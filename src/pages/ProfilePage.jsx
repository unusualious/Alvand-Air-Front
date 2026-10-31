import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { bookingService, authService } from '../services/api'
import useAuthStore from '../stores/authStore' // از قبل هست
import TicketsTab from '../components/profile/TicketsTab'



function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuthStore()
  const [editMode, setEditMode] = useState(false)

const [editForm, setEditForm] = useState({
  fullName: user?.fullName || '',
  phone: user?.phone || ''
})

const [savingProfile, setSavingProfile] = useState(false)

  // تغییر رمز عبور
  const [showPwForm, setShowPwForm] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState(null) // { type: 'ok' | 'error', text }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwMsg(null)
    if (pwForm.next.length < 6) return setPwMsg({ type: 'error', text: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد' })
    if (pwForm.next !== pwForm.confirm) return setPwMsg({ type: 'error', text: 'رمز جدید و تکرار آن یکسان نیستند' })
    setPwSaving(true)
    try {
      await authService.changePassword(pwForm.current, pwForm.next)
      setPwMsg({ type: 'ok', text: 'رمز عبور با موفقیت تغییر کرد' })
      setPwForm({ current: '', next: '', confirm: '' })
      setShowPwForm(false)
    } catch (err) {
      setPwMsg({ type: 'error', text: err?.response?.data?.message || 'تغییر رمز عبور انجام نشد' })
    } finally {
      setPwSaving(false)
    }
  }

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('trips')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingService.getMyBookings()
      setBookings(res.data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  
const handleSaveProfile = async () => {
  setSavingProfile(true)
  try {
    await authService.updateProfile(editForm)
    window.location.reload() // ساده‌ترین راه برای رفرش user توی authStore
  } catch {
    // می‌تونی اینجا toast خطا اضافه کنی
  } finally {
    setSavingProfile(false)
  }
}

const [cancelMsg, setCancelMsg] = useState('')

const handleCancelBooking = async (pnr) => {
  setCancelMsg('')
  try {
    // ابتدا جریمه و مبلغ بازگشتی را از نیرا می‌گیریم و به کاربر نشان می‌دهیم
    const { data: q } = await bookingService.refundQuote(pnr)
    const text = q.free
      ? 'این رزرو هنوز پرداخت نشده و بدون جریمه لغو می‌شود. ادامه می‌دهید؟'
      : `جریمه‌ی لغو: ${Number(q.totalPenalty).toLocaleString('fa-IR')} تومان\nمبلغ قابل بازگشت: ${Number(q.totalRefund).toLocaleString('fa-IR')} تومان\n\nبا لغو، بلیط شما ابطال می‌شود و این عمل قابل بازگشت نیست. ادامه می‌دهید؟`
    if (!confirm(text)) return

    const { data } = await bookingService.cancel(pnr)
    setCancelMsg(data.refundAmount != null
      ? `رزرو لغو شد. مبلغ ${Number(data.refundAmount).toLocaleString('fa-IR')} تومان برای بازگشت ثبت شد.`
      : 'رزرو لغو شد.')
    fetchBookings()
  } catch (e) {
    setCancelMsg(e.response?.data?.message || 'لغو رزرو انجام نشد. لطفاً بعداً تلاش کنید.')
    fetchBookings()
  }
}

const statusConfig = {
  'Confirmed': { label: 'تأیید شده', color: 'bg-green-100 text-green-700', icon: 'ti-circle-check' },
  'PendingPayment': { label: 'در انتظار پرداخت', color: 'bg-amber-100 text-amber-700', icon: 'ti-clock' },
  'Cancelled': { label: 'کنسل شده', color: 'bg-red-100 text-red-700', icon: 'ti-circle-x' },
  'PaymentFailed': { label: 'پرداخت ناموفق', color: 'bg-red-100 text-red-700', icon: 'ti-circle-x' },
  'IssueFailed': { label: 'در حال پیگیری صدور', color: 'bg-red-100 text-red-700', icon: 'ti-alert-triangle' },
  'CancelPending': { label: 'لغو در حال پیگیری', color: 'bg-amber-100 text-amber-700', icon: 'ti-clock' },
}
const tabs = [
  { id: 'trips', label: 'سفرهای من', icon: 'ti-ticket' },
  { id: 'tickets', label: 'تیکت‌های پشتیبانی', icon: 'ti-headset' },
  { id: 'profile', label: 'اطلاعات حساب', icon: 'ti-user' },
  { id: 'security', label: 'امنیت', icon: 'ti-shield-check' },
]

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* هدر پروفایل */}
        <div className="bg-gradient-to-l from-blue-700 to-indigo-800 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">
              {user?.fullName?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-black">{user?.fullName || user?.username}</h1>
              <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
              <p className="text-blue-200 text-sm">{user?.phone}</p>
            </div>
            <div className="mr-auto flex gap-2">
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold">
                {bookings.length} سفر
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* سایدبار */}
          <aside className="w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-b border-gray-50 last:border-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <i className={`ti ${tab.icon} text-lg ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
              <button onClick={() => { logout(); navigate('/') }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                <i className="ti ti-logout text-lg" />
                خروج
              </button>
            </div>
          </aside>

          {/* محتوا */}
          <div className="flex-1 min-w-0">

            {/* سفرهای من */}
            {activeTab === 'trips' && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">سفرهای من</h2>

                {cancelMsg && (
                  <div className="mb-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl px-4 py-3">
                    {cancelMsg}
                  </div>
                )}

                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <i className="ti ti-ticket-off text-5xl text-gray-300 block mb-4" />
                    <h3 className="font-bold text-gray-700 mb-2">هنوز سفری ندارید</h3>
                    <p className="text-gray-400 text-sm mb-6">اولین بلیط خود را رزرو کنید</p>
                    <Link to="/" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
                      جستجوی پرواز
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(booking => {
                      const status = statusConfig[booking.status] || { label: booking.status, color: 'bg-gray-100 text-gray-600', icon: 'ti-info-circle' }
                      return (
                        <div key={booking.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <i className="ti ti-plane text-blue-500 text-lg" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 font-black text-gray-900">
                                  <span>{booking.originName || booking.origin}</span>
                                  <i className="ti ti-arrow-left text-blue-400 text-sm" />
                                  <span>{booking.destinationName || booking.destination}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {booking.airlineName} — {booking.flightNumber}
                                </p>
                              </div>
                            </div>
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${status.color}`}>
                              <i className={`ti ${status.icon}`} />
                              {status.label}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <i className="ti ti-calendar text-gray-400 text-sm" />
                                {new Date(`${booking.flightDate}T00:00:00`).toLocaleDateString('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' })} {booking.departureTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="ti ti-users text-gray-400 text-sm" />
                                {booking.passengers?.length} مسافر
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-blue-600">
                                {booking.totalPrice?.toLocaleString()} تومان
                              </span>
                              <Link to={`/ticket/${booking.pnr}`}
                                className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-100 transition">
                                <i className="ti ti-eye text-sm" />
                                مشاهده بلیط
                              </Link>
                              {booking.canCancel && (
  <button onClick={() => handleCancelBooking(booking.pnr)}
    className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-100 transition">
    <i className="ti ti-x text-sm" />
    کنسل رزرو
  </button>
)}
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-50">
                            <span className="text-xs text-gray-400">کد رزرو: </span>
                            <span className="text-xs font-black text-gray-700 tracking-wider">{booking.pnr}</span>
                          </div>
                        </div>
                      )
                      
                    })}
                  </div>
                )}
              </div>
            )}

            {/* اطلاعات حساب */}
    {activeTab === 'profile' && (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-black text-gray-900">اطلاعات حساب</h2>
      {!editMode && (
        <button onClick={() => setEditMode(true)} className="text-sm text-blue-600 font-bold hover:underline">
          ویرایش
        </button>
      )}
   
    </div>

    {editMode ? (
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">نام و نام خانوادگی</label>
          <input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">شماره موبایل</label>
          <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveProfile} disabled={savingProfile}
            className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
            {savingProfile ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
          <button onClick={() => setEditMode(false)} className="text-gray-500 font-medium px-5 py-2.5">
            انصراف
          </button>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        {[
          { label: 'نام و نام خانوادگی', value: user?.fullName, icon: 'ti-user' },
          { label: 'ایمیل', value: user?.email, icon: 'ti-mail' },
          { label: 'شماره موبایل', value: user?.phone, icon: 'ti-phone' },
        ].map((field, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className={`ti ${field.icon} text-blue-500`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5">{field.label}</p>
              <p className="font-bold text-gray-800">{field.value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

            {/* امنیت */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-black text-gray-900 mb-6">تنظیمات امنیتی</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <i className="ti ti-lock text-green-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">رمز عبور</p>
                        <p className="text-xs text-gray-400">آخرین تغییر: نامشخص</p>
                      </div>
                    </div>
                    <button
    onClick={() => { setShowPwForm(v => !v); setPwMsg(null) }}
    className="text-sm text-blue-600 font-bold hover:underline cursor-pointer"
>
    {showPwForm ? 'انصراف' : 'تغییر رمز'}
</button>
                  </div>

                  {pwMsg && !showPwForm && (
                    <div className={`text-sm px-4 py-3 rounded-xl ${pwMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {pwMsg.text}
                    </div>
                  )}

                  {showPwForm && (
                    <form onSubmit={handleChangePassword} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      {pwMsg && (
                        <div className={`text-sm px-4 py-3 rounded-xl ${pwMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {pwMsg.text}
                        </div>
                      )}
                      <input
                        type="password"
                        required
                        placeholder="رمز عبور فعلی"
                        value={pwForm.current}
                        onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="password"
                        required
                        placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                        value={pwForm.next}
                        onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="password"
                        required
                        placeholder="تکرار رمز عبور جدید"
                        value={pwForm.confirm}
                        onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="submit"
                        disabled={pwSaving}
                        className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
                      >
                        {pwSaving ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
                      </button>
                    </form>
                  )}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="ti ti-device-mobile text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">تأیید دو مرحله‌ای</p>
                        <p className="text-xs text-gray-400">غیرفعال</p>
                      </div>
                    </div>
                    <button className="text-sm bg-blue-600 text-white font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                      فعال‌سازی
                    </button>
                  </div>
                </div>
              </div>
            )}
               {activeTab === 'tickets' && <TicketsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage