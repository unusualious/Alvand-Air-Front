import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useBookingStore from '../stores/bookingStore'
import useSearchStore from '../stores/searchStore'
import {
  Plane,
  Check,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Phone,
  Smartphone,
  Mail,
  Info,
  ArrowLeft,
} from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import { isValidNationalCode, isLatinName, isValidPhone } from '../utils/validators'
import { parseBirthDate, ageAt, faNumber } from '../utils/dates'

const emptyPassenger = (type) => ({
  firstName: '', lastName: '', nationalId: '',
  birthDate: '', gender: 'male', type
})

const steps = ['انتخاب پرواز', 'اطلاعات مسافران', 'پرداخت', 'بلیط']
const typeLabelFa = { adult: 'بزرگسال', child: 'کودک', infant: 'نوزاد' }

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center mt-10 gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
            i === current ? 'bg-gray-600 text-white scale-105' :
            i < current  ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < current
              ? <Check size={14} />
              : <span className="w-4 h-4 flex items-center justify-center">{i + 1}</span>
            }
            <span className="hidden md:block">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-0.5 rounded ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PassengerPage() {
  const navigate = useNavigate()
  const { selectedFlight, setPassengers, setContactInfo, setStep } = useBookingStore()
  const { passengers: count } = useSearchStore()

  const initialForms = [
    ...Array(count.adult).fill(null).map(() => emptyPassenger('adult')),
    ...Array(count.child).fill(null).map(() => emptyPassenger('child')),
    ...Array(count.infant).fill(null).map(() => emptyPassenger('infant')),
  ]

  const [forms, setForms] = useState(initialForms)
  const [contact, setContact] = useState({ phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [expandedIndex, setExpandedIndex] = useState(0)

  if (!selectedFlight) { navigate('/'); return null }

  const update = (index, field, value) =>
    setForms(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))

  const toggleAccordion = (index) => {
    const nextIndex = expandedIndex === index ? -1 : index
    setExpandedIndex(nextIndex)
    
    if (nextIndex !== -1) {
      trackEvent('passenger_accordion_toggled', { passengerIndex: index + 1 })
    }
  }

  // مرز سنی طبق داکیومنت نیرا: نوزاد ≤۲ ، کودک ۲ تا ۱۲ ، بزرگسال ≥۱۲ (سن در روز پرواز)
  const ageOk = (type, age) =>
    type === 'adult' ? age >= 12 : type === 'child' ? age >= 2 && age <= 12 : age <= 2

  const toEnDigits = (v) => String(v || '').replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))

  const validate = () => {
    const err = {}
    const flightDate = new Date(`${selectedFlight.departure.date}T00:00:00`)
    const seen = new Set()

    forms.forEach((p, i) => {
      if (!isLatinName(p.firstName)) err[`${i}_fn`] = 'نام را به حروف انگلیسی وارد کنید'
      if (!isLatinName(p.lastName)) err[`${i}_ln`] = 'نام خانوادگی را به حروف انگلیسی وارد کنید'

      const nid = toEnDigits(p.nationalId).trim()
      if (!isValidNationalCode(nid)) err[`${i}_ni`] = 'کد ملی معتبر نیست'
      else if (seen.has(nid)) err[`${i}_ni`] = 'کد ملی تکراری است'
      seen.add(nid)

      const birth = parseBirthDate(p.birthDate)
      if (!birth || birth >= flightDate) {
        err[`${i}_bd`] = 'تاریخ تولد معتبر نیست (مثل 1370/01/15)'
      } else {
        const age = ageAt(birth, flightDate)
        if (!ageOk(p.type, age))
          err[`${i}_bd`] = `سن (${faNumber(age)} سال) با نوع مسافر (${typeLabelFa[p.type]}) سازگار نیست`
      }
    })
    if (!isValidPhone(toEnDigits(contact.phone).trim())) err.phone = 'شماره موبایل معتبر وارد کنید (مثل 09123456789)'
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email.trim())) err.email = 'ایمیل معتبر نیست'
    setErrors(err)
    return err
  }

  const handleNext = () => {
    const err = validate()
    const keys = Object.keys(err)
    if (keys.length > 0) {
      const idx = keys.map(k => parseInt(k.split('_')[0])).find(n => !isNaN(n))
      if (idx !== undefined) setExpandedIndex(idx)

      // لاگ خطای ولیدیشن
      trackEvent('passenger_validation_failed', { errorCount: keys.length })
      return
    }

    // ثبت لاگ ارسال موفق اطلاعات مسافران همراه با جزئیات کامل
    trackEvent('passenger_info_submitted', {
      passengerCount: forms.length,
      adults: count.adult,
      children: count.child,
      infants: count.infant,
      airlineCode: selectedFlight.airline?.code,
      flightNumber: selectedFlight.flightNumber,
      hasEmail: Boolean(contact.email),
    })

    setPassengers(forms.map(p => ({
      ...p,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      nationalId: toEnDigits(p.nationalId).trim(),
      birthDate: toEnDigits(p.birthDate).trim(),
    })))
    setContactInfo({ phone: toEnDigits(contact.phone).trim(), email: contact.email.trim() })
    setStep(3)
    navigate('/payment')
  }

  const typeLabel = typeLabelFa
  const typeColor = {
    adult:  'bg-gray-100 text-gray-700',
    child:  'bg-green-100 text-green-700',
    infant: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <StepBar current={1} />

        {/* خلاصه پرواز */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-700 flex-shrink-0">
            {selectedFlight.airline.code}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 font-black text-gray-900">
              <span>{selectedFlight.departure.city}</span>
              <Plane size={15} className="text-gray-500" />
              <span>{selectedFlight.arrival.city}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {selectedFlight.airline.name} — پرواز {selectedFlight.flightNumber} — کلاس {selectedFlight.class} — {selectedFlight.departure.time?.slice(0, 5)} تا {selectedFlight.arrival.time?.slice(0, 5)}
            </p>
          </div>
          <div className="text-left flex-shrink-0">
            <p className="text-xs text-gray-400">هر نفر</p>
            <p className="font-black text-gray-600">{faNumber(selectedFlight.price.adult)}</p>
            <p className="text-xs text-gray-400">تومان</p>
          </div>
        </div>

        {/* آکاردئون مسافران */}
        <div className="space-y-3 mb-5">
          {forms.map((passenger, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="w-9 h-9 bg-gray-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-bold text-gray-900 text-sm">
                    {passenger.firstName && passenger.lastName
                      ? `${passenger.firstName} ${passenger.lastName}`
                      : `مسافر ${index + 1}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${typeColor[passenger.type]}`}>
                      {typeLabel[passenger.type]}
                    </span>
                    {Object.keys(errors).some(k => k.startsWith(`${index}_`)) && (
                      <span className="text-xs text-red-500 flex items-center gap-0.5">
                        <AlertCircle size={13} />
                        اطلاعات ناقص
                      </span>
                    )}
                  </div>
                </div>
                {expandedIndex === index
                  ? <ChevronUp size={17} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={17} className="text-gray-400 flex-shrink-0" />
                }
              </button>

              {expandedIndex === index && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      { field: 'firstName', label: 'نام (انگلیسی)',          placeholder: 'Ali',        err: `${index}_fn`, ltr: true },
                      { field: 'lastName',  label: 'نام خانوادگی (انگلیسی)',  placeholder: 'Mohammadi',  err: `${index}_ln`, ltr: true },
                      { field: 'nationalId',label: 'کد ملی',        placeholder: '0012345678', err: `${index}_ni`, ltr: true },
                      { field: 'birthDate', label: 'تاریخ تولد (شمسی)',    placeholder: '1370/01/15', err: `${index}_bd`, ltr: true },
                    ].map(f => (
                      <div key={f.field}>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          {f.label}
                          <span className="text-red-400 mr-0.5">*</span>
                        </label>
                        <input
                          value={passenger[f.field]}
                          onChange={e => update(index, f.field, e.target.value)}
                          placeholder={f.placeholder}
                          dir={f.ltr ? 'ltr' : undefined}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                            errors[f.err] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors[f.err] && (
                          <p className="text-xs text-red-500 mt-0.5">{errors[f.err]}</p>
                        )}
                      </div>
                    ))}

                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">جنسیت</label>
                      <div className="flex gap-2">
                        {[{ v: 'male', l: '👨 آقا' }, { v: 'female', l: '👩 خانم' }].map(g => (
                          <button
                            key={g.v}
                            onClick={() => update(index, 'gender', g.v)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition cursor-pointer ${
                              passenger.gender === g.v
                                ? 'border-blue-500 bg-gray-50 text-gray-700'
                                : 'border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                          >
                            {g.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* اطلاعات تماس */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Phone size={16} className="text-gray-500" />
            </div>
            اطلاعات تماس
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                شماره موبایل <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Smartphone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={contact.phone}
                  onChange={e => setContact({ ...contact, phone: e.target.value })}
                  placeholder="09123456789"
                  className={`w-full border rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ایمیل (اختیاری)</label>
              <div className="relative">
                <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={contact.email}
                  onChange={e => setContact({ ...contact, email: e.target.value })}
                  placeholder="example@email.com"
                  className={`w-full border rounded-xl pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <Info size={13} />
            بلیط به این شماره پیامک می‌شود
          </p>
        </div>

        {/* دکمه ادامه */}
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-4 rounded-2xl
            hover:opacity-90 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <ArrowLeft size={20} />
          ادامه و رفتن به پرداخت
        </button>
      </div>
    </div>
  )
}

export default PassengerPage