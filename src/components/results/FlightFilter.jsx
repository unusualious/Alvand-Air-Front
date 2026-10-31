import useFlightStore from '../../stores/flightStore'
import { trackEvent } from '../../utils/analytics'

function FlightFilter() {
  const { flights, filters, setFilter, priceCap } = useFlightStore()
  const priceRange = filters.maxPrice || priceCap

  // لیست ایرلاین‌های موجود از نتایج جستجو
  const airlines = [...new Set((flights || []).map(f => f.airline?.name).filter(Boolean))]

  const toggleAirline = (airline) => {
    const current = filters.airlines || []
    const updated = current.includes(airline)
      ? current.filter(a => a !== airline)
      : [...current, airline]

    setFilter('airlines', updated)

    // لاگ فیلتر ایرلاین
    trackEvent('filter_applied', { filterType: 'airline', value: airline })
  }

  const handlePriceChange = (e) => {
    const value = Number(e.target.value)
    setFilter('maxPrice', value)
    trackEvent('filter_applied', { filterType: 'maxPrice', value })
  }

  const handleTimeChange = (timeValue) => {
    const selected = timeValue === (filters.departTime || 'all') ? 'all' : timeValue
    setFilter('departTime', selected)
    trackEvent('filter_applied', { filterType: 'departTime', value: selected })
  }

  const handleResetFilters = () => {
    setFilter('airlines', [])
    setFilter('maxPrice', priceCap)
    setFilter('departTime', 'all')

    trackEvent('filter_reset', { component: 'FlightFilter' })
  }

  return (
    <div className="bg-white rounded-l border border-gray-200 shadow-xl p-6 space-y-7 sticky top-36">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-gray-900">فیلترها</h3>
        <button
          onClick={handleResetFilters}
          className="text-xs text-rose-600 font-bold hover:underline">
          پاک کردن
        </button>
      </div>

      {/* حداکثر قیمت */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-gray-700">حداکثر قیمت</h4>
          <span className="text-xs text-sky-900 font-extrabold">
            {priceRange.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={500000}
          max={priceCap}
          step={100000}
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full accent-[#e8ac21]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>۵۰۰,۰۰۰</span>
          <span>{priceCap.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      {/* ایرلاین */}
      {airlines.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">ایرلاین</h4>
          <div className="space-y-2">
            {airlines.map(airline => (
              <label key={airline} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.airlines || []).includes(airline)}
                  onChange={() => toggleAirline(airline)}
                  className="w-4 h-4 accent-[#e8ac21] rounded"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition flex-1">
                  {airline}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ساعت پرواز */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">ساعت پرواز</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'morning', label: 'صبح', icon: 'ti-sun', time: '۶-۱۲' },
            { value: 'afternoon', label: 'ظهر', icon: 'ti-cloud-sun', time: '۱۲-۱۸' },
            { value: 'evening', label: 'عصر', icon: 'ti-sunset', time: '۱۸-۲۴' },
            { value: 'night', label: 'شب', icon: 'ti-moon', time: '۰-۶' },
          ].map(time => (
            <button
              key={time.value}
              onClick={() => handleTimeChange(time.value)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition ${
                (filters.departTime || 'all') === time.value
                  ? 'border-blue-400 bg-slate-100 text-sky-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-200 hover:bg-gray-100'
              }`}>
              <i className={`ti ${time.icon} text-xl`} />
              <span>{time.label}</span>
              <span className="text-gray-400 text-xs">{time.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlightFilter