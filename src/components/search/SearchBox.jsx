import { useNavigate } from "react-router-dom";
import useSearchStore from "../../stores/searchStore";
import useFlightStore from "../../stores/flightStore";
import AirportInput from "./AirportInput";
import PassengerSelect from "./PassengerSelect";
import PersianDatePicker from "./PersianDatePicker";
import PersianRangePicker from "./PersianRangePicker";
import { useState } from "react";
import { airports } from "../../data/mockFlights";
import {
  Plane,
  Repeat,
  ArrowLeft,
  Users,
  Search,
  Split,
  Loader2,
  MapPinHouse,
  Hash,
  ArrowLeftRight,
  TicketCheck,
  TowerControl,
} from "lucide-react";

const TRIP_TYPES = [
  { value: "oneway", label: "یک‌طرفه", icon: Plane },
  { value: "roundtrip", label: "رفت و برگشت", icon: Repeat },
  { value: "ticketInquiry", label: "استعلام بلیط", icon: TicketCheck },
];

function SearchBox() {
  const navigate = useNavigate();
  const {
    tripType,
    setTripType,
    origin,
    setOrigin,
    destination,
    setDestination,
    departDate,
    setDepartDate,
    returnDate,
    setReturnDate,
    passengers,
    setPassengers,
    swapAirports,
  } = useSearchStore();

  const { searchFlights, loading } = useFlightStore();
  const [showPassenger, setShowPassenger] = useState(false);
  const [error, setError] = useState("");
  const [pnrCode, setPnrCode] = useState("");
  const totalPassengers =
    passengers.adult + passengers.child + passengers.infant;

const formatPersianDate = (date) => {
  if (!date) return null;

  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
};

  const handleSearch = async () => {
    if (tripType === "ticketInquiry") {
      if (!pnrCode.trim()) return setError("کد رزرو را وارد کنید");

      setError("");
      navigate(`/ticket/${pnrCode.trim()}`);
      return;
    }

    if (!origin) return setError("مبدا را انتخاب کنید");

    if (!destination) return setError("مقصد را انتخاب کنید");

    if (!departDate) return setError("تاریخ رفت را انتخاب کنید");
    if (tripType === "roundtrip" && !returnDate) {
      return setError("تاریخ برگشت را انتخاب کنید");
    }

    if (origin.code === destination.code)
      return setError("مبدا و مقصد نمی‌توانند یکسان باشند");

    setError("");

    const departStr = formatPersianDate(departDate);

    const returnStr = formatPersianDate(returnDate);

    await searchFlights({
      origin,
      destination,
      departDate: departStr,
      returnDate: returnStr,
      passengers,
      tripType,
    });

    navigate("/search");
  };
  return (
<div className="bg-white rounded-[32px] sm:rounded-[24px] shadow-[0_20px_80px_rgba(0,0,0,0.12)] border border-gray-100">
  {/* تب‌ها */}
  <div className="flex">
    {TRIP_TYPES.map((t, index) => {
      const Icon = t.icon;
      const isActive = tripType === t.value;
      const isFirst = index === 0;
      const isLast = index === TRIP_TYPES.length - 1;
      return (
        <button
          key={t.value}
          onClick={() => {
            setTripType(t.value);
            setError("");

            setDepartDate(null);
            setReturnDate(null);
          }}
          className={`
            flex flex-1 items-center justify-center gap-1.5 sm:gap-2 py-4.5 sm:py-3.5 text-xs sm:text-sm font-bold 
            transition-all duration-200 cursor-pointer select-none
            ${isFirst ? "rounded-tr-[28px] sm:rounded-tr-[22px]" : ""}
            ${isLast ? "rounded-tl-[28px] sm:rounded-tl-[22px]" : ""}
            ${
              isActive
                ? "bg-[#702e37] text-white"
                : "bg-gray-100 text-[#702e37] hover:bg-gray-200 hover:text-gray-700"
            }
          `}
        >
          <Icon size={15} strokeWidth={2} />
          {t.label}
        </button>
      );
    })}
  </div>

  {/* بدنه */}
  <div className="p-4 sm:p-7">
    {(tripType === "oneway" || tripType === "roundtrip") && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-end">
          {/* مبدا */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 cursor-default">
              <MapPinHouse size={14} className="text-slate-400" />
              مبدا
            </label>
            <AirportInput
              value={origin}
              onChange={setOrigin}
              placeholder="شهر یا فرودگاه"
              airports={airports}
            />
          </div>

          {/* swap */}
          <div className="flex justify-center md:col-span-1">
            <button
              onClick={swapAirports}
              className="w-10 h-10 rounded-full border-t border-gray-200 flex items-center justify-center
                hover:border-[#a51c20] hover:bg-red-50 transition-all duration-200 mt-2 sm:mt-6 cursor-pointer group"
            >
              <ArrowLeftRight
                size={16}
                className="text-gray-400 group-hover:text-[#a51c20] transition-colors"
              />
            </button>
          </div>

          {/* مقصد */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 cursor-default">
              <Split size={14} className="text-slate-400" />
              مقصد
            </label>
            <AirportInput
              value={destination}
              onChange={setDestination}
              placeholder="شهر یا فرودگاه"
              airports={airports}
            />
          </div>

          <div className="col-span-1 hidden md:block"></div>

          {/* تاریخ — یک‌طرفه */}
          {tripType === "oneway" && (
            <div className="md:col-span-3">
              <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 cursor-default">
                <ArrowLeft size={14} className="text-slate-400" />
                تاریخ رفت
              </label>
              <PersianDatePicker
                value={departDate}
                onChange={setDepartDate}
                placeholder="تاریخ رفت را انتخاب کنید"
              />
            </div>
          )}

          {/* تاریخ — رفت و برگشت */}
          {tripType === "roundtrip" && (
            <div className="md:col-span-3">
              <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 cursor-default">
                تاریخ رفت و برگشت
              </label>
              <PersianRangePicker
                departDate={departDate}
                returnDate={returnDate}
                onDepartChange={setDepartDate}
                onReturnChange={setReturnDate}
              />
            </div>
          )}
        </div>

        {/* مسافران + دکمه */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-between items-stretch sm:items-end">
          <div className="relative flex-1 sm:flex-none">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 cursor-default">
              <Users size={14} className="text-gray-600" />
              مسافران
            </label>
            <button
              onClick={() => setShowPassenger(!showPassenger)}
              className="w-full flex items-center gap-2 border border-gray-200 rounded-2xl sm:rounded-xl px-4 py-2.5 text-xs sm:text-sm
                hover:border-[#a51c20]/50 transition min-w-full sm:min-w-44 cursor-pointer"
            >
              <Users size={15} className="text-gray-700 flex-shrink-0" />
              <span className="font-medium text-gray-700">
                {totalPassengers} مسافر — اکونومی
              </span>
              <span className="text-gray-400 mr-auto text-xs">▾</span>
            </button>
            {showPassenger && (
              <div className="absolute top-full mt-2 z-50 w-full sm:w-auto">
                <PassengerSelect
                  passengers={passengers}
                  onChange={setPassengers}
                  onClose={() => setShowPassenger(false)}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffbc1c] to-amber-500 
            text-gray-900 font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-8 rounded-2xl sm:rounded-xl
            hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-200/50
            disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> جستجو...
              </>
            ) : (
              <>
                <Search size={16} /> جستجوی پرواز
              </>
            )}
          </button>
        </div>
      </>
    )}

    {/* استعلام بلیط */}
    {tripType === "ticketInquiry" && (
      <div className="py-2">
        <p className="text-xs sm:text-sm text-gray-700 mb-5 leading-relaxed">
          با وارد کردن کد رزرو (PNR) می‌توانید وضعیت بلیط خود را استعلام بگیرید.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 cursor-default">
              <Hash size={14} className="text-gray-300" />
              کد رزرو (PNR)
            </label>
            <input
              type="text"
              value={pnrCode}
              onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="مثال: ALV123456"
              maxLength={12}
              className="w-full border border-gray-200 rounded-2xl sm:rounded-xl px-4 py-3 text-xs sm:text-sm font-mono tracking-widest
                focus:outline-none focus:ring-2 focus:ring-[#a51c20]/30 focus:border-[#a51c20]
                transition placeholder:font-sans placeholder:tracking-normal uppercase"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!pnrCode.trim()}
            className="flex items-center justify-center gap-2 bg-[#a51c20] text-white font-bold text-xs sm:text-sm
              py-3 px-6 rounded-2xl sm:rounded-xl hover:bg-[#8a1518] transition shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Search size={16} />
            استعلام
          </button>
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl sm:rounded-xl p-3.5 flex items-start gap-2.5">
          <TicketCheck
            size={16}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-[11px] sm:text-xs text-amber-700 leading-relaxed">
            کد رزرو را می‌توانید در پیامک تأیید رزرو یا ایمیل دریافتی خود پیدا کنید.
          </p>
        </div>
      </div>
    )}
  </div>

  {/* خطا */}
  {error && (
    <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 border-t border-red-100 px-6 py-3 rounded-b-[32px]">
      <span>⚠️</span>
      {error}
    </div>
  )}
</div>
  );
}

export default SearchBox;
