import { useEffect, useRef, useState, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5106'}/hubs/chat`

export function useChatConnection(visitorId) {
  const connectionRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('Open')

  useEffect(() => {
    if (!visitorId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
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
  }, [visitorId])

  const sendMessage = useCallback((text) => {
    if (!connectionRef.current || !conversationId) return
    connectionRef.current.invoke('SendMessage', conversationId, text)
  }, [conversationId])

  return { connected, conversationId, messages, status, sendMessage }
}