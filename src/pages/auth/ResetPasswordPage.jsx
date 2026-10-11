import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../../services/api'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!password || password.length < 6) return setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
    if (password !== confirm) return setError('رمزهای عبور یکسان نیستند')
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'لینک نامعتبر یا منقضی شده است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1a2f5e] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-xl font-black text-gray-900 mb-5">تغییر رمز عبور</h1>
        {done ? (
          <p className="text-sm text-green-600">رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...</p>
        ) : (
          <>
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="رمز عبور جدید" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="تکرار رمز عبور" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? 'در حال ثبت...' : 'ثبت رمز جدید'}
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

export default ResetPasswordPage