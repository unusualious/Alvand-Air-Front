import { useState } from 'react'
import { feedbackService } from '../services/api'

function SafetyReportPage() {
  const [form, setForm] = useState({
    type: 'SafetyReport', isAnonymous: false,
    fullName: '', email: '', phone: '',
    subject: '', message: '', flightNumber: '', incidentDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.message) return setError('توضیح رویداد الزامی است')
    if (!form.isAnonymous && !form.fullName) return setError('نام الزامی است، یا گزینه‌ی ناشناس رو انتخاب کنید')
    setError('')
    setLoading(true)
    try {
      await feedbackService.create(form)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ارسال. لطفاً دوباره تلاش کنید')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-10 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-shield-check text-3xl text-green-500" />
          </div>
          <h2 className="font-black text-gray-900 text-xl mb-2">گزارش شما ثبت شد</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            گزارش ایمنی شما مستقیماً به واحد تضمین کیفیت ارسال شد و با دقت بررسی می‌شود.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="ti ti-shield-exclamation text-2xl text-amber-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">گزارش رویداد ایمنی</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            هر مشاهده‌ای که به ایمنی پرواز مربوط می‌شود را با ما در میان بگذارید.
            گزارش شما مستقیماً نزد واحد ایمنی و تضمین کیفیت (QA) می‌رود.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-4 cursor-pointer">
            <input type="checkbox" checked={form.isAnonymous}
              onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
              className="w-4 h-4 accent-amber-600" />
            <span className="text-sm font-medium text-gray-700">می‌خواهم این گزارش را به‌صورت ناشناس ارسال کنم</span>
          </label>

          {!form.isAnonymous && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="نام و نام خانوادگی" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="شماره موبایل" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={form.flightNumber} onChange={e => setForm({ ...form, flightNumber: e.target.value })}
              placeholder="شماره پرواز (اختیاری)" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input value={form.incidentDate} onChange={e => setForm({ ...form, incidentDate: e.target.value })}
              placeholder="تاریخ رویداد (اختیاری)" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>

          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            placeholder="خلاصه‌ی رویداد" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3" />
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="شرح کامل رویداد..." rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none mb-4" />

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-amber-600 text-white font-black py-3.5 rounded-xl hover:bg-amber-700 transition disabled:opacity-60">
            {loading ? 'در حال ارسال...' : 'ارسال گزارش'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SafetyReportPage