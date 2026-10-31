import axios from 'axios'

// 1. خواندن آدرس از فایل‌های .env یا استفاده از مسیر نسبی /api
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// ── Request Interceptor — اضافه کردن access token ──
api.interceptors.request.use(config => {
  const token = localStorage.getItem('alvand_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── جلوگیری از چندین refresh همزمان ──
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// ── Response Interceptor — اگر 401 بود refresh کن ──
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = localStorage.getItem('alvand_refresh_token')

      if (!refreshToken) {
        isRefreshing = false
        localStorage.removeItem('alvand_access_token')
        localStorage.removeItem('alvand_refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // اصلاح آدرس هاردکد شده: استفاده از api (یا baseURL) به‌جای localhost:5106
        const res = await api.post('/auth/refresh-token', {
          refreshToken
        })
        const { accessToken, refreshToken: newRefreshToken } = res.data
        localStorage.setItem('alvand_access_token', accessToken)
        localStorage.setItem('alvand_refresh_token', newRefreshToken)
        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('alvand_access_token')
        localStorage.removeItem('alvand_refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (dto) => api.post('/auth/login', dto),
  register: (dto) => api.post('/auth/register', dto),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  revokeToken: (refreshToken) => api.post('/auth/revoke-token', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (dto) => api.put('/auth/me', dto),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
}

export const flightService = {
  search: (dto) => api.post('/flights/search', dto),
  getById: (id) => api.get(`/flights/${id}`)
}

export const bookingService = {
  create: (dto) => api.post('/bookings', dto),
  getMyBookings: () => api.get('/bookings/my'),
  getByPnr: (pnr) => api.get(`/bookings/${pnr}`),
  cancel: (pnr) => api.post(`/bookings/${pnr}/cancel`),
  refundQuote: (pnr) => api.get(`/bookings/${pnr}/refund-quote`),
  // استعلام بدون ورود: PNR + نام خانوادگی مسافر (لاتین)
  lookup: (pnr, lastName) => api.get('/bookings/lookup', { params: { pnr, lastName } }),
}

export const blogService = {
  getAll: (params) => api.get('/blogposts', { params }),
  getBySlug: (slug) => api.get(`/blogposts/${slug}`),
  getRecent: (count = 3) => api.get(`/blogposts/recent?count=${count}`),
}

export const paymentService = {
  initiate: (bookingId) => api.post(`/payments/${bookingId}/initiate`),
  verify: (paymentId, success = true) => api.post('/payments/verify', { paymentId, success }),
}

export const feedbackService = {
  create: (dto) => api.post('/feedback', dto),
}

export const ticketService = {
  create: (dto) => api.post('/support-tickets', dto),
  getMyTickets: () => api.get('/support-tickets/my'),
  getById: (id) => api.get(`/support-tickets/${id}`),
  addMessage: (id, message) => api.post(`/support-tickets/${id}/messages`, { message }),
}

export const safetyFormService = {
  getTemplates: () => api.get('/safety-forms/templates'),
  createMandatory: (dto) => api.post('/safety-forms/mandatory', dto),
  createVoluntary: (dto) => api.post('/safety-forms/voluntary', dto),
  upload: (formData) => api.post('/safety-forms/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const analyticsService = {
  track: (payload) => api.post('/analytics/events', payload),
  getMyLoyalty: () => api.get('/analytics/loyalty/me'),
}

export const otpService = {
  send: (phone, purpose = 'Register') => api.post('/otp/send', { phone, purpose }),
  verify: (phone, code, purpose = 'Register') => api.post('/otp/verify', { phone, code, purpose }),
}
export const chatService = {
  getHistory: (visitorId) => api.get(`/chat/history/${visitorId}`),
}
export default api