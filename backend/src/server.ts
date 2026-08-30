import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const RATES = {
  BASE_SALARY: 19200,
  CONNECT_TV: 150,
  CONNECT_NO_TV: 100,
  ADDON_PON: 100,
  ADDON_ETH: 75,
  RECONNECT: 80,
  EXTRA_HOUR_RATE: 100,
  DUTY_HOUR_RATE: 120,
  BROUGHT_CLIENT_RATE: 150,
  CONNECT_UO_RATE: 180
};

app.get('/', (req: Request, res: Response) => {
  res.send('Сервер калькулятора ЗП успішно зʼєднано з PostgreSQL!');
});


//НАША ПРОСЛОЙКА БЕЗПЕКИ (MIDDLEWARE)

const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Дістаємо заголовок Authorization (там лежить рядок "Bearer token_abc123...")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Доступ заборонено! Відсутній токен авторизації.' });
    }

    // Відрізаємо слово "Bearer " і отримуємо чистий JWT токен
    const token = authHeader.split(' ')[1];

    // Просимо Supabase перевірити цей токен на валідність
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Сесія застаріла або токен підроблено! Увійдіть знову.' });
    }

    // Якщо все супер, записуємо id користувача в об'єкт запиту і передаємо кермо маршрутам далі
    req.authenticatedUserId = user.id;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Помилка авторизації' });
  }
};

// 🚀 1. МАРШРУТ ПЕРЕЗАПИСУ ДАНИХ ЗА ДЕНЬ (POST)
app.post('/api/work-log', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      date, connect_tv, connect_no_tv, addon_pon, addon_eth, 
      reconnect, extra_hours, duty_hours, brought_clients, connect_uo,tips 
    } = req.body;

    if (!date) return res.status(400).json({ error: 'Поле date є обовʼязковим!' });
    const currentUserId = req.authenticatedUserId;
    const { data, error } = await supabase
      .from('daily_work_log')
      .upsert({
        date,
        connect_tv: connect_tv || 0,
        connect_no_tv: connect_no_tv || 0,
        addon_pon: addon_pon || 0,
        addon_eth: addon_eth || 0,
        reconnect: reconnect || 0,
        extra_hours: Number(extra_hours) || 0,
        duty: Number(duty_hours) || 0,
        brought_clients: brought_clients || 0,
        connect_uo: connect_uo || 0,
        tips: Number(tips) || 0,
        user_id: currentUserId
      }, { onConflict: 'date,user_id' }) // Залишаємо так, PostgreSQL тепер знає цей індекс!
      .select();

      if (error) {
      // 🌟 НАДВАЖЛИВО: Якщо база відхилить запит, ми побачимо ТОЧНУ причину в логах Render!
      console.error('КРИТИЧНА ПОМИЛКА SUPABASE ДЕБАГ:', error.message, error.details);
      throw error;
    }
    return res.status(200).json({ message: 'Дані успішно оновлено за цю дату!', log: data });
  } catch (error: any) {
    console.error('Помилка POST:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 📜 2. МАРШРУТ ОТРИМАННЯ ІСТОРІЇ ПО ДНЯХ (GET) - Саме його не міг знайти фронтенд!
app.get('/api/work-log', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Серпень = 7

    // Формуємо чисті ISO дати початку й кінця місяця
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayDate = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${lastDayDate}`;

    // Замість розмитого .like використовуємо чітке порівняння дат, сумісне з типом Date!
    const { data: history, error: historyError } = await supabase
      .from('daily_work_log')
      .select('*')
      .gte('date', firstDay)
      .lte('date', lastDay)
      .eq('user_id', req.authenticatedUserId)
      .order('date', { ascending: false });

    if (historyError ) throw historyError;
    return res.status(200).json({ history: history || [] });
  } catch (error: any) {
    console.error('Помилка GET history:', error);
    return res.status(500).json({ error: 'Не вдалося завантажити історію', details: error.message });
  }
});
// 📊 3. МАРШРУТ РОЗРАХУНКУ ЗАГАЛЬНОЇ ЗП ЗА МІСЯЦЬ (GET)
app.get('/api/salary', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bonusQuery = req.query.bonus; 
    let bonusPercent = bonusQuery ? Number(bonusQuery) : 0;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayDate = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${lastDayDate}`;

    const { data: profile } = await supabase
      .from('profiles')
      .select('base_salary')
      .eq('id', req.authenticatedUserId)
      .single();

    const userBaseSalary = profile ? Number(profile.base_salary) : 19200;
    const { data: logs, error: logsError } = await supabase.from('daily_work_log').select('*').gte('date', firstDay).lte('date', lastDay).eq('user_id', req.authenticatedUserId);

    if (logsError) throw logsError;

    let totalTv = 0; let totalNoTv = 0; let totalPon = 0; let totalEth = 0;
    let totalReconnect = 0; let totalExtraHours = 0; let totalDuties = 0;
    let totalBroughtClients = 0; let totalConnectUo = 0; let totalTips = 0;

    if (logs) {
      logs.forEach(log => {
        totalTv += Number(log.connect_tv) || 0;
        totalNoTv += Number(log.connect_no_tv) || 0;
        totalPon += Number(log.addon_pon) || 0;
        totalEth += Number(log.addon_eth) || 0;
        totalReconnect += Number(log.reconnect) || 0;
        totalExtraHours += Number(log.extra_hours) || 0;
        totalDuties += Number(log.duty) || 0; 
        totalBroughtClients += Number(log.brought_clients) || 0;
        totalConnectUo += Number(log.connect_uo) || 0;
        totalTips += Number(log.tips) || 0;
      });
    }

    const earnedFromWork = 
      (totalTv * RATES.CONNECT_TV) +
      (totalNoTv * RATES.CONNECT_NO_TV) +
      (totalPon * RATES.ADDON_PON) +
      (totalEth * RATES.ADDON_ETH) +
      (totalReconnect * RATES.RECONNECT) +
      (totalExtraHours * RATES.EXTRA_HOUR_RATE) +
      (totalDuties * RATES.DUTY_HOUR_RATE) +
      (totalBroughtClients * RATES.BROUGHT_CLIENT_RATE) +
      (totalConnectUo * RATES.CONNECT_UO_RATE);

    const bonusMoney = (userBaseSalary * bonusPercent) / 100;
    const totalSalary = userBaseSalary + bonusMoney + earnedFromWork; 

    return res.status(200).json({
      calculations: {
        base_salary: userBaseSalary,
        bonus_percent_applied: `${bonusPercent}%`,
        bonus_calculated_uah: bonusMoney,
        earned_from_work: earnedFromWork,
        total_salary_prognosis: totalSalary,
        envelope_remain_uah: totalSalary,
        total_tips_uah: totalTips
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Не вдалося порахувати ЗП' });
  }
});

app.post('/api/profile/update', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { base_salary } = req.body;
    if (!base_salary || Number(base_salary) <= 0) {
      return res.status(400).json({ error: 'Ставка має бути більшою за 0!' });
    }
    const { data, error } = await supabase
      .from('profiles')
      .update({ base_salary: Number(base_salary), updated_at: new Date() })
      .eq('id', req.authenticatedUserId)
      .select();

    if (error) throw error;
    return res.status(200).json({ message: 'Профіль успішно оновлено!', profile: data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка оновлення' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});
