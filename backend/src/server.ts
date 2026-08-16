// 🚀 РОЗУМНИЙ МАРШРУТ ЗАПИСУ ДАНИХ (POST) - Тепер додає підключення, а не затирає їх!
app.post('/api/work-log', async (req: Request, res: Response) => {
  try {
    const { 
      date, connect_tv, connect_no_tv, addon_pon, addon_eth, 
      reconnect, extra_hours, duty_hours, brought_clients, connect_uo 
    } = req.body;

    if (!date) return res.status(400).json({ error: 'Поле date є обовʼязковим!' });

    // 1. Спочатку перевіряємо, чи є вже якийсь запис у базі за цю дату
    const { data: existingLog, error: fetchError } = await supabase
      .from('daily_work_log')
      .select('*')
      .eq('date', date)
      .single(); // Очікуємо один рядок

    // Нові значення, які ми хочемо записати
    const newTv = connect_tv || 0;
    const newNoTv = connect_no_tv || 0;
    const newPon = addon_pon || 0;
    const newEth = addon_eth || 0;
    const newReconnect = reconnect || 0;
    const newExtra = extra_hours || 0;
    const newDuty = duty_hours || 0;
    const newBrought = brought_clients || 0;
    const newUo = connect_uo || 0;

    let finalData;

    if (existingLog) {
      // 2. ЯКЩО ДЕНЬ УЖЕ Є В БАЗІ — МИ ПЛЮСУЄМО НОВІ ЦИФРИ ДО СТАРИХ (Акумуляція)
      const { data, error } = await supabase
        .from('daily_work_log')
        .update({
          connect_tv: (existingLog.connect_tv || 0) + newTv,
          connect_no_tv: (existingLog.connect_no_tv || 0) + newNoTv,
          addon_pon: (existingLog.addon_pon || 0) + newPon,
          addon_eth: (existingLog.addon_eth || 0) + newEth,
          reconnect: (existingLog.reconnect || 0) + newReconnect,
          extra_hours: Number(existingLog.extra_hours || 0) + Number(newExtra),
          duty: (existingLog.duty || 0) + newDuty,
          brought_clients: (existingLog.brought_clients || 0) + newBrought,
          connect_uo: (existingLog.connect_uo || 0) + newUo
        })
        .eq('date', date)
        .select();

      if (error) throw error;
      finalData = data;
    } else {
      // 3. ЯКЩО ЦЬОГО ДНЯ ЩЕ НЕМАЄ — ПРОСТО СТВОРЮЄМО ЧИСТИЙ НОВИЙ РЯДОК
      const { data, error } = await supabase
        .from('daily_work_log')
        .insert({
          date,
          connect_tv: newTv,
          connect_no_tv: newNoTv,
          addon_pon: newPon,
          addon_eth: newEth,
          reconnect: newReconnect,
          extra_hours: newExtra,
          duty: newDuty,
          brought_clients: newBrought,
          connect_uo: newUo
        })
        .select();

      if (error) throw error;
      finalData = data;
    }

    return res.status(200).json({
      message: 'Дані успішно збережено в PostgreSQL хмарі!',
      log: finalData
    });

  } catch (error: any) {
    console.error('Помилка на сервері:', error);
    return res.status(500).json({ error: 'Сталася помилка бази даних', details: error.message });
  }
});
