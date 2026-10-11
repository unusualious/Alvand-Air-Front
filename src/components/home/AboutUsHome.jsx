import { Play } from "lucide-react";
import hero from "../../assets/images/d6dae522.webp";

export default function HeroSection() {
  return (
<section
  className="relative min-h-[70vh] py-12 lg:py-0 overflow-hidden bg-cover bg-center bg-fixed"
  style={{
    backgroundImage: `url(${hero})`
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-[#081321]/80 to-[#081321]/95 lg:from-black/20 lg:to-[#081321]/90"></div>

  <div className="relative z-10 container mx-auto h-full px-4 sm:px-8 flex items-center">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 lg:gap-0 lg:px-5 items-center">
      
      {/* Right Column - Content */}
      <div className="text-white max-w-2xl text-center lg:text-right">
        <h2 className="text-amber-400 mb-6 lg:mb-12 font-extrabold text-3xl sm:text-4xl lg:text-5xl">
          درباره ایرلاین الوند
        </h2>

        <h3 className="text-xl sm:text-2xl lg:text-3xl leading-relaxed lg:leading-[1.3] font-bold">
          آسمان در کنار شماست، پرواز خوبی با هم خواهیم داشت . 
        </h3>

        <p className="mt-4 lg:mt-8 text-sm sm:text-base lg:text-lg text-gray-200 leading-7 lg:leading-10">
          تجربه‌ای متفاوت از سفر با هواپیماهای ما، بدون انتظار،
          بدون شلوغی و با بیشترین میزان آسایش.
        </p>
      </div>

      {/* Left Column - Play Button & Contact */}
      <div className="flex flex-col items-center justify-center lg:px-5">
        
        {/* Play Button */}
        <div className="relative flex items-center justify-center p-6 lg:p-10 my-4 lg:mb-10">
          <span className="absolute h-20 w-20 lg:h-28 lg:w-28 rounded-full border border-amber-400 animate-ripple"></span>
          <button
            className="
              relative z-10
              w-16 h-16 lg:w-24 lg:h-24
              rounded-full
              bg-amber-400/30
              backdrop-blur-sm
              flex items-center justify-center
            "
          >
            <Play
              fill="#d6b26e"
              color="#d6b26e"
              className="w-6 h-6 lg:w-8 lg:h-8"
            />
          </button>
        </div>

        {/* Contact Box */}
        <div className="mt-4 lg:mt-10 bg-white w-full max-w-[650px] rounded-2xl lg:rounded-lg p-5 lg:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-right gap-4">
          <div>
            <h3 className="text-base lg:text-xl font-extrabold text-slate-900">
              شماره تماس ما :
            </h3>
            <p className="mt-1 lg:mt-4 text-2xl lg:text-3xl font-extrabold text-amber-600 lg:text-slate-900 dir-ltr">
              02144554000
            </p>
          </div>
          {/* <button className="bg-amber-400 px-8 py-3 lg:px-15 lg:py-5 rounded-full text-sm lg:text-md font-extrabold flex items-center gap-3">
            ✈ رزرو کنید 
          </button> */}
        </div>

      </div>
    </div>
  </div>
</section>
  );
}