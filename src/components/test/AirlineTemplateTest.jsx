import { useState } from "react";
import {
  Plane,
  Search,
  Calendar,
  Users,
  Ticket,
  ArrowLeft,
  PlaneTakeoff,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import samp from "../../assets/images/154941061-e231b4725ef1.jpg";

export default function AirlineTemplateTest() {
  const [activeTab, setActiveTab] = useState("flight");

  const deals = [
    {
      id: 1,
      city: "تهران ← استانبول",
      price: "۹,۸۰۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900&q=80",
    },
    {
      id: 2,
      city: "تهران ← دبی",
      price: "۷,۵۰۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
    },
    {
      id: 3,
      city: "تهران ← آنتالیا",
      price: "۸,۲۰۰,۰۰۰",
      image:
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800" dir="rtl">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden tbg-gradient-to-b from-[#F5F9FF] via-white to-[#EEF4FB] via-[#0A1830] to-[#0f203d]">
        {/* background glow */}
        <div className="absolute top-[-250px] left-[-250px] h-[500px] w-[500px] rounded-full bg-yellow-400/10 blur-[140px]" />

        <div className="absolute bottom-[-250px] right-[-250px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pt-12 pb-24 lg:grid-cols-2 lg:px-8">
          {/* Right */}
          <div>
            <div className="mb-8 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-sm text-yellow-300 backdrop-blur-xl">
              رزرو رسمی بلیط هواپیما
            </div>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              سفر هوایی
              <span className="text-yellow-400"> سریع، امن </span>و حرفه‌ای
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-9 text-slate-300">
              رزرو بلیط داخلی و خارجی با بهترین قیمت، پشتیبانی ۲۴ ساعته و پروازه ای متنوع در سرتاسر کشور          </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-bold text-slate-900 transition hover:scale-105">
                جستجوی پرواز
              </button>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition hover:bg-white/10">
                مشاهده مقاصد
              </button>
            </div>
          </div>

          {/* left visual */}
          <div className="relative lg:flex justify-center">
            <div className="absolute h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[120px]" />

            <img
              src={samp}
              alt=""
              className="relative z-10 h-[520px] rounded-[40px] object-cover shadow-2xl shadow-black/50"
            />
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">
            {/* tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("flight")}
                className={`flex flex-1 items-center justify-center gap-2 py-5 font-medium transition ${
                  activeTab === "flight"
                    ? "bg-yellow-400 text-slate-900"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Plane size={18} />
                جستجوی پرواز
              </button>

              <button
                onClick={() => setActiveTab("ticket")}
                className={`flex flex-1 items-center justify-center gap-2 py-5 font-medium transition ${
                  activeTab === "ticket"
                    ? "bg-yellow-400 text-slate-900"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Ticket size={18} />
                استعلام بلیط
              </button>
            </div>

            {/* tab content */}
            <div className="p-7">
              {activeTab === "flight" && (
                <div className="grid gap-4 lg:grid-cols-5">
                  <div className="rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5">
                    <p className="text-sm text-slate-400">مبدا</p>
                    <h3 className="mt-2 text-lg font-bold">تهران</h3>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5">
                    <p className="text-sm text-slate-400">مقصد</p>
                    <h3 className="mt-2 text-lg font-bold">استانبول</h3>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5">
                    <Calendar className="text-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-400">تاریخ</p>
                      <h3 className="font-bold">۱۲ شهریور</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5">
                    <Users className="text-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-400">مسافران</p>
                      <h3 className="font-bold">۱ بزرگسال</h3>
                    </div>
                  </div>

                  <button className="rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 font-black text-slate-900 transition hover:scale-[1.02]">
                    جستجوی پرواز
                  </button>
                </div>
              )}

              {activeTab === "ticket" && (
                <div className="grid gap-4 lg:grid-cols-4">
                  <input
                    placeholder="کد پیگیری"
                    className="rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5 outline-none placeholder:text-slate-500"
                  />

                  <input
                    placeholder="نام خانوادگی"
                    className="rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5 outline-none placeholder:text-slate-500"
                  />

                  <input
                    placeholder="شماره موبایل"
                    className="rounded-3xl border border-white/10 bg-[#0d1a2f]/70 p-5 outline-none placeholder:text-slate-500"
                  />

                  <button className="rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 font-black text-slate-900">
                    استعلام
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEALS ================= */}
      <section className="bg-[#091525] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <span className="text-sm text-yellow-400">پیشنهاد ویژه</span>

              <h2 className="mt-3 text-4xl font-black">پروازهای محبوب</h2>
            </div>

            <button className="hidden items-center gap-2 text-yellow-400 lg:flex">
              مشاهده همه
              <ArrowLeft size={18} />
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition duration-500 hover:-translate-y-3"
              >
                <div className="overflow-hidden">
                  <img
                    src={deal.image}
                    alt=""
                    className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold">{deal.city}</h3>

                  <p className="mt-3 text-slate-400">شروع قیمت از</p>

                  <div className="mt-4 text-3xl font-black text-yellow-400">
                    {deal.price}
                    <span className="mr-2 text-sm text-slate-400">تومان</span>
                  </div>

                  <button className="mt-6 w-full rounded-2xl border border-yellow-400/20 bg-yellow-400/10 py-4 text-yellow-300 transition hover:bg-yellow-400 hover:text-slate-900">
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= PROMO ================= */}
      <section className="relative overflow-hidden bg-[#F7F9FC] py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-r from-[#0c1930] via-[#132445] to-[#0f1d37]">
            {/* glow */}
            <div className="absolute top-[-150px] left-[10%] h-[300px] w-[300px] rounded-full bg-yellow-400/10 blur-[120px]" />

            <div className="grid items-center gap-10 lg:grid-cols-2">
              {/* text */}
              <div className="relative z-10 p-10 lg:p-16">
                <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300 backdrop-blur-xl">
                  پیشنهاد ویژه
                </span>

                <h2 className="mt-7 text-4xl font-black leading-tight lg:text-6xl">
                  مقصد بعدی
                  <span className="text-yellow-400"> رویایی </span>
                  خود را پیدا کنید
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-9 text-slate-300">
                  با بهترین قیمت‌های داخلی و خارجی، تجربه‌ای لوکس و حرفه‌ای از
                  سفرهای هوایی داشته باشید.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-4 font-black text-slate-900 transition hover:scale-105">
                    مشاهده مقاصد
                  </button>

                  <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur-xl transition hover:bg-white/10">
                    تماس با مشاور
                  </button>
                </div>
              </div>

              {/* image */}
              <div className="relative h-full min-h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= DESTINATIONS ================= */}
      <section className="bg-[#091525] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-sm text-yellow-400">مقاصد محبوب</span>

            <h2 className="mt-4 text-4xl font-black">بهترین مقصدهای پروازی</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                city: "استانبول",
                country: "ترکیه",
                image:
                  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=80",
              },
              {
                city: "دبی",
                country: "امارات",
                image:
                  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
              },
              {
                city: "رم",
                country: "ایتالیا",
                image:
                  "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900&q=80",
              },
              {
                city: "پاریس",
                country: "فرانسه",
                image:
                  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80",
              },
            ].map((item) => (
              <div
                key={item.city}
                className="group relative overflow-hidden rounded-[34px] border border-white/10"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-7">
                  <p className="text-sm text-yellow-400">{item.country}</p>

                  <h3 className="mt-2 text-3xl font-black">{item.city}</h3>

                  <button className="mt-4 rounded-xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl transition hover:bg-yellow-400 hover:text-slate-900">
                    مشاهده پروازها
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= SERVICES ================= */}
      <section className="bg-[#F7F9FC] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-sm text-yellow-400">خدمات ویژه</span>

            <h2 className="mt-4 text-4xl font-black">تجربه‌ای متفاوت از سفر</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "رزرو سریع",
                desc: "کمتر از ۳ دقیقه بلیط رزرو کنید",
              },
              {
                title: "پشتیبانی ۲۴/۷",
                desc: "همیشه کنار شما هستیم",
              },
              {
                title: "بهترین قیمت",
                desc: "ارزان‌ترین نرخ بازار",
              },
              {
                title: "پرداخت امن",
                desc: "تراکنش کاملاً امن و سریع",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-[34px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-yellow-400/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400/10 text-2xl text-yellow-400">
                  ✦
                </div>

                <h3 className="mt-7 text-2xl font-bold">{service.title}</h3>

                <p className="mt-4 leading-8 text-slate-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= NEWS ================= */}
<section className="bg-[#091525] py-24">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="mb-14 flex items-end justify-between">
      <div>
        <span className="text-sm text-yellow-400">
          اخبار و مقالات
        </span>

        <h2 className="mt-4 text-4xl font-black">
          تازه‌ترین مطالب سفر
        </h2>
      </div>

      <button className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 backdrop-blur-xl transition hover:bg-white/10 lg:block">
        مشاهده همه
      </button>
    </div>

    <div className="grid gap-8 lg:grid-cols-3">
      {[
        {
          title:
            'بهترین زمان سفر به استانبول',
          date: '۱۲ شهریور ۱۴۰۵',
          image:
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
        },
        {
          title:
            'راهنمای کامل سفر به دبی',
          date: '۱۸ شهریور ۱۴۰۵',
          image:
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
        },
        {
          title:
            '۵ مقصد ارزان برای سفر خارجی',
          date: '۲۲ شهریور ۱۴۰۵',
          image:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
        },
      ].map((post) => (
        <article
          key={post.title}
          className="group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition duration-500 hover:-translate-y-2"
        >
          <div className="overflow-hidden">
            <img
              src={post.image}
              alt=""
              className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-110"
            />
          </div>

          <div className="p-7">
            <p className="text-sm text-yellow-400">
              {post.date}
            </p>

            <h3 className="mt-4 text-2xl font-bold leading-relaxed transition group-hover:text-yellow-400">
              {post.title}
            </h3>

            <button className="mt-6 text-yellow-400 transition hover:translate-x-1">
              ادامه مطلب ←
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
{/* ================= NEWSLETTER ================= */}
<section className="bg-[#F7F9FC] py-10">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-r from-[#0d1b31] to-[#13264a] p-10 lg:p-16">
      <div className="absolute top-[-100px] left-[-100px] h-[250px] w-[250px] rounded-full bg-yellow-400/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <span className="text-sm text-yellow-400">
            عضویت در خبرنامه
          </span>

          <h2 className="mt-4 text-4xl font-black">
            از تخفیف‌های ویژه جا نمانید
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
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-800 outline-none placeholder:text-slate-500"
          />

          <button className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-bold text-slate-900 transition hover:scale-105">
            عضویت
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
{/* ================= FOOTER ================= */}
<footer className="border-t border-white/10 bg-[#272c34] py-20">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
      {/* brand */}
      <div>
        <h2 className="text-3xl font-black text-yellow-400">
          AlvandAir
        </h2>

        <p className="mt-5 leading-8 text-slate-400">
          تجربه‌ای لوکس و امن از
          رزرو بلیط هواپیما و خدمات
          سفر.
        </p>
      </div>

      {/* links */}
      <div>
        <h3 className="mb-5 text-xl font-bold">
          دسترسی سریع
        </h3>

        <ul className="space-y-4 text-slate-400">
          <li>
            <a
              href="#"
              className="transition hover:text-yellow-400"
            >
              خانه
            </a>
          </li>

          <li>
            <a
              href="#"
              className="transition hover:text-yellow-400"
            >
              پروازها
            </a>
          </li>

          <li>
            <a
              href="#"
              className="transition hover:text-yellow-400"
            >
              مقاصد
            </a>
          </li>
        </ul>
      </div>

      {/* support */}
      <div>
        <h3 className="mb-5 text-xl font-bold">
          پشتیبانی
        </h3>

        <ul className="space-y-4 text-slate-400">
          <li>سوالات متداول</li>
          <li>حریم خصوصی</li>
          <li>تماس با ما</li>
        </ul>
      </div>

      {/* contact */}
      <div>
        <h3 className="mb-5 text-xl font-bold">
          تماس
        </h3>

        <p className="text-slate-400">
          support@alvandair.com
        </p>

        <p className="mt-3 text-slate-400">
          +98 21 1234 5678
        </p>
      </div>
    </div>

    <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
      © 2026 AlvandAir — تمامی حقوق
      محفوظ است.
    </div>
  </div>
</footer>
    </div>
  );
}
