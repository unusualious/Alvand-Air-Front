import { useState, useRef, useEffect } from 'react'

function AirportInput({ value, onChange, placeholder, airports }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = airports.filter(a =>
    a.name.includes(query) ||
    a.nameEn.toLowerCase().includes(query.toLowerCase()) ||
    a.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6)

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (airport) => {
    onChange(airport)
    setQuery(airport.name)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 transition ${
        open ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
      }`}>
        <span className="text-gray-400">✈️</span>
        <input
          value={value ? value.name : query}
          onChange={e => { setQuery(e.target.value); onChange(null); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
        />
        {value && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
            {value.code}
          </span>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {filtered.map(airport => (
            <button key={airport.code} onClick={() => select(airport)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-right">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-black text-xs">{airport.code}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{airport.name}</p>
                <p className="text-gray-400 text-xs">{airport.airport}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AirportInput