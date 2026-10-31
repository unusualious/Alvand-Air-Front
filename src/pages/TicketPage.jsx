import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { bookingService } from '../services/api'
import useAuthStore from '../stores/authStore'
import { loadAirports, airportCityName } from '../services/airports'
import { faNumber, formatJalali } from '../utils/dates'

const STATUS = {
  Confirmed: { label: 'بلیط صادر شده', color: 'text-green-600', bg: 'bg-green-100', icon: 'ti-circle-check' },
  PendingPayment: { label: 'در انتظار پرداخت', color: 'text-amber-600', bg: 'bg-amber-100', icon: 'ti-clock' },
  Reserved: { label: 'رزرو شده (بلیط هنوز صادر نشده)', color: 'text-amber-600', bg: 'bg-amber-100', icon: 'ti-clock' },
  Cancelled: { label: 'لغو شده', color: 'text-red-600', bg: 'bg-red-100', icon: 'ti-circle-x' },
  PaymentFailed: { label: 'پرداخت ناموفق', color: 'text-red-600', bg: 'bg-red-100', icon: 'ti-circle-x' },
  IssueFailed: { label: 'پرداخت ثبت شد؛ صدور بلیط در حال پیگیری', color: 'text-red-600', bg: 'bg-red-100', icon: 'ti-alert-triangle' },
  CancelPending: { label: 'لغو در حال پیگیری', color: 'text-amber-600', bg: 'bg-amber-100', icon: 'ti-clock' },
}

const typeFa = { adult: 'بزرگسال', child: 'کودک', infant: 'نوزاد', AD: 'بزرگسال', CH: 'کودک', IN: 'نوزاد', Adult: 'بزرگسال', Child: 'کودک', Infant: 'نوزاد' }

// ─── نمای یکسان برای دو منبع: رزرو کاربر (دیتابیس + RT زنده) و استعلام بدون ورود (فقط RT) ───
function fromBooking(b) {
  return {
    pnr: b.pnr,
    status: b.status,
    niraStatus: b.niraStatus,
    origin: b.origin, destination: b.destination,
    originName: b.originName, destName: b.destinationName,
    date: b.flightDate, dep: b.departureTime, arr: b.arrivalTime,
    flightNo: b.flightNumber, airline: b.airlineName, cls: b.flightClass,
    passengers: (b.passengers || []).map(p => ({ name: `${p.firstName} ${p.lastName}`, nationalId: p.nationalId, type: p.type })),
    tickets: (b.tickets || []).map(t => ({ passenger: t.passenger, number: t.ticketNumber })),
    total: b.totalPrice,
    canCancel: b.canCancel,
  }
}

function fromLookup(d, airports) {
  const seg = d.segments?.[0] || {}
  const [date, time] = String(seg.departureDT || '').split(' ')
  return {
    pnr: d.pnr,
    status: (d.tickets?.length || 0) > 0 ? 'Confirmed' : 'Reserved',
    niraStatus: d.status,
    origin: seg.origin, destination: seg.destination,
    originName: airportCityName(airports, seg.origin), destName: airportCityName(airports, seg.destination),
    date, dep: time, arr: '',
    flightNo: seg.flightNo, airline: 'هواپیمایی الوند', cls: seg.flightClass,
    passengers: (d.passengers || []).map(p => ({ name: `${p.firstName} ${p.lastName}`, type: p.ageType })),
    tickets: (d.tickets || []).map(t => ({ passenger: t.passenger, number: t.ticketNo })),
    total: null,
    canCancel: false,
  }
}

