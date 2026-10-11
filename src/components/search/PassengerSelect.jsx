function PassengerSelect({ passengers, onChange, onClose }) {
  const types = [
    { key: 'adult', label: 'بزرگسال', desc: 'بالای ۱۲ سال', min: 1 },
    { key: 'child', label: 'کودک', desc: '۲ تا ۱۲ سال', min: 0 },
    { key: 'infant', label: 'نوزاد', desc: 'زیر ۲ سال', min: 0 },
  ]

  const update = (key, delta) => {
    const type = types.find(t => t.key === key)
    const newVal = passengers[key] + delta
    if (newVal < type.min) return
    if (key === 'infant' && newVal > passengers.adult) return
    onChange({ ...passengers, [key]: newVal })
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4 w-64">
      {types.map(type => (
        <div key={type.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
          <div>
            <p className="font-bold text-gray-800 text-sm">{type.label}</p>
            <p className="text-gray-400 text-xs">{type.desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => update(type.key, -1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold transition disabled:opacity-30"
              disabled={passengers[type.key] <= type.min}>
              −
            </button>
            <span className="w-5 text-center font-black text-gray-800">{passengers[type.key]}</span>
            <button onClick={() => update(type.key, 1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold transition">
              +
            </button>
          </div>
        </div>
      ))}
      <button onClick={onClose}
        className="w-full bg-gray-600 cursor-pointer text-white font-bold py-2.5 rounded-xl mt-3 hover:bg-gray-700 transition">
        تأیید
      </button>
    </div>
  )
}

export default PassengerSelect