export const isValidPhone = (v) => /^09\d{9}$/.test(v); // دقیقاً ۱۱ رقم، شروع با 09

export const toJalaliString = (dateObj) => {
  if (!dateObj) return '';
  return `${dateObj.year}/${String(dateObj.month).padStart(2, '0')}/${String(dateObj.day).padStart(2, '0')}`;
};

// اعتبارسنجی کد ملی ایران (ارقام فارسی هم پذیرفته می‌شود)
export const isValidNationalCode = (value) => {
  const s = String(value ?? '').replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).trim()
  if (!/^\d{10}$/.test(s)) return false
  if (/^(\d)\1{9}$/.test(s)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(s[i]) * (10 - i)
  const r = sum % 11
  return r < 2 ? Number(s[9]) === r : Number(s[9]) === 11 - r
}

export const isLatinName = (v) => /^[A-Za-z][A-Za-z ]*$/.test(String(v ?? '').trim())
