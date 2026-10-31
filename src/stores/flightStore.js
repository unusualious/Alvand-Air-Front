import { create } from 'zustand'
import { flightService } from '../services/api'
import { trackEvent } from '../utils/analytics'
import { toGregorianISO } from '../utils/dates'

let lastRequest = 0

const DEFAULT_CAP = 10000000
const priceCapOf = (flights) => {
  const max = Math.max(0, ...flights.filter(f => !f.soldOut).map(f => f.price?.adult || 0))
  return Math.max(DEFAULT_CAP, Math.ceil(max / 1000000) * 1000000)
}

const hourOf = (f) => parseInt((f.departure?.time || '00:00').slice(0, 2), 10)

const useFlightStore = create((set, get) => ({
  flights: [],
  selectedFlight: null,
  loading: false,
  error: null,
  searched: false,
  priceCap: DEFAULT_CAP,
  sortBy: 'price',
  filters: {
    maxPrice: DEFAULT_CAP,
    airlines: [],
    departTime: 'all'
  },

  // داده‌ی واقعی از نیرا؛ در خطا دیگر به داده‌ی mock برنمی‌گردیم (کاربر باید خطای واقعی را ببیند)
  searchFlights: async (params) => {
    const requestId = ++lastRequest
    set({ loading: true, error: null, flights: [], searched: false })
    try {
      const departDate = toGregorianISO(params.departDate)
      const adultCount = params.passengers?.adult || 1
      const childCount = params.passengers?.child || 0
      const infantCount = params.passengers?.infant || 0

      const res = await flightService.search({
        origin: params.origin?.code,
        destination: params.destination?.code,
        departDate,
        adultCount,
        childCount,
        infantCount,
        flightType: 'all'
      })
      if (requestId !== lastRequest) return // جستجوی جدیدتری شروع شده

      const flights = Array.isArray(res.data) ? res.data : []
      const cap = priceCapOf(flights)
      set(state => ({
        flights,
        loading: false,
        searched: true,
        priceCap: cap,
        filters: { ...state.filters, maxPrice: cap, airlines: [], departTime: 'all' }
      }))
      trackEvent('search_flight', {
        origin: params.origin?.code,
        destination: params.destination?.code,
        departDate,
        adultCount, childCount, infantCount,
        resultCount: flights.length
      })
    } catch (err) {
      if (requestId !== lastRequest) return
      set({
        loading: false,
        searched: true,
        flights: [],
        error: err.response?.data?.message || 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.'
      })
    }
  },

  selectFlight: (flight) => set({ selectedFlight: flight }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilter: (key, value) => set(state => ({
    filters: { ...state.filters, [key]: value }
  })),

  getFilteredAndSorted: () => {
    const { flights, sortBy, filters } = get()
    let result = [...flights]

    if (filters.airlines.length > 0)
      result = result.filter(f => filters.airlines.includes(f.airline.name))

    if (filters.departTime && filters.departTime !== 'all') {
      const ranges = { morning: [6, 12], afternoon: [12, 18], evening: [18, 24], night: [0, 6] }
      const [from, to] = ranges[filters.departTime] || [0, 24]
      result = result.filter(f => { const h = hourOf(f); return h >= from && h < to })
    }

    result = result.filter(f => f.soldOut || f.price.adult <= filters.maxPrice)

    const cmp = {
      price: (a, b) => a.price.adult - b.price.adult,
      time: (a, b) => a.departure.time.localeCompare(b.departure.time),
      duration: (a, b) => a.durationMin - b.durationMin,
    }[sortBy] || (() => 0)

    // پروازهای «تکمیل ظرفیت» همیشه آخر لیست
    result.sort((a, b) => (a.soldOut === b.soldOut ? cmp(a, b) : a.soldOut ? 1 : -1))
    return result
  }
}))

export default useFlightStore
