import { useEffect, useRef, useState, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5106'}/hubs/chat`

// فقط توکنِ منقضی‌نشده را می‌فرستیم؛ توکن منقضی باعث ۴۰۱ و قطع شدن کل چت می‌شد
function getValidToken() {
  const token = localStorage.getItem('alvand_access_token')
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && payload.exp * 1000 < Date.now()) return ''
  } catch {
    return ''
  }
  return token
}

// isLoggedIn: با لاگین/لاگ‌اوت اتصال دوباره برقرار می‌شود تا مکالمه به حساب کاربر وصل شود
export function useChatConnection(visitorId, isLoggedIn = false) {
  const connectionRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('Open')

  useEffect(() => {
    if (!visitorId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => getValidToken() })
      .withAutomaticReconnect()
      .build()

    connection.on('ConversationJoined', (id, convStatus) => {
      setConversationId(id)
      setStatus(convStatus)
    })
    connection.on('ReceiveMessage', (payload) => {
      setMessages(prev => [...prev, payload])
    })
    connection.on('ConversationClosed', () => setStatus('Closed'))

    connection.start()
      .then(() => {
        setConnected(true)
        connection.invoke('JoinConversation', visitorId)
      })
      .catch(() => setConnected(false))

    connectionRef.current = connection
    return () => { connection.stop() }
  }, [visitorId, isLoggedIn])

  const sendMessage = useCallback((text) => {
    if (!connectionRef.current || !conversationId) return
    connectionRef.current.invoke('SendMessage', conversationId, text)
  }, [conversationId])

  return { connected, conversationId, messages, status, sendMessage }
}