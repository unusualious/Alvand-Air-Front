import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useBookingStore from '../stores/bookingStore'
import useSearchStore from '../stores/searchStore'
import { bookingService } from '../services/api'

function TicketPage() {
  const { pnr } = useParams()
  const { selectedFlight, passengers, contactInfo } = useBookingStore()
  const { passengers: passengerCount } = useSearchStore()
  const [fetchedBooking, setFetchedBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const hasFreshData = !!selectedFlight

  useEffect(() => {
    if (hasFreshData) return
    setLoading(true)
    bookingService.getByPnr(pnr)
      .then(res => setFetchedBooking(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [pnr, hasFreshData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasFreshData && (notFound || !fetchedBooking)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <i className="ti ti-ticket-off text-6xl text-gray-300 block mb-4" />
          <h2 className="font-bold text-gray-700 text-xl mb-2">بلیطی یافت نشد</h2>
          <Link to="/" className="text-blue-600 hover:underline">بازگشت به خانه</Link>
        </div>
      </div>
    )
  }

  // ── حالت ۱: تازه از فلوی خرید اومدیم — دیتای کامل پرواز رو داریم ──
  if (hasFreshData) {
    const totalPrice = (
      selectedFlight.price.adult * passengerCount.adult +
      selectedFlight.price.child * passengerCount.child +
      selectedFlight.price.infant * passengerCount.infant
    )
    return <TicketRichView pnr={pnr} flight={selectedFlight} passengers={passengers} phone={contactInfo?.phone} totalPrice={totalPrice} />
  }

  // ── حالت ۲: مستقیم لینک باز شده / بعد از رفرش — فقط دیتای بوکینگ رو داریم ──
  return <TicketSimpleView booking={fetchedBooking} />
}

function TicketRichView({ pnr, flight, passengers, phone, totalPrice }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 fade-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-check text-4xl text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">رزرو با موفقیت انجام شد!</h1>
          <p className="text-gray-500">بلیط شما صادر شد و به زودی پیامک می‌شود</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="bg-gradient-to-l from-blue-700 to-indigo-800 p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="ti ti-plane text-white text-lg" />
                </div>
                <span className="font-black text-xl">پرواز</span>
              </div>
              <div className="text-left">
                <p className="text-blue-200 text-xs">کد رزرو</p>
                <p className="font-black text-2xl tracking-widest">{pnr}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-4xl font-black">{flight.departure.time}</p>
                <p className="text-blue-200 text-sm mt-1">{flight.departure.city}</p>
                <p className="text-blue-300 text-xs">{flight.departure.airport}</p>
              </div>
              <div className="flex-1 flex flex-col items-center mx-4">
                <p className="text-blue-200 text-xs mb-2">{flight.duration}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full border-2 border-blue-300" />
                  <div className="flex-1 border-t border-dashed border-blue-400 relative">
                    <i className="ti ti-plane text-white text-lg absolute -top-4 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                </div>
                <p className="text-blue-200 text-xs mt-2">{flight.stops === 0 ? 'بدون توقف' : `${flight.stops} توقف`}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black">{flight.arrival.time}</p>
                <p className="text-blue-200 text-sm mt-1">{flight.arrival.city}</p>
                <p className="text-blue-300 text-xs">{flight.arrival.airport}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'ایرلاین', value: flight.airline.name, icon: 'ti-building' },
                { label: 'شماره پرواز', value: flight.flightNumber, icon: 'ti-plane' },
                { label: 'هواپیما', value: flight.aircraft, icon: 'ti-propeller' },
                { label: 'تاریخ', value: flight.departure.date, icon: 'ti-calendar' },
                { label: 'ترمینال', value: `ترمینال ${flight.departure.terminal}`, icon: 'ti-map-pin' },
                { label: 'بار مجاز', value: flight.baggage, icon: 'ti-briefcase' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                    <i className={`ti ${item.icon} text-blue-500 text-sm`} />
                  </div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-bold text-gray-500 mb-3">مسافران</p>
              <div className="space-y-2">
                {passengers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <i className="ti ti-user text-gray-400 text-sm" />
                      <span className="font-bold text-gray-800 text-sm">{p.firstName} {p.lastName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">کد ملی: {p.nationalId}</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {p.type === 'adult' ? 'بزرگسال' : p.type === 'child' ? 'کودک' : 'نوزاد'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">مبلغ پرداخت شده</p>
                <p className="font-black text-blue-600 text-xl">{totalPrice.toLocaleString()} تومان</p>
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                <i className="ti ti-circle-check text-lg" />
                پرداخت موفق
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">
            <i className="ti ti-home text-lg" />
            خانه
          </Link>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-4 flex items-start gap-3">
          <i className="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">توجه مهم</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              لطفاً ۲ ساعت قبل از پرواز در فرودگاه حاضر باشید. کد رزرو <strong>{pnr}</strong> به شماره {phone} پیامک شد.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// نمای ساده — وقتی فقط دیتای بک‌اند رو داریم (بدون جزئیات پرواز که فقط توی فرانت موجود بود)
function TicketSimpleView({ booking }) {
  const statusLabel = {
    Confirmed: { label: 'تأیید شده', color: 'text-green-500', icon: 'ti-circle-check' },
    PendingPayment: { label: 'در انتظار پرداخت', color: 'text-amber-500', icon: 'ti-clock' },
    Cancelled: { label: 'کنسل شده', color: 'text-red-500', icon: 'ti-circle-x' },
    PaymentFailed: { label: 'پرداخت ناموفق', color: 'text-red-500', icon: 'ti-circle-x' },
  }[booking.status] || { label: booking.status, color: 'text-gray-500', icon: 'ti-info-circle' }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400">کد رزرو</p>
              <p className="font-black text-2xl tracking-widest text-gray-900">{booking.pnr}</p>
            </div>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${statusLabel.color}`}>
              <i className={`ti ${statusLabel.icon}`} />
              {statusLabel.label}
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 mb-4">
            <div className="font-bold text-gray-900">{booking.origin} ← {booking.destination}</div>
            <div className="text-xs text-gray-500">{booking.flightNumber} — {booking.airlineName}</div>
          </div>

          <div className="space-y-2 mb-4">
            {booking.passengers.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="font-bold text-gray-800 text-sm">{p.firstName} {p.lastName}</span>
                <span className="text-xs text-gray-400">کد ملی: {p.nationalId}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">مبلغ</p>
            <p className="font-black text-blue-600 text-xl">{booking.totalPrice?.toLocaleString()} تومان</p>
          </div>
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
          <i className="ti ti-home text-lg" />
          بازگشت به خانه
        </Link>
      </div>
    </div>
  )
}

export default TicketPage