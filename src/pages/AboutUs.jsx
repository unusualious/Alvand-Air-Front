import React, { useState } from "react";
import {
  Phone,
  ChevronRight,
  Plane,
  Plus,
  Minus,
  Search,
  User,
  Menu,
  Star,
  Check,
} from "lucide-react";
import hero2 from "../assets/images/hero/456565606663.webp";
import topHeader from "../assets/images/banners/6099809532322.webp";

export default function EvoflyAboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="font-serif text-slate-800 bg-white">
      <section
        className="relative h-[320px] bg-contain bg-center flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${topHeader})` }}
      >
        <h1 className="text-4xl font-extrabold tracking-wide mb-2">
          درباره ما
        </h1>
        <div className="text-xs font-sans text-slate-300 flex items-center gap-2">
          <span>الوند ایرلاین</span>
          <ChevronRight className="w-3 h-3 text-amber-500" />
          <span className="text-amber-500">درباره ما</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative">
          <img
            src={hero2}
            alt="Aircraft Interior"
            className="w-full h-[450px] object-cover shadow-lg"
          />
        </div>

        <div className="md:col-span-7">
          <span className="text-xs font-sans tracking-widest text-amber-800 uppercase block mb-2">
            تجربه بهتری داشته باشید
          </span>
          <h2 className="text-3xl md:text-4xl leading-tight mb-6 text-slate-900">
            به همراه <span className="text-red-700">[24/7]</span> پرواز امن و
            راحت در هر زمان
          </h2>
          <p className="text-slate-500 font-sans text-sm leading-relaxed mb-8">
            شما می توانید از امکانات بیشتر و شرایط گوناگون در پروازهای بی شمار و
            جذاب ما بهره مند شوید.
          </p>

          <div className="flex flex-wrap items-center gap-8 border-t border-slate-100 pt-6">
            <div>
              <span className="block text-xs font-sans text-slate-400">
                برای اطلاعات بیشتر تماس بگیرید
              </span>
              <span className="text-lg font-extrabold text-red-700 font-sans">
                02144554000
              </span>
            </div>
            <button className="bg-amber-800 hover:bg-amber-900 text-white font-sans text-xs px-6 py-3 tracking-wider">
              همین حالا رزرو کنید +
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
