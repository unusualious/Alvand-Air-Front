import { analyticsService } from '../services/api'

const SESSION_KEY = 'alv_session_id'
const FLUSH_INTERVAL = 8000
const MAX_BATCH = 20

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

let queue = []
let flushTimer = null

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => { flushTimer = null; flush() }, FLUSH_INTERVAL)
}

function flush(useBeacon = false) {
  if (queue.length === 0) return
  const events = queue.splice(0, MAX_BATCH)
  const payload = { events }

  if (useBeacon && navigator.sendBeacon) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5106'}/api/analytics/events`
    navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  } else {
    analyticsService.track(payload).catch(() => {
      // شکست بی‌سروصدا — آنالیتیکس نباید تجربه‌ی کاربر رو مختل کنه
    })
  }
}

const VISITOR_KEY = 'alv_visitor_id'
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export function trackEvent(eventType, properties = {}) {
  queue.push({
    eventType,
    sessionId: getSessionId(),
    pageUrl: window.location.pathname,
    referrer: document.referrer || null,
    visitorId: getVisitorId(),
    properties
  })

  if (queue.length >= MAX_BATCH) flush()
  else scheduleFlush()
}

export function trackPageView(path) {
  trackEvent('page_view', { path })
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => flush(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })
}