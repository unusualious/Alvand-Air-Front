import { useState, useEffect } from 'react'
import { otpService } from '../../services/api'

function PhoneOtpVerification({ phone, purpose = 'Register', onVerified }) {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleSend = async () => {
    setError('')
    setLoading(true)
    try {
      await otpService.send(phone, purpose)
      setSent(true)
      setCountdown(120)
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (code.length !== 5) return setError('کد ۵ رقمی را کامل وارد کنید')
    setError('')
    setLoading(true)
    try {
      const res = await otpService.verify(phone, code, purpose)
      onVerified(res.data.verificationToken)
    } catch (err) {
      setError(err.response?.data?.message || 'کد وارد شده صحیح نیست')
    } finally {
      setLoading(false)
    }
  }

  if (!sent) {
    return (
      <button type="button" onClick={handleSend} disabled={loading || !phone || phone.length !== 11}
        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
        {loading ? 'در حال ارسال...' : 'ارسال کد تایید به موبایل'}
      </button>
    )
  }

  return (
    <div className="space-y-3 bg-gray-50 rounded-xl p-4">
      {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>}
      <p className="text-xs text-gray-500">کد ۵ رقمی به شماره‌ی {phone} پیامک شد</p>
      <input
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="•••••"
        maxLength={5}
        inputMode="numeric"
        className="w-full text-center tracking-[0.5em] font-black text-lg border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="button" onClick={handleVerify} disabled={loading || code.length !== 5}
        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
        {loading ? 'در حال بررسی...' : 'تایید کد'}
      </button>
      <button type="button" onClick={handleSend} disabled={countdown > 0}
        className="w-full text-xs text-gray-500 disabled:opacity-40">
        {countdown > 0 ? `ارسال مجدد تا ${countdown} ثانیه دیگر` : 'ارسال مجدد کد'}
      </button>
    </div>
  )
}

export default PhoneOtpVerification