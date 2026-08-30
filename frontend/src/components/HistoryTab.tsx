// 🌟 Описуємо інтерфейс прямо тут, щоб компонент був незалежним
export interface WorkDay {
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

interface HistProps {
  list: WorkDay[];
  onCalc: (day: WorkDay) => number;
  onFormat: (d: string) => string;
}

export const calculatedTotalDayEarned = (day: any) => {
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
  return (
    (day?.connect_tv || 0) * RATES.CONNECT_TV +
    (day?.connect_no_tv || 0) * RATES.CONNECT_NO_TV +
    (day?.addon_pon || 0) * RATES.ADDON_PON +
    (day?.addon_eth || 0) * RATES.ADDON_ETH +
    (day?.reconnect || 0) * RATES.RECONNECT +
    (day?.extra_hours || 0) * RATES.EXTRA_HOUR +
    (day?.duty || 0) * RATES.DUTY_HOUR +
    (day?.brought_clients || 0) * RATES.BROUGHT_CLIENT +
    (day?.connect_uo || 0) * RATES.CONNECT_UO
  );
};

export const formatLogDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString('uk-UA', { weekday: 'short' })}, ${date.toLocaleDateString('uk-UA', { day: 'numeric' })} ${date.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '')}`;
};

export function HistoryTab({ list, onCalc, onFormat }: HistProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-3 shadow-md animate-[fadeIn_0.15s_ease-out]">
      <div className="flex justify-between items-center border-b border-slate-700/40 pb-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
          <i className="fa-solid fa-boxes-stacked text-emerald-400"></i> Архів
          логів за місяць
        </h3>
        <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/10">
          днів: {list ? list.length : 0}
        </span>
      </div>

      {!list || list.length === 0 ? (
        <p className="text-center text-xs text-slate-500 py-6">
          Записів за цей місяць ще немає...
        </p>
      ) : (
        <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {list.map((day) => {
            const sum = onCalc(day);
            return (
              <div
                key={day.date}
                className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/30 text-[11px] space-y-1.5"
              >
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                  <span className="font-extrabold text-slate-200">
                    <i className="fa-solid fa-calendar-days text-slate-400"></i>{' '}
                    {onFormat(day.date)}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/10">
                    +{sum ? sum.toLocaleString('uk-UA') : '0'} ₴
                  </span>
                </div>
                <div className="space-y-1 text-slate-400 pt-1.5">
                  {day?.connect_tv > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-tv text-emerald-400 text-xs w-4"></i>{' '}
                        ТВ підключення
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.connect_tv}
                      </span>
                    </div>
                  )}
                  {day?.connect_no_tv > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-globe text-emerald-400 text-xs w-4"></i>
                        Інтернет підключення
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.connect_no_tv}
                      </span>
                    </div>
                  )}
                  {day?.addon_pon > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-bolt text-teal-400 text-xs w-4"></i>{' '}
                        Допідключення ПОН
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.addon_pon}
                      </span>
                    </div>
                  )}
                  {day?.addon_eth > 0 && (
                    <div className="flex justify-between">
                      <span>
                        {' '}
                        <i className="fa-solid fa-network-wired text-teal-400 text-xs w-4"></i>{' '}
                        Допідключення Езернет
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.addon_eth}
                      </span>
                    </div>
                  )}
                  {day?.reconnect > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-arrows-rotate text-sky-400 text-xs w-4"></i>{' '}
                        Переключення
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.reconnect}
                      </span>
                    </div>
                  )}
                  {day?.extra_hours > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-hourglass-half text-amber-400 text-xs w-4"></i>{' '}
                        Додаткові години
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.extra_hours} год
                      </span>
                    </div>
                  )}
                  {day?.duty > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-user-shield text-amber-400 text-xs w-4"></i>{' '}
                        Чергування
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.duty} год
                      </span>
                    </div>
                  )}
                  {day?.brought_clients > 0 && (
                    <div className="flex justify-between">
                      <span>
                        {' '}
                        <i className="fa-solid fa-user-plus text-purple-400 text-xs w-4"></i>{' '}
                        Приведені клієнти
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.brought_clients}
                      </span>
                    </div>
                  )}
                  {day?.connect_uo > 0 && (
                    <div className="flex justify-between">
                      <span>
                        <i className="fa-solid fa-building text-indigo-400 text-xs w-4"></i>{' '}
                        Підключення ЮО
                      </span>
                      <span className="font-bold text-slate-200">
                        {day.connect_uo}
                      </span>
                    </div>
                  )}
                  {day?.tips > 0 && (
                    <div className="flex justify-between text-amber-400/90 font-medium">
                      <span>
                        <i className="fa-solid fa-piggy-bank text-amber-400"></i>{' '}
                        Чайові за день
                      </span>
                      <span className="font-bold">+{day.tips || 0} ₴</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
