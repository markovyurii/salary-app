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
  CONNECT_WITH_TV: 150,
  CONNECT_WITH_TV_SHARED: 75,
  CONNECT_INTERNET_SOLO: 100,
  CONNECT_INTERNET_SHARED: 50,
  CONNECT_TV_SOLO: 100,
  CONNECT_TV_SHARED: 50,
  RECONNECT: 80,
  EXTRA_HOUR_RATE: 100,
  DUTY_HOUR_RATE: 120,
  BROUGHT_CLIENT_RATE: 150,
  CONNECT_UO_RATE: 180,
  ADDON_PON_SOLO: 100,
  ADDON_PON_SHARED: 50,
  PARKING_HOUR_RATE: 15
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

// 🚀 2. МАРШРУТ ЗАПИСУ РОБОТИ ЗА ДЕНЬ (POST) - ЗАЛІЗОБЕТОННИЙ ДЕБАГ-ВАРІАНТ
app.post('/api/work-log', requireAuth, async (req: any, res: Response) => {
  try {
    // Безпечно дістаємо дані, страхуючи кожне поле від undefined
    const date = req.body?.date;
    const connect_with_tv = req.body?.connect_with_tv;
    const connect_with_tv_shared = req.body?.connect_with_tv_shared;
    const connect_internet_solo = req.body?.connect_internet_solo;
    const connect_internet_shared = req.body?.connect_internet_shared;
    const connect_tv_solo = req.body?.connect_tv_solo;
    const connect_tv_shared = req.body?.connect_tv_shared;
    const addon_pon_solo = req.body?.addon_pon_solo;
    const addon_pon_shared = req.body?.addon_pon_shared;
    const reconnect = req.body?.reconnect;
    const extra_hours = req.body?.extra_hours;
    const duty_hours = req.body?.duty_hours;
    const parking_hours = req.body?.parking_hours;
    const travel_compensation= req.body?.travel_compensation;
    const brought_clients = req.body?.brought_clients;
    const connect_uo = req.body?.connect_uo;
    const tips = req.body?.tips;

    if (!date) {
      return res.status(400).json({ error: 'Поле date є обовʼязковим!' });
    }

    const currentUserId = req.authenticatedUserId;
    if (!currentUserId) {
      return res.status(401).json({ error: 'Критична помилка: ідентифікатор користувача відсутній у сесії!' });
    }

    // Робимо запит до Supabase, примусово перетворюючи ВСІ лічильники на чисті числа
    const { data, error } = await supabase
      .from('daily_work_log')
      .upsert({
        date: date,
        connect_with_tv: Number(connect_with_tv) || 0,
        connect_with_tv_shared: Number(connect_with_tv_shared) || 0,
        connect_internet_solo: Number(connect_internet_solo) || 0,
        connect_internet_shared: Number(connect_internet_shared) || 0,
        connect_tv_solo: Number(connect_tv_solo) || 0,
        connect_tv_shared: Number(connect_tv_shared) || 0, 
        addon_pon_solo: Number(addon_pon_solo) || 0,
        addon_pon_shared: Number(addon_pon_shared) || 0, 
        reconnect: Number(reconnect) || 0,
        extra_hours: Number(extra_hours) || 0,
        parking_hours: Number(parking_hours) || 0,
        travel_compensation: Number(travel_compensation) || 0,
        duty: Number(duty_hours) || 0,
        brought_clients: Number(brought_clients) || 0,
        connect_uo: Number(connect_uo) || 0,
        tips: Number(tips) || 0,
        user_id: currentUserId
      }, { onConflict: 'date,user_id' })
      .select();

    if (error) {
      console.error('Помилка Supabase:', error.message);
      return res.status(500).json({ error: `Помилка Supabase: ${error.message}. Деталі: ${error.details || 'немає'}` });
    }

    return res.status(200).json({ message: 'Дані успішно оновлено за цю дату!', log: data });
  } catch (error: any) {
    console.error('Помилка сервера POST:', error);
    // 🌟 ЗАХИСТ: Якщо error це рядок або обʼєкт без .message, ми все одно виведемо його текст на екран!
    const errorMessage = error?.message || String(error) || 'Невідома помилка Express логіки';
    return res.status(500).json({ error: `Внутрішня помилка сервера Node.js: ${errorMessage}` });
  }
});

