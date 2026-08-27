import { useState, useEffect } from 'react';

interface WorkDay {
  date: string;
  connect_tv: number;
  connect_no_tv: number;
  addon_pon: number;
  addon_eth: number;
  reconnect: number;
  extra_hours: number;
  duty: number;
  brought_clients: number;
  connect_uo: number;
  tips: number;
}

function App() {
  const BONUS_OPTIONS = [0, 5, 10, 15];
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'history'>('stats');
  const DAY_RATES = {
    CONNECT_TV: 150,
    CONNECT_NO_TV: 100,
    ADDON_PON: 100,
    ADDON_ETH: 75,
    RECONNECT: 80,
    EXTRA_HOUR: 100,
    DUTY_HOUR: 120,
    BROUGHT_CLIENT: 150,
    CONNECT_UO: 180,
  };
  const [bonusPercent, setBonusPercent] = useState<number>(0);
  const [dbCalculations, setDbCalculations] = useState({
    base_salary: 19200,
    bonus_calculated_uah: 0,
    earned_from_work: 0,
    total_salary_prognosis: 19200,
    card_paid_uah: 0,
    envelope_remain_uah: 19200,
    total_tips_uah: 0,
  });

  const [historyList, setHistoryList] = useState<WorkDay[]>([]);

  const [workLog, setWorkLog] = useState({
    connect_tv: 0,
    connect_no_tv: 0,
    addon_pon: 0,
    addon_eth: 0,
    reconnect: 0,
    extra_hours: 0,
    duty_hours: 0,
    brought_clients: 0,
    connect_uo: 0,
    tips: 0,
    date: new Date().toLocaleDateString('en-CA'),
  });

  const fetchSalaryFromBackend = async () => {
    try {
      const response = await fetch(
        `https://salary-backend-woq5.onrender.com/api/salary?bonus=${bonusPercent}`,
      );
      if (!response.ok)
        throw new Error('Не вдалося завантажити дані з сервера');
      const data = await response.json();
      setDbCalculations(data.calculations);
    } catch (error: any) {
      console.error('Помилка завантаження ЗП:', error);
    }
  };

  const fetchHistoryFromBackend = async () => {
    try {
      const response = await fetch(
        `https://salary-backend-woq5.onrender.com/api/work-log`,
      );
      if (!response.ok) throw new Error('Не вдалося завантажити звіт');

      const data = await response.json();
      setHistoryList(data.history || []);
    } catch (error: any) {
      console.error('Помилка завантаження історії:', error);
      setHistoryList([]); // У разі помилки мережі теж ставимо порожній масив, щоб сайт не виснув
    }
  };

  useEffect(() => {
    fetchSalaryFromBackend();
    fetchHistoryFromBackend();
  }, [bonusPercent]);

  const handleCounterChange = (
    field: string,
    operation: 'inc' | 'dec',
    step: number = 1,
  ) => {
    setWorkLog((prev) => {
      const currentValue = prev[field as keyof typeof prev] as number;
      const newValue =
        operation === 'inc'
          ? currentValue + step
          : Math.max(0, currentValue - step);

      return {
        ...prev,
        [field]: newValue,
      };
    });
  };
  const saveDataToServer = async () => {
    try {
      const response = await fetch(
        'https://salary-backend-woq5.onrender.com/api/work-log',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workLog),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Щось пішло не так при збереженні');
      }
      alert(`${data.message}`);
      fetchSalaryFromBackend();
      fetchHistoryFromBackend();
      setActiveTab('history');
      setWorkLog((prev) => ({
        ...prev,
        connect_tv: 0,
        connect_no_tv: 0,
        addon_pon: 0,
        addon_eth: 0,
        reconnect: 0,
        extra_hours: 0,
        duty_hours: 0,
        brought_clients: 0,
        connect_uo: 0,
        tips: 0,
      }));
    } catch (error: any) {
      console.error('Помилка відправки:', error);
      alert(`❌ Помилка: ${error.message}`);
    }
  };

  const formatUkDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
    });
  };

  const calculateDaySum = (day: WorkDay) => {
    return (
      (day?.connect_tv || 0) * DAY_RATES.CONNECT_TV +
      (day?.connect_no_tv || 0) * DAY_RATES.CONNECT_NO_TV +
      (day?.addon_pon || 0) * DAY_RATES.ADDON_PON +
      (day?.addon_eth || 0) * DAY_RATES.ADDON_ETH +
      (day?.reconnect || 0) * DAY_RATES.RECONNECT +
      (day?.extra_hours || 0) * DAY_RATES.EXTRA_HOUR +
      (day?.duty || 0) * DAY_RATES.DUTY_HOUR +
      (day?.brought_clients || 0) * DAY_RATES.BROUGHT_CLIENT +
      (day?.connect_uo || 0) * DAY_RATES.CONNECT_UO
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 antialiased">
      <header className="w-full max-w-md my-6 text-center">
        <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
          Калькулятор ЗП
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Твій інтерактивний фінансовий блокнот
        </p>
      </header>
      <main className="w-full max-w-md space-y-6 ">
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-in-out]">

            {/* ГОЛОВНЕ ТАБЛО */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider opacity-90">Прогноз ЗП на місяць</h2>
                <p className="text-3xl font-black text-white drop-shadow-sm">
                  {(dbCalculations?.total_salary_prognosis || 0).toLocaleString('uk-UA')} <span className="text-lg font-bold">грн</span>
                </p>
                <div className="inline-block bg-slate-950/20 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] font-semibold text-emerald-50">
                  ✉️ У конверт: <span className="text-amber-300 font-black pl-1">{(dbCalculations?.envelope_remain_uah || 0).toLocaleString('uk-UA')} грн</span>
                </div>
              </div>

              <div className="bg-slate-950/20 p-3 rounded-xl border border-white/5 text-right space-y-1 text-[11px] text-emerald-50 min-w-[140px]">
                <div className="flex justify-between gap-3"><span className="opacity-75">Ставка:</span><span className="font-bold">{(dbCalculations?.base_salary || 0).toLocaleString('uk-UA')}</span></div>
                <div className="flex justify-between gap-3"><span className="opacity-75">Премія:</span><span className="font-bold">+{(dbCalculations?.bonus_calculated_uah || 0).toLocaleString('uk-UA')}</span></div>
                <div className="flex justify-between gap-3 border-t border-white/10 pt-1 mt-1"><span className="opacity-75">Підробітки:</span><span className="font-bold text-white">+{(dbCalculations?.earned_from_work || 0).toLocaleString('uk-UA')}</span></div>
              </div>
            </div>

            {/* ВІДЖЕТ ЧАЙОВИХ */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">💵 Накопичені Чайові</h4>
                <p className="text-[11px] text-slate-400">Твій чистий готівковий прибуток</p>
              </div>
              <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl font-black text-lg">
                +{(dbCalculations?.total_tips_uah || 0).toLocaleString('uk-UA')} ₴
              </div>
            </div>

            {/* УПРАВЛІННЯ ПРЕМІЄЮ */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 space-y-3 shadow-md">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide text-center">Моделювання премії за місяць</h3>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-slate-700/30">
                {BONUS_OPTIONS.map((option) => {
                  const isActive = bonusPercent === option;
                  return (
                    <button 
                      key={option} 
                      type="button"
                      onClick={() => setBonusPercent(option)}
                      className={`py-2.5 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer ${
                        isActive ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {option}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* ➕ СТОРІНКА 2: ВНЕСЕННЯ ДАНИХ ЗА ДЕНЬ */}
           {activeTab === 'add' && (
          <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700/40 space-y-4 animate-[fadeIn_0.15s_ease-out]">
            <div className="border-b border-slate-700/40 pb-2 text-center">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Внести роботу за день</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Обери дату та вкажи кількість виконаних послуг</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Дата запису/перезапису</label>
              <input type="date" value={workLog.date} onChange={(e) => setWorkLog(prev => ({ ...prev, date: e.target.value }))} className="w-full mt-1.5 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs scheme-dark font-semibold" />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-none">
              {[
                { label: '📺 Підключення з ТВ (150 грн)', field: 'connect_tv' },
                { label: '🌐 Підключення без ТВ (100 грн)', field: 'connect_no_tv' },
                { label: '🌀 Допідключення ПОН (100 грн)', field: 'addon_pon' },
                { label: '🔌 Допідключення Езернет (75 грн)', field: 'addon_eth' },
                { label: '🔄 Переключення (80 грн)', field: 'reconnect' },
                { label: '🤝 Приведені клієнти (150 грн)', field: 'brought_clients' },
                { label: '🏢 Підключення ЮО (180 грн)', field: 'connect_uo' },
                { label: '⏱️ Додаткові години (100 грн/год)', field: 'extra_hours', isHours: true },
                { label: '🛡️ Чергування (120 грн/год)', field: 'duty_hours', isHours: true },
              ].map((item) => {
                const value = workLog[item.field as keyof typeof workLog];
                return (
                  <div key={item.field} className="flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-700/20">
                    <span className="text-xs font-medium text-slate-300">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => handleCounterChange(item.field, 'dec', item.isHours ? 0.5 : 1)} className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-black text-center flex items-center justify-center cursor-pointer select-none text-sm active:scale-90 transition-transform">-</button>
                      <span className="text-xs font-black text-emerald-400 w-6 text-center">{value}</span>
                      <button type="button" onClick={() => handleCounterChange(item.field, 'inc', item.isHours ? 0.5 : 1)} className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-center flex items-center justify-center cursor-pointer select-none text-sm active:scale-90 transition-transform">+</button>
                    </div>
                  </div>
                );
              })}

              {/* ПОЛЕ ВВЕДЕННЯ ЧАЙОВИХ З КЛАВІАТУРИ */}
              <div className="flex justify-between items-center bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 mt-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-400 block">💵 Чайові за день (грн)</span>
                  <span className="text-[10px] text-slate-400">Будь-яка сума з клавіатури</span>
                </div>
                <input type="number" placeholder="0" value={workLog.tips || ''} onChange={(e) => setWorkLog(prev => ({ ...prev, tips: Number(e.target.value) }))} className="w-24 p-2 bg-slate-900/60 border border-amber-500/30 rounded-xl text-white text-right font-black focus:outline-none focus:border-amber-400 text-xs" />
              </div>

            </div>
            <button type="button" onClick={saveDataToServer} className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-150 transform active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider">🚀 Зберегти / Перезаписати цей день</button>
          </div>
        )}

        {/* 📋 СТОРІНКА 3: ДЕТАЛЬНА СТАТИСТИКА ПО ДНЯХ */}
                {/* 📋 СТОРІНКА 3: ДЕТАЛЬНА СТАТИСТИКА ПО ДНЯХ */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-3 shadow-md animate-[fadeIn_0.15s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">📋 Архів логів за місяць</h3>
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-500/10">днів: {historyList?.length}</span>
            </div>

            {!historyList || historyList.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">Записів за цей місяць ще немає...</p>
            ) : (
              <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {historyList.map((day) => {
                  const daySum = calculateDaySum(day);
                  return (
                    <div key={day.date} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/30 text-[11px] space-y-1.5">
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="font-extrabold text-slate-200 text-[11px]">📅 {formatUkDate(day.date)}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/10">+{daySum ? daySum.toLocaleString('uk-UA') : '0'} ₴</span>
                      </div>
                      <div className="space-y-1 text-slate-400 pt-1.5">
                        {day?.connect_tv > 0 && <div className="flex justify-between"><span>📺 ТВ підключення</span><span className="font-bold text-slate-200">{day.connect_tv}</span></div>}
                        {day?.connect_no_tv > 0 && <div className="flex justify-between"><span>🌐 Інтернет підключення</span><span className="font-bold text-slate-200">{day.connect_no_tv}</span></div>}
                        {day?.addon_pon > 0 && <div className="flex justify-between"><span>🌀 Допідключення ПОН</span><span className="font-bold text-slate-200">{day.addon_pon}</span></div>}
                        {day?.addon_eth > 0 && <div className="flex justify-between"><span>🔌 Допідключення Езернет</span><span className="font-bold text-slate-200">{day.addon_eth}</span></div>}
                        {day?.reconnect > 0 && <div className="flex justify-between"><span>🔄 Переключення</span><span className="font-bold text-slate-200">{day.reconnect}</span></div>}
                        {day?.extra_hours > 0 && <div className="flex justify-between"><span>⏱️ Додаткові години</span><span className="font-bold text-slate-200">{day.extra_hours} год</span></div>}
                        {day?.duty > 0 && <div className="flex justify-between"><span>🛡️ Чергування</span><span className="font-bold text-slate-200">{day.duty} год</span></div>}
                        {day?.brought_clients > 0 && <div className="flex justify-between"><span>🤝 Приведені клієнти</span><span className="font-bold text-slate-200">{day.brought_clients}</span></div>}
                        {day?.connect_uo > 0 && <div className="flex justify-between"><span>🏢 Підключення ЮО</span><span className="font-bold text-slate-200">{day.connect_uo}</span></div>}
                        {day?.tips > 0 && <div className="flex justify-between text-amber-400/90 font-medium"><span>💵 Чайові за день</span><span className="font-bold">+{day.tips || 0} ₴</span></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


      </main>
   {/* 📱 НАДЗРУЧНЕ ФІКСОВАНЕ НИЖНЄ МЕНЮ НАВІГАЦІЇ (BOTTOM TABS) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-50 shadow-2xl max-w-md mx-auto rounded-t-2xl">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${activeTab === 'stats' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">Статистика</span>
        </button>

        <button 
          onClick={() => setActiveTab('add')}
          className={`flex flex-col items-center space-y-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${activeTab === 'add' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">➕</span>
          <span className="text-[10px]">Внести день</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${activeTab === 'history' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">📋</span>
          <span className="text-[10px]">Логи дня</span>
        </button>
      </nav>

    </div>
  );
}

export default App;
