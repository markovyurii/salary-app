interface AuthProps {
  onSubmit: (e: React.FormEvent) => void; email: string; setEmail: (v: string) => void;
  pass: string; setPass: (v: string) => void; isReg: boolean; setIsReg: (v: boolean) => void;
}
export function AuthScreen({ onSubmit, email, setEmail, pass, setPass, isReg, setIsReg }: AuthProps) {
  return (
    <div className="w-full max-w-md mt-10 flex flex-col space-y-5 animate-[fadeIn_0.2s_ease-out]">
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-black text-emerald-400 tracking-tight">Калькулятор ЗП</h1>
        <p className="text-slate-400 text-xs font-medium">Вхід у твій персональний хмарний блокнот</p>
      </header>
      <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Електронна пошта</label>
            <input type="email" placeholder="example@work.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1.5 p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Пароль</label>
            <input type="password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full mt-1.5 p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-emerald-500/10 text-xs uppercase tracking-wider cursor-pointer">
            {isReg ? '🚀 Створити новий акаунт' : '🔑 Увійти в систему'}
          </button>
        </form>
        <div className="text-center border-t border-slate-700/50 pt-4 mt-4">
          <button type="button" onClick={() => setIsReg(!isReg)} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-all cursor-pointer">
            {isReg ? 'У вас вже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
          </button>
        </div>
      </div>
    </div>
  );
}
