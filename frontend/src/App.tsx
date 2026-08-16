import { useState, useEffect } from 'react';

function App() {
  const BONUS_OPTIONS = [0, 5, 10, 15];
  const [salary] = useState<number>(19200);
  const [bonusPercent, setBonusPercent] = useState<number>(0);
  const [dbCalculations, setDbCalculations] = useState({
    base_salary: 19200,
    bonus_calculated_uah: 0,
    earned_from_work: 0,
    total_salary_prognosis: 19200,
  });
  const RATES = {
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
        `https://salary-backend-woq5.onrender.com${bonusPercent}`,
      );
      if (!response.ok)
        throw new Error('Не вдалося завантажити дані з сервера');
      const data = await response.json();
      setDbCalculations(data.calculations);
    } catch (error: any) {
      console.error('Помилка завантаження ЗП:', error);
    }
  };

  useEffect(() => {
    fetchSalaryFromBackend();
  }, [bonusPercent]);

  const earnedFromWork =
    workLog.connect_tv * RATES.CONNECT_TV +
    workLog.connect_no_tv * RATES.CONNECT_NO_TV +
    workLog.addon_pon * RATES.ADDON_PON +
    workLog.addon_eth * RATES.ADDON_ETH +
    workLog.reconnect * RATES.RECONNECT +
    workLog.extra_hours * RATES.EXTRA_HOUR +
    workLog.duty_hours * RATES.DUTY_HOUR +
    workLog.brought_clients * RATES.BROUGHT_CLIENT +
    workLog.connect_uo * RATES.CONNECT_UO;

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
      const response = await fetch('https://salary-backend-woq5.onrender.com', {
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
                label: '🌐 Підключення без ТВ (100 sub)',
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
      </main>
    </div>
  );
}

export default App;
