import { Link } from "react-router-dom";
import logo from "../../assets/images/logo-white.png";

function Footer() {
  return (
      <footer className="bg-[#272c34] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <img src={logo} className="w-[200px]" alt="" />
              </div>
              <p className="text-sm leading-relaxed">
                سامانه رزرو آنلاین بلیط هواپیمای داخلی
              </p>
            </div>
            {[
              {
                title: "دسترسی سریع",
                links: [
                  { label: "خانه", to: "/" },
                  { label: "جستجوی پرواز", to: "/" },
                  { label: "درباره ما", to: "/about" },
                ],
              },
              {
                title: "خدمات",
                links: [
                  { label: "رزرو بلیط", to: "/" },
                  { label: "شکایات و پیشنهادات", to: "/feedback" },
                  { label: "پشتیبانی", to: "/feedback" },
                ],
              },
              {
                title: "تماس با ما",
                links: [
                  { label: "۰۲۱-۴۴۵۵۴۰۰۰" },
                  { label: "info@alvandairways.ir" },
                  { label: "تهران، ضلع جنوبی بزرگراه شیخ فضل الله، انتهای خیابان کاشانی پور، پلاک 216" },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-bold text-sm mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j} className="text-sm leading-7">
                      {link.to ? (
                        <Link to={link.to} className="hover:text-white transition">{link.label}</Link>
                      ) : (
                        <span>{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 text-center text-sm">
            © 2026 - تمامی حقوق برای هواپیمایی الوند محفوظ می باشد
          </div>
        </div>
      </footer>
  )
}
export default Footer