// 📜 2. МАРШРУТ ОТРИМАННЯ ІСТОРІЇ ПО ДНЯХ (GET) - Саме його не міг знайти фронтенд!
app.get('/api/work-log', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();
    const month = req.query.month ? Number(req.query.month) : (now.getMonth() + 1); // Серпень = 7

    // Формуємо чисті ISO дати початку й кінця місяця
    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDayDate = new Date(year, month, 0).getDate();
    const lastDay = `${year}-${String(month).padStart(2, '0')}-${lastDayDate}`;

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
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();
    const month = req.query.month ? Number(req.query.month) : (now.getMonth() + 1);
    
    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDayDate =  new Date(year, month, 0).getDate();
    const lastDay = `${year}-${String(month).padStart(2, '0')}-${lastDayDate}`;

    const { data: profile } = await supabase
      .from('profiles')
      .select('base_salary,is_driver, car_amortization,bonus_percent')
      .eq('id', req.authenticatedUserId)
      .single();

    const userBaseSalary = profile ? Number(profile.base_salary) : 19200;
    const isDriver = profile ? Boolean(profile.is_driver) : false;
    const carAmortization = profile ? Number(profile.car_amortization) : 3500;
    const currentBonusPercent = profile ? Number(profile.bonus_percent) : 0;
    const { data: logs, error: logsError } = await supabase.from('daily_work_log').select('*').gte('date', firstDay).lte('date', lastDay).eq('user_id', req.authenticatedUserId);
    
    //Читаємо ВСІ виплати на картку за цей місяць
    const { data: cardPayments } = await supabase
      .from('card_payments')
      .select('amount')
      .gte('date', firstDay)
      .lte('date', lastDay)
      .eq('user_id', req.authenticatedUserId);

    //Сумуємо всі транзакції на картку, скільки б їх не було
    let totalCardPaidUah = 0;
    if (cardPayments) {
      cardPayments.forEach(pay => {
        totalCardPaidUah += Number(pay.amount) || 0;
      });
    }
    if (logsError) throw logsError;

    let connect_with_tv = 0; let connect_with_tv_shared = 0; let connect_internet_solo = 0; let connect_internet_shared = 0;
    let connect_tv_solo = 0; let connect_tv_shared = 0; let reconnect = 0; let connect_uo = 0; let brought_clients = 0;
    let addon_pon_solo = 0; let addon_pon_shared = 0;
    let extra_hours = 0; let duty_hours = 0; let parking_hours = 0; let travel_trips = 0; let totalTips = 0;

    if (logs) {
      logs.forEach(log => {
        connect_with_tv += Number(log.connect_with_tv) || 0;
        connect_with_tv_shared += Number(log.connect_with_tv_shared) || 0;
       connect_internet_solo += Number(log.connect_internet_solo) || 0;
        connect_internet_shared += Number(log.connect_internet_shared) || 0;
        connect_tv_solo += Number(log.connect_tv_solo) || 0;
        connect_tv_shared += Number(log.connect_tv_shared) || 0;
        reconnect += Number(log.reconnect) || 0;
        connect_uo += Number(log.connect_uo) || 0;
        brought_clients += Number(log.brought_clients) || 0;
        addon_pon_solo += Number(log.addon_pon_solo) || 0;
        addon_pon_shared += Number(log.addon_pon_shared) || 0;
        extra_hours += Number(log.extra_hours) || 0;
        duty_hours += Number(log.duty) || 0;
        parking_hours += Number(log.parking_hours) || 0;
        travel_trips += Number(log.travel_compensation) || 0;
        totalTips += Number(log.tips) || 0;
      });
    }

    const earnedFromWork = 
      (connect_with_tv * RATES.CONNECT_WITH_TV) + 
      (connect_with_tv_shared * RATES.CONNECT_WITH_TV_SHARED) + 
      (connect_internet_solo * RATES.CONNECT_INTERNET_SOLO) + 
      (connect_internet_shared * RATES.CONNECT_INTERNET_SHARED) + 
      (connect_tv_solo * RATES.CONNECT_TV_SOLO) + 
      (connect_tv_shared * RATES.CONNECT_TV_SHARED) + 
      (reconnect * RATES.RECONNECT) + 
      (connect_uo * RATES.CONNECT_UO_RATE) + 
      (brought_clients * RATES.BROUGHT_CLIENT_RATE) + 
      (addon_pon_solo * RATES.ADDON_PON_SOLO) +
      (addon_pon_shared * RATES.ADDON_PON_SHARED) +
      (extra_hours * 100) + (duty_hours * 120) +
      (isDriver ? (parking_hours * RATES.PARKING_HOUR_RATE) : (travel_trips * 26));

    const bonusMoney = (userBaseSalary * currentBonusPercent) / 100;
    const totalSalary = userBaseSalary + bonusMoney + earnedFromWork + (isDriver ? carAmortization : 0); 
    const envelopeRemain = Math.max(0,totalSalary - totalCardPaidUah)

    return res.status(200).json({
      calculations: {
        base_salary: userBaseSalary,
        is_driver: isDriver,
        car_amortization: carAmortization,
        bonus_percent_applied: `${bonusPercent}%`,
        bonus_percent: currentBonusPercent,
        bonus_calculated_uah: bonusMoney,
        earned_from_work: earnedFromWork,
        total_salary_prognosis: totalSalary,
        envelope_remain_uah: envelopeRemain,
        total_tips_uah: totalTips,
        total_card_paid_uah: totalCardPaidUah
      },
      stats: {
        connect_with_tv, connect_with_tv_shared, connect_internet_solo, connect_internet_shared,
        connect_tv_solo, connect_tv_shared, reconnect, connect_uo, brought_clients,
        addon_pon_solo, addon_pon_shared, extra_hours, duty_hours, parking_hours, travel_trips
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Не вдалося порахувати ЗП' });
  }
});

app.post('/api/profile/update', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { base_salary, is_driver, car_amortization , bonus_percent} = req.body;
    const updateData: any = { 
      updated_at: new Date() 
    };

    if (bonus_percent !== undefined) updateData.bonus_percent = Number(bonus_percent);
    if (base_salary !== undefined) {
      if (Number(base_salary) <= 0) {
        return res.status(400).json({ error: 'Ставка має бути більшою за 0!' });
      }
      updateData.base_salary = Number(base_salary);
    }

    if (is_driver !== undefined) {
      updateData.is_driver = Boolean(is_driver);
    }
     if (car_amortization !== undefined) {
      updateData.car_amortization = Number(car_amortization);
    }
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.authenticatedUserId)
      .select();
      
    if (error) throw error;
    return res.status(200).json({ message: 'Профіль успішно оновлено!', profile: data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка оновлення' });
  }
});

// 💰 6. МАРШРУТ ЗАПИСУ ВИПЛАТИ НА КАРТКУ (POST)
app.post('/api/card-payment', requireAuth, async (req: any, res: Response) => {
  try {
    const { amount, date } = req.body;
    const paymentDate = date || new Date().toLocaleDateString('en-CA');

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Сума виплати має бути більшою за 0!' });
    }

    // Записуємо транзакцію в нову таблицю
    const { data, error } = await supabase
      .from('card_payments')
      .insert({
        date: paymentDate,
        amount: Number(amount),
        user_id: req.authenticatedUserId
      })
      .select();

    if (error) throw error;
    return res.status(200).json({ message: 'Виплату на картку успішно враховано!', payment: data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Не вдалося зберегти виплату' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});
