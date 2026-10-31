import DateObject from 'react-date-object'
import gregorian from 'react-date-object/calendars/gregorian'
import persian from 'react-date-object/calendars/persian'

const faToEn = (s) =>
  String(s ?? '')
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632))

// DateObject شمسی (یا رشته‌ی شمسی 1405-08-07) → میلادی yyyy-MM-dd برای ارسال به نیرا
export function toGregorianISO(date) {
  if (!date) return ''
  if (typeof date === 'string') {
    const m = faToEn(date).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
    if (!m) return date
    const y = Number(m[1])
    if (y >= 1700) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
    return new DateObject({ calendar: persian, year: y, month: Number(m[2]), day: Number(m[3]) })
      .convert(gregorian).format('YYYY-MM-DD')
  }
  return new DateObject(date).convert(gregorian).format('YYYY-MM-DD')
}

// تاریخ تولد شمسی/میلادی تایپ‌شده → Date (یا null)
export function parseBirthDate(input) {
  const m = faToEn(input).trim().match(/^(\d{4})[-/.]?(\d{1,2})[-/.]?(\d{1,2})$/)
  if (!m) return null
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  try {
    const obj = y < 1700
      ? new DateObject({ calendar: persian, year: y, month: mo, day: d }).convert(gregorian)
      : new DateObject({ calendar: gregorian, year: y, month: mo, day: d })
    if (!obj.isValid) return null
    return new Date(obj.year, obj.month.number - 1, obj.day)
  } catch { return null }
}

export function ageAt(birth, onDate) {
  let age = onDate.getFullYear() - birth.getFullYear()
  const m = onDate.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && onDate.getDate() < birth.getDate())) age--
  return age
}

// میلادی yyyy-MM-dd → «۷ آبان ۱۴۰۵»
export function formatJalali(iso, withWeekday = false) {
  if (!iso) return ''
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`)
  if (isNaN(d)) return iso
  return d.toLocaleDateString('fa-IR-u-ca-persian', {
    year: 'numeric', month: 'long', day: 'numeric', ...(withWeekday ? { weekday: 'long' } : {})
  })
}

export const faNumber = (n) => Number(n || 0).toLocaleString('fa-IR')