function TicketPage() {
  const { pnr } = useParams()
  const [params] = useSearchParams()
  const ln = params.get('ln') || ''
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()

  const [vm, setVm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needLastName, setNeedLastName] = useState(false)
  const [lastNameInput, setLastNameInput] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(''); setNeedLastName(false)
      try {
        const airports = await loadAirports()

        if (isLoggedIn) {
          try {
            const res = await bookingService.getByPnr(pnr)
            if (!cancelled) setVm(fromBooking(res.data))
            return
          } catch (e) {
            if (e.response?.status !== 404) throw e // رزرو مال این کاربر نیست → ادامه با استعلام
          }
        }

        if (ln) {
          const res = await bookingService.lookup(pnr, ln)
          if (!cancelled) setVm(fromLookup(res.data, airports))
        } else if (!cancelled) {
          setNeedLastName(true)
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'خطا در دریافت اطلاعات بلیط')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [pnr, ln, isLoggedIn])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (needLastName) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-1">استعلام بلیط {pnr}</h2>
            <p className="text-sm text-gray-500 mb-4">برای مشاهده‌ی اطلاعات، نام خانوادگی مسافر را به حروف انگلیسی وارد کنید.</p>
            <input dir="ltr" value={lastNameInput} onChange={e => setLastNameInput(e.target.value)}
              placeholder="MOHAMMADI"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button disabled={!lastNameInput.trim()}
              onClick={() => navigate(`/ticket/${pnr}?ln=${encodeURIComponent(lastNameInput.trim())}`)}
              className="w-full mt-3 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer">
              استعلام
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error || !vm) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <i className="ti ti-ticket-off text-6xl text-gray-300 block mb-4" />
          <h2 className="font-bold text-gray-700 text-xl mb-2">{error || 'بلیطی یافت نشد'}</h2>
          <Link to="/" className="text-blue-600 hover:underline">بازگشت به خانه</Link>
        </div>
      </div>
    )
  }

  const st = STATUS[vm.status] || { label: vm.status, color: 'text-gray-600', bg: 'bg-gray-100', icon: 'ti-info-circle' }
  const issued = vm.status === 'Confirmed'

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {issued && (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-check text-4xl text-green-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">بلیط شما صادر شد</h1>
            <p className="text-gray-500">کد رزرو و شماره بلیط را برای حضور در فرودگاه همراه داشته باشید</p>
          </div>
        )}

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="bg-gradient-to-l from-blue-700 to-indigo-800 p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="ti ti-plane text-white text-lg" />
                </div>
                <span className="font-black text-xl">{vm.airline || 'پرواز'}</span>
              </div>
              <div className="text-left">
                <p className="text-blue-200 text-xs">کد رزرو</p>
                <p className="font-black text-2xl tracking-widest">{vm.pnr}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-4xl font-black">{vm.dep?.slice(0, 5) || '—'}</p>
                <p className="text-blue-200 text-sm mt-1">{vm.originName}</p>
                <p className="text-blue-300 text-xs">{vm.origin}</p>
              </div>
              <div className="flex-1 flex flex-col items-center mx-4">
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full border-2 border-blue-300" />
                  <div className="flex-1 border-t border-dashed border-blue-400 relative">
                    <i className="ti ti-plane text-white text-lg absolute -top-4 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black">{vm.arr?.slice(0, 5) || '—'}</p>
                <p className="text-blue-200 text-sm mt-1">{vm.destName}</p>
                <p className="text-blue-300 text-xs">{vm.destination}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full mb-5 ${st.bg} ${st.color}`}>
              <i className={`ti ${st.icon}`} />
              {st.label}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'شماره پرواز', value: faNumber(vm.flightNo), icon: 'ti-plane' },
                { label: 'تاریخ پرواز', value: formatJalali(vm.date), icon: 'ti-calendar' },
                { label: 'کلاس پروازی', value: vm.cls || '—', icon: 'ti-armchair' },
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
                {vm.passengers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <i className="ti ti-user text-gray-400 text-sm" />
                      <span className="font-bold text-gray-800 text-sm" dir="ltr">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.nationalId && <span className="text-xs text-gray-400">کد ملی: {p.nationalId}</span>}
                      {p.type && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          {typeFa[p.type] || p.type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {vm.tickets.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-bold text-gray-500 mb-3">شماره بلیط</p>
                <div className="space-y-2">
                  {vm.tickets.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2.5">
                      <span className="text-xs text-gray-500" dir="ltr">{t.passenger || vm.passengers[i]?.name}</span>
                      <span className="font-black text-gray-800 tracking-wider" dir="ltr">{t.number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vm.total != null && (
              <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">{issued ? 'مبلغ پرداخت‌شده' : 'مبلغ'}</p>
                <p className="font-black text-blue-600 text-xl">{faNumber(vm.total)} تومان</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <i className="ti ti-printer text-lg" />
            چاپ بلیط
          </button>
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">
            <i className="ti ti-home text-lg" />
            خانه
          </Link>
        </div>

        {issued && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <i className="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">
              لطفاً ۲ ساعت قبل از پرواز در فرودگاه حاضر باشید. همراه داشتن کارت ملی (یا گذرنامه) الزامی است.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketPage
