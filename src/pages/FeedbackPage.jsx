import { useState } from 'react'
import { feedbackService } from '../services/api'

function FeedbackPage() {
  const [form, setForm] = useState({ type: 'Suggestion', fullName: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.fullName || !form.message) return setError('نام و متن پیام الزامی است')
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
            <i className="ti ti-check text-3xl text-green-500" />
          </div>
          <h2 className="font-black text-gray-900 text-xl mb-2">پیام شما ثبت شد</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            از اینکه با ما در میان گذاشتید سپاسگزاریم. تیم پشتیبانی در اسرع وقت آن را بررسی می‌کند.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">شکایات و پیشنهادات</h1>
          <p className="text-gray-500 text-sm">نظرات شما به بهتر شدن خدمات ما کمک می‌کند</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <div className="flex gap-2 mb-4">
            {[{ id: 'Suggestion', label: 'پیشنهاد', icon: 'ti-bulb' }, { id: 'Complaint', label: 'شکایت', icon: 'ti-alert-triangle' }].map(t => (
              <button key={t.id} onClick={() => setForm({ ...form, type: t.id })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  form.type === t.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'
                }`}>
                <i className={`ti ${t.icon}`} /> {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
              placeholder="نام و نام خانوادگی" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="شماره موبایل" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="ایمیل" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3" />
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            placeholder="موضوع" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3" />
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="توضیحات..." rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-4" />

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? 'در حال ارسال...' : 'ارسال پیام'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage