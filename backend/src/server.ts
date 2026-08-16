import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

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

// 🚀 МАРШРУТ ЗАПИСУ ДАНИХ (POST) - Тепер чітко приймає duty_hours з React
app.post('/api/work-log', async (req: Request, res: Response) => {
  try {
    console.log('👉 НА БЕКЕНД ПРИЙШЛИ ТАКІ ДАНІ З ФОРМИ:', req.body);
    const { 
      date, 
      connect_tv, 
      connect_no_tv, 
      addon_pon, 
      addon_eth, 
      reconnect, 
      extra_hours, 
      duty_hours, // <--- Виправили назву: тепер чітко ловимо duty_hours з React-форми
      brought_clients, 
      connect_uo 
    } = req.body;

    if (!date) { 
      return res.status(400).json({ error: 'Поле date є обовʼязковим!' }); 
    }

    const { data, error } = await supabase
      .from('daily_work_log') 
      .upsert({
        date,
        connect_tv: connect_tv || 0,
        connect_no_tv: connect_no_tv || 0,
        addon_pon: addon_pon || 0,
        addon_eth: addon_eth || 0,
        reconnect: reconnect || 0,
        extra_hours: extra_hours || 0,
        duty: duty_hours || 0, // <--- Записуємо значення у колонку duty в базі Supabase
        brought_clients: brought_clients || 0,
        connect_uo: connect_uo || 0
      }, { onConflict: 'date' }) 
      .select(); 

    if (error) throw error;

    return res.status(200).json({
      message: 'Дані успішно збережено в PostgreSQL хмарі!',
      log: data
    });

  } catch (error: any) {
    console.error('Помилка на сервері:', error);
    return res.status(500).json({ error: 'Сталася помилка бази даних', details: error.message });
  }
});

// 📊 МАРШРУТ РОЗРАХУНКУ ЗП ЗА МІСЯЦЬ (GET)
app.get('/api/salary', async (req: Request, res: Response) => {
  try {
    const bonusQuery = req.query.bonus; 
    let bonusPercent = bonusQuery ? Number(bonusQuery) : 0;
    
    if (bonusPercent < 0 || bonusPercent > 15) {
      return res.status(400).json({ error: 'Відсоток премії має бути в межах від 0 до 15%' });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayDate = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${lastDayDate}`;

    console.log(`Шукаємо логи в діапазоні від ${firstDay} до ${lastDay}`);

    const { data: logs, error } = await supabase
      .from('daily_work_log')
      .select('*')
      .gte('date', firstDay)
      .lte('date', lastDay);

    if (error) throw error;

    let totalTv = 0; let totalNoTv = 0; let totalPon = 0; let totalEth = 0;
    let totalReconnect = 0; let totalExtraHours = 0; let totalDuties = 0;
    let totalBroughtClients = 0; let totalConnectUo = 0;

    if (logs) {
      logs.forEach(log => {
        totalTv += log.connect_tv || 0;
        totalNoTv += log.connect_no_tv || 0;
        totalPon += log.addon_pon || 0;
        totalEth += log.addon_eth || 0;
        totalReconnect += log.reconnect || 0;
        totalExtraHours += Number(log.extra_hours) || 0;
        totalDuties += log.duty || 0; 
        totalBroughtClients += log.brought_clients || 0;
        totalConnectUo += log.connect_uo || 0;
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

    const bonusMoney = (RATES.BASE_SALARY * bonusPercent) / 100;
    const totalSalary = RATES.BASE_SALARY + bonusMoney + earnedFromWork; 

    return res.status(200).json({
      month: `${year}-${String(month + 1).padStart(2, '0')}`,
      metrics: {
        connect_tv: totalTv,
        connect_no_tv: totalNoTv,
        addon_pon: totalPon,
        addon_eth: totalEth,
        reconnect: totalReconnect,
        extra_hours: totalExtraHours,
        duty_hours: totalDuties,
        brought_clients: totalBroughtClients,
        connect_uo: totalConnectUo
      },
      calculations: {
        base_salary: RATES.BASE_SALARY,
        bonus_percent_applied: `${bonusPercent}%`,
        bonus_calculated_uah: bonusMoney,
        earned_from_work: earnedFromWork,
        total_salary_prognosis: totalSalary
      }
    });

  } catch (error: any) {
    return res.status(500).json({ error: 'Не вдалося порахувати ЗП', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});
