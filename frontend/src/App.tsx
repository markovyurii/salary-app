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
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'form'>(
    'dashboard',
  );
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
      day.connect_tv * DAY_RATES.CONNECT_TV +
      day.connect_no_tv * DAY_RATES.CONNECT_NO_TV +
      day.addon_pon * DAY_RATES.ADDON_PON +
      day.addon_eth * DAY_RATES.ADDON_ETH +
      day.reconnect * DAY_RATES.RECONNECT +
      day.extra_hours * DAY_RATES.EXTRA_HOUR +
      day.duty * DAY_RATES.DUTY_HOUR +
      day.brought_clients * DAY_RATES.BROUGHT_CLIENT +
      day.connect_uo * DAY_RATES.CONNECT_UO
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
        {currentPage === 'dashboard' && (
          <div className="space-y-5 animate-[fadeIn_0.2s_ease-in-out]">
            {/* СТИЛЬНЕ СУЧАСНЕ ТАБЛО */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5 rounded-2xl shadow-lg border border-emerald-400/200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider opacity-90">
                  Прогноз ЗП на місяць
                </h2>
                <p className="text-3xl font-black text-white mt-1 drop-shadow-sm leading-none">
                  {' '}
                  {dbCalculations.total_salary_prognosis.toLocaleString(
                    'uk-UA',
                  )}
                  <span className="text-lg font-bold">грн</span>
                </p>
                <div className="mt-3 bg-slate-950/20 px-3 py-1.5 rounded-xl border border-white/5 text-[11px] font-semibold text-emerald-50 ">
                  ✉️ У конверт:{' '}
                  <span className="text-amber-300 font-black pl-1">
                    {(dbCalculations?.total_tips_uah || 0).toLocaleString(
                      'uk-UA',
                    )}{' '}
                    грн
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-auto bg-slate-950/30 p-3 rounded-xl border border-white/5 text-right space-y-1 flex-1 min-w-[170px]">
                <div className="flex justify-between text-[11px] text-emerald-50">
                  <span className="opacity-75">Ставка:</span>
                  <span className="font-bold">
                    {dbCalculations.base_salary.toLocaleString('uk-UA')} грн
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-50">
                  <span className="opacity-75">Премія ({bonusPercent}%):</span>
                  <span className="font-bold">
                    +
                    {dbCalculations.bonus_calculated_uah.toLocaleString(
                      'uk-UA',
                    )}{' '}
                    грн
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-50 border-t border-white/10 pt-1 mt-1">
                  <span className="opacity-75">Підробітки:</span>
                  <span className="font-bold text-white">
                    +{dbCalculations.earned_from_work.toLocaleString('uk-UA')}{' '}
                    грн
                  </span>
                </div>
              </div>
            </div>

            {/* ВІДЖЕТ ЗАГАЛЬНИХ ЧАЙОВИХ ЗА МІСЯЦЬ */}
            <div className="bg-slate-800 p-4 rounded-2xl shadow-lg border border-amber-500/20 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  💵 Накопичені Чайові
                </h4>
                <p className="text-[11px] text-slate-400">
                  Чистий щоденний кеш від клієнтів
                </p>
              </div>
              <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl font-black text-md text-right min-w-[120px]">
                +{dbCalculations.total_tips_uah.toLocaleString('uk-UA')} грн
              </div>
            </div>

            {/* 🔥 ГОЛОВНА КНОПКА ПЕРЕХОДУ НА СТОРІНКУ ВНЕСЕННЯ РОБОТИ */}
            <button
              type="button"
              onClick={() => setCurrentPage('form')}
              className="w-full bg-slate-800 hover:bg-slate-750 text-emerald-400 font-extrabold py-4 rounded-2xl shadow-lg border border-dashed border-emerald-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span className="text-xl">➕</span>
              <span>Внести / Перезаписати роботу за день</span>
            </button>

            {/* БЛОК ОБРАННЯ ПРЕМІЇ */}

            <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700/40 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide text-center">
                Розмір премії за місяць
              </h3>
              <div className="grid grid-cols-4 gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/20">
                {BONUS_OPTIONS.map((option) => {
                  const isActive = bonusPercent === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBonusPercent(option)}
                      className={`py-2 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer ${
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

            {/* 📋 КРАСИВИЙ ДЕТАЛЬНИЙ ЗВІТ З ПРЕМІУМ СКРОЛОМ */}
            <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700/40 pb-2 flex justify-between items-center">
                <span>📋 Детальний звіт за місяць</span>
                <span className="text-xs bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/10">
                  днів: {historyList ? historyList.length : 0}
                </span>
              </h3>

              {!historyList || historyList.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">
                  Записів за цей місяць ще немає...
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {historyList.map((day) => {
                    const daySum = calculateDaySum(day);
                    return (
                      <div
                        key={day.date}
                        className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/30 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                          <span className="font-extrabold text-slate-200 text-[11px]">
                            📅 {formatUkDate(day.date)}
                          </span>
                          <span className="bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/10">
                            +{daySum.toLocaleString('uk-UA')} грн
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
                          {day.connect_tv > 0 && (
                            <div className="flex justify-between">
                              <span>📺 ТВ підключення:</span>{' '}
                              <b className="text-slate-200">{day.connect_tv}</b>
                            </div>
                          )}
                          {day.connect_no_tv > 0 && (
                            <div className="flex justify-between">
                              <span>🌐 Інтернет підкл:</span>{' '}
                              <b className="text-slate-200">
                                {day.connect_no_tv}
                              </b>
                            </div>
                          )}
                          {day.addon_pon > 0 && (
                            <div className="flex justify-between">
                              <span>🌀 Допідкл ПОН:</span>{' '}
                              <b className="text-slate-200">{day.addon_pon}</b>
                            </div>
                          )}
                          {day.addon_eth > 0 && (
                            <div className="flex justify-between">
                              <span>🔌 Допідкл Етх:</span>{' '}
                              <b className="text-slate-200">{day.addon_eth}</b>
                            </div>
                          )}
                          {day.reconnect > 0 && (
                            <div className="flex justify-between">
                              <span>🔄 Переключення:</span>{' '}
                              <b className="text-slate-200">{day.reconnect}</b>
                            </div>
                          )}
                          {day.extra_hours > 0 && (
                            <div className="flex justify-between">
                              <span>⏱️ Додаткові години:</span>{' '}
                              <b className="text-slate-200">
                                {day.extra_hours} год
                              </b>
                            </div>
                          )}
                          {day.duty > 0 && (
                            <div className="flex justify-between">
                              <span>🛡️ Чергування:</span>{' '}
                              <b className="text-slate-200">{day.duty} год</b>
                            </div>
                          )}
                          {day.brought_clients > 0 && (
                            <div className="flex justify-between">
                              <span>🤝 Приведені клієнти:</span>{' '}
                              <b className="text-slate-200">
                                {day.brought_clients}
                              </b>
                            </div>
                          )}
                          {day.connect_uo > 0 && (
                            <div className="flex justify-between">
                              <span>🏢 Підключення ЮО:</span>{' '}
                              <b className="text-slate-200">{day.connect_uo}</b>
                            </div>
                          )}
                          {day.tips > 0 && (
                            <div className="flex justify-between text-amber-400 font-semibold">
                              <span>💵 Чайові клієнта:</span>{' '}
                              <b>+{day.tips} грн</b>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {/* 🌎 СТОРІНКА 2: ОКРЕМА СТОРІНКА ФОРМИ ЛІЧИЛЬНИКІВ */}
        {currentPage === 'form' && (
          <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700/40 space-y-4 animate-[fadeIn_0.15s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-700/40 pb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Внести роботу за день
              </h3>
              <button
                type="button"
                onClick={() => setCurrentPage('dashboard')}
                className="text-xs bg-slate-900 hover:bg-slate-950 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700/40 cursor-pointer font-bold transition-all active:scale-95"
              >
                ⬅️ Назад
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Обери дату для запису/перезапису
              </label>
              <input
                type="date"
                value={workLog.date}
                onChange={(e) =>
                  setWorkLog((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full mt-1.5 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm scheme-dark font-semibold"
              />
            </div>

            <div className="space-y-2.5 pt-1">
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
                    className="flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-700/20"
                  >
                    <span className="text-xs font-medium text-slate-300">
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleCounterChange(
                            item.field,
                            'dec',
                            item.isHours ? 0.5 : 1,
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-black text-center flex items-center justify-center cursor-pointer select-none text-base active:scale-90 transition-transform"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-emerald-400 w-7 text-center">
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
                        className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-center flex items-center justify-center cursor-pointer select-none text-base active:scale-90 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ПОЛЕ ВВЕДЕННЯ ДОВІЛЬНОЇ СУМИ ЧАЙОВИХ З КЛАВІАТУРИ */}
              <div className="flex justify-between items-center bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 mt-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-400 block">
                    💵 Чайові за цей день (грн)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Введи суму з клавіатури
                  </span>
                </div>
                <div className="relative max-w-[110px]">
                  <input
                    type="number"
                    placeholder="0"
                    value={workLog.tips || ''}
                    onChange={(e) =>
                      setWorkLog((prev) => ({
                        ...prev,
                        tips: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 bg-slate-900/60 border border-amber-500/30 rounded-xl text-white text-right font-black focus:outline-none focus:border-amber-400 text-xs"
                  />
                  <span className="absolute left-2.5 top-2 text-[10px] text-amber-500/60 font-bold">
                    грн
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={saveDataToServer}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-150 transform active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              Зберегти / Перезаписати день
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
