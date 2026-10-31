import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSearchStore from '../stores/searchStore'
import useFlightStore from '../stores/flightStore'
import FlightCard from '../components/results/FlightCard'
import FlightFilter from '../components/results/FlightFilter'

import topHeader from "../assets/images/banners/6099809532444.webp";
import {
  ChevronRight,
} from "lucide-react";

function SearchResultsPage() {
  const navigate = useNavigate()
  const { origin, destination, departDate,returnDate, passengers, tripType } = useSearchStore()
  const { loading, error, sortBy, setSortBy, searchFlights, getFilteredAndSorted } = useFlightStore()

  const flights = getFilteredAndSorted()

    const formatDate = (date) => {
    if (!date) return ''
    if (typeof date === 'string') return date // اگر قبلاً رشته بود
    return `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`
  }
  
  useEffect(() => {
    if (!origin || !destination) {
      navigate('/')
      return
    }
    searchFlights({ origin, destination, departDate, passengers })
  }, [])

  const totalPassengers = passengers.adult + passengers.child + passengers.infant

  const sortOptions = [
    { value: 'price', label: 'ارزان‌ترین', icon: 'ti-coins' },
    { value: 'time', label: 'زودترین', icon: 'ti-clock' },
    { value: 'duration', label: 'کوتاه‌ترین', icon: 'ti-bolt' },
  ]

  return (
    <div className="min-h-screen bg-gray-200 mt-8 pt-16">

      {/* هدر */}
      <div className="bg-white border-b border-gray-300 shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')}
                className="w-9 h-9 rounded-l border border-gray-200 flex items-center justify-center hover:bg-mauve-200 transition flex-shrink-0">
                <i className="ti ti-arrow-right text-gray-500" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-900">{origin?.name}</span>
                <i className="ti ti-plane text-gray-500 text-xl" />
                <span className="font-black text-gray-900">{destination?.name}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1  font-extrabold">
  {formatDate(departDate)}
  {tripType === 'roundtrip' && returnDate && (
    <>
      <span className='mx-4 font-black'>
        -
      </span>
      {formatDate(returnDate)}
    </>
  )}
</span>

                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 font-semibold">
                  {totalPassengers} مسافر
                </span>
                <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 font-semibold">
                  {tripType === 'oneway' ? 'یک‌طرفه' : 'رفت و برگشت'}
                </span>
              </div>
            </div>
            <button onClick={() => navigate('/')}
              className="hidden md:flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 font-bold hover:underline">
              <i className="ti ti-edit text-base" />
              تغییر جستجو
            </button>
          </div>
        </div>
      </div>
      <section
        className="relative h-[200px] bg-cover bg-center flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${topHeader})` }}
      >
        <h1 className="text-4xl font-extrabold tracking-wide mb-2">
          نتایج جستجو
        </h1>
        <div className="text-xs font-sans text-slate-300 flex items-center gap-2">
          <span>الوند ایرلاین</span>
          <ChevronRight className="w-3 h-3 text-amber-500" />
          <span className="text-amber-500">نتایج جستجو</span>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-6">

          {/* فیلتر سایدبار */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <FlightFilter />
          </aside>

          {/* نتایج */}
          <div className="flex-1 min-w-0">

            {/* سورت بار */}
            <div className="bg-white rounded-l border border-gray-100 shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-600">
                  {loading ? 'در حال جستجو...' : error ? 'خطا در دریافت پروازها' : (
                    <><span className="font-extrabold">{flights.length}</span> پرواز یافت شد</>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden md:block">مرتب‌سازی:</span>
                  {sortOptions.map(s => (
                    <button key={s.value} onClick={() => setSortBy(s.value)}
                      className={`flex items-center gap-1.5 cursor-pointer text-xs px-3 py-1.5 rounded-l font-bold transition ${
                        sortBy === s.value
                          ? 'bg-gray-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      <i className={`ti ${s.icon} text-sm`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton Loading */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-l border border-gray-100 p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 skeleton rounded-l" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 skeleton rounded w-1/3" />
                        <div className="h-3 skeleton rounded w-1/4" />
                      </div>
                      <div className="w-32 space-y-2">
                        <div className="h-6 skeleton rounded" />
                        <div className="h-8 skeleton rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* خطای ارتباط با سیستم رزرواسیون */}
            {!loading && error && (
              <div className="bg-white rounded-l border border-red-100 p-10 text-center">
                <i className="ti ti-plug-off text-5xl text-red-300 block mb-3" />
                <h3 className="font-black text-gray-700 text-lg mb-2">دریافت پروازها ممکن نشد</h3>
                <p className="text-gray-500 text-sm mb-5">{error}</p>
                <button onClick={() => searchFlights({ origin, destination, departDate, passengers })}
                  className="bg-gray-600 text-white font-bold px-6 py-2.5 rounded-l hover:bg-gray-700 transition cursor-pointer">
                  تلاش مجدد
                </button>
              </div>
            )}

            {/* نتایج */}
            {!loading && !error && flights.length === 0 && (
              <div className="bg-white rounded-l border border-gray-100 p-18 text-center">
                <i className="ti ti-plane-off text-6xl text-gray-200 block mb-4" />
                <h3 className="font-black text-gray-700 text-xl mb-2">پروازی یافت نشد</h3>
                <p className="text-gray-400 text-sm mb-6">مسیر یا تاریخ دیگری را امتحان کنید</p>
                <button onClick={() => navigate('/')}
                  className="bg-gray-600 text-white font-bold px-6 py-2.5 rounded-l hover:bg-gray-700 transition">
                  جستجوی جدید
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-3">
                {flights.map((flight, i) => (
                  <FlightCard key={flight.id} flight={flight} passengers={passengers} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage