import { useRef, useState, useLayoutEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

function PersianDatePicker({ value, onChange, placeholder = "انتخاب تاریخ" }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("bottom"); // bottom | top
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

  // موقعیت‌دهی هوشمند
  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const popupHeight = popupRef.current?.offsetHeight || 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // اگر پایین جا نبود ولی بالا جا بود → بالا باز شود
    if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  }, [open]);

  const formatDate = (date) => {
    if (!date) return placeholder;
    return `${date.year}/${String(date.month).padStart(2, "0")}/${String(
      date.day
    ).padStart(2, "0")}`;
  };

  // تبدیل value (آبجکت ساده) به مقدار قابل فهم تقویم
  const calendarValue = value
    ? `${value.year}/${String(value.month).padStart(2, "0")}/${String(
        value.day
      ).padStart(2, "0")}`
    : "";

  const handleChange = (dateObject) => {
    if (!dateObject) {
      onChange(null);
      return;
    }
    onChange({
      year: dateObject.year,
      month: dateObject.month.number,
      day: dateObject.day,
    });
    setOpen(false); // در حالت تک‌تاریخ، بعد از انتخاب می‌بندیم
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
            value ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {formatDate(value)}
        </span>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
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
          className={`absolute z-50 right-0 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <Calendar
            value={calendarValue}
            onChange={handleChange}
            calendar={persian}
            locale={persian_fa}
             minDate={new DateObject({ calendar: persian })}
            className="rmdp-prime shadow-xl rounded-2xl border border-gray-300"
            weekStartDayIndex={6}
          />
        </div>
      )}
    </div>
  );
}

export default PersianDatePicker;
