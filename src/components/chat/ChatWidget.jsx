import { useEffect, useState } from 'react'
import { useChatConnection } from '../../hooks/useChatConnection'
import { chatService } from '../../services/api'
import useAuthStore from '../../stores/authStore'

const VISITOR_KEY = 'alv_visitor_id'
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}
const QUICK_EMOJIS = ['😊', '👍', '🙏', '✈️', '❤️', '😢', '🎉', '👌', '🤔', '😅', '🔥', '💯']
const FAQ_ITEMS = [
  { q: 'چطور بلیط رزرو کنم؟', a: 'از صفحه‌ی اصلی، مبدا/مقصد/تاریخ رو انتخاب کن، پرواز موردنظر رو انتخاب و مراحل رزرو رو تا پرداخت طی کن. ✈️' },
  { q: 'چطور رزروم رو کنسل کنم؟', a: 'از پروفایل ← تب «سفرهای من»، کنار همون رزرو دکمه‌ی «کنسل رزرو» رو بزن. 🎫' },
  { q: 'بازپرداخت چقدر طول می‌کشه؟', a: 'معمولاً بین ۳ تا ۷ روز کاری، بسته به بانک شما. 💳' },
  { q: 'ساعت کاری پشتیبانی چیه؟', a: 'هر روز از ۸ صبح تا ۲۴ در خدمتتونیم. 🕐' },
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('faq') // faq | live
  const [visitorId] = useState(getVisitorId)
  const [localMessages, setLocalMessages] = useState([])
  const [history, setHistory] = useState([])
  const [historyLoaded, setHistoryLoaded] = useState(false)

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { connected, messages, status, sendMessage } = useChatConnection(mode === 'live' ? visitorId : null, isLoggedIn)

  useEffect(() => {
    if (!open || historyLoaded) return
    chatService.getHistory(visitorId)
      .then(res => {
        setHistory(res.data.messages || [])
        if ((res.data.messages || []).length > 0) setMode('live')
        setHistoryLoaded(true)
      })
      .catch(() => setHistoryLoaded(true))
  }, [open])

  const allMessages = mode === 'live' ? [...history, ...messages] : localMessages

  const handleFaqClick = (item) => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'q' + Date.now(), message: item.q, isFromAdmin: false },
      { id: 'a' + Date.now(), message: item.a, isFromAdmin: true },
    ])
  }

  return (
    <div className="fixed bottom-5 right-5 z-50" dir="rtl">
      {open ? (
<div className="w-[360px] h-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/40 bg-white/30 backdrop-blur-3xl flex flex-col ring-1 ring-white/20">         
<div className="bg-gradient-to-l from-blue-600/70 to-indigo-700/70 backdrop-blur-xl text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">✈️</div>
              <div>
                <p className="font-black text-sm">پشتیبانی الوند</p>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> آنلاین
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm">
            {allMessages.length === 0 && (
              <div className="text-center text-xs text-gray-500 mt-6">👋 سلام! چطور می‌تونم کمکتون کنم؟</div>
            )}

            {allMessages.map((m, i) => (
              <div key={m.id || i} className={`flex ${m.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.isFromAdmin ? 'bg-white/90 text-gray-800 rounded-bl-sm' : 'bg-blue-600 text-white rounded-br-sm'
                }`}>
                  {m.message}
                </div>
              </div>
            ))}

            {mode === 'faq' && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] text-gray-500 px-1">سوالات پرتکرار:</p>
                {FAQ_ITEMS.map((item, i) => (
                  <button key={i} onClick={() => handleFaqClick(item)}
                    className="w-full text-right text-xs bg-white/70 hover:bg-white text-gray-700 px-3 py-2 rounded-xl transition shadow-sm">
                    {item.q}
                  </button>
                ))}
                <button onClick={() => setMode('live')}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-xl transition mt-2">
                  💬 گفتگوی زنده با پشتیبانی
                </button>
              </div>
            )}

            {mode === 'live' && status === 'Closed' && (
              <div className="text-center text-xs text-gray-500 bg-white/70 rounded-xl py-2">
                این گفتگو توسط پشتیبانی بسته شده است.
              </div>
            )}
          </div>

          {mode === 'live' && status !== 'Closed' && <ChatInput onSend={sendMessage} connected={connected} />}
        </div>
      ) : (
        <button onClick={() => setOpen(true)}
  className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-900/30 flex items-center justify-center text-2xl text-white hover:scale-105 transition-transform">          💬
        </button>
      )}
    </div>
  )
}

function ChatInput({ onSend, connected }) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
    setShowEmoji(false)
  }

  return (
    <div className="relative">
      {showEmoji && (
        <div className="absolute bottom-full mb-2 right-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-2.5 grid grid-cols-6 gap-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => { setText(t => t + emoji); setShowEmoji(false) }}
              className="text-xl hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 p-2.5 bg-white/60 backdrop-blur-md border-t border-white/40">
        <button
          onClick={() => setShowEmoji(s => !s)}
          className="w-9 h-9 shrink-0 flex items-center justify-center text-lg rounded-full hover:bg-white/60 transition"
        >
          😊
        </button>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={connected ? 'پیام خود را بنویسید...' : 'در حال اتصال...'}
          disabled={!connected}
          className="flex-1 bg-white/80 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />
        <button onClick={handleSend} disabled={!connected || !text.trim()}
          className="w-9 h-9 shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-blue-700 transition">
          ➤
        </button>
      </div>
    </div>
  )
}

export default ChatWidget