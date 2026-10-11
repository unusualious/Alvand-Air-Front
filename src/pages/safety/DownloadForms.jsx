import { useEffect, useState } from 'react'
import { safetyFormService } from '../../services/api'

function DownloadForms() {
  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({ formType: 'Mandatory', fullName: '', email: '', phone: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    safetyFormService.getTemplates()
      .then(res => {
        // دریافت صحیح آرایه چه به صورت res.data باشد چه res.data.data
        const data = Array.isArray(res?.data) ? res.data : (res?.data?.data || [])
        setTemplates(data)
      })
      .catch((err) => {
        console.error('Error loading templates:', err)
      })
  }, [])

  // تابع ساخت آدرس دانلود سازگار با لوکال و IIS
  const getDownloadUrl = (rawUrl) => {
    if (!rawUrl) return '#'
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl

    // تمیزسازی اسلش ابتدای آدرس
    const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`

    // اگر در لوکال باشیم (مثلا روی localhost:5173)، آدرس مستقیم API لوکال را می‌دهد
    // اگر روی سرور واقعی باشیم، از مسیر نسبی استفاده می‌کند تا IIS آن را به بک‌اند پروکسی کند
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const baseUrl = isLocal 
      ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5106')
      : ''

    return `${baseUrl}${cleanPath}`
  }

  const handleUpload = async () => {
    if (!file) return setError('لطفاً فایل تکمیل‌شده را انتخاب کنید')
    if (!form.fullName) return setError('نام الزامی است')
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('formType', form.formType)
      fd.append('fullName', form.fullName)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      await safetyFormService.upload(fd)
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در آپلود فایل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">دانلود و بارگذاری فرم‌ها</h1>
          <p className="text-gray-500 text-sm">فرم را دانلود، تکمیل و سپس همینجا بارگذاری کنید</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-black text-gray-900 mb-4">۱. دانلود فرم</h3>
          <div className="space-y-2">
            {templates && templates.length > 0 ? (
              templates.map((t, i) => (
                <a 
                  key={t.id || i} 
                  href={getDownloadUrl(t.url)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
                >
                  <div className="flex items-center gap-2">
                    <i className="ti ti-file-type-pdf text-red-500 text-lg" />
                    <span className="text-sm font-bold text-gray-800">{t.name || t.title}</span>
                    {t.code && <span className="text-xs text-gray-400">({t.code})</span>}
                  </div>
                  <i className="ti ti-download text-gray-400" />
                </a>
              ))
            ) : (
              <div className="text-center py-3 text-gray-400 text-sm">
                در حال دریافت لیست فرم‌ها...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-4">۲. بارگذاری فرم تکمیل‌شده</h3>
          {done ? (
            <div className="text-center py-6">
              <i className="ti ti-circle-check text-4xl text-green-500 block mb-2" />
              <p className="text-gray-700 font-bold">فایل شما با موفقیت ارسال شد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <select 
                value={form.formType} 
                onChange={e => setForm({ ...form, formType: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Mandatory">فرم گزارش اجباری (ALV-SCM-FO-06)</option>
                <option value="Voluntary">فرم گزارش داوطلبانه/محرمانه (ALV-SCM-FO-09)</option>
              </select>
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  value={form.fullName} 
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="نام و نام خانوادگی" 
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="شماره موبایل" 
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
              
              <input 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="ایمیل" 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
              
              <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 cursor-pointer hover:border-blue-300 transition">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setFile(e.target.files[0])} />
                <i className="ti ti-upload text-xl text-gray-400" />
                <span className="text-sm text-gray-500">{file ? file.name : 'انتخاب فایل PDF یا Word'}</span>
              </label>

              <button 
                onClick={handleUpload} 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? 'در حال ارسال...' : 'ارسال فایل'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DownloadForms