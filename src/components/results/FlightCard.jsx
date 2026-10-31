import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../stores/bookingStore";
import {
  Plane,
  Briefcase,
  Check,
  X,
  Ticket,
  PlaneTakeoff,
  Settings2,
  Info,
} from "lucide-react";
import { trackEvent } from "../../utils/analytics";
import { faNumber, formatJalali } from "../../utils/dates";

const fmtBag = (raw) =>
  raw ? String(raw).replace(/(\d+)\s*KG/i, (_, n) => `${faNumber(n)} کیلوگرم`) : "";

// کلاس پیش‌فرض = ارزان‌ترین کلاس قابل فروش (همان که سرور در flight.class گذاشته)
function FlightCard({ flight, passengers }) {
  const navigate = useNavigate();
  const { setSelectedFlight } = useBookingStore();

  const classes = (flight.classes || []).filter((c) => c.available);
  const [classCode, setClassCode] = useState(flight.class);
  const cls = classes.find((c) => c.code === classCode) || classes[0];

  const adult = passengers?.adult || 1;
  const child = passengers?.child || 0;
  const infant = passengers?.infant || 0;

  const price = cls
    ? { adult: cls.adult, child: cls.child, infant: cls.infant }
    : flight.price;

  const totalPrice = price.adult * adult + price.child * child + price.infant * infant;
  const soldOut = flight.soldOut || !cls;

  const handleSelect = () => {
    if (soldOut) return;
    // شناسه‌ی پرواز با کلاس انتخاب‌شده (آخرین بخش id) ساخته می‌شود؛ رزرو و قیمت‌گذاری سمت سرور بر همین اساس است
    const idParts = String(flight.id).split("|");
    idParts[4] = cls.code;

    setSelectedFlight({
      ...flight,
      id: idParts.join("|"),
      class: cls.code,
      price,
      baggage: fmtBag(cls.baggage) || flight.baggage,
      refundable: cls.refundKnown ? cls.refundable : flight.refundable,
      refundKnown: cls.refundKnown,
      refundRules: cls.refundRules || [],
      capacity: { ...flight.capacity, available: cls.seats },
    });
    navigate("/passenger");
    trackEvent("view_flight", { flightId: flight.id, flightNumber: flight.flightNumber, price: price.adult, flightClass: cls.code });
    trackEvent("booking_started", { flightId: flight.id });
  };

  const seats = cls?.seats ?? 0;
  const capacityBadge = () => {
    if (soldOut) return { text: "ظرفیت تکمیل", color: "bg-gray-200 text-gray-600" };
    if (seats >= 10) return { text: "بیش از ۹ صندلی", color: "bg-zinc-200 text-emerald-700" };
    if (seats <= 5) return { text: `فقط ${faNumber(seats)} صندلی`, color: "bg-red-100 text-red-600" };
    return { text: `${faNumber(seats)} صندلی`, color: "bg-amber-100 text-amber-600" };
  };
  const badge = capacityBadge();
  const refundKnown = cls ? cls.refundKnown : flight.refundKnown;
  const refundable = cls ? cls.refundable : flight.refundable;
  const baggage = fmtBag(cls?.baggage) || flight.baggage;

  return (
    <div
      className={`flight-card bg-white rounded-l border border-gray-100 shadow-sm my-6 p-6 ${
        soldOut ? "opacity-70" : "hover:shadow-lg hover:border-blue-100 cursor-pointer"
      }`}
      onClick={handleSelect}
    >
      <div className="flex items-center gap-3 md:gap-6">
        {/* ایرلاین */}
        <div className="flex flex-col items-center gap-1.5 w-20 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-sm text-gray-700">
            {flight.airline.code}
          </div>
          <p className="text-xs text-gray-600 text-center leading-tight font-black">
            {flight.airline.name}
          </p>
        </div>

        {/* مسیر پرواز */}
        <div className="flex-1 flex items-center justify-center gap-3 md:gap-6">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              {flight.departure.time?.slice(0, 5)}
            </p>
            <p className="text-sm font-bold text-gray-600 mt-1">{flight.departure.city}</p>
            <p className="text-xs text-gray-400">{flight.departure.airport}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 min-w-20 max-w-40">
            <p className="text-xs text-gray-400 font-medium">{flight.duration}</p>
            <div className="w-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full border-2 border-blue-400 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-l from-blue-100 to-blue-200 relative">
                <Plane size={15} className="text-gray-500 absolute -top-[7px] left-1/2 -translate-x-1/2" />
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0 ? "بدون توقف" : `${flight.stops} توقف`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              {flight.arrival.time?.slice(0, 5)}
            </p>
            <p className="text-sm font-bold text-gray-600 mt-1">{flight.arrival.city}</p>
            <p className="text-xs text-gray-400">{flight.arrival.airport}</p>
          </div>
        </div>

        {/* اطلاعات اضافی */}
        <div className="hidden md:flex flex-col items-center gap-2 w-28 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.text}</span>
          {baggage && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Briefcase size={13} />
              {baggage}
            </div>
          )}
          {refundKnown &&
            (refundable ? (
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Check size={13} /> استرداد
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-red-700 font-medium">
                <X size={13} /> غیرقابل استرداد
              </div>
            ))}
        </div>

        {/* قیمت و دکمه */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-32">
          {soldOut ? (
            <p className="text-sm font-extrabold text-gray-400 my-3">—</p>
          ) : (
            <div className="text-left flex items-center">
              <p className="text-xl md:text-2xl font-extrabold my-3 mx-2 text-slate-700 leading-none">
                {faNumber(price.adult)}
              </p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">تومان</p>
            </div>
          )}
          <button
            disabled={soldOut}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffbc1c] to-amber-500
                  text-gray-900 font-bold text-sm py-3.5 px-8 rounded-xl
                  hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-200/50
                  cursor-pointer justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Ticket size={15} />
            <span className="mt-1">{soldOut ? "تکمیل ظرفیت" : "انتخاب"}</span>
          </button>
        </div>
      </div>

      {/* انتخاب کلاس پروازی (اگر بیش از یک کلاس قابل فروش باشد) */}
      {classes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
          <span className="text-xs text-gray-400">کلاس پروازی:</span>
          {classes.map((c) => (
            <button
              key={c.code}
              onClick={() => setClassCode(c.code)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                cls?.code === c.code
                  ? "border-amber-400 bg-amber-50 text-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {c.code} · {faNumber(c.adult)}
            </button>
          ))}
        </div>
      )}

      {/* ردیف پایینی */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <PlaneTakeoff size={13} />
            {faNumber(flight.flightNumber)}
          </span>
          {flight.aircraft && (
            <span className="flex items-center gap-1">
              <Settings2 size={13} />
              {flight.aircraft}
            </span>
          )}
          <span className="flex items-center gap-1">{formatJalali(flight.departure.date, true)}</span>
          {cls && (
            <span className="flex items-center gap-1" title="کلاس پروازی">
              <Info size={13} /> کلاس {cls.code}
            </span>
          )}
        </div>
        {!soldOut && totalPrice !== price.adult && (
          <p className="text-xs text-gray-500">
            جمع:{" "}
            <span className="font-black text-gray-700">{faNumber(totalPrice)} تومان</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default FlightCard;
