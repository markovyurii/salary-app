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
          {/* 🌟 СТАЛО: Ідеальний баланс — підняли текст до text-xs, а іконку зафіксували на w-4.5 h-4.5 */}
          <h2 className="text-emerald-100 text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-2">
            <i className="fa-solid fa-wallet  text-white"></i>
            <span>Прогноз ЗП на цей місяць</span>
          </h2>

          <p className="text-3xl font-black text-white drop-shadow-sm leading-none">
            {(calculations?.total_salary_prognosis || 0).toLocaleString(
              'uk-UA',
            )}{' '}
            <span className="text-lg font-bold">грн</span>
          </p>
          <div className="w-max mt-3 flex bg-slate-950/20 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] font-semibold text-emerald-50">
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-envelope-open-text text-emerald-50"></i>
              <span>Конверт:</span>
            </div>
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
          <p className=" font-bold flex gap-2 items-center text-xs text-slate-400 uppercase tracking-wide">
            <i className="fa-solid fa-credit-card text-emerald-400"></i>
            <span>На карту</span>
          </p>
          <p className="text-lg font-black text-emerald-400 mt-1">
            {(calculations?.total_card_paid_uah || 0).toLocaleString('uk-UA')} ₴
          </p>
        </div>
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col justify-between shadow-md">
          <p>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-solid fa-piggy-bank text-amber-400"></i>
              на чай
            </span>
          </p>
          <p className="text-lg font-black text-amber-400 mt-1">
            +{(calculations?.total_tips_uah || 0).toLocaleString('uk-UA')} ₴
          </p>
        </div>
      </div>

      {/* 📊 МОДЕЛЮВАННЯ ПРЕМІЇ */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-md">
        <h3 className="text-xs flex text-xs items-center justify-center gap-1.5 font-bold text-slate-400 uppercase tracking-wide ">
          <i className="fa-solid fa-money-bill-transfer text-emerald-400"></i>
          <span>Моделювання премії за місяць</span>
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
