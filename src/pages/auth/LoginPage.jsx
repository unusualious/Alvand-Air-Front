import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('همه فیلدها را پر کنید')
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      setError('ایمیل یا رمز عبور اشتباه است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1a2f5e] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900">
            <i className="ti ti-plane text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">ورود به پرواز</h1>
          <p className="text-blue-300 text-sm">به سامانه رزرو بلیط خوش آمدید</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <i className="ti ti-alert-circle text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ایمیل</label>
              <div className="relative">
                <i className="ti ti-mail absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">رمز عبور</label>
              <div className="relative">
                <i className="ti ti-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'} text-lg`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#e8ac21] rounded" />
                <span className="text-gray-600">مرا به خاطر بسپار</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                فراموشی رمز؟
              </Link>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2 text-base mt-2">
              {loading ? (
                <><i className="ti ti-loader-2 animate-spin text-xl" /> در حال ورود...</>
              ) : (
                <><i className="ti ti-login text-xl" /> ورود</>
              )}
            </button>
          </div>

          <div className="relative my-6">
            <div className="border-t border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
              یا
            </span>
          </div>

          <p className="text-center text-sm text-gray-500">
            حساب ندارید؟{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">ثبت‌نام رایگان</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage