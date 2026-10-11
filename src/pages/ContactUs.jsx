import { Phone, CheckCircle2,ChevronRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom'
import topHeader from "../assets/images/banners/609980953232488s5.webp";
import aboutImg from "../assets/images/banners/45640655640.webp";
import aboutThumb from "../assets/images/banners/5sad09sa8d.webp";

const AboutSection = () => {
  const features = [
    'هواپیمای امن و مدرن',
    'سرویس ها و خدمات شخصی',
    'به دور از خستگی و تاخیر',
    'پشتیبانی اختصاصی 24 ساعته',
  ];

const contactCards = [
  {
    icon: 'ti-message-circle-2',
    title: 'شکایات و پیشنهادات',
    desc: 'نظرات و انتقادات شما درباره‌ی خدمات به تیم پشتیبانی ارسال می‌شود',
    to: '/feedback',
    color: 'bg-blue-50 text-blue-600',
  },
{
  icon: 'ti-shield-exclamation',
  title: 'فرم‌های گزارش‌دهی ایمنی',
  desc: 'گزارش اجباری، داوطلبانه/محرمانه، یا دانلود فرم‌های رسمی',
  to: '/safety-reports',
  color: 'bg-amber-50 text-amber-600',
},
  {
    icon: 'ti-headset',
    title: 'تیکت پشتیبانی',
    desc: 'برای پیگیری رزرو یا مشکلات فنی، از پنل کاربری خود تیکت ثبت کنید',
    to: '/profile',
    color: 'bg-green-50 text-green-600',
  },
]
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

<section className="py-16 md:py-24 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ستون عکس‌ها و مدال‌ها (تصویر سمت چپ / راست در حالت دسکتاپ) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* تصویر اصلی */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src = {aboutImg}
                  alt="Private Jet Flight"
                  className="w-full h-[450px] md:h-[520px] object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* تصویر کوچک مکمل (شناور) */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl z-10">
                <img
                  src={aboutThumb}
                  alt="Luxury Cabin Interior"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

          {/* ستون محتوا و توضیحات */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* زیرعنوان / Subtitle */}
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest w-fit mb-4">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>بهترین سفر را داشته باشید</span>
            </div>

            {/* عنوان اصلی */}
            <h2 className="text-3xl md:text-4xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              با سرویس های <span className="text-rose-800">[24/7]</span> هواپیمایی الوند 
            </h2>

            {/* توضیحات */}
            <p className="text-slate-600 text-base md:text-md leading-relaxed mb-8">
              در هواپیمایی ما، ارتباط با مسافران و همراهی با شما تنها به زمان سفر محدود نمی‌شود. تیم پشتیبانی و کارشناسان ما آماده‌اند تا برای پاسخ‌گویی به پرسش‌ها، پیگیری درخواست‌ها، دریافت پیشنهادها و ارائه راهنمایی‌های لازم در کنار شما باشند. برای دریافت اطلاعات بیشتر یا ارتباط با بخش‌های مختلف، می‌توانید از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
            </p>

            {/* لیست ویژگی‌ها (Checklist Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* بخش تماس و دکمه اکشن (CTA Footer) */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
              
              {/* باکس شماره تماس */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500 font-medium">
                    تماس با ما
                  </span>
                  <a href="tel:+9802144554000" className="text-lg font-semibold text-slate-900 hover:text-rose-600 transition-colorsDir">
                    44554000
                  </a>
                </div>
              </div>

              {/* دکمه رزرو */}
              <button className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-rose-800 text-white px-7 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-rose-500/25 group">
                <span>رزرو آنی</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

            </div>

          </div>

        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: 'ti-phone', label: 'تلفن پشتیبانی', value: '۰۲۱-۴۴۵۵۴۰۰۰' },
            { icon: 'ti-mail', label: 'ایمیل', value: 'info@alvandairways.ir' },
            { icon: 'ti-map-pin', label: 'آدرس دفتر مرکزی', value: 'تهران، بزرگراه شیخ فضل‌الله' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className={`ti ${item.icon} text-blue-600 text-lg`} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactCards.map((card, i) => (
            <Link key={i} to={card.to}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.color}`}>
                <i className={`ti ${card.icon} text-2xl`} />
              </div>
              <h3 className="font-black text-gray-900 mb-1.5">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
              <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                ثبت درخواست <i className="ti ti-arrow-left" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
</div>

  );
};

export default AboutSection;