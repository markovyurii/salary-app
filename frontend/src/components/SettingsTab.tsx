interface SettingsProps {
  salaryInput: string;
  setSalaryInput: (v: string) => void;
  updateBaseSalaryInDb: (payload?: any) => void;
  cardPaymentInput: string;
  setCardPaymentInput: (v: string) => void;
  saveCardPayment: () => void;
  isDriver: boolean;
  setIsDriver: (v: boolean) => void;
  amortizationInput: string;
  setAmortizationInput: (v: string) => void;
  bonusInput: string;
  setBonusInput: (v: string) => void;
}

export function SettingsTab({
  salaryInput,
  setSalaryInput,
  updateBaseSalaryInDb,
  cardPaymentInput,
  setCardPaymentInput,
  saveCardPayment,
  isDriver,
  setIsDriver,
  amortizationInput,
  setAmortizationInput,
  bonusInput,
  setBonusInput,
}: SettingsProps) {
  const handleSaveProfile = () => {
    updateBaseSalaryInDb({
      base_salary: Number(salaryInput) || 19200,
      is_driver: Boolean(isDriver),
      car_amortization: Number(amortizationInput) || 3500,
      bonus_percent: Number(bonusInput) || 0,
    });
  };
  return (
    <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
      <div className="border-b border-slate-700/40 pb-2 text-center">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex justify-center items-center gap-2.5 ">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.242-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.992l1.004.827a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.354-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.242.437-.614.43-.992a7.736 7.723 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.753.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span>Керування Профілем</span>
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Налаштування твого фінансового аккаунта
        </p>
      </div>
      {/* 🚗 ТРАНСПОРТНИЙ СТАТУС (КНОПКИ ТЕПЕР ПОВНІСТЮ РОЗБЛОКОВАНІ) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
          <i className="fa-solid fa-car text-emerald-400"></i> Транспортний
          статус
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700/40">
          <button
            type="button"
            onClick={() => setIsDriver(true)}
            className={`py-2 text-xs font-black rounded-lg cursor-pointer transition-all ${isDriver ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🚗 Я на авто
          </button>
          <button
            type="button"
            onClick={() => setIsDriver(false)}
            className={`py-2 text-xs font-black rounded-lg cursor-pointer transition-all ${!isDriver ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🚶 Я пішохід
          </button>
        </div>
      </div>

      {/* 💰 СУМА АМОРТИЗАЦІЇ (ПЛАВНО ВИСКАКУЄ ТІЛЬКИ ДЛЯ ВОДІЇВ) */}
      {isDriver && (
        <div className="space-y-1.5 animate-[fadeIn_0.1s_ease-out]">
          <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
            <i className="fa-solid fa-wrench"></i> Фактична амортизація за
            місяць (грн)
          </label>
          <input
            type="number"
            value={amortizationInput}
            onChange={(e) => setAmortizationInput(e.target.value)}
            className="w-full p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      )}
      <button
        type="button"
        onClick={handleSaveProfile}
        className="w-full bg-slate-800 hover:bg-emerald-500/10 text-emerald-400 font-bold py-2 rounded-xl text-xs border border-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <i className="fa-solid fa-floppy-disk"></i> Зберегти статус та
        амортизацію
      </button>
      {/* 💳 БЛОК ВНЕСЕННЯ ВИПЛАТИ НА КАРТКУ (АВАНСИ) */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-md">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-1.5 text-sm  font-bold text-emerald-400 uppercase tracking-wide">
            <svg
              className="w-4 h-3.5 shrink-0 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25 3h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z"
              ></path>
            </svg>
            <span className="">Фіксація виплати на картку</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            Прийшов аванс чи частина ЗП? Внеси суму сюди:
          </p>
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
            onClick={saveCardPayment}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            Внести
          </button>
        </div>
      </div>

      {/* ⚙️ БЛОК НАЛАШТУВАННЯ СТАВКИ */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-3 shadow-md">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-1.5">
            <svg
              className="w-4 h-4 shrink-0 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V9.75m-15 11.25V9.75M3 21h18M12 9v-.75m0 0a1.5 1.5 0 113 0m-3 0a1.5 1.5 0 00-3 0m3 0h3.75M6 9h12"
              ></path>
            </svg>
            <span>Зміна базового окладу</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            Твоя офіційна чи щомісячна фіксована ставка:
          </p>
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
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-3 shadow-md">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-emerald-400 text-xs"></i>
            <span>Фінальна премія за місяць</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            Вноситься один раз наприкінці місяця:
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0"
            value={bonusInput}
            onChange={(e) => setBonusInput(e.target.value)}
            className="flex-1 p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={updateBaseSalaryInDb}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <i className="fa-solid fa-square-check"></i>
            <span>Зберегти</span>
          </button>
        </div>
      </div>
    </div>
  );
}
