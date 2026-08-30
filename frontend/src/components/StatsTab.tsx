import { BONUS_OPTIONS } from '../hooks/useSalary';

interface StatsProps {
  calculations: any;
  bonus: number;
  setBonus: (v: number) => void;
}

export function StatsTab({ calculations, bonus, setBonus }: StatsProps) {
  return (
    <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
      {/* 📊 ГОЛОВНЕ ТАБЛО ЗП */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h2 className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider opacity-90">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18v-6m18 0V9A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 9v3m18 0h-3.75a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H21"></path></svg>
            Прогноз ЗП на цей місяць
          </h2>
          <p className="text-3xl font-black text-white drop-shadow-sm leading-none">
            {(calculations?.total_salary_prognosis || 0).toLocaleString(
              'uk-UA',
            )}{' '}
            <span className="text-lg font-bold">грн</span>
          </p>
          <div className="mt-3 inline-block bg-slate-950/20 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] font-semibold text-emerald-50">
            ✉️ У конверт:{' '}
            <span className="text-amber-300 font-black pl-1">
              {(calculations?.envelope_remain_uah || 0).toLocaleString('uk-UA')}{' '}
              грн
            </span>
          </div>
        </div>
        <div className="bg-slate-950/20 p-3 rounded-xl border border-white/5 text-right space-y-1 text-[11px] text-emerald-50 min-w-[140px]">
          <div className="flex justify-between gap-3">
            <span>Ставка:</span>
            <span className="font-bold">
              {(calculations?.base_salary || 0).toLocaleString('uk-UA')}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Премія:</span>
            <span className="font-bold">
              +
              {(calculations?.bonus_calculated_uah || 0).toLocaleString(
                'uk-UA',
              )}
            </span>
          </div>
          <div className="flex justify-between gap-3 border-t border-white/10 pt-1 mt-1">
            <span>Підробітки:</span>
            <span className="font-bold text-white">
              +{(calculations?.earned_from_work || 0).toLocaleString('uk-UA')}
            </span>
          </div>
        </div>
      </div>

      {/* 💳 СТАТИСТИКА КАРТКИ ТА ЧАЙОВИХ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            💳 На картку зайшло
          </span>
          <p className="text-lg font-black text-emerald-400 mt-1">
            {(calculations?.total_card_paid_uah || 0).toLocaleString('uk-UA')} ₴
          </p>
        </div>
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
            💵 Живі Чайові
          </span>
          <p className="text-lg font-black text-amber-400 mt-1">
            +{(calculations?.total_tips_uah || 0).toLocaleString('uk-UA')} ₴
          </p>
        </div>
      </div>

      {/* 📊 МОДЕЛЮВАННЯ ПРЕМІЇ */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-md">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide text-center">
          Моделювання премії за місяць
        </h3>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-slate-700/30">
          {BONUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setBonus(opt)}
              className={`py-2 text-xs font-black rounded-lg cursor-pointer transition-all ${bonus === opt ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {opt}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
