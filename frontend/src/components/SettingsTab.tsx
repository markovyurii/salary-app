interface SettingsProps {
  salaryInput: string;
  setSalaryInput: (v: string) => void;
  updateBaseSalaryInDb: () => void;
  cardPaymentInput: string;
  setCardPaymentInput: (v: string) => void;
  saveCardPaymentToDb: () => void;
}

export function SettingsTab({
  salaryInput, setSalaryInput, updateBaseSalaryInDb,
  cardPaymentInput, setCardPaymentInput, saveCardPaymentToDb
}: SettingsProps) {
  return (
    <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
      
      <div className="border-b border-slate-700/40 pb-2 text-center">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">⚙️ Керування Профілем</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Налаштування твого фінансового аккаунта</p>
      </div>

      {/* 💳 БЛОК ВНЕСЕННЯ ВИПЛАТИ НА КАРТКУ (АВАНСИ) */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-md">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">💸 Фіксація виплати на картку</h4>
          <p className="text-[10px] text-slate-400">Прийшов аванс чи частина ЗП? Внеси суму сюди:</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Сума виплати (грн)" 
            value={cardPaymentInput}
            onChange={(e) => setCardPaymentInput(e.target.value)}
            className="flex-1 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          />
          <button 
            type="button"
            onClick={saveCardPaymentToDb}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            Внести
          </button>
        </div>
      </div>

      {/* ⚙️ БЛОК НАЛАШТУВАННЯ СТАВКИ */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-3 shadow-md">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">💵 Зміна базового окладу</h4>
          <p className="text-[10px] text-slate-400">Твоя офіційна чи щомісячна фіксована ставка:</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={salaryInput} 
            onChange={(e) => setSalaryInput(e.target.value)}
            className="flex-1 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          />
          <button 
            onClick={updateBaseSalaryInDb}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            Зберегти
          </button>
        </div>
      </div>

    </div>
  );
}
