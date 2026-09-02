// 🌟 Описуємо інтерфейс прямо тут, щоб компонент був незалежним

interface HistProps {
  list: any[];
  onFormat: (d: string) => string;
}

export const calculatedTotalDayEarned = (day: any) => {
  const RATES = {
    CONNECT_WITH_TV: 150,
    CONNECT_WITH_TV_SHARED: 75,
    CONNECT_INTERNET_SOLO: 100,
    CONNECT_INTERNET_SHARED: 50,
    CONNECT_TV_SOLO: 100,
    CONNECT_TV_SHARED: 50,
    RECONNECT: 80,
    CONNECT_UO: 180,
    BROUGHT_CLIENT: 150,
    ADDON_PON_SOLO: 100,
    ADDON_PON_SHARED: 50,
    EXTRA_HOUR: 100,
    DUTY_HOUR: 120,
    PARKING_HOUR: 15,
  };

  const hasParking = (Number(day?.parking_hours) || 0) > 0;
  return (
    (Number(day?.connect_with_tv) || 0) * RATES.CONNECT_WITH_TV +
    (Number(day?.connect_with_tv_shared) || 0) * RATES.CONNECT_WITH_TV_SHARED +
    (Number(day?.connect_internet_solo) || 0) * RATES.CONNECT_INTERNET_SOLO +
    (Number(day?.connect_internet_shared) || 0) *
      RATES.CONNECT_INTERNET_SHARED +
    (Number(day?.connect_tv_solo) || 0) * RATES.CONNECT_TV_SOLO +
    (Number(day?.connect_tv_shared) || 0) * RATES.CONNECT_TV_SHARED +
    (Number(day?.reconnect) || 0) * RATES.RECONNECT +
    (Number(day?.connect_uo) || 0) * RATES.CONNECT_UO +
    (Number(day?.brought_clients) || 0) * RATES.BROUGHT_CLIENT +
    (Number(day?.addon_pon_solo) || 0) * RATES.ADDON_PON_SOLO +
    (Number(day?.addon_pon_shared) || 0) * RATES.ADDON_PON_SHARED +
    (Number(day?.extra_hours) || 0) * RATES.EXTRA_HOUR +
    (Number(day?.duty) || 0) * RATES.DUTY_HOUR +
    // Розрахунок транспортного блоку за день
    (hasParking
      ? (Number(day?.parking_hours) || 0) * RATES.PARKING_HOUR
      : (Number(day?.travel_compensation) || 0) * 26)
  );
};

