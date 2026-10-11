import { useEffect, useState } from 'react'
import { ticketService } from '../../services/api'

const categoryLabels = { General: 'عمومی', Booking: 'رزرو', Payment: 'پرداخت', Technical: 'فنی' }
const statusConfig = {
  Open: { label: 'باز', color: 'bg-amber-100 text-amber-700' },
  Answered: { label: 'پاسخ داده شده', color: 'bg-blue-100 text-blue-700' },
  Closed: { label: 'بسته شده', color: 'bg-gray-100 text-gray-600' },
}

function TicketsTab() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ subject: '', category: 'General', priority: 'Normal', message: '' })
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await ticketService.getMyTickets()
      setTickets(res.data)
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const openTicket = async (id) => {
    setSelected(id)
    setDetail(null)
    try {
      const res = await ticketService.getById(id)
      setDetail(res.data)
    } catch {
      setDetail(null)
    }
  }

  const handleCreate = async () => {
    if (!form.subject || !form.message) return
    setSubmitting(true)
    try {
      await ticketService.create(form)
      setCreating(false)
      setForm({ subject: '', category: 'General', priority: 'Normal', message: '' })
      fetchTickets()
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return
    setSubmitting(true)
    try {
      await ticketService.addMessage(selected, replyText)
      setReplyText('')
      const res = await ticketService.getById(selected)
      setDetail(res.data)
      fetchTickets()
    } finally {
      setSubmitting(false)
    }
  }

  if (selected) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <button onClick={() => { setSelected(null); setDetail(null) }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <i className="ti ti-arrow-right" /> بازگشت به لیست تیکت‌ها
        </button>

        {!detail ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">{detail.subject}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[detail.status]?.color}`}>
                {statusConfig[detail.status]?.label}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-1">
              {detail.messages.map(m => (
                <div key={m.id} className={`flex ${m.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.isFromAdmin ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'
                  }`}>
                    <p className="leading-relaxed">{m.message}</p>
                    <p className={`text-[10px] mt-1 ${m.isFromAdmin ? 'text-gray-400' : 'text-blue-200'}`}>
                      {m.senderName} · {new Date(m.createdAt).toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {detail.status !== 'Closed' ? (
              <div className="flex items-end gap-2">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..." rows={2}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                <button onClick={handleReply} disabled={submitting || !replyText.trim()}
                  className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                  ارسال
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center">این تیکت بسته شده و امکان پاسخ وجود ندارد</p>
            )}
          </>
        )}
      </div>
    )
  }

  if (creating) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <button onClick={() => setCreating(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <i className="ti ti-arrow-right" /> انصراف
        </button>
        <h3 className="font-black text-gray-900 mb-4">تیکت جدید</h3>
        <div className="space-y-3">
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            placeholder="موضوع" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="Low">کم</option>
              <option value="Normal">عادی</option>
              <option value="High">فوری</option>
            </select>
          </div>
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="توضیحات..." rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          <button onClick={handleCreate} disabled={submitting || !form.subject || !form.message}
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
            {submitting ? 'در حال ثبت...' : 'ثبت تیکت'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-gray-900">تیکت‌های پشتیبانی</h2>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          <i className="ti ti-plus" /> تیکت جدید
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <i className="ti ti-headset text-4xl block mb-2" />
          هنوز تیکتی ثبت نکرده‌اید
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <button key={t.id} onClick={() => openTicket(t.id)}
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3 text-right">
              <div>
                <p className="font-bold text-gray-800 text-sm">{t.subject}</p>
                <p className="text-xs text-gray-400 mt-0.5">{categoryLabels[t.category]} · {new Date(t.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[t.status]?.color}`}>
                {statusConfig[t.status]?.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TicketsTab