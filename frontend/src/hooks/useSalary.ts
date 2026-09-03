import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';



const supabaseAuthClient = createClient(
  'https://xntsjmmmcpeegyjrjvqo.supabase.co/',
  'sb_publishable_ZlVIg3I3okwL08KB7l5QFw_AiTknWft'
);

export const DAY_RATES = {
  CONNECT_TV: 150, CONNECT_NO_TV: 100, ADDON_PON: 100, ADDON_ETH: 75,
  RECONNECT: 80, EXTRA_HOUR: 100, DUTY_HOUR: 120, BROUGHT_CLIENT: 150, CONNECT_UO: 180
};


export interface WorkDay {
  date: string; connect_tv: number; connect_no_tv: number; addon_pon: number;
  addon_eth: number; reconnect: number; extra_hours: number; duty: number;
  brought_clients: number; connect_uo: number; tips: number;
}

export function useSalary() {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string | null>(() => localStorage.getItem('salary_app_token'));
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [cardPaymentInput, setCardPaymentInput] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Користувач');
  const [authName, setAuthName] = useState<string>('');
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [amortizationInput, setAmortizationInput] = useState<string>('3500');

  const [monthlyStats, setMonthlyStats] = useState<any>({});
  const [bonusInput, setBonusInput] = useState<string>('0');  


  const [dbCalculations, setDbCalculations] = useState({
    base_salary: 19200, bonus_calculated_uah: 0, earned_from_work: 0,
    total_salary_prognosis: 19200, envelope_remain_uah: 19200, total_tips_uah: 0,is_driver: false,
    car_amortization: 3500
  });

  const [historyList, setHistoryList] = useState<WorkDay[]>([]);
  const [workLog, setWorkLog] = useState<any>({
    connect_with_tv: 0, connect_with_tv_shared: 0, connect_internet_solo: 0, connect_internet_shared: 0,
    connect_tv_solo: 0, connect_tv_shared: 0, reconnect: 0, connect_uo: 0, brought_clients: 0,
    addon_pon_solo: 0, addon_pon_shared: 0, extra_hours: 0, duty_hours: 0,
    parking_hours: 0, travel_compensation: 0, tips: 0,
    date: new Date().toLocaleDateString('en-CA')
  });

  const fetchSalaryFromBackend = async () => {
    if (!userToken) return;
    try {
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/salary?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setDbCalculations(data.calculations);
      setMonthlyStats(data.stats || {});
      if (data.calculations?.base_salary) setSalaryInput(data.calculations.base_salary.toString());
      if (data.calculations?.car_amortization) setAmortizationInput(data.calculations.car_amortization.toString());
      if (data.calculations?.bonus_percent !== undefined) setBonusInput(data.calculations.bonus_percent.toString());
      setIsDriver(!!data.calculations?.is_driver);
    } catch (error) { console.error(error); }
  };

  const fetchHistoryFromBackend = async () => {
    if (!userToken) return;
    try {
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/work-log/?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setHistoryList(data.history || []);
    } catch (error) { console.error(error); }
  };

  const fetchUserProfile = async () => {

  try {
    const { data: { session }, error: sessionError} = await supabaseAuthClient.auth.getSession();
    if (sessionError || !session) {
        // Якщо сесія повністю померла за добу - м'яко виходимо з акаунта, щоб користувач перезайшов
        handleLogout();
        return;
      }
      const currentUser = session.user;
    // Запитуємо у Supabase рядок з нашої таблиці профілів
    const { data, error } = await supabaseAuthClient
      .from('profiles')
      .select('full_name')
      .eq('id', (await currentUser.id))
      .single();

    if (error) throw error;

    // Якщо в базі записане ім'я — ставимо його, якщо ні — виведемо пошту користувача
    if (!error && data?.full_name) {
        setUserName(data.full_name);
      } else {
        const emailName = currentUser.email?.split('@')[0] || 'Користувач';
        setUserName(emailName);
      }
  } catch (error) {
    console.error('Не вдалося завантажити профіль:', error);
    setUserName('Користувач');
  }
};

const updateBaseSalaryInDb = async (customPayload?: any) => {
  if (!userToken || !salaryInput) return;
  const bodyPayload = customPayload || { 
      base_salary: Number(salaryInput), 
      is_driver: isDriver, 
      car_amortization: Number(amortizationInput) 
    };
  try {
    const response = await fetch(`https://salary-backend-woq5.onrender.com/api/profile/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) throw new Error('Failed');
      if (bodyPayload.base_salary !== undefined) setSalaryInput(bodyPayload.base_salary.toString());
      if (bodyPayload.car_amortization !== undefined) setAmortizationInput(bodyPayload.car_amortization.toString());
      if (bodyPayload.is_driver !== undefined) setIsDriver(bodyPayload.is_driver);
      alert ('⚙️ Нову ставку успішно збережено в хмарі!');
      fetchSalaryFromBackend();
  } catch (error) {
    alert('❌ Помилка оновлення ставки');
  }
};

  useEffect(() => {
    const {data:{subscription}} = supabaseAuthClient.auth.onAuthStateChange((_event:any, session:any) => {
    if(session?.access_token) {
      setUserToken(session.access_token);
      localStorage.setItem('salary_app_token', session.access_token);
    } else {
      setUserToken(null);
      localStorage.removeItem('salary_app_token');
    }
})
    if (userToken) {
      fetchSalaryFromBackend();
      fetchHistoryFromBackend();
      fetchUserProfile();
    }

    return () => subscription.unsubscribe();
  }, [userToken,selectedMonth, selectedYear]);

  const handleCounterChange = (field: string, operation: 'inc' | 'dec', step: number = 1) => {
    setWorkLog((prev: any) => {
      const currentValue = prev[field as keyof typeof prev] as number;
      const newValue = operation === 'inc' ? currentValue + step : Math.max(0, currentValue - step);
      return { ...prev, [field]: newValue };
    });
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return alert('❌ Заповніть усі поля!');
    if (isRegistering && !authName) return alert('❌ Введіть ваше імʼя!');
    try {
      if (isRegistering) {
        const { data: authData, error: authError } = await supabaseAuthClient.auth.signUp({ 
          email: authEmail, 
          password: authPassword,
          options: {
            data: { full_name: authName } // Зберігаємо в системних метаданих
          }
        });
        if (authError) throw authError;
        if (authData?.user) {
          await supabaseAuthClient
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: authName,
              base_salary: 19200
            });
          setUserName(authName);
        }
        alert('🎉 Реєстрація успішна! Увійдіть.');
        setIsRegistering(false);
        setAuthName('');
      } else {
        const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        const token = data.session?.access_token;
        if (token) {
          setUserToken(token);
          localStorage.setItem('salary_app_token', token);
          navigate('/');
        }
      }
    } catch (err: any) { alert(`❌ Помилка: ${err.message}`); }
  };

  const handleLogout = async () => {
    await supabaseAuthClient.auth.signOut();
    setUserToken(null);
    localStorage.removeItem('salary_app_token');
    navigate('/login')
  };

  const saveDataToServer = async () => {
    try {
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/work-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify(workLog),
      });
      const data = await response.json();
      if (!response.ok) {
        // Якщо сервер повернув помилку, викидаємо її текст далі в блок catch
        throw new Error(data.error || 'Невідома помилка сервера');
      }
      alert(`🎉 Дані успішно збережено!`);
      fetchSalaryFromBackend();
      fetchHistoryFromBackend();
      setWorkLog((prev: any) => ({
          ...prev,
          connect_with_tv: 0, connect_with_tv_shared: 0, connect_internet_solo: 0, connect_internet_shared: 0,
          connect_tv_solo: 0, connect_tv_shared: 0, reconnect: 0, connect_uo: 0, brought_clients: 0,
          addon_pon_solo: 0, addon_pon_shared: 0, extra_hours: 0, duty_hours: 0,
          parking_hours: 0, travel_compensation: 0, tips: 0
        }));
      navigate('/history')
    } catch (error: any) { alert(`❌ Помилка: ${error.message || error}`); }
  };

  const saveCardPayment = async () => {
    if (!userToken || !cardPaymentInput || Number(cardPaymentInput)<= 0) return alert('❌ Введіть коректну суму виплати!');
    try {
      const response = await fetch('https://salary-backend-woq5.onrender.com/api/card-payment',
       {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify({amount: cardPaymentInput, date: workLog.date}),
      })
      if (!response.ok) throw new Error('Failed');
    alert('💳 Виплату на картку успішно зафіксовано!');
    setCardPaymentInput(''); // Очищаємо поле
    fetchSalaryFromBackend(); // Перераховуємо табло миттєво!
    } catch (error) {
    alert('❌ Помилка збереження виплати');
  }
  };

  return {
    bonusInput, setBonusInput, userToken,
    authEmail, setAuthEmail, authPassword, setAuthPassword, isRegistering, setIsRegistering,
    dbCalculations, historyList, workLog, setWorkLog, handleCounterChange, handleAuthAction, handleLogout, saveDataToServer,userName,salaryInput,setSalaryInput, updateBaseSalaryInDb, cardPaymentInput, saveCardPayment,setCardPaymentInput,selectedMonth,setSelectedMonth,selectedYear,setSelectedYear, authName,setAuthName,isDriver, setIsDriver, amortizationInput, setAmortizationInput,monthlyStats
  };
}
