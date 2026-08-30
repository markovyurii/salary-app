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
  userName,
  handleLogout,
  children,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: MainLayoutProps) {
  const location = useLocation(); // Стежимо за URL для підсвічування кнопок

  return (
    <div className="w-full max-w-md flex flex-col min-h-screen pt-4 pb-24 animate-[fadeIn_0.15s_ease-out]">
      {/* 🔘 СТАБІЛЬНИЙ ОДНАКОВИЙ ХЕДЕР */}
      {/* 🔘 СТАБІЛЬНИЙ ОДНАКОВИЙ ХЕДЕР З ВИБОРОМ МІСЯЦЯ */}
      <header className="py-3 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-40 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black text-emerald-400 leading-none">
              Калькулятор ЗП
            </h1>
            <span className="text-[10px] text-emerald-500/80 font-bold tracking-wide mt-1 block">
              👋 Привіт, {userName}!
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[10px] bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg border border-slate-700/40 cursor-pointer font-bold transition-all"
          >
            🚪 Вийти
          </button>
        </div>

        {/* 🌟 ІНТЕЛЕКТУАЛЬНИЙ СЕЛЕКТОР МІСЯЦІВ ТА РОКІВ */}
        <div className="flex gap-2 bg-slate-900/40 p-1.5 rounded-xl border border-slate-800/60">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="flex-1 bg-slate-800 text-slate-200 text-xs font-bold p-2 rounded-lg border border-slate-700/40 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {[
              { v: 1, n: 'Січень ❄️' },
              { v: 2, n: 'Лютий 🏔️' },
              { v: 3, n: 'Березень 🌱' },
              { v: 4, n: 'Квітень 🌸' },
              { v: 5, n: 'Травень 🌿' },
              { v: 6, n: 'Червень ☀️' },
              { v: 7, n: 'Липень 🏖️' },
              { v: 8, n: 'Серпень 🍉' },
              { v: 9, n: 'Вересень 🍁' },
              { v: 10, n: 'Жовтень 🍂' },
              { v: 11, n: 'Листопад 🌧️' },
              { v: 12, n: 'Грудень 🎄' },
            ].map((m) => (
              <option key={m.v} value={m.v}>
                {m.n}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 text-xs font-bold p-2 rounded-lg border border-slate-700/40 focus:outline-none focus:border-emerald-500 cursor-pointer w-24"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 🔘 ДИНАМІЧНИЙ ЦЕНТР СТОРІНОК */}
      <main className="flex-1 pt-4">{children}</main>

      {/* 🔘 СТАБІЛЬНИЙ ОДНАКОВИЙ ФУТЕР НАВІГАЦІЇ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-50 shadow-2xl max-w-md mx-auto rounded-t-2xl">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${location.pathname === '/' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">Статистика</span>
        </Link>
        <Link
          to="/add"
          className={`flex flex-col items-center space-y-1 py-1 px-4 rounded-xl transition-all ${location.pathname === '/add' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">➕</span>
          <span className="text-[10px]">Внести день</span>
        </Link>
        <Link
          to="/history"
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${location.pathname === '/history' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-lg">📋</span>
          <span className="text-[10px]">Логи дня</span>
        </Link>
      </nav>
    </div>
  );
}
