import { ChatCompletionMessageParam } from '@mlc-ai/web-llm'
import { FormEvent, createContext, useContext, useEffect, useState } from 'react'
import { Chat, ChatPreview } from '../types/chat'
import { get, listPreview, remove, upsert } from '../services/chat'
import { useRoute } from 'wouter'
import { useEngine } from './use-engine'
import { parseForm } from '../utils/form'
import { chunksReader, getChuns } from '../utils/chunks-reader'

function useChat () {
  const [, params] = useRoute('/:id?')
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const [asideOpen, setAsideOpen] = useState(false)
  const { progress, engine } = useEngine()

  useEffect(() => {
    if (params?.id == null) {
      setChat(null)
      return
    }
    selectChat(params.id)
  }, [params?.id])

  useEffect(() => {
    listPreview().then(setChats)
  }, [])  

  async function handleSubmit (evt: FormEvent) {
    evt.preventDefault()
    if (engine == null) {
      return alert('Model not loaded, please wait')
    }
    const form = evt.target as HTMLFormElement
    const {message}: { message?: string } = parseForm(form)
    if (message == null || message.trim() === '') {
      return alert('Message cannot be empty')
    }
    form.reset()
    const engineMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: message
    }
    const messages = [...(chat?.messages ?? []), engineMessage]
    const chunks = await getChuns({ engine, messages })
    const replyId = crypto.randomUUID()
    const chatUpdated: Chat = {
      id: chat?.id ?? crypto.randomUUID(),
      messages: [
        ...chat?.messages ?? [],
        { ...engineMessage, id: crypto.randomUUID() },
        { id: replyId, role: 'assistant', content: '...' }
      ]
    }
    setChat(chatUpdated)
    await upsert(chatUpdated)
    if (chat?.id == null) {
      listPreview().then(setChats)
    }
    let chatState = chatUpdated
    for await (const buffer of chunksReader(chunks)) {
      chatState = {
        ...chatState,
        messages: chatState.messages.map(msg => {
          return msg.id === replyId ? { ...msg, content: buffer } : msg
        })
      }
      setChat(chatState)
    }
    await upsert(chatState)
  }

  async function selectChat (id: string) {
    const chat = await get(id)
    if (chat != null) {
      setChat(chat)
    }
  } 

  async function deleteChat (id: string) {
    await remove(id)
    listPreview().then(setChats)
    if (chat?.id === id) {
      setChat(null)
    }
  }

  return { chats, chat, progress, asideOpen, handleSubmit, setAsideOpen, selectChat, deleteChat }
}

type ChatState = ReturnType<typeof useChat>
const ChatContext = createContext<ChatState | null>(null)

export function useChatContext () {
  const chat = useContext(ChatContext)
  if (chat == null) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return chat
}

export function ChatProvider ({ children }: { children: React.ReactNode }) {
  const chat = useChat()
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}
