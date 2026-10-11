import { create } from 'zustand'
import { flightService } from '../services/api'
import { mockFlights } from '../data/mockFlights'
import { trackEvent } from '../utils/analytics'

const useFlightStore = create((set, get) => ({
  flights: [],
  selectedFlight: null,
  loading: false,
  error: null,
  sortBy: 'price',
  filters: {
    type: 'all',
    maxPrice: 10000000,
    airlines: [],
    departTime: 'all'
  },

  searchFlights: async (params) => {
    set({ loading: true, error: null, flights: [] })
    try {
      const res = await flightService.search({
        origin: params.origin?.code || 'THR',
        destination: params.destination?.code || 'MHD',
        departDate: params.departDate || '',
        adultCount: params.passengers?.adult || 1,
        childCount: params.passengers?.child || 0,
        infantCount: params.passengers?.infant || 0,
        flightType: 'all'
      })
      set({ flights: res.data, loading: false })
      trackEvent('search_flight', {
        origin: params.origin?.code,
        destination: params.destination?.code,
        departDate: params.departDate,
        adultCount: params.passengers?.adult || 1,
        childCount: params.passengers?.child || 0,
        infantCount: params.passengers?.infant || 0
      })
    } catch (err) {
      console.warn('API unavailable, using mock data')
      await new Promise(r => setTimeout(r, 800))
      set({ flights: mockFlights, loading: false })
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

    if (filters.type !== 'all')
      result = result.filter(f => f.type === filters.type)
    if (filters.airlines.length > 0)
      result = result.filter(f => filters.airlines.includes(f.airline.name))
    result = result.filter(f => f.price.adult <= filters.maxPrice)

    if (sortBy === 'price') result.sort((a, b) => a.price.adult - b.price.adult)
    if (sortBy === 'time') result.sort((a, b) => a.departure.time.localeCompare(b.departure.time))
    if (sortBy === 'duration') result.sort((a, b) => a.durationMin - b.durationMin)

    return result
  }
}))

export default useFlightStore