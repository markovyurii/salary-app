import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useSalary } from './hooks/useSalary';
import { MainLayout } from './components/MainLayout';
import { AuthScreen } from './components/AuthScreen';
import { StatsTab } from './components/StatsTab';
import { AddTab } from './components/AddTab';
import {
  HistoryTab,
  calculatedTotalDayEarned,
  formatLogDate,
} from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';

function AppContent() {
  const {
    bonusPercent,
    setBonusPercent,
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
    saveCardPayment,
    cardPaymentInput,
    setCardPaymentInput,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    authName,
    setAuthName,
  } = useSalary();

  return (
    /* 🌟 ФІКС №2: Додали pb-28, щоб нижній контент більше ніколи не ховався під меню навігації! */
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center px-4 pb-28 antialiased selection:bg-emerald-500/20">
      <Routes>
        {/* 🔒 СЦЕНАРІЙ А: КОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ */}
        {!userToken ? (
          <Route
            path="*"
            element={
              <AuthScreen
                onSubmit={handleAuthAction}
                email={authEmail}
                setEmail={setAuthEmail}
                pass={authPassword}
                setPass={setAuthPassword}
                isReg={isRegistering}
                setIsReg={setIsRegistering}
                authName={authName}
                setAuthName={setAuthName}
              />
            }
          />
        ) : (
          /* 🔓 СЦЕНАРІЙ Б: АВТОРТИЗОВАНИЙ — ВСІ РОУТИ ЗАГОРНУТІ В НАШ ЧИСТИЙ MAINLAYOUT */
          <Route
            path="*"
            element={
              <MainLayout
                userName={userName}
                handleLogout={handleLogout}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <StatsTab
                        calculations={dbCalculations}
                        bonus={bonusPercent}
                        setBonus={setBonusPercent}
                      />
                    }
                  />
                  <Route
                    path="/add"
                    element={
                      <AddTab
                        log={workLog}
                        setLog={setWorkLog}
                        onCounter={handleCounterChange}
                        onSave={saveDataToServer}
                      />
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <HistoryTab
                        list={historyList}
                        onCalc={calculatedTotalDayEarned}
                        onFormat={formatLogDate}
                      />
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <SettingsTab
                        salaryInput={salaryInput}
                        setSalaryInput={setSalaryInput}
                        updateBaseSalaryInDb={updateBaseSalaryInDb}
                        cardPaymentInput={cardPaymentInput}
                        setCardPaymentInput={setCardPaymentInput}
                        saveCardPayment={saveCardPayment} // 
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
