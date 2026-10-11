export const isValidPhone = (v) => /^09\d{9}$/.test(v); // دقیقاً ۱۱ رقم، شروع با 09

export const toJalaliString = (dateObj) => {
  if (!dateObj) return '';
  return `${dateObj.year}/${String(dateObj.month).padStart(2, '0')}/${String(dateObj.day).padStart(2, '0')}`;
};