import { create } from 'zustand'
import { bookingService, paymentService } from '../services/api'
import { trackEvent } from '../utils/analytics'
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

createBooking: async () => {
  const { selectedFlight, passengers, contactInfo } = get()
  if (!selectedFlight) return null

  set({ loading: true, error: null })
  try {
    const dto = {
      flightNumber: selectedFlight.flightNumber,
      origin: selectedFlight.departure.city,
      destination: selectedFlight.arrival.city,
      departureTime: selectedFlight.departure.time,
      arrivalTime: selectedFlight.arrival.time,
      airlineName: selectedFlight.airline.name,
      flightDate: selectedFlight.departure.date,
      totalPrice: passengers.reduce((sum, p) => {
        if (p.type === 'adult') return sum + selectedFlight.price.adult
        if (p.type === 'child') return sum + selectedFlight.price.child
        return sum + selectedFlight.price.infant
      }, 0),
      passengers: passengers.map(p => ({
        firstName: p.firstName, lastName: p.lastName, nationalId: p.nationalId,
        birthDate: p.birthDate, gender: p.gender, type: p.type
      })),
      contact: contactInfo
    }

    const bookingRes = await bookingService.create(dto)
    const { id: bookingId, paymentId } = bookingRes.data

    await paymentService.initiate(bookingId)
    trackEvent('payment_initiated', { bookingId, amount: dto.totalPrice })

    const verifyRes = await paymentService.verify(paymentId, true)

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