export const formatLogDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString('uk-UA', { weekday: 'short' })}, ${date.toLocaleDateString('uk-UA', { day: 'numeric' })} ${date.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '')}`;
};

export function HistoryTab({ list, onFormat }: HistProps) {
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
            const hasParking = (Number(day?.parking_hours) || 0) > 0;
            const sum =
              (Number(day?.connect_with_tv) || 0) * 150 +
              (Number(day?.connect_with_tv_shared) || 0) * 75 +
              (Number(day?.connect_internet_solo) || 0) * 100 +
              (Number(day?.connect_internet_shared) || 0) * 50 +
              (Number(day?.connect_tv_solo) || 0) * 100 +
              (Number(day?.connect_tv_shared) || 0) * 50 +
              (Number(day?.reconnect) || 0) * 80 +
              (Number(day?.connect_uo) || 0) * 180 +
              (Number(day?.brought_clients) || 0) * 150 +
              (Number(day?.addon_pon_solo) || 0) * 100 +
              (Number(day?.addon_pon_shared) || 0) * 50 +
              (Number(day?.extra_hours) || 0) * 100 +
              (Number(day?.duty) || 0) * 120 +
              (hasParking
                ? (Number(day?.parking_hours) || 0) * 15
                : (Number(day?.travel_compensation) || 0) * 26);
            const dayItems = [
              {
                val: day?.connect_with_tv,
                label: 'Підключення з ТВ (150 ₴)',
                icon: 'fa-satellite-dish',
                color: 'text-emerald-400',
              },
              {
                val: day?.connect_with_tv_shared,
                label: 'З ТВ муфта на поверсі (75 ₴)',
                icon: 'fa-network-wired',
                color: 'text-emerald-400',
              },
              {
                val: day?.connect_internet_solo,
                label: 'Суто інтернет (100 ₴)',
                icon: 'fa-globe',
                color: 'text-teal-400',
              },
              {
                val: day?.connect_internet_shared,
                label: 'Суто інтернет муфта (50 ₴)',
                icon: 'fa-people-arrows',
                color: 'text-teal-500',
              },
              {
                val: day?.connect_tv_solo,
                label: 'Підключення телебачення (100 ₴)',
                icon: 'fa-tv',
                color: 'text-sky-400',
              },
              {
                val: day?.connect_tv_shared,
                label: 'Телебачення на двох (50 ₴)',
                icon: 'fa-users',
                color: 'text-sky-400',
              },
              {
                val: day?.reconnect,
                label: 'Переключення (80 ₴)',
                icon: 'fa-arrows-rotate',
                color: 'text-amber-400',
              },
              {
                val: day?.connect_uo,
                label: 'Підключення ЮО (180 ₴)',
                icon: 'fa-building',
                color: 'text-purple-400',
              },
              {
                val: day?.brought_clients,
                label: 'Приведені клієнти (150 ₴)',
                icon: 'fa-user-plus',
                color: 'text-fuchsia-400',
              },
              {
                val: day?.addon_pon_solo,
                label: 'Допідкл. ПОН без муфти (100 ₴)',
                icon: 'fa-bolt',
                color: 'text-indigo-400',
              },
              {
                val: day?.addon_pon_shared,
                label: 'Допідкл. ПОН з муфтою (50 ₴)',
                icon: 'fa-circle-nodes',
                color: 'text-indigo-500',
              },
              {
                val: day?.extra_hours,
                label: 'Додаткові години',
                icon: 'fa-hourglass-half',
                color: 'text-slate-400',
                unit: ' год',
              },
              {
                val: day?.duty,
                label: 'Чергування',
                icon: 'fa-user-shield',
                color: 'text-slate-400',
                unit: ' год',
              },
              {
                val: day?.parking_hours,
                label: 'Виплата за парковку (15 ₴/год)',
                icon: 'fa-square-parking',
                color: 'text-emerald-400/90',
                unit: ' год',
              },
              {
                val: day?.travel_compensation,
                label: 'Кількість поїздок проїзду (26 ₴)',
                icon: 'fa-bus',
                color: 'text-sky-400/90',
                unit: ' поїзд.',
              },
            ];
            return (
              <div
                key={day.date}
                className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/30 text-[11px] space-y-1.5 animate-[fadeIn_0.1s_ease-out]"
              >
                {/* Рядок Заголовку Дня */}
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                  <span className="font-extrabold text-slate-200">
                    <i className="fa-solid fa-calendar-days text-slate-400"></i>{' '}
                    {onFormat(day.date)}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/10">
                    +{sum ? sum.toLocaleString('uk-UA') : '0'} ₴
                  </span>
                </div>

                {/* 🌟 АВТОМАТИЧНИЙ ВИВІД СПИСОК ТВ/ІНТЕРНЕТ РОБІТ ЗА ДЕНЬ ЧЕРЕЗ ЦИКЛ */}
                <div className="space-y-1 text-slate-400 pt-1.5">
                  {dayItems.map((item, idx) => {
                    const value = Number(item.val) || 0;
                    if (value <= 0) return null; // Якщо цієї роботи за день не було — рядок приховується!

                    return (
                      <div key={idx} className="flex justify-between">
                        <span className="flex items-center gap-1.5">
                          <i
                            className={`fa-solid ${item.icon} ${item.color} text-xs w-4 text-center`}
                          ></i>{' '}
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-200">
                          {value}
                          {item.unit || ''}
                        </span>
                      </div>
                    );
                  })}

                  {/* Чайові за день */}
                  {Number(day?.tips) > 0 && (
                    <div className="flex justify-between text-amber-400/90 font-medium border-t border-slate-800/40 pt-1 mt-1">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-piggy-bank text-amber-400 text-xs w-4 text-center"></i>{' '}
                        Чайові за день
                      </span>
                      <span className="font-bold">+{day.tips} ₴</span>
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
