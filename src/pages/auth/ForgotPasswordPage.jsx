import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/api'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } finally {
      setLoading(false)
      setSent(true) // چه ایمیل موجود باشه چه نه، همیشه همین پیام رو نشون می‌دیم
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1a2f5e] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-xl font-black text-gray-900 mb-2">فراموشی رمز عبور</h1>
        {sent ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            اگر این ایمیل در سامانه ثبت شده باشد، لینک بازیابی رمز عبور برایش ارسال شد.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">ایمیل حساب خود را وارد کنید</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
            />
            <button onClick={handleSubmit} disabled={loading || !email}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
            </button>
          </>
        )}
        <p className="text-center text-sm text-gray-500 mt-5">
          <Link to="/login" className="text-blue-600 font-bold hover:underline">بازگشت به ورود</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage