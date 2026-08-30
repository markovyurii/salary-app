import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  userName: string;
  handleLogout: () => void;
  children: React.ReactNode;
  selectedMonth: number;
  setSelectedMonth: (v: number) => void;
  selectedYear: number;
  setSelectedYear: (v: number) => void;
}

export function MainLayout({ 
  userName, handleLogout, children, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear 
}: MainLayoutProps) {
  const location = useLocation();

  return (
    <div className="w-full max-w-md flex flex-col min-h-screen px-1 antialiased">
      
      {/* 🔘 МОНОЛІТНИЙ КОМПАКТНИЙ ХЕДЕР — ВСЕ В ОДИН РЯДОК */}
      <header className="py-3 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-40 space-y-3">
        
        {/* ГОЛОВНИЙ РЯДОК: Лого + Назва + Юзер + Вихід */}
        <div className="flex justify-between items-center gap-2">
          
          {/* Ліва частина: Логотип і назва разом */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <i className="fa-solid fa-calculator text-xs text-white"></i>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight leading-none">Калькулятор ЗП</h1>
              <span className="text-[9px] text-emerald-400 font-bold opacity-90 mt-0.5 block">Твій особистий щоденник</span>
            </div>
          </div>

          {/* Права частина: Компактний бейдж юзера та міні-кнопка виходу */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800/80 text-[10px] text-slate-300 font-medium">
              <i className="fa-solid fa-user text-[9px] text-emerald-400"></i>
              <span className="max-w-[60px] truncate">{userName}</span>
            </div>
            
            <button 
              type="button" 
              onClick={handleLogout} 
              className="w-7 h-7 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700/40 cursor-pointer flex items-center justify-center transition-all active:scale-90"
              title="Вийти з акаунта"
            >
              <i className="fa-solid fa-right-from-bracket text-[10px]"></i>
            </button>
          </div>

        </div>

        {/* СЕЛЕКТОР ПЕРІОДУ — ДУЖЕ ТОНКИЙ І КОМПАКТНИЙ */}
        <div className="flex gap-2 bg-slate-900/40 p-1 rounded-lg border border-slate-800/60 items-center">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))} 
            className="flex-1 bg-slate-800 text-slate-200 text-[11px] font-bold py-1.5 px-2 rounded-md border border-slate-700/30 focus:outline-none focus:border-emerald-500 cursor-pointer scheme-dark"
          >
            {[
              { v: 1, n: 'Січень' }, { v: 2, n: 'Лютий' }, { v: 3, n: 'Березень' },
              { v: 4, n: 'Квітень' }, { v: 5, n: 'Травень' }, { v: 6, n: 'Червень' },
              { v: 7, n: 'Липень' }, { v: 8, n: 'Серпень' }, { v: 9, n: 'Вересень' },
              { v: 10, n: 'Жовтень' }, { v: 11, n: 'Листопад' }, { v: 12, n: 'Грудень' }
            ].map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))} 
            className="bg-slate-800 text-slate-200 text-[11px] font-bold py-1.5 px-2 rounded-md border border-slate-700/30 focus:outline-none focus:border-emerald-500 cursor-pointer w-20 scheme-dark"
          >
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

      </header>

      {/* ДИНАМІЧНИЙ ЦЕНТР СТОРІНОК */}
      <main className="flex-1 pt-3">
        {children}
      </main>

      {/* ФУТЕР НАВІГАЦІЇ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-50 shadow-2xl max-w-md mx-auto rounded-t-2xl">
        <Link to="/" className={`flex flex-col items-center space-y-1 py-1 px-2.5 rounded-xl transition-all ${location.pathname === '/' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
          <i className="fa-solid fa-chart-simple text-base transition-transform active:scale-90"></i>
          <span className="text-[9px] font-semibold tracking-wide">Аналітика</span>
        </Link>
        <Link to="/add" className={`flex flex-col items-center space-y-1 py-1 px-2.5 rounded-xl transition-all ${location.pathname === '/add' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
          <i className="fa-solid fa-circle-plus text-base transition-transform active:scale-90"></i>
          <span className="text-[9px] font-semibold tracking-wide">Внести день</span>
        </Link>
        <Link to="/history" className={`flex flex-col items-center space-y-1 py-1 px-2.5 rounded-xl transition-all ${location.pathname === '/history' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
          <i className="fa-solid fa-clipboard-list text-base transition-transform active:scale-90"></i>
          <span className="text-[9px] font-semibold tracking-wide">Логи дня</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center space-y-1 py-1 px-2.5 rounded-xl transition-all ${location.pathname === '/settings' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
          <i className="fa-solid fa-gear text-base transition-transform active:scale-90"></i>
          <span className="text-[9px] font-semibold tracking-wide">Налаштування</span>
        </Link>
      </nav>

    </div>
  );
}
