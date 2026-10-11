import { create } from 'zustand'
import { authService } from '../services/api'
import { trackEvent } from '../utils/analytics'
const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: !!localStorage.getItem('alvand_access_token'),
  loading: true,

  login: async (email, password) => {
    const res = await authService.login({ email, password })
    const { accessToken, refreshToken, ...user } = res.data
    localStorage.setItem('alvand_access_token', accessToken)
    localStorage.setItem('alvand_refresh_token', refreshToken)
    set({ user, isLoggedIn: true })
    trackEvent('login')
    return res.data
  },

register: async (fullName, email, phone, password, otpVerificationToken) => {
  const res = await authService.register({ fullName, email, phone, password, otpVerificationToken })
  const { accessToken, refreshToken, ...user } = res.data
  localStorage.setItem('alvand_access_token', accessToken)
  localStorage.setItem('alvand_refresh_token', refreshToken)
  set({ user, isLoggedIn: true })
  trackEvent('register')
  return res.data
},

  logout: async () => {
    const refreshToken = localStorage.getItem('alvand_refresh_token')
    try {
      if (refreshToken) await authService.revokeToken(refreshToken)
    } catch { /* بی‌خیال خطا، فقط لوکال رو پاک کن */ }
    localStorage.removeItem('alvand_access_token')
    localStorage.removeItem('alvand_refresh_token')
    set({ user: null, isLoggedIn: false })
  },

  // موقع رفرش صفحه — چک کن user هنوز لاگین هست
  initAuth: async () => {
    const token = localStorage.getItem('alvand_access_token')
    if (!token) { set({ loading: false }); return }
    try {
      const res = await authService.getMe()
      set({ user: res.data, isLoggedIn: true, loading: false })
    } catch {
      // اگه access token منقضی بود، interceptor خودش refresh می‌کنه
      // اگه refresh هم fail شد، به /login میره
      set({ loading: false })
    }
  }
}))

export default useAuthStore