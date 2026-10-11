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
} from "lucide-react";
import { trackEvent } from '../../utils/analytics'; 

function FlightCard({ flight, passengers }) {
  const navigate = useNavigate();
  const { setSelectedFlight } = useBookingStore();

  const totalPrice =
    flight.price.adult * (passengers?.adult || 1) +
    flight.price.child * (passengers?.child || 0) +
    flight.price.infant * (passengers?.infant || 0);

  const handleSelect = () => {
    setSelectedFlight(flight);
    navigate("/passenger");
    trackEvent('view_flight', { flightId: flight.id, flightNumber: flight.flightNumber, price: flight.price.adult });
    trackEvent('booking_started', { flightId: flight.id });
  };

  const capacityBadge = () => {
    if (flight.capacity.available <= 5)
      return {
        text: `فقط ${flight.capacity.available} صندلی`,
        color: "bg-red-100 text-red-600",
      };
    if (flight.capacity.available <= 15)
      return {
        text: `${flight.capacity.available} صندلی`,
        color: "bg-amber-100 text-amber-600",
      };
    return {
      text: `${flight.capacity.available} صندلی`,
      color: "bg-zinc-200 text-emerald-700",
    };
  };

  const badge = capacityBadge();

  return (
    <div
      className="flight-card bg-white rounded-l border border-gray-100 shadow-sm hover:shadow-lg my-6 hover:border-blue-100 p-6 cursor-pointer"
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
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              flight.type === "charter"
                ? "bg-rose-100 text-rose-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {flight.type === "charter" ? "چارتر" : "سیستمی"}
          </span>
        </div>

        {/* مسیر پرواز */}
        <div className="flex-1 flex items-center justify-center gap-3 md:gap-6">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              {flight.departure.time}
            </p>
            <p className="text-sm font-bold text-gray-600 mt-1">
              {flight.departure.city}
            </p>
            <p className="text-xs text-gray-400">{flight.departure.airport}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 min-w-20 max-w-40">
            <p className="text-xs text-gray-400 font-medium">
              {flight.duration}
            </p>
            <div className="w-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full border-2 border-blue-400 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-l from-blue-100 to-blue-200 relative">
                <Plane
                  size={15}
                  className="text-gray-500 absolute -top-[7px] left-1/2 -translate-x-1/2"
                />
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0 ? "بدون توقف" : `${flight.stops} توقف`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              {flight.arrival.time}
            </p>
            <p className="text-sm font-bold text-gray-600 mt-1">
              {flight.arrival.city}
            </p>
            <p className="text-xs text-gray-400">{flight.arrival.airport}</p>
          </div>
        </div>

        {/* اطلاعات اضافی */}
        <div className="hidden md:flex flex-col items-center gap-2 w-24 flex-shrink-0">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}
          >
            {badge.text}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Briefcase size={13} />
            {flight.baggage}
          </div>
          {flight.refundable ? (
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Check size={13} />
              استرداد
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-red-700 font-medium">
              <X size={13} />
              غیرقابل استرداد
            </div>
          )}
        </div>

        {/* قیمت و دکمه */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-32">
          <div className="text-left flex items-center">
            {(passengers?.adult || 1) + (passengers?.child || 0) > 1 && (
              <p className="text-xs text-gray-400 ">جمع کل هر نفر</p>
            )}
            <p className="text-xl md:text-2xl font-extrabold my-3 mx-2 text-slate-700 leading-none">
              {flight.price.adult.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">تومان</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffbc1c] to-amber-500  
                  text-gray-900 font-bold text-sm py-3.5 px-8 rounded-xl
                  hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-200/50
                  cursor-pointer justify-center gap-1.5"
          >
            <Ticket size={15} />
            <span className="mt-1">انتخاب</span>
          </button>
        </div>
      </div>

      {/* ردیف پایینی */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <PlaneTakeoff size={13} />
            {flight.flightNumber}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 size={13} />
            {flight.aircraft}
          </span>
          <span className="flex items-center gap-1 md:hidden">
            <Briefcase size={13} />
            {flight.baggage}
          </span>
        </div>
        {totalPrice !== flight.price.adult && (
          <p className="text-xs text-gray-500">
            جمع:{" "}
            <span className="font-black text-gray-700">
              {totalPrice.toLocaleString()} تومان
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default FlightCard;
