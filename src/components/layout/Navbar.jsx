import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import logo from "../../assets/images/logo.png";

function Navbar() {
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false)
  const isHome = location.pathname === "/";


  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { path: "/", label: "خانه", icon: "ti-home" },
    { path: "/search", label: "جستجوی پرواز", icon: "ti-search" },
    // { path: "/ui-test", label: "تست", icon: "ti-phone" },
    { path: "/about", label: "درباره ما", icon: "ti-info-circle" },
  ];

  const contactSubLinks = [
    { path: "/contact", label: "تماس با ما", icon: "ti-phone" },
    { path: "/feedback", label: "شکایات و پیشنهادات", icon: "ti-message-circle-2" },
    { path: "/safety-reports", label: "فرم‌های گزارش‌دهی ایمنی", icon: "ti-shield-exclamation" },
  ]

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 bg-white/85 backdrop-blur-md transition-all duration-300 ${isHome && !scrolled
        ? "bg-transparent"
        : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between shadow-[0_20px_25px_-5px_rgba(0,0,0,0.07),0_8px_10px_-6px_rgba(0,0,0,0.03)]">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center py-2 gap-3">
            <img src={logo} className="w-[150px] sm:w-[200px]" alt="" />
          </div>
        </Link>

        {/* منو دسکتاپ */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center text-sm gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                ? isHome && !scrolled
                  ? "text-gray-600 hover:bg-gray-50 font-extrabold hover:text-gray-900"
                  : "bg-gray-50 text-[#a51c20] "
                : isHome && !scrolled
                  ? "text-gray-600 hover:bg-white/10 hover:text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <i className={`ti ${link.icon} text-base`} />
              {link.label}
            </Link>

          ))}
          <div className="relative" onMouseEnter={() => setContactOpen(true)} onMouseLeave={() => setContactOpen(false)}>
            <button
              className={`flex items-center text-sm gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${contactSubLinks.some(l => l.path === location.pathname)
                ? "bg-gray-50 text-[#a51c20]"
                : isHome && !scrolled
                  ? "text-gray-600 hover:bg-white/10 hover:text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <i className="ti ti-phone text-base" />
              تماس
              <i className={`ti ti-chevron-down text-sm transition-transform ${contactOpen ? "rotate-180" : ""}`} />
            </button>

            {contactOpen && (
              <div className="absolute top-full right-0 -mt-2 w-60 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-[0_20px_30px_-10px_rgba(0,0,0,0.12)] border-x border-b border-gray-300 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {contactSubLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="group flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-amber-500/10 hover:text-amber-600 transition-all duration-200"
                  >
                    <div className="w-2 h-2 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200 shadow-sm">
                      <i className={`ti ${link.icon} text-base`} />
                    </div>
                    <span className="group-hover:translate-x-[-2px] transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* سمت چپ */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-yellow-800 flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
                <span
                  className={`text-sm font-medium hidden md:block ${isHome && !scrolled ? "text-white" : "text-gray-700"}`}
                >
                  {user?.fullName}
                </span>
                <i
                  className={`ti ti-chevron-down text-sm ${isHome && !scrolled ? "text-white/70" : "text-gray-400"}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl border border-gray-300 border-t-0 shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="font-bold text-gray-900 text-sm">
                      {user?.username}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  {[
                    { to: "/profile", icon: "ti-user", label: "پروفایل من" },
                    { to: "/my-trips", icon: "ti-ticket", label: "سفرهای من" },
                    {
                      to: "/profile/wishlist",
                      icon: "ti-heart",
                      label: "علاقه‌مندی‌ها",
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <i className={`ti ${item.icon} text-gray-400`} />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <i className="ti ti-logout" />
                      خروج از حساب
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`text-sm font-bold px-4 py-2 rounded-xl transition ${isHome && !scrolled
                  ? "text-gray/90 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                ورود
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#ffbc1c] to-amber-500  text-sm font-bold text-slate-900 px-6 py-3 rounded-2xl hover:scale-105 transition shadow-sm shadow-blue-200"
              >
                ثبت‌نام
              </Link>
            </div>
          )}

          {/* منو موبایل */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden flex items-center justify-center transition ${isLoggedIn ? "w-9 h-9" : ""
              } ${isHome && !scrolled
                ? "text-white hover:bg-white/10"
                : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <i className={`ti ${mobileOpen ? "ti-x" : "ti-menu-2"} text-xl`} />
          </button>
        </div>
      </div>

      {/* منو موبایل */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <i className={`ti ${link.icon} text-gray-400`} />
              {link.label}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setContactOpen(true)} onMouseLeave={() => setContactOpen(false)}>
            <button
              className={`flex items-center text-sm gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${contactSubLinks.some(l => l.path === location.pathname)
                ? "bg-gray-50 text-[#a51c20]"
                : isHome && !scrolled
                  ? "text-gray-600 hover:bg-white/10 hover:text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <i className="ti ti-phone text-base" />
              تماس
              <i className={`ti ti-chevron-down text-sm transition-transform ${contactOpen ? "rotate-180" : ""}`} />
            </button>

            {contactOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {contactSubLinks.map(link => (
                  <Link key={link.path} to={link.path}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition">
                    <i className={`ti ${link.icon} text-base`} />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
