import { Link } from 'react-router-dom';

interface RegisterProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  pass: string;
  setPass: (v: string) => void;
  authName: string;
  setAuthName: (v: string) => void;
}

export function RegisterScreen({ onSubmit, email, setEmail, pass, setPass, authName, setAuthName }: RegisterProps) {
  return (
    <div className="w-full max-w-md mt-16 flex flex-col space-y-6 animate-[fadeIn_0.2s_ease-out]">
      
      {/* ХЕДЕР */}
      <header className="flex flex-col items-center text-center space-y-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg border border-white/5">
          <i className="fa-solid fa-calculator text-base text-white"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight leading-none">Калькулятор ЗП</h1>
          <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest mt-1 block">Твій особистий щоденник</span>
        </div>
        <p className="text-slate-400 text-xs font-medium pt-0.5">Створи твій персональний фінансовий кабінет</p>
      </header>

      {/* ФОРМА РЕЄСТРАЦІЇ */}
      <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-solid fa-signature text-emerald-400"></i> Як до вас звертатися?
            </label>
            <input type="text" placeholder="Введіть ваше імʼя" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-solid fa-envelope text-slate-400"></i> Електронна пошта
            </label>
            <input type="email" placeholder="example@work.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-solid fa-lock text-slate-400"></i> Пароль
            </label>
            <input type="password" placeholder="Мінімум 6 символів" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold" required />
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-emerald-500/10 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <i className="fa-solid fa-circle-check"></i>
            Створити аккаунт
          </button>
        </form>

        <div className="text-center border-t border-slate-700/50 pt-4 mt-4">
          <Link to="/login" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-all">
            Вже є профіль? Увійти в систему
          </Link>
        </div>
      </div>

    </div>
  );
}
