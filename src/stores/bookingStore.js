import { create } from 'zustand'
import { bookingService, paymentService } from '../services/api'
import { trackEvent } from '../utils/analytics'

const priceFor = (flight, type) =>
  type === 'adult' ? flight.price.adult : type === 'child' ? flight.price.child : flight.price.infant

const useBookingStore = create((set, get) => ({
  step: 1,
  selectedFlight: null,
  passengers: [],
  contactInfo: { phone: '', email: '' },
  pnr: null,
  loading: false,
  error: null,

  setStep: (step) => set({ step }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight, step: 2 }),
  setPassengers: (passengers) => set({ passengers }),
  setContactInfo: (info) => set({ contactInfo: info }),

  // ۱) رزرو در نیرا (PNR)  ۲) شروع پرداخت  ۳) تأیید پرداخت ← صدور بلیت
  createBooking: async () => {
    const { selectedFlight, passengers, contactInfo } = get()
    if (!selectedFlight) return null

    set({ loading: true, error: null })
    try {
      // قیمت نهایی را سرور از نیرا می‌گیرد؛ این مقدار فقط برای تشخیص تغییر قیمت ارسال می‌شود
      const totalPrice = passengers.reduce((sum, p) => sum + priceFor(selectedFlight, p.type), 0)

      const dto = {
        flightId: selectedFlight.id,
        flightNumber: selectedFlight.flightNumber,
        origin: selectedFlight.departure.code,
        destination: selectedFlight.arrival.code,
        departureTime: selectedFlight.departure.time,
        arrivalTime: selectedFlight.arrival.time,
        airlineName: selectedFlight.airline.name,
        flightDate: selectedFlight.departure.date,
        totalPrice,
        passengers: passengers.map(p => ({
          firstName: p.firstName, lastName: p.lastName, nationalId: p.nationalId,
          birthDate: p.birthDate, gender: p.gender, type: p.type
        })),
        contact: contactInfo
      }

      const bookingRes = await bookingService.create(dto)
      const bookingId = bookingRes.data.id

      const init = await paymentService.initiate(bookingId)
      trackEvent('payment_initiated', { bookingId, amount: totalPrice, paymentMethod: 'online' })

      // درگاه پرداخت هنوز شبیه‌سازی است (PaymentSettings:AllowSimulated در بک‌اند).
      // با اتصال درگاه واقعی، این مرحله به صفحه‌ی بانک هدایت و verify از callback انجام می‌شود.
      const verifyRes = await paymentService.verify(init.data.paymentId, true)

      if (verifyRes.data.status !== 'Confirmed') {
        trackEvent('payment_failed', { reason: 'not_confirmed', bookingId })
        set({ loading: false, error: 'پرداخت ناموفق بود. لطفاً دوباره تلاش کنید' })
        return null
      }

      trackEvent('payment_completed', { pnr: verifyRes.data.pnr, amount: verifyRes.data.totalPrice })
      set({ pnr: verifyRes.data.pnr, step: 4, loading: false })
      return verifyRes.data.pnr
    } catch (err) {
      const message = err.response?.data?.message || 'خطا در ثبت رزرو. لطفاً دوباره تلاش کنید'
      trackEvent('payment_failed', { reason: message })
      set({ loading: false, error: message })
      return null
    }
  },

  reset: () => set({
    step: 1,
    selectedFlight: null,
    passengers: [],
    contactInfo: { phone: '', email: '' },
    pnr: null,
    error: null
  })
}))

export default useBookingStore
