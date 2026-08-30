import { Routes, Route,Link,useLocation,Navigate } from 'react-router-dom';
import { useSalary } from './hooks/useSalary';
import { AuthScreen } from './components/AuthScreen';
import { StatsTab } from './components/StatsTab';
import { AddTab } from './components/AddTab';
import {
  HistoryTab,
  calculatedTotalDayEarned,
  formatLogDate,
} from './components/HistoryTab';


function AppContent() {
  const {
    bonusPercent,
    setBonusPercent,
    activeTab,
    setActiveTab,
    userToken,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    isRegistering,
    setIsRegistering,
    dbCalculations,
    historyList,
    workLog,
    setWorkLog,
    handleCounterChange,
    handleAuthAction,
    handleLogout,
    saveDataToServer,
    userName,
    salaryInput,
    setSalaryInput,
    updateBaseSalaryInDb,
  } = useSalary();

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center px-4 antialiased selection:bg-emerald-500/20">
      <div className="w-full max-w-md flex flex-col min-h-screen pt-4 pb-24">
        {/* ГЛОБАЛЬНИЙ ОДНАКОВИЙ ХЕДЕР ДЛЯ ВСІХ СТОРІНОК */}
        <header className="flex justify-between items-center py-2.5 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-black text-emerald-400 leading-none">
              Калькулятор ЗП
            </h1>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
              {userToken ? `Привіт, ${userName}!` : 'Потрібна авторизація'}
            </span>
          </div>
          {userToken && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-[10px] bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg border border-slate-700/40 cursor-pointer font-bold transition-all"
            >
              🚪 Вийти
            </button>
          )}
        </header>

        {/* ЦЕНТРАЛЬНИЙ ДИНАМІЧНИЙ КОНТЕНТ */}
        <div className="flex-1 pt-4">
          <Routes>
          {!userToken ?  (
              <Route path="*" element={<AuthScreen onSubmit={handleAuthAction} email={authEmail} setEmail={setAuthEmail} pass={authPassword} setPass={setAuthPassword} isReg={isRegistering} setIsReg={setIsRegistering} />} />
            ) : (
              <>
                {/* Головні робочі роути додатка */}
                <Route path="/" element={<StatsTab calculations={dbCalculations} bonus={bonusPercent} setBonus={setBonusPercent} salaryInput={salaryInput} setSalaryInput={setSalaryInput} onUpdateSalary={updateBaseSalaryInDb} />} />
                <Route path="/add" element={<AddTab log={workLog} setLog={setWorkLog} onCounter={handleCounterChange} onSave={saveDataToServer} />} />
                <Route path="/history" element={<HistoryTab list={historyList} onCalc={calculatedTotalDayEarned} onFormat={formatLogDate} />} />
                {/* Якщо користувач ввів вигаданий URL, мʼяко повертаємо його на головну сторінку */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>

        {/* ГЛОБАЛЬНИЙ ОДНАКОВИЙ ФУТЕР ДЛЯ ВСІХ СТОРІНОК */}
        {userToken && (
          <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-50 shadow-2xl max-w-md mx-auto rounded-t-2xl">
           <Link to="/" className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${location.pathname === '/' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
              <span className="text-lg">📊</span><span className="text-[10px]">Статистика</span>
            </Link>
            <Link to="/add" className={`flex flex-col items-center space-y-1 py-1 px-4 rounded-xl transition-all ${location.pathname === '/add' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
              <span className="text-lg">➕</span><span className="text-[10px]">Внести день</span>
            </Link>
            <Link to="/history" className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition-all ${location.pathname === '/history' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
              <span className="text-lg">📋</span><span className="text-[10px]">Логи дня</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}

import { BrowserRouter } from 'react-router-dom';
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
