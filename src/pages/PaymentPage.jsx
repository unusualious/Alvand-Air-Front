import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useBookingStore from '../stores/bookingStore'
import useSearchStore from '../stores/searchStore'
import useAuthStore from '../stores/authStore'

function PaymentPage() {
  const navigate = useNavigate()
  const { selectedFlight, passengers, contactInfo, createBooking, loading } = useBookingStore()
  const { passengers: count } = useSearchStore()
  const { isLoggedIn } = useAuthStore()
  const [payMethod, setPayMethod] = useState('online')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  if (!selectedFlight) { navigate('/'); return null }

  const totalPrice = (
    selectedFlight.price.adult * count.adult +
    selectedFlight.price.child * count.child +
    selectedFlight.price.infant * count.infant
  )

const handlePay = async () => {
  if (!agreed) return setError('لطفاً قوانین را بپذیرید')
  if (!isLoggedIn) {
    navigate('/login')
    return
  }
  setError('')
  const pnr = await createBooking()
  if (pnr) {
    navigate(`/ticket/${pnr}`)
  } else {
    setError(useBookingStore.getState().error || 'پرداخت ناموفق بود. لطفاً دوباره تلاش کنید')
  }
}

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {['انتخاب پرواز', 'اطلاعات مسافران', 'پرداخت', 'بلیط'].map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${
                i === 2 ? 'bg-blue-600 text-white scale-105' :
                i < 2 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < 2 ? <i className="ti ti-check text-sm" /> : <span>{i + 1}</span>}
                <span className="hidden md:block">{step}</span>
              </div>
              {i < 3 && <div className={`w-6 h-0.5 rounded ${i < 2 ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">

            {/* خلاصه پرواز */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <i className="ti ti-plane text-blue-500 text-xl" />
                اطلاعات پرواز
              </h3>
              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-700 text-sm shadow-sm">
                    {selectedFlight.airline.code}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedFlight.airline.name}</p>
                    <p className="text-xs text-gray-400">{selectedFlight.flightNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-center">
                  <div>
                    <p className="text-xl font-black text-gray-900">{selectedFlight.departure.time}</p>
                    <p className="text-xs text-gray-500">{selectedFlight.departure.city}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-400">{selectedFlight.duration}</p>
                    <i className="ti ti-plane text-blue-400 my-1" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">{selectedFlight.arrival.time}</p>
                    <p className="text-xs text-gray-500">{selectedFlight.arrival.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* مسافران */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <i className="ti ti-users text-blue-500 text-xl" />
                مسافران ({passengers.length} نفر)
              </h3>
              <div className="space-y-2">
                {passengers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-gray-400">کد ملی: {p.nationalId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-left">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        p.type === 'adult' ? 'bg-blue-100 text-blue-600' :
                        p.type === 'child' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {p.type === 'adult' ? 'بزرگسال' : p.type === 'child' ? 'کودک' : 'نوزاد'}
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {(p.type === 'adult' ? selectedFlight.price.adult :
                          p.type === 'child' ? selectedFlight.price.child :
                          selectedFlight.price.infant).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* روش پرداخت */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <i className="ti ti-credit-card text-blue-500 text-xl" />
                روش پرداخت
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'online', label: 'پرداخت آنلاین', desc: 'درگاه بانکی شاپرک — امن و سریع', icon: 'ti-credit-card', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { value: 'wallet', label: 'کیف پول', desc: 'موجودی: ۰ تومان', icon: 'ti-wallet', color: 'text-purple-500', bg: 'bg-purple-50', disabled: true },
                ].map(m => (
                  <label key={m.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                      m.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      payMethod === m.value && !m.disabled
                        ? 'border-blue-400 bg-blue-50/50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}>
                    <input type="radio" name="pay" value={m.value}
                      checked={payMethod === m.value}
                      onChange={() => !m.disabled && setPayMethod(m.value)}
                      className="w-4 h-4 accent-[#e8ac21]" disabled={m.disabled} />
                    <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center flex-shrink-0`}>
                      <i className={`ti ${m.icon} text-xl ${m.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* موافقت با قوانین */}
            <label className="flex items-start gap-3 cursor-pointer bg-white rounded-2xl border border-gray-100 p-4">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-[#e8ac21] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                قوانین و مقررات پرواز و سامانه الوند ایرلاین را مطالعه کرده و می‌پذیرم
              </p>
            </label>
          </div>

          {/* خلاصه قیمت */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h3 className="font-black text-gray-900 mb-4">خلاصه پرداخت</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>بلیط بزرگسال × {count.adult}</span>
                  <span>{(selectedFlight.price.adult * count.adult).toLocaleString()}</span>
                </div>
                {count.child > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>بلیط کودک × {count.child}</span>
                    <span>{(selectedFlight.price.child * count.child).toLocaleString()}</span>
                  </div>
                )}
                {count.infant > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>بلیط نوزاد × {count.infant}</span>
                    <span>{(selectedFlight.price.infant * count.infant).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>مالیات و عوارض</span>
                  <span className="text-green-500 font-medium">رایگان</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-1">
                  <div className="flex justify-between font-black text-gray-900">
                    <span>جمع کل</span>
                    <div className="text-left">
                      <p className="text-blue-600 text-xl">{totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 font-normal">تومان</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-500 text-xs px-3 py-2.5 rounded-xl mt-3">
                  <i className="ti ti-alert-circle" />
                  {error}
                </div>
              )}

              <button onClick={handlePay} disabled={loading || !agreed}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-4 rounded-xl mt-4 hover:opacity-90 transition shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading
                  ? <><i className="ti ti-loader-2 animate-spin text-xl" /> در حال پردازش...</>
                  : <><i className="ti ti-lock text-lg" /> پرداخت {totalPrice.toLocaleString()} تومان</>
                }
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                <i className="ti ti-shield-check text-green-500" />
                پرداخت امن با رمزنگاری SSL
              </div>

              <div className="flex gap-1.5 flex-wrap justify-center mt-3">
                {['ملی', 'ملت', 'صادرات', 'پارسیان', 'پاسارگاد', 'سامان'].map(b => (
                  <span key={b} className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage