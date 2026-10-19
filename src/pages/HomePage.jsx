import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "../components/search/SearchBox";
import AboutUsHome from "../components/home/AboutUsHome";
import Blog from "../components/home/Blog";
import Benefits from "../components/home/BenefitsSection";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import hero1 from "../assets/images/hero/61a109cc05.jpg";
import hero2 from "../assets/images/hero/37866556-6812c9d1c72e.jpg";
import hero3 from "../assets/images/hero/525428034-b723cf961d3e.jpg";
import route1 from "../assets/images/banners/traveltomashhadbanner001.webp";
import route2 from "../assets/images/banners/traveltoshirazbanner001.webp";
import route3 from "../assets/images/banners/traveltokishbanner001.webp";
import route4 from "../assets/images/banners/traveltoisfahanbanner001.webp";
import route5 from "../assets/images/154941061-e231b4725ef1.jpg";
import destination1 from "../assets/images/banners/traveltoistanbulbanner001.webp";
import destination2 from "../assets/images/banners/traveltodubaybanner001.webp";
import destination3 from "../assets/images/banners/traveltoarmenia-2e2e2.webp";
import destination4 from "../assets/images/banners/traveltolahur-e3.webp";
import banner1 from "../assets/images/banners/photo-1507525428034-b723cf961d3e.jpg";

import {
  ArrowDownLeft,
  ClockCheck,
  WalletCards,
  Headset,
  RefreshCcw,
  Users,
  Ticket,
  Clock,
  Search,
  Plane,
  ArrowLeft,
  ShieldAlert,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "پرواز خود را پیدا کنید",
    subtitle: "بیش از ۱۰ پرواز  — با قیمت مناسب",
    badge: "✈ سامانه رسمی رزرو بلیط",
    bg: "from-[#0A1628]/70 via-[#3c3c33] to-[#1a1f6e]/80",
    image: hero1,
  },
  {
    id: 2,
    title: "تخفیف‌های ویژه تابستان",
    subtitle: "تا 5٪ تخفیف روی پروازهای انتخابی",
    badge: "🔥 پیشنهاد محدود",
    bg: "from-[#382d2d]/70 via-[#3c3c33] to-[#780e36]/80",
    image: hero2,
  },
  {
    id: 3,
    title: "رزرو سریع، سفر آسان",
    subtitle: "در کمتر از 5 دقیقه بلیط خود را رزرو کنید",
    badge: "⚡ رزرو فوری",
    bg: "from-[#0A1628]/70 via-[#3a4f58] to-[#0d4a2b]/80",
    image: hero3,
  },
];

const popularRoutes = [
  {
    from: "تهران",
    to: "مشهد",
    fromCode: "THR",
    toCode: "MHD",
    price: "۱,۶۵۰,۰۰۰",
    time: "۱ ساعت ۲۰ دقیقه",
    img: route1,
  },
  {
    from: "تهران",
    to: "شیراز",
    fromCode: "THR",
    toCode: "SYZ",
    price: "۱,۸۰۰,۰۰۰",
    time: "۱ ساعت ۴۰ دقیقه",
    img: route2,
  },
  {
    from: "تهران",
    to: "کیش",
    fromCode: "THR",
    toCode: "KIH",
    price: "۲,۱۰۰,۰۰۰",
    time: "۱ ساعت ۵۰ دقیقه",
    img: route3,
  },
  {
    from: "تهران",
    to: "اصفهان",
    fromCode: "THR",
    toCode: "IFN",
    price: "۱,۴۰۰,۰۰۰",
    time: "۵۵ دقیقه",
    img: route4,
  },
];

const airlines = [
  { name: "الوند ایرلاین", code: "W5", color: "bg-red-50 text-red-700" },
  { name: "الوند ایرلاین", code: "IR", color: "bg-blue-50 text-blue-700" },
  { name: "قشم ایر", code: "QB", color: "bg-green-50 text-green-700" },
  { name: "زاگرس", code: "ZV", color: "bg-[#0A1628]-50 text-purple-700" },
  { name: "کیش ایر", code: "Y9", color: "bg-amber-50 text-amber-700" },
  { name: "آسمان", code: "EP", color: "bg-sky-50 text-sky-700" },
  { name: "کاسپین", code: "RV", color: "bg-teal-50 text-teal-700" },
  { name: "تابان", code: "HH", color: "bg-orange-50 text-orange-700" },
];

