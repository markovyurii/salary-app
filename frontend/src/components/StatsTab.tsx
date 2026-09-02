

interface StatsProps {
  calculations: any;
  monthlyStats: any;
}

export function StatsTab({
  calculations,
  monthlyStats,
}: StatsProps) {
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
              <span>Конверт: </span>
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
          {calculations?.is_driver && (
            <div className="flex justify-between gap-3 text-amber-300 font-bold border-t border-white/5 pt-1 mt-1 animate-[fadeIn_0.1s_ease-out]">
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-car text-[10px]"></i> Авто:
              </span>
              <span>
                +{(calculations?.car_amortization || 0).toLocaleString('uk-UA')}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* 🌟 ПОВЕРТАЄМО БЛОК КАРТКИ ТА ЧАЙОВИХ НА МІСЦЕ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col justify-between shadow-md">
          <p className="font-bold flex gap-2 items-center text-xs text-slate-400 uppercase tracking-wide">
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

      {/* 💳 СТАТИСТИКА КАРТКИ ТА ЧАЙОВИХ */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-md">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-700/40 pb-2">
          <i className="fa-solid fa-list-check text-emerald-400"></i>
          <span>Виконані роботи за місяць</span>
        </h3>
        <div className="grid grid-cols-1 gap-y-2 text-xs text-slate-300 pt-1">
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-satellite-dish text-emerald-400 w-4 text-center"></i>{' '}
              Підключення з ТВ (150 ₴):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_with_tv || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-network-wired text-emerald-400 w-4 text-center"></i>{' '}
              Підключення з ТВ на двох (75 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_with_tv_shared || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-globe text-teal-400 w-4 text-center"></i>{' '}
              Підключення  інтернет (100 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_internet_solo || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-people-arrows text-teal-500 w-4 text-center"></i>{' '}
              Підключення  інтернет на двох (50 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_internet_shared || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-tv text-sky-400 w-4 text-center"></i>{' '}
              Підключення телебачення (100 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_tv_solo || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-users text-sky-400 w-4 text-center"></i>{' '}
              Телебачення на двох (50 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_tv_shared || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-arrows-spin text-amber-400 w-4 text-center"></i>{' '}
              Переключення (80 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.reconnect || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-building text-purple-400 w-4 text-center"></i>{' '}
              Підключення ЮО (180 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.connect_uo || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-user-plus text-fuchsia-400 w-4 text-center"></i>{' '}
              Приведені клієнти (150 грн):
            </span>
            <span className="font-black text-fuchsia-400">
              {monthlyStats?.brought_clients || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-bolt text-indigo-400 w-4 text-center"></i>{' '}
              Допідключення ПОН (100 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.addon_pon_solo || 0} шт
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/20 pb-1">
            <span>
              <i className="fa-solid fa-circle-nodes text-indigo-500 w-4 text-center"></i>{' '}
              Допідключення ПОН на двох (50 грн):
            </span>
            <span className="font-black text-white">
              {monthlyStats?.addon_pon_shared || 0} шт
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700/40">
          <div className="flex justify-between">
            <span>
              <i className="fa-solid fa-clock text-amber-400/80"></i> Додаткові
              години (100 грн/год):
            </span>
            <span className="font-black text-amber-400">
              {monthlyStats?.extra_hours || 0} год
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              <i className="fa-solid fa-user-shield text-amber-400/80"></i>{' '}
              Чергування (120 грн/год):
            </span>
            <span className="font-black text-amber-400">
              {monthlyStats?.duty_hours || 0} год
            </span>
          </div>
          {calculations?.is_driver ? (
            <div className="flex justify-between col-span-1 sm:col-span-2 text-emerald-400 font-bold pt-0.5 border-t border-slate-700/10 mt-1">
              <span>
                <i className="fa-solid fa-square-parking"></i> Виплата за
                парковку:
              </span>
              <span>
               
                {monthlyStats?.parking_hours * 15 || 0} грн
              </span>
            </div>
          ) : (
            <div className="flex justify-between col-span-1 sm:col-span-2 text-sky-400 font-bold pt-0.5 border-t border-slate-700/10 mt-1">
              <span>
                <i className="fa-solid fa-bus"></i> Компенсація проїзду (26 грн):
              </span>
              <span>
                {monthlyStats?.travel_trips * 26 || 0} грн
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
