import { useState } from 'react'
import { safetyFormService } from '../../services/api'
import PersianDatePicker from '../../components/search/PersianDatePicker'
import { isValidPhone, toJalaliString } from '../../utils/validators'
import { trackEvent } from '../../utils/analytics'

function VoluntaryReportForm() {
  const [eventDateObj, setEventDateObj] = useState(null)
  const [form, setForm] = useState({
    isConfidential: false,
    fullName: '',
    dept: '',
    phone: '',
    email: '',
    eventDate: '',
    reportType: 'Occurrence',
    station: '',
    location: '',
    description: '',
    proposedActions: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    if (!form.isConfidential && form.phone && !isValidPhone(form.phone)) {
      return setError('شماره تماس باید دقیقاً ۱۱ رقم و با 09 شروع شود')
    }
    if (!form.description) {
      return setError('شرح رخداد/مخاطره الزامی است')
    }

    setError('')
    setLoading(true)
    try {
      const res = await safetyFormService.createVoluntary(form)
      trackEvent('safety_report_submitted', { kind: 'Voluntary' })
      setResult(res.data)
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
            <span className="font-mono font-black text-2xl text-amber-600 tracking-widest">{result.trackNo}</span>
          </div>
          <p className="text-xs text-slate-400">اطلاعات شما با موفقیت در سامانه ایمنی ثبت گردید.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* کارت اصلی فرم */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/60 overflow-hidden transition-all">
          
          {/* هدر اختصاصی فرم داوطلبانه/محرمانه */}
          <div className="relative bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 text-white overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <i className="ti ti-lock-access text-2xl text-amber-400" />
                </div>
                <div>
                  <h1 className="font-black text-lg tracking-wide">Voluntary & Confidential Report</h1>
                  <p className="text-xs text-slate-300/80 font-medium mt-0.5">گزارش داوطلبانه و محرمانه ایمنی پرواز</p>
                </div>
              </div>
              <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-r border-white/10 pt-3 sm:pt-0 sm:pr-6">
                <p className="font-black text-sm tracking-wider text-amber-400">ALVAND AIRWAYS</p>
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

            {/* کارت فعال‌سازی حالت محرمانه */}
            <div 
              onClick={() => setForm({ ...form, isConfidential: !form.isConfidential })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                form.isConfidential 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  form.isConfidential ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  <i className={`ti ${form.isConfidential ? 'ti-eye-off' : 'ti-user-check'} text-xl`} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">ارسال گزارش به‌صورت تماماً محرمانه (Confidential)</p>
                  <p className="text-xs text-slate-500 mt-0.5">با فعال‌سازی این گزینه، هویت شما کاملاً ناشناخته باقی می‌ماند.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={form.isConfidential}
                onChange={() => {}} 
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {/* مشخصات گزارش دهنده (در صورت عدم انتخاب حالت محرمانه) */}
            {!form.isConfidential && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 animate-in fade-in duration-300">
                <Field label="نام گزارش دهنده (Reporter)" icon="ti-user">
                  <Input value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} placeholder="نام و نام خانوادگی" />
                </Field>

                <Field label="قسمت / واحد (Div/Dept)" icon="ti-building">
                  <Input value={form.dept} onChange={v => setForm({ ...form, dept: v })} placeholder="مثال: Flight Ops" />
                </Field>

                <Field label="تلفن تماس (Telephone)" icon="ti-phone">
                  <Input value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="09123456789" />
                </Field>

                <Field label="آدرس الکترونیکی (Email)" icon="ti-mail">
                  <Input value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="name@alvand.aero" />
                </Field>
              </div>
            )}

            {/* نوع گزارش (Occurrence vs Hazard) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                <i className="ti ti-category text-amber-500 text-sm" />
                نوع گزارش (Report Type)
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { id: 'Occurrence', label: 'رخداد (Occurrence)', icon: 'ti-alert-octagon' },
                  { id: 'Hazard', label: 'مخاطره (Hazard)', icon: 'ti-shield-alert' }
                ].map(t => {
                  const active = form.reportType === t.id
                  return (
                    <button 
                      key={t.id} 
                      type="button" 
                      onClick={() => setForm({ ...form, reportType: t.id })}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black transition-all border ${
                        active 
                          ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20 scale-[1.02]' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <i className={`ti ${t.icon} text-base`} />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* اطلاعات تاریخ، ایستگاه و محل */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="تاریخ رخداد" icon="ti-calendar">
                <PersianDatePicker 
                  value={eventDateObj} 
                  onChange={(d) => { 
                    setEventDateObj(d); 
                    setForm({ ...form, eventDate: toJalaliString(d) }); 
                  }} 
                />
              </Field>

              <Field label="ایستگاه (Station)" icon="ti-building-airport">
                <Input value={form.station} onChange={v => setForm({ ...form, station: v })} placeholder="مثال: THR / OIII" />
              </Field>

              <Field label="محل رخداد/مخاطره (Location)" icon="ti-map-pin">
                <Input value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="موقعیت دقیق..." />
              </Field>
            </div>

            {/* شرح رخداد */}
            <Field label="شرح رخداد / مخاطره (Occurrence / Hazard Description)" icon="ti-file-text">
              <textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={5} 
                placeholder="جزئیات رخداد یا مخاطره مشاهده‌شده را شرح دهید..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none" 
              />
            </Field>

            {/* اقدامات پیشنهادی */}
            <Field label="اقدامات پیشنهادی (Proposed Actions)" icon="ti-bulb">
              <textarea 
                value={form.proposedActions} 
                onChange={e => setForm({ ...form, proposedActions: e.target.value })}
                rows={4} 
                placeholder="راهکارها یا پیشنهادات شما جهت جلوگیری از تکرار موارد مشابه..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none" 
              />
            </Field>

            {/* دکمه ارسال */}
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-600/20 hover:shadow-2xl hover:shadow-amber-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none"
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
                    ثبت نهایی گزارش داوطلبانه
                  </>
                )}
              </span>
            </button>
          </div>

          {/* فوتر فرم */}
          <div className="flex items-center justify-between px-8 py-4 bg-slate-50/80 border-t border-slate-100 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              ALV-SCM-FO-09
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
      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all" 
    />
  )
}

export default VoluntaryReportForm