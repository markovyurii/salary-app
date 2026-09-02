interface AddProps {
  log: any;
  setLog: any;
  onCounter: (f: string, op: 'inc' | 'dec', s?: number) => void;
  onSave: () => void;
  isDriver: boolean; }

export function AddTab({ log, setLog, onCounter, onSave, isDriver }: AddProps) {
  const fields = [
    { label: 'Підключення з ТВ (150 грн)', f: 'connect_with_tv', icon: <i className="fa-solid fa-satellite-dish text-emerald-400 text-xs w-5 text-center"></i> },
    { label: 'Підключення з ТВ на двох (75 грн)', f: 'connect_with_tv_shared', icon: <i className="fa-solid fa-network-wired text-emerald-400 text-xs w-5 text-center"></i> },
    { label: 'Підключення  інтернет (100 грн)', f: 'connect_internet_solo', icon: <i className="fa-solid fa-globe text-teal-400 text-xs w-5 text-center"></i> },
    { label: 'Підключення  інтернет на двох (50 грн)', f: 'connect_internet_shared', icon: <i className="fa-solid fa-people-arrows text-teal-500 text-xs w-5 text-center"></i> },
    { label: 'Підключення телебачення (100_грн)', f: 'connect_tv_solo', icon: <i className="fa-solid fa-tv text-sky-400 text-xs w-5 text-center"></i> },
    { label: 'Підключення телебачення на двох (50 грн)', f: 'connect_tv_shared', icon: <i className="fa-solid fa-users text-sky-400 text-xs w-5 text-center"></i> },
    { label: 'Переключення (80 грн)', f: 'reconnect', icon: <i className="fa-solid fa-arrows-spin text-amber-400 text-xs w-5 text-center"></i> },
    { label: 'Підключення ЮО (180 грн)', f: 'connect_uo', icon: <i className="fa-solid fa-building text-purple-400 text-xs w-5 text-center"></i> },
    { label: 'Приведені клієнти (150 грн)', f: 'brought_clients', icon: <i className="fa-solid fa-user-plus text-fuchsia-400 text-xs w-5 text-center"></i> },
    { label: 'Допідключення ПОН (100 грн)', f: 'addon_pon_solo', icon: <i className="fa-solid fa-bolt text-indigo-400 text-xs w-5 text-center"></i> },
    { label: 'Допідключення ПОН на двох (50 грн)', f: 'addon_pon_shared', icon: <i className="fa-solid fa-circle-nodes text-indigo-500 text-xs w-5 text-center"></i> },
    { label: 'Додаткові години (100 грн/год)', f: 'extra_hours', h: true, icon: <i className="fa-solid fa-clock text-slate-400 text-xs w-5 text-center"></i> },
    { label: 'Чергування (120 грн/год)', f: 'duty_hours', h: true, icon: <i className="fa-solid fa-user-shield text-slate-400 text-xs w-5 text-center"></i> },
  ];
  return (
    <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700/40 space-y-4 animate-[fadeIn_0.15s_ease-out]">
      <div className="border-b border-slate-700/40 pb-2 text-center">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
          Внести роботу за день
        </h3>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          <i className="fa-solid fa-calendar-days text-slate-400"></i> Дата
          логування
        </label>
        <input
          type="date"
          value={log.date}
          onChange={(e) => setLog((p: any) => ({ ...p, date: e.target.value }))}
          className="w-full mt-1.5 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs scheme-dark font-semibold"
        />
      </div>
      <div className="space-y-2.5">
        {fields.map((item) => (
          <div
            key={item.f}
            className="flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-700/20"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-xs font-medium text-slate-300">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onCounter(item.f, 'dec', item.h ? 0.5 : 1)}
                className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 font-black text-center flex items-center justify-center cursor-pointer text-sm"
              >
                -
              </button>
              <span className="text-xs font-black text-emerald-400 w-6 text-center">
                {log[item.f]}
              </span>
              <button
                onClick={() => onCounter(item.f, 'inc', item.h ? 0.5 : 1)}
                className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-center flex items-center justify-center cursor-pointer text-sm"
              >
                +
              </button>
            </div>
          </div>
        ))}
         {isDriver ? (
          <div className="flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-700/20">
            <div className="flex items-center gap-2"><i className="fa-solid fa-square-parking text-emerald-400 text-xs w-5 text-center"></i><span className="text-xs font-medium text-slate-300">Виплата за парковку (15 грн/год)</span></div>
            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => onCounter('parking_hours', 'dec', 1)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 font-black text-center flex items-center justify-center text-sm">-</button>
              <span className="text-xs font-black text-emerald-400 w-6 text-center">{log.parking_hours || 0}</span>
              <button type="button" onClick={() => onCounter('parking_hours', 'inc', 1)} className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-center flex items-center justify-center text-sm">+</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-700/20">
            <div className="flex items-center gap-2"><i className="fa-solid fa-bus text-sky-400 text-xs w-5 text-center"></i><span className="text-xs font-medium text-slate-300">Кількість поїздок проїзду (26 грн/шт)</span></div>
            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => onCounter('travel_compensation', 'dec', 1)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 font-black text-center flex items-center justify-center text-sm">-</button>
              <span className="text-xs font-black text-emerald-400 w-6 text-center">{log.travel_compensation || 0}</span>
              <button type="button" onClick={() => onCounter('travel_compensation', 'inc', 1)} className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-center flex items-center justify-center text-sm">+</button>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20 mt-2">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <i className="fa-solid fa-piggy-bank text-amber-400"></i>
            <span> Чайові за день </span>
          </span>
          <input
            type="number"
            placeholder="0"
            value={log.tips || ''}
            onChange={(e) =>
              setLog((p: any) => ({ ...p, tips: Number(e.target.value) }))
            }
            className="w-24 p-1.5 bg-slate-900/60 border border-amber-500/30 rounded-xl text-white text-right font-black focus:outline-none focus:border-amber-400 text-xs"
          />
        </div>
      </div>
      <button
        onClick={onSave}
        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg text-xs uppercase tracking-wider cursor-pointer"
      >
        <i className="fa-solid fa-paper-plane text-xs"></i> Зберегти день в
        хмару
      </button>
    </div>
  );
}
