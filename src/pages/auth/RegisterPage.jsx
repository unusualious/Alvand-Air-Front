import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import PhoneOtpVerification from '../../components/auth/PhoneOtpVerification'

function RegisterPage() {
  const navigate = useNavigate()
  const [otpToken, setOtpToken] = useState(null)
  const { register } = useAuthStore()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    if (!form.username || !form.email || !form.phone || !form.password) return 'همه فیلدها اجباری هستند'
    if (form.password.length < 6) return 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    if (form.password !== form.confirm) return 'رمز عبور با تکرار آن یکسان نیست'
    if (!/^09\d{9}$/.test(form.phone)) return 'شماره موبایل معتبر نیست'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) return setError(err)
    setLoading(true)
    setError('')
    try {
      debugger
      await register(form.username, form.email, form.phone, form.password,otpToken)
      navigate('/')
    } catch {
      setError('خطا در ثبت‌نام. ایمیل قبلاً استفاده شده')
    } finally {
      setLoading(false)
    }
  }

  // آرایه فقط شامل اشیای فیلدها باشد
  const fields = [
    { key: 'username', label: 'نام و نام خانوادگی', placeholder: 'علی محمدی', icon: 'ti-user', type: 'text' },
    { key: 'email', label: 'ایمیل', placeholder: 'example@email.com', icon: 'ti-mail', type: 'email' },
    { key: 'phone', label: 'شماره موبایل', placeholder: '09123456789', icon: 'ti-phone', type: 'tel' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1a2f5e] flex items-center justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900">
            <i className="ti ti-plane text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">ثبت‌نام در پرواز</h1>
          <p className="text-blue-300 text-sm">رایگان و سریع — کمتر از یک دقیقه</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <i className="ti ti-alert-circle text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <i className={`ti ${f.icon} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg`} />
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              </div>
            ))}

            <PhoneOtpVerification phone={form.phone} purpose="Register" onVerified={setOtpToken} />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">رمز عبور</label>
              <div className="relative">
                <i className="ti ti-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="حداقل ۶ کاراکتر"
                  className="w-full border border-gray-200 rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'} text-lg`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">تکرار رمز عبور</label>
              <div className="relative">
                <i className="ti ti-lock-check absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input type="checkbox" className="w-4 h-4 accent-[#e8ac21] rounded mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                با ثبت‌نام، <Link to="/terms" className="text-blue-600 hover:underline">قوانین و مقررات</Link> سامانه را می‌پذیرم
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading || !otpToken}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <><i className="ti ti-loader-2 animate-spin text-xl" /> در حال ثبت‌نام...</>
              ) : (
                <><i className="ti ti-user-plus text-xl" /> ثبت‌نام رایگان</>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            قبلاً ثبت‌نام کردید؟{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">وارد شوید</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage