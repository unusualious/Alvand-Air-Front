import { useState } from 'react'
import { safetyFormService } from '../../services/api'
import PersianDatePicker from '../../components/search/PersianDatePicker'
import { isValidPhone, toJalaliString } from '../../utils/validators'
import { trackEvent } from '../../utils/analytics'

const flagOptions = [
  { id: 'EngShutDown', label: 'Eng Shut Down', icon: 'ti-engine' },
  { id: 'Diversion', label: 'Diversion', icon: 'ti-route-alt-2' },
  { id: 'RejectedTO', label: 'Rejected T/O', icon: 'ti-plane-off' },
  { id: 'AirTurnBack', label: 'Air Turn Back', icon: 'ti-rotate-360' },
  { id: 'ReturnToRamp', label: 'Return To Ramp', icon: 'ti-building-airport' },
]

const severityOptions = [
  { id: 'Destroyed', label: 'Destroyed', color: 'from-rose-600 to-red-700 text-white border-rose-600 shadow-rose-200' },
  { id: 'Major', label: 'Major', color: 'from-amber-500 to-orange-600 text-white border-amber-500 shadow-amber-200' },
  { id: 'Minor', label: 'Minor', color: 'from-blue-500 to-indigo-600 text-white border-blue-500 shadow-blue-200' },
  { id: 'Negligible', label: 'Negligible', color: 'from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-emerald-200' },
]

function MandatoryReportForm() {
  const [eventDateObj, setEventDateObj] = useState(null)
  const [form, setForm] = useState({
    fullName: '',
    dept: '',
    phone: '',
    eventDate: '',
    location: '',
    eventTime: '',
    aircraftReg: '',
    flightNo: '',
    severity: '',
    eventFlags: [],
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const toggleFlag = (id) => {
    setForm(f => ({
      ...f,
      eventFlags: f.eventFlags.includes(id) ? f.eventFlags.filter(x => x !== id) : [...f.eventFlags, id]
    }))
  }

  const handleSubmit = async () => {
    if (form.phone && !isValidPhone(form.phone)) {
      return setError('شماره تماس باید دقیقاً ۱۱ رقم و با 09 شروع شود')
    }
    if (!form.description) {
      return setError('شرح رخداد/مخاطره الزامی است')
    }

    setError('')
    setLoading(true)
    try {
      const res = await safetyFormService.createMandatory(form)
      setResult(res.data)
      trackEvent('safety_report_submitted', { kind: 'Mandatory' })
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ثبت گزارش')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-900/5 backdrop-blur-3xl pt-24 pb-12 flex items-center justify-center px-4">
        <div className="text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-10 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <i className="ti ti-circle-check-filled text-5xl text-emerald-500" />
          </div>
          <h2 className="font-black text-slate-900 text-2xl mb-2">گزارش با موفقیت ثبت شد</h2>
          <p className="text-slate-500 text-sm mb-6">کد پیگیری اختصاصی پرونده شما:</p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <span className="font-mono font-black text-2xl text-red-600 tracking-widest">{result.trackNo}</span>
          </div>
          <p className="text-xs text-slate-400">لطفاً کد پیگیری فوق را جهت ارجاعات بعدی نزد خود نگهداری کنید.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* کارت اصلی فرم */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/60 overflow-hidden transition-all">
          
          {/* هدر سفارشی با تم هوانوردی */}
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-6 text-white overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <i className="ti ti-shield-check text-2xl text-red-400" />
                </div>
                <div>
                  <h1 className="font-black text-lg tracking-wide">Mandatory Safety Report</h1>
                  <p className="text-xs text-slate-300/80 font-medium mt-0.5">Safety & Compliance Monitoring System</p>
                </div>
              </div>
              <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-r border-white/10 pt-3 sm:pt-0 sm:pr-6">
                <p className="font-black text-sm tracking-wider text-red-400">ALVAND AIRWAYS</p>
                <p className="text-xs text-slate-400 mt-0.5">شرکت هواپیمایی الوند</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* نمایش خطای عمومی */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200/80 text-red-700 text-sm px-4 py-3.5 rounded-2xl animate-shake">
                <i className="ti ti-alert-circle text-xl shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* گرید فیلدهای اطلاعاتی پایه */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="نام (Name)" icon="ti-user">
                <Input value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} placeholder="نام و نام خانوادگی" />
              </Field>

              <Field label="واحد (Dept)" icon="ti-building">
                <Input value={form.dept} onChange={v => setForm({ ...form, dept: v })} placeholder="مثال: Operations" />
              </Field>

              <Field label="شماره تماس" icon="ti-phone">
                <Input value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="09123456789" />
              </Field>

              <Field label="تاریخ رخداد (Date)" icon="ti-calendar">
                <PersianDatePicker
                  value={eventDateObj}
                  onChange={(d) => {
                    setEventDateObj(d)
                    setForm({ ...form, eventDate: toJalaliString(d) })
                  }}
                />
              </Field>

              <Field label="محل وقوع (Location)" icon="ti-map-pin">
                <Input value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="مثال: OIII / Ramp" />
              </Field>

              <Field label="ساعت (Time)" icon="ti-clock">
                <Input value={form.eventTime} onChange={v => setForm({ ...form, eventTime: v })} placeholder="14:30" />
              </Field>

              <Field label="A/C Reg" icon="ti-plane">
                <Input value={form.aircraftReg} onChange={v => setForm({ ...form, aircraftReg: v })} placeholder="EP-..." />
              </Field>

              <Field label="Flt No" icon="ti-ticket">
                <Input value={form.flightNo} onChange={v => setForm({ ...form, flightNo: v })} placeholder="مثال: 1204" />
              </Field>
            </div>

            <hr className="border-slate-100" />

            {/* انتخاب شدت رخداد (Severity) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                <i className="ti ti-alert-triangle text-red-500 text-sm" />
                شدت رخداد (Severity)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {severityOptions.map(s => {
                  const active = form.severity === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm({ ...form, severity: s.id })}
                      className={`relative px-4 py-3 rounded-2xl text-xs font-black transition-all duration-200 border flex items-center justify-center gap-2 ${
                        active
                          ? `bg-gradient-to-r ${s.color} border-transparent shadow-lg scale-[1.02]`
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* موارد مرتبط (Event Flags) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                <i className="ti ti-tags text-slate-500 text-sm" />
                موارد مرتبط (Related Categories)
              </label>
              <div className="flex flex-wrap gap-2">
                {flagOptions.map(f => {
                  const active = form.eventFlags.includes(f.id)
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFlag(f.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <i className={`ti ${f.icon} ${active ? 'text-red-400' : 'text-slate-400'}`} />
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* شرح رخداد */}
            <Field label="شرح رخداد / مخاطره (Description Of the Occurrence/Hazard)" icon="ti-file-text">
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="توضیحات دقیق و کامل رخداد را وارد کنید..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none"
              />
            </Field>

            {/* دکمه ارسال */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-red-600 to-rose-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/25 hover:shadow-2xl hover:shadow-red-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <>
                    <i className="ti ti-loader-2 animate-spin text-lg" />
                    در حال ثبت اطلاعات...
                  </>
                ) : (
                  <>
                    <i className="ti ti-send text-lg" />
                    ثبت نهایی گزارش ایمنی
                  </>
                )}
              </span>
            </button>
          </div>

          {/* فوتر فرم */}
          <div className="flex items-center justify-between px-8 py-4 bg-slate-50/80 border-t border-slate-100 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ALV-SCM-FO-06
            </span>
            <span>Rev. 00 May 2026</span>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-600 flex items-center gap-1.5">
        {icon && <i className={`ti ${icon} text-slate-400 text-sm`} />}
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
    />
  )
}

export default MandatoryReportForm