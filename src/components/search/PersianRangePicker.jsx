import { useRef, useState, useLayoutEffect } from "react";
import { Calendar as CalendarIcon, X, Check } from "lucide-react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

function PersianRangePicker({
  departDate,
  returnDate,
  onDepartChange,
  onReturnChange,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [measured, setMeasured] = useState(false);
  const wrapperRef = useRef(null);
  const popupRef = useRef(null);

  // بستن با کلیک بیرون
  useLayoutEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // محاسبه موقعیت + Zero-Flicker
  useLayoutEffect(() => {
    if (!open) {
      setMeasured(false);
      return;
    }

    let rafId;

    const calcPosition = () => {
      if (!wrapperRef.current || !popupRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const popupHeight = popupRef.current.offsetHeight || 360;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setPosition(
        spaceBelow < popupHeight && spaceAbove > spaceBelow ? "top" : "bottom"
      );
      setMeasured(true);
    };

    // requestAnimationFrame تا تقویم دو‌ماهه کامل mount/render شود
    rafId = requestAnimationFrame(calcPosition);

    const ro = new ResizeObserver(calcPosition);
    if (popupRef.current) ro.observe(popupRef.current);

    window.addEventListener("scroll", calcPosition, true);
    window.addEventListener("resize", calcPosition);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("scroll", calcPosition, true);
      window.removeEventListener("resize", calcPosition);
    };
  }, [open]);

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.year}/${String(date.month).padStart(2, "0")}/${String(
      date.day
    ).padStart(2, "0")}`;
  };

  // ساخت مقدار range برای تقویم
  const rangeValue = [];
  if (departDate)
    rangeValue.push(
      `${departDate.year}/${String(departDate.month).padStart(2, "0")}/${String(
        departDate.day
      ).padStart(2, "0")}`
    );
  if (returnDate)
    rangeValue.push(
      `${returnDate.year}/${String(returnDate.month).padStart(2, "0")}/${String(
        returnDate.day
      ).padStart(2, "0")}`
    );

  const handleChange = (dates) => {
    const [from, to] = dates || [];
    onDepartChange(
      from ? { year: from.year, month: from.month.number, day: from.day } : null
    );
    onReturnChange(
      to ? { year: to.year, month: to.month.number, day: to.day } : null
    );
  };

  const inputLabel = () => {
    if (!departDate) return "تاریخ رفت و برگشت";
    if (!returnDate) return `رفت: ${formatDate(departDate)}`;
    return `${formatDate(departDate)} — ${formatDate(returnDate)}`;
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          w-full flex items-center gap-2
          border border-gray-300 rounded-xl
          px-4 py-3 text-sm bg-white
          hover:border-[#a51c20]/40
          transition-all duration-200
        "
      >
        <CalendarIcon size={16} className="text-[#a51c20] shrink-0" />
        <span
          className={`flex-1 text-right font-medium ${
            departDate ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {inputLabel()}
        </span>
        {departDate && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDepartChange(null);
              onReturnChange(null);
            }}
            className="text-gray-300 hover:text-red-500 transition cursor-pointer"
          >
            <X size={15} />
          </span>
        )}
      </button>

      {open && (
        <div
          ref={popupRef}
          style={{
            visibility: measured ? "visible" : "hidden",
            opacity: measured ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
          className={`absolute z-50 right-0 bg-white rounded-2xl shadow-xl border border-gray-300 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <Calendar
            value={rangeValue}
            onChange={handleChange}
            range
            rangeHover
            numberOfMonths={2}
            calendar={persian}
            locale={persian_fa}
            weekStartDayIndex={6}
            minDate={
              rangeValue?.[0] && !rangeValue?.[1]
                ? rangeValue[0]
                : new DateObject({ calendar: persian })
            }
            className="rmdp-prime"
          />

          {/* نوار پایین: نمایش بازه + دکمه تأیید */}
          <div className="flex items-center justify-between bg-white gap-3 px-4 py-3 border-t border-gray-300">
            <span className="text-sm text-gray-500 font-black">
              {departDate && returnDate
                ? `${formatDate(departDate)} — ${formatDate(returnDate)}`
                : departDate
                ? `رفت: ${formatDate(departDate)} — انتخاب برگشت`
                : "بازه‌ای انتخاب نشده"}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={!departDate}
              className="
                flex items-center gap-1.5 bg-gray-700 text-white text-xs font-bold
                px-4 py-2 rounded-lg hover:bg-gray-600 transition
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
              "
            >
              <Check size={14} />
              تأیید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersianRangePicker;
