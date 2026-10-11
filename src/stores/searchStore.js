import { create } from 'zustand'

const useSearchStore = create((set) => ({
  tripType: 'oneway',
  origin: null,
  destination: null,
  departDate: null,      // DateObject از persian calendar
  returnDate: null,      // DateObject از persian calendar
  passengers: { adult: 1, child: 0, infant: 0 },
  flightClass: 'economy',

  setTripType: (type) => set({ tripType: type }),
  setOrigin: (airport) => set({ origin: airport }),
  setDestination: (airport) => set({ destination: airport }),
  setDepartDate: (date) => set({ departDate: date }),
  setReturnDate: (date) => set({ returnDate: date }),
  setPassengers: (passengers) => set({ passengers }),
  swapAirports: () => set(state => ({
    origin: state.destination,
    destination: state.origin
  })),
}))

export default useSearchStore