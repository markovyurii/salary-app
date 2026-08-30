interface AddProps {
  log: any;
  setLog: any;
  onCounter: (f: string, op: 'inc' | 'dec', s?: number) => void;
  onSave: () => void;
}
export function AddTab({ log, setLog, onCounter, onSave }: AddProps) {
  const fields = [
    { label: '📺 Підключення з ТВ (150 грн)', f: 'connect_tv' },
    { label: '🌐 Підключення без ТВ (100 грн)', f: 'connect_no_tv' },
    { label: '🌀 Допідключення ПОН (100 грн)', f: 'addon_pon' },
    { label: '🔌 Допідключення Езернет (75 грн)', f: 'addon_eth' },
    { label: '🔄 Переключення (80 грн)', f: 'reconnect' },
    { label: '🤝 Приведені клієнти (150 грн)', f: 'brought_clients' },
    { label: '🏢 Підключення ЮО (180 грн)', f: 'connect_uo' },
    { label: '⏱️ Додаткові години (100 грн/год)', f: 'extra_hours', h: true },
    { label: '🛡️ Чергування (120 грн/год)', f: 'duty_hours', h: true },
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
          Дата логування
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
            <span className="text-xs font-medium text-slate-300">
              {item.label}
            </span>
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
        <div className="flex justify-between items-center bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20 mt-2">
          <span className="text-xs font-bold text-amber-400 block">
            💵 Чайові за день (грн)
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
        🚀 Зберегти день в хмару
      </button>
    </div>
  );
}
