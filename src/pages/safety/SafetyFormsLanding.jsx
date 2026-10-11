import { Link } from 'react-router-dom'
import topHeader from "../../assets/images/banners/609980953232488s5.webp";
import { ChevronRight } from 'lucide-react';

const items = [
  {
    icon: 'ti-alert-octagon',
    title: 'گزارش اجباری',
    subtitle: 'Mandatory Report',
    code: 'ALV-SCM-FO-06',
    desc: 'برای رویدادهای ایمنی که طبق دستورالعمل شرکت گزارش آن‌ها الزامی است',
    to: '/safety-reports/mandatory',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: 'ti-shield-check',
    title: 'گزارش داوطلبانه / محرمانه',
    subtitle: 'Voluntary / Confidential Report',
    code: 'ALV-SCM-FO-09',
    desc: 'برای مشاهدات و مخاطرات ایمنی، با امکان ثبت به‌صورت محرمانه',
    to: '/safety-reports/voluntary',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: 'ti-file-download',
    title: 'دانلود فرم‌های گزارش‌دهی',
    subtitle: 'Download & Upload Forms',
    code: '',
    desc: 'دانلود نسخه‌ی رسمی فرم‌ها، تکمیل، و بارگذاری مجدد',
    to: '/safety-reports/download',
    color: 'bg-blue-50 text-blue-600',
  },
]

function SafetyFormsLanding() {
  return (
    <div className="font-serif text-slate-800 bg-white">


      <section
        className="relative h-[380px] bg-cover bg-center flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${topHeader})` }}
      >
        <h1 className="text-4xl mt-8 font-extrabold tracking-wide mb-2">
          تماس با هواپیمایی الوند
        </h1>
        <div className="text-xs font-sans text-slate-300 flex items-center gap-2">
          <span>الوند ایرلاین</span>
          <ChevronRight className="w-3 h-3 text-rose-500" />
          <span className="text-rose-800">راه‌های ارتباطی و ثبت درخواست‌های شما</span>
        </div>
      </section>
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <i className="ti ti-shield-exclamation text-2xl text-red-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">فرم‌های گزارش‌دهی ایمنی</h1>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              واحد ایمنی و تضمین کیفیت (Safety & Compliance Monitoring) هواپیمایی الوند، آماده‌ی دریافت گزارش شماست
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <Link key={i} to={item.to}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                  <i className={`ti ${item.icon} text-2xl`} />
                </div>
                <h3 className="font-black text-gray-900 mb-0.5">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-1">{item.subtitle} {item.code && `· ${item.code}`}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                  ادامه <i className="ti ti-arrow-left" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafetyFormsLanding