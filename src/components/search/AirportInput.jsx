import { useState, useRef, useEffect } from 'react'

function AirportInput({ value, onChange, placeholder, airports }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (value) setQuery(value.name)
    else setQuery('')
  }, [value])

  const filtered = query.length === 0
    ? airports.slice(0, 6)
    : airports.filter(a =>
        a.name.includes(query) ||
        a.nameEn?.toLowerCase().includes(query.toLowerCase()) ||
        a.code?.toLowerCase().includes(query.toLowerCase()) ||
        a.airport?.includes(query)
      ).slice(0, 6)

  const select = (airport) => {
    onChange(airport)
    setQuery(airport.name)
    setOpen(false)
  }

  const handleInput = (e) => {
    setQuery(e.target.value)
    onChange(null)
    setOpen(true)
  }

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all bg-white ${
        open ? 'border-gray-500 shadow-md shadow-blue-100' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <i className="ti ti-map-pin btext-gray-400 text-lg flex-shrink-0" />
        <input
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder-slat-700 bg-transparent min-w-0"
        />
        {value && (
          <span className="flex-shrink-0 text-xs bg-gray-100 btext-gray-700 font-black px-2 py-0.5 rounded-lg">
            {value.code}
          </span>
        )}
        {value && (
          <button onClick={() => { onChange(null); setQuery(''); setOpen(false) }}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition">
            <i className="ti ti-x text-sm" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1.5 w-full bg-white border border-gray-300 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          <div className="p-2">
            {filtered.map(airport => (
              <button
                key={airport.code}
                onMouseDown={(e) => { e.preventDefault(); select(airport) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-right group">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 transition">
                  <span className="btext-gray-700 font-black text-xs">{airport.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{airport.name}</p>
                  <p className="text-gray-400 text-xs truncate">{airport.airport}</p>
                </div>
                <i className="ti ti-plane-departure text-gray-300 group-hover:btext-gray-400 text-sm transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {open && filtered.length === 0 && query.length > 0 && (
        <div className="absolute top-full mt-1.5 w-full bg-white border border-gray-300 rounded-2xl shadow-xl z-[100] p-4 text-center">
          <i className="ti ti-search-off text-2xl text-gray-300 block mb-1" />
          <p className="text-sm text-gray-400">فرودگاهی یافت نشد</p>
        </div>
      )}
    </div>
  )
}

export default AirportInput