import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useSalary } from './hooks/useSalary';
import { MainLayout } from './components/MainLayout';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
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
    bonusInput, 
    setBonusInput,
    userToken,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
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
    isDriver,
    setIsDriver,
    amortizationInput,
    setAmortizationInput,
    monthlyStats,
  } = useSalary();

  return (
    /* 🌟 ФІКС №2: Додали pb-28, щоб нижній контент більше ніколи не ховався під меню навігації! */
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center px-4 pb-28 antialiased selection:bg-emerald-500/20">
      <Routes>
        {/* 🔒 СЦЕНАРІЙ А: КОРИСТУВАЧ НЕ АВТОРИЗОВАНИЙ */}
        {!userToken ? (
          <>
            {/* Примусово вмикаємо режим логіну в хуку при переході на цей URL */}
            <Route
              path="/login"
              element={
                <LoginScreen
                  onSubmit={(e) => {
                    setIsRegistering(false);
                    handleAuthAction(e);
                  }}
                  email={authEmail}
                  setEmail={setAuthEmail}
                  pass={authPassword}
                  setPass={setAuthPassword}
                />
              }
            />
            {/* Примусово вмикаємо режим реєстрації в хуку при переході на цей URL */}
            <Route
              path="/register"
              element={
                <RegisterScreen
                  onSubmit={(e) => {
                    setIsRegistering(true);
                    handleAuthAction(e);
                  }}
                  email={authEmail}
                  setEmail={setAuthEmail}
                  pass={authPassword}
                  setPass={setAuthPassword}
                  authName={authName}
                  setAuthName={setAuthName}
                />
              }
            />
            {/* Будь-який лівий запит неавторизованого користувача примусово кидає на форму входу */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
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
                        bonus={bonusInput}
                        setBonus={setBonusInput}
                        monthlyStats={monthlyStats}
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
                        isDriver={isDriver}
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
                        saveCardPayment={saveCardPayment}
                        isDriver={isDriver}
                        setIsDriver={setIsDriver}
                        amortizationInput={amortizationInput}
                        setAmortizationInput={setAmortizationInput}
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