const features = [
  {
    icon: WalletCards,
    title: "پرداخت امن",
    desc: "درگاه پرداخت مستقیم بانکی",
    color: "text-green-500",
  },
  {
    icon: ClockCheck,
    title: "رزرو ۲۴ ساعته",
    desc: "در هر زمانی بلیط رزرو کنید",
    color: "text-blue-500",
  },
  {
    icon: Headset,
    title: "پشتیبانی آنلاین",
    desc: "تیم ما همیشه در دسترس است",
    color: "text-purple-500",
  },
  {
    icon: RefreshCcw,
    title: "استرداد آسان",
    desc: "بازگشت وجه سریع و بدون دردسر",
    color: "text-amber-500",
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden mt-20 sm:mt-0">
      {/* Hero Swiper */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-screen min-h-[500px] max-h-[600px]"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className={`relative h-full bg-gradient-to-br ${slide.bg}`}>
                {/* تصویر پس‌زمینه */}
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />

                {/* محتوا */}
                <div className="relative h-full flex flex-col justify-center pt-16">
                  <div className="relative hidden sm-block z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pt-12 pb-24 lg:grid-cols-2 lg:px-8">
                    {/* Right */}

                    <div>
                      <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6">
                        {slide.badge}
                      </span>

                      <h1 className="text-4xl font-black text-white leading-tight lg:text-5xl">
                        {slide.title}
                      </h1>

                      <p className="mt-7 max-w-xl text-lg font-medium leading-9 text-slate-300">
                        {slide.subtitle}
                      </p>
                    </div>

                    {/* left visual */}
                    <div className="relative lg:flex justify-center">
                      <div className="absolute h-[300px] w-[250px] rounded-full bg-yellow-500/10 blur-[120px]" />

                      <img
                        src={route5}
                        alt=""
                        className="hidden sm-hidden lg-block relative z-10 h-[350px] rounded-[40px] object-cover shadow-2xl shadow-black/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="w-[80%] absolute left-1/2 -translate-x-1/2 items-center rounded-[2rem] text-slate-800 text-sm sm:text-xl font-extrabold px-5 py-6 sm:py-10 z-[60] top-6 sm:top-10 lg:top-[150px] bg-white/90 backdrop-blur-md shadow-2xl border border-white/50">
          <h2 className="my-2 sm:my-5 leading-relaxed tracking-wider text-base sm:text-2xl font-black text-slate-900">
            بازدیدکننده گرامی
          </h2>

          <div className="leading-relaxed sm:leading-8 tracking-wide sm:tracking-widest">
            احتراماً؛
            <h3 className="font-black text-rose-900 inline-flex mx-1.5 sm:mx-3 text-base sm:text-xl">
              شرکت هواپیمایی الوند
            </h3>
            در حال آماده سازی زیرساخت جهت خرید بلیط توسط شما مسافر گرامی میباشد.
            <br />
            به زودی این امکان برای شما مهیا خواهد شد.
          </div>
        </div>
        <div className="absolute left-1/2 bottom-[-160px] z-30 w-full max-w-7xl -translate-x-1/2 px-4">
          <SearchBox />
        </div>
      </div>

      {/* بخش گزارش‌های ایمنی */}
      <section className="pt-48 pb-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  گزارش‌های ایمنی پرواز
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                  تضمین ایمنی پروازها اولویت اصلی ماست. جهت مشاهده گزارش‌ها، دستورالعمل‌های ایمنی و ثبت گزارش جدید کلیک کنید.
                </p>
              </div>
            </div>
            <Link
              to="/safety-reports"
              className="whitespace-nowrap inline-flex items-center gap-2 bg-[#702e37]  hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg shadow-red-600/20"
            >
              <span>ارسال گزارش‌ها</span>
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* بخش بخشنامه‌ها */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">

          {/* عنوان بخش */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                بخشنامه‌ها
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                دسترسی به بخشنامه‌ها و اسناد رسمی شرکت هواپیمایی الوند
              </p>
            </div>

            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 items-center justify-center">
              <FileText size={28} />
            </div>
          </div>

          {/* فهرست بخشنامه‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              {
                id: 1,
                title: "بخشنامه بازرگانی ۱",
                number: "001",
                date: "۱۴۰۵/۰۷/۱۹",
                file: "/documents/Alvand_Commercial_Manual.pdf",
              },
              {
                id: 2,
                title: "بخشنامه پاور بانک و باتری های لیتیومی",
                number: "002",
                date: "۱۴۰۵/۰۷/۱۹",
                file: "/documents/Alvand_Lithium_Battery_Circular.pdf",
              },
              {
                id: 3,
                title: "بخشنامه بازرگانی 2",
                number: "003",
                date: "۱۴۰۵/۰۷/۱۹",
                file: "/documents/Commercial_Manual_2.pdf",
              },
            ].map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 leading-7">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      شماره: {item.number}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      تاریخ انتشار: {item.date}
                    </p>
                  </div>
                </div>


                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">

                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#702e37] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#56232a]"
                  >
                    <ExternalLink size={16} />
                    مشاهده PDF
                  </a>


                  <a
                    href={item.file}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    aria-label={`دانلود ${item.title}`}
                  >
                    <Download size={17} />
                    دانلود
                  </a>
                </div>

              </article>
            ))}

          </div>
        </div>
      </section>



      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 special-title relative">
                مقصد های محبوب
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                مقصدهای رویایی در انتظار شماست
              </p>
            </div>
            <Link
              to="/search"
              className="flex items-center gap-1 text-gray-600 text-sm font-bold hover:gap-2 transition-all"
            >
              مشاهده همه
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                city: "استانبول",
                country: "ترکیه",
                image: destination1,
              },
              {
                city: "دبی",
                country: "امارات",
                image: destination2,
              },
              {
                city: "ارمنستان",
                country: "یروان",
                image: destination3,
              },
              {
                city: "پاکستان",
                country: "لاهور",
                image: destination4,
              },
            ].map((item) => (
              <div
                key={item.city}
                className="group relative overflow-hidden rounded-[24px] border border-white/10"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-7">
                  <p className="text-sm text-yellow-400">{item.country}</p>

                  <h3 className="mt-2 text-3xl text-white font-black">{item.city}</h3>

                  <button className="mt-4 rounded-2xl border border-white/80 bg-white/80 cursor-pointer px-5 py-3 backdrop-blur-xl transition hover:bg-yellow-400 
                  hover:bg-gradient-to-r from-[#ffbc1c] to-amber-500">
                    مشاهده پروازها
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#e8ac21]" />
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-nd">{f.title}</h4>

                    <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AboutUsHome />
      <section className="mb-8 max-w-7xl mx-auto py-14">
        <div className="flex items-center justify-between mb-8 px-10 ">
          <div>
            <h2 className="text-2xl font-black text-gray-900 special-title relative">
              مسیرهای پرطرفدار
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              محبوب‌ترین مسیرهای پروازی ایران
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1 text-gray-600 text-sm font-bold hover:gap-2 transition-all"
          >
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 px-10 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, i) => (
            <div
              key={i}
              onClick={() => navigate("/search")}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={route.img}
                  alt={route.to}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white text-sm">
                    <span>{route.from}</span>
                    <Plane size={16} className="text-amber-400" />
                    <span>{route.to}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                  <Clock size={14} />
                  {route.time}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    {/* <p className="text-xs text-gray-400">از</p>
                    <p className="text-gray-600 font-bold text-base">
                      {route.price}
                    </p>
                    <p className="text-xs text-gray-400">تومان</p> */}
                    <p className="text-xs text-gray-400">با الوند ایرلاین</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-bold px-2.5 py-1.5 rounded-xl group-hover:bg-[#a51c20] group-hover:text-white transition-colors">
                    <Search size={14} />
                    جستجو
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Benefits />
      <Blog />
      {/* ایرلاین‌ها */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 special-title relative">
                همکاری با دیگر ایرلاین ها
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                با امکانات بی شمار
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {airlines.map((airline, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${airline.color} flex items-center justify-center text-xs font-black mx-auto mb-2`}
                >
                  {airline.code}
                </div>
                <p className="text-xs font-bold text-gray-700 leading-tight">
                  {airline.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-r from-[#681f21] to-[#562a30] p-10 lg:p-16">
            <div className="absolute top-[-100px] left-[-100px] h-[250px] w-[250px] rounded-full bg-yellow-400/10 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <span className="text-sm text-yellow-400">
                  عضویت در خبرنامه
                </span>

                <h2 className="mt-4 text-white text-4xl font-black">
                  برنامه های جذابی داریم
                </h2>

                <p className="mt-4 text-slate-400">
                  آخرین تخفیف‌ها و پیشنهادهای
                  پروازی را دریافت کنید.
                </p>
              </div>

              <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 outline-none placeholder:text-slate-200"
                />
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition shadow-xl"
          >
            عضویت
          </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="bg-gradient-to-l from-[#e8ac21] to-[#e0bc74] py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            آماده سفر هستید؟
          </h2>
          <p className="text-gray-600 mb-8">همین الان بلیط خود را رزرو کنید</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition shadow-xl"
          >
            جستجوی پرواز
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;