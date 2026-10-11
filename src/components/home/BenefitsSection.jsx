import {
  Plane,
  Wallet,
  TrendingUp,
  Clock3,
  Gem,
  ShieldCheck,
} from "lucide-react";
import hero from "../../assets/images/asd456156321.webp";

const benefits = [
  {
    icon: Plane,
    title: "سفر بدون محدودیت",
    desc: "در زمان دلخواه خود به هر مقصدی سفر کنید و تجربه‌ای آرام و کاملاً اختصاصی داشته باشید.",
  },
  {
    icon: Wallet,
    title: "مدیریت بهتر زمان",
    desc: "بدون انتظارهای طولانی فرودگاهی، برنامه سفر خود را دقیق و انعطاف‌پذیر تنظیم کنید.",
  },
  {
    icon: TrendingUp,
    title: "اعتبار و پرستیژ",
    desc: "پرواز خصوصی، ترکیبی از راحتی، اعتبار و سبک زندگی سطح بالا را برای شما فراهم می‌کند.",
  },
  {
    icon: Clock3,
    title: "برنامه‌ریزی منعطف",
    desc: "ساعت حرکت، مسیر پرواز و جزئیات سفر کاملاً مطابق نیاز شما تعیین می‌شود.",
  },
  {
    icon: Gem,
    title: "خدمات ویژه VIP",
    desc: "از پذیرایی اختصاصی، فضای آرام و امکاناتی در سطح استانداردهای جهانی بهره‌مند شوید.",
  },
  {
    icon: ShieldCheck,
    title: "امنیت و آسودگی",
    desc: "حریم خصوصی، آرامش و امنیت در تمام مراحل سفر برای شما تضمین می‌شود.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      dir="rtl"
      className="py-28 relative h-screen overflow-hidden bg-cover bg-center bg-fixed"
            style={{
              backgroundImage:
                `url(${hero})`
            }}
    >
      <div className="max-w-7xl mx-auto px-6">

     <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 special-title relative">
              چرا ایــرلــاین الـــوند ؟ 
            </h2>
            <p className="text-gray-500 text-sm mt-1">
             سرویس هایی که ما ارائه می دهیم
            </p>
          </div>
        </div>


        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  rounded-xl
                  p-10
                  shadow-[0_12px_35px_rgba(0,0,0,0.05)]
                  border border-[#eee]
                  transition-shadow duration-300
                  hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                "
              >
                
                {/* خط طلایی */}
                <div className="w-10 h-[2px] bg-[#B8945A] mb-8"></div>

                <div className="flex  align-center gap-3">
                <Icon
                  size={40}
                  strokeWidth={1.3}
                  className="text-[#14171f]"
                />
                <h3 className="
                  mt-2 
                  text-xl 
                  font-bold
                  text-[#1B2430]
                ">
                  {item.title}
                </h3>
                </div>

                {/* Description */}
                <p className="
                  mt-5
                  text-gray-800
                  leading-9
                  text-md
                ">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}



