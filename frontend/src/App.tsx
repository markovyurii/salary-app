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
}

function App() {
  const BONUS_OPTIONS = [0, 5, 10, 15];
    const DAY_RATES = {
    CONNECT_TV: 150, CONNECT_NO_TV: 100, ADDON_PON: 100, ADDON_ETH: 75,
    RECONNECT: 80, EXTRA_HOUR: 100, DUTY_HOUR: 120, BROUGHT_CLIENT: 150, CONNECT_UO: 180
  };
  const [bonusPercent, setBonusPercent] = useState<number>(0);
  const [dbCalculations, setDbCalculations] = useState({
    base_salary: 19200,
    bonus_calculated_uah: 0,
    earned_from_work: 0,
    total_salary_prognosis: 19200,
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
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/salary`);
      if (!response.ok) throw new Error('Не вдалося завантажити звіт');
      
      const data = await response.json();
      
      // 🌟 НАДВАЖЛИВИЙ ФІКС: якщо з сервера прийшло undefined/null, ставимо порожній масив []
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
      const response = await fetch('https://salary-backend-woq5.onrender.com/api/work-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workLog),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Щось пішло не так при збереженні');
      }
      alert(`${data.message}`);
      fetchSalaryFromBackend();
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
      }));
    } catch (error: any) {
      console.error('Помилка відправки:', error);
      alert(`❌ Помилка: ${error.message}`);
    }
  };

  const formatUkDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', weekday: 'short' });
  };

   const calculateDaySum = (day: WorkDay) => {
    return (
      (day.connect_tv * DAY_RATES.CONNECT_TV) +
      (day.connect_no_tv * DAY_RATES.CONNECT_NO_TV) +
      (day.addon_pon * DAY_RATES.ADDON_PON) +
      (day.addon_eth * DAY_RATES.ADDON_ETH) +
      (day.reconnect * DAY_RATES.RECONNECT) +
      (day.extra_hours * DAY_RATES.EXTRA_HOUR) +
      (day.duty * DAY_RATES.DUTY_HOUR) +
      (day.brought_clients * DAY_RATES.BROUGHT_CLIENT) +
      (day.connect_uo * DAY_RATES.CONNECT_UO)
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
      <main className="w-full max-w-md space-y-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-xl text-center border border-emerald-400/20">
          <h2 className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            Прогноз ЗП на цей місяць
          </h2>
          <p className="text-4xl font-black text-white mt-2 drop-shadow-sm">
            {dbCalculations.total_salary_prognosis.toLocaleString('uk-UA')} грн
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-emerald-50 ">
            <div>
              {' '}
              Ставка:
              <span className="font-bold pl-1">
                {dbCalculations.base_salary.toLocaleString('uk-UA')} грн
              </span>
            </div>
            <div>
              Премія:
              <span className="font-bold pl-1">
                {bonusPercent}% ({dbCalculations.bonus_calculated_uah} грн)
              </span>
            </div>
          </div>
          {dbCalculations.earned_from_work > 0 && (
            <div className="mt-2 text-xs text-emerald-100 text-center font-medium bg-white/10 py-1 rounded-md">
              Зароблено на підробітках: +
              {dbCalculations.earned_from_work.toLocaleString('uk-UA')} грн
            </div>
          )}
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/50 text-center text-slate-400 text-sm">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
            Розмір премії за місяць
          </h3>
          <div className="grid grid-cols-4 gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/30">
            {BONUS_OPTIONS.map((option) => {
              const isActive = bonusPercent === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBonusPercent(option)}
                  className={`py-2.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                      : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {option}%
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/50">
          <h3 className="text-md font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700/50">
            Внести роботу за день
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Дата
            </label>
            <input
              type="date"
              value={workLog.date}
              onChange={(e) =>
                setWorkLog((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full mt-1.5 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl  text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer scheme-dark"
            ></input>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: '📺 Підключення з ТВ (150 грн)', field: 'connect_tv' },
              {
                label: '🌐 Підключення без ТВ (100 грн)',
                field: 'connect_no_tv',
              },
              { label: '🌀 Допідключення ПОН (100 грн)', field: 'addon_pon' },
              {
                label: '🔌 Допідключення Езернет (75 грн)',
                field: 'addon_eth',
              },
              { label: '🔄 Переключення (80 грн)', field: 'reconnect' },
              {
                label: '🤝 Приведені клієнти (150 грн)',
                field: 'brought_clients',
              },
              { label: '🏢 Підключення ЮО (180 грн)', field: 'connect_uo' },
              {
                label: '⏱️ Додаткові години (100 грн/год)',
                field: 'extra_hours',
                isHours: true,
              },
              {
                label: '🛡️ Чергування (120 грн/год)',
                field: 'duty_hours',
                isHours: true,
              },
            ].map((item) => {
              const value = workLog[item.field as keyof typeof workLog];
              return (
                <div
                  key={item.field}
                  className="flex justify-between items-center bg-slate-900/30 p-2.5 rounded-xl border border-slate-700/20"
                >
                  <span className="text-xs font-medium text-slate-300">
                    {item.label}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleCounterChange(
                          item.field,
                          'dec',
                          item.isHours ? 0.5 : 1,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-center flex items-center justify-center cursor-pointer select-none text-lg active:scale-95 transition-transform"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-emerald-400 w-8 text-center">
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCounterChange(
                          item.field,
                          'inc',
                          item.isHours ? 0.5 : 1,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-center flex items-center justify-center cursor-pointer select-none text-lg active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={saveDataToServer}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
          >
            Зберегти в базу даних
          </button>
        </div>
               {/* 📋 ДЕТАЛЬНИЙ ЗВІТ / ІСТОРІЯ ПО ДНЯХ РОБОТИ */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/50 space-y-4">
          <h3 className="text-md font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700/50 pb-2 flex justify-between items-center">
            <span>📋 Детальний звіт за місяць</span>
            <span className="text-xs bg-slate-900 text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/10">
              днів: {historyList ? historyList.length : 0}
            </span>
          </h3>

          {/* 🌟 РОЗУМНА ПЕРЕВІРКА: якщо масиву немає або він порожній, показуємо заглушку */}
          {!historyList || historyList.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-4">Записів за цей місяць ще немає...</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {historyList.map((day) => {
                const daySum = calculateDaySum(day);
                return (
                  <div key={day.date} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/40 text-xs space-y-2">
                    
                    {/* Шапка дня: Дата + Зароблена сума за цей день */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-black text-slate-200 uppercase tracking-tight text-[11px]">
                        📅 {formatUkDate(day.date)}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/10">
                        +{daySum.toLocaleString('uk-UA')} грн
                      </span>
                    </div>
                    
                    {/* Детальний список виконаної роботи */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400">
                      {day.connect_tv > 0 && <div className="flex justify-between"><span>📺 ТВ підключення:</span> <b className="text-slate-200">{day.connect_tv}</b></div>}
                      {day.connect_no_tv > 0 && <div className="flex justify-between"><span>🌐 Інтернет підкл:</span> <b className="text-slate-200">{day.connect_no_tv}</b></div>}
                      {day.addon_pon > 0 && <div className="flex justify-between"><span>🌀 Допідкл ПОН:</span> <b className="text-slate-200">{day.addon_pon}</b></div>}
                      {day.addon_eth > 0 && <div className="flex justify-between"><span>🔌 Допідкл Етх:</span> <b className="text-slate-200">{day.addon_eth}</b></div>}
                      {day.reconnect > 0 && <div className="flex justify-between"><span>🔄 Переключення:</span> <b className="text-slate-200">{day.reconnect}</b></div>}
                      {day.extra_hours > 0 && <div className="flex justify-between"><span>⏱️ Додаткові години:</span> <b className="text-slate-200">{day.extra_hours} год</b></div>}
                      {day.duty > 0 && <div className="flex justify-between"><span>🛡️ Чергування:</span> <b className="text-slate-200">{day.duty} год</b></div>}
                      {day.brought_clients > 0 && <div className="flex justify-between"><span>🤝 Приведені клієнти:</span> <b className="text-slate-200">{day.brought_clients}</b></div>}
                      {day.connect_uo > 0 && <div className="flex justify-between"><span>🏢 Підключення ЮО:</span> <b className="text-slate-200">{day.connect_uo}</b></div>}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
