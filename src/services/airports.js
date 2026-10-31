import api from './api'
import { airports as fallback } from '../data/mockFlights'

let cache = null
let pending = null

// فرودگاه‌های فعال از دیتابیس؛ در صورت خطا فهرست ثابت (فقط برای اینکه فرم جستجو خالی نماند)
export function loadAirports() {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = api.get('/airports')
      .then(res => {
        const list = (res.data || []).map(a => ({
          code: a.iataCode,
          name: a.city,
          nameEn: a.cityEn,
          airport: a.name,
        })).filter(a => a.code)
        cache = list.length ? list : fallback
        return cache
      })
      .catch(() => { cache = fallback; return cache })
  }
  return pending
}

export const airportCityName = (list, code) =>
  (list || []).find(a => a.code === code)?.name || code
