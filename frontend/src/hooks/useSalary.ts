import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';




const supabaseAuthClient = createClient(
  'https://xntsjmmmcpeegyjrjvqo.supabase.co/',
  'sb_publishable_ZlVIg3I3okwL08KB7l5QFw_AiTknWft'
);

export const DAY_RATES = {
  CONNECT_TV: 150, CONNECT_NO_TV: 100, ADDON_PON: 100, ADDON_ETH: 75,
  RECONNECT: 80, EXTRA_HOUR: 100, DUTY_HOUR: 120, BROUGHT_CLIENT: 150, CONNECT_UO: 180
};

export const BONUS_OPTIONS = [0,5,10,15
];

export interface WorkDay {
  date: string; connect_tv: number; connect_no_tv: number; addon_pon: number;
  addon_eth: number; reconnect: number; extra_hours: number; duty: number;
  brought_clients: number; connect_uo: number; tips: number;
}

export function useSalary() {
  const [bonusPercent, setBonusPercent] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'history'>('stats');
  const [userToken, setUserToken] = useState<string | null>(() => localStorage.getItem('salary_app_token'));
  const [salaryInput, setSalaryInput] = useState<string>('');
  
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Користувач');


  const [dbCalculations, setDbCalculations] = useState({
    base_salary: 19200, bonus_calculated_uah: 0, earned_from_work: 0,
    total_salary_prognosis: 19200, envelope_remain_uah: 19200, total_tips_uah: 0
  });

  const [historyList, setHistoryList] = useState<WorkDay[]>([]);
  const [workLog, setWorkLog] = useState({
    connect_tv: 0, connect_no_tv: 0, addon_pon: 0, addon_eth: 0,
    reconnect: 0, extra_hours: 0, duty_hours: 0, brought_clients: 0, connect_uo: 0,
    tips: 0, date: new Date().toLocaleDateString('en-CA')
  });

  const fetchSalaryFromBackend = async () => {
    if (!userToken) return;
    try {
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/salary?bonus=${bonusPercent}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setDbCalculations(data.calculations);
      setSalaryInput(data.calculations.base_salary.toString())
    } catch (error) { console.error(error); }
  };

  const fetchHistoryFromBackend = async () => {
    if (!userToken) return;
    try {
      const response = await fetch(`https://salary-backend-woq5.onrender.com/api/work-log`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
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
        const emailName = currentUser.email?.split('@') || 'Користувач';
        setUserName(emailName);
      }
  } catch (error) {
    console.error('Не вдалося завантажити профіль:', error);
    setUserName('Користувач');
  }
};

const updateBaseSalaryInDb = async () => {
  if (!userToken || !salaryInput) return;
  try {
    const response = await fetch(`https://salary-backend-woq5.onrender.com/api/profile/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({base_salary: salaryInput})
      });
      if (!response.ok) throw new Error('Failed');
      alert ('⚙️ Нову ставку успішно збережено в хмарі!');
      fetchSalaryFromBackend();
  } catch (error) {
    alert('❌ Помилка оновлення ставки');
  }
};

  useEffect(() => {
    const {data:{subscription}} = supabaseAuthClient.auth.onAuthStateChange((event, session) => {
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
  }, [bonusPercent, userToken]);

  const handleCounterChange = (field: string, operation: 'inc' | 'dec', step: number = 1) => {
    setWorkLog(prev => {
      const currentValue = prev[field as keyof typeof prev] as number;
      const newValue = operation === 'inc' ? currentValue + step : Math.max(0, currentValue - step);
      return { ...prev, [field]: newValue };
    });
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return alert('❌ Заповніть усі поля!');
    try {
      if (isRegistering) {
        const { error } = await supabaseAuthClient.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        alert('🎉 Реєстрація успішна! Увійдіть.');
        setIsRegistering(false);
      } else {
        const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        const token = data.session?.access_token;
        if (token) {
          setUserToken(token);
          localStorage.setItem('salary_app_token', token);
        }
      }
    } catch (err: any) { alert(`❌ Помилка: ${err.message}`); }
  };

  const handleLogout = async () => {
    await supabaseAuthClient.auth.signOut();
    setUserToken(null);
    localStorage.removeItem('salary_app_token');
    setActiveTab('stats');
  };

  const saveDataToServer = async () => {
    try {
      const response = await fetch('https://salary-backend-woq5.onrender.com/api/work-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify(workLog),
      });
      if (!response.ok) throw new Error('Failed');
      alert(`🎉 Дані успішно збережено!`);
      fetchSalaryFromBackend();
      fetchHistoryFromBackend();
      setActiveTab('history');
      setWorkLog(prev => ({ ...prev, connect_tv: 0, connect_no_tv: 0, addon_pon: 0, addon_eth: 0, reconnect: 0, extra_hours: 0, duty_hours: 0, brought_clients: 0, connect_uo: 0, tips: 0 }));
    } catch (error) { alert(`❌ Помилка збереження`); }
  };

  return {
    bonusPercent, setBonusPercent, activeTab, setActiveTab, userToken,
    authEmail, setAuthEmail, authPassword, setAuthPassword, isRegistering, setIsRegistering,
    dbCalculations, historyList, workLog, setWorkLog, handleCounterChange, handleAuthAction, handleLogout, saveDataToServer,userName,salaryInput,setSalaryInput, updateBaseSalaryInDb
  };
}
