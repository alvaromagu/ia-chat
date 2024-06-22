import { ChatCompletionMessageParam, CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { FormEvent, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { systemMessage } from '../constants/system'
import { Chat, ChatPreview } from '../types/chat'
import { get, list, remove, upsert } from '../services/chat'
import { useRoute } from 'wouter'

const model = 'Llama-3-8B-Instruct-q4f32_1-MLC'

type CompatibilityCheck = { compatible: true } | { compatible: false, message: string }

// check compatibility of WebGPU API
async function checkCompatibility(): Promise<CompatibilityCheck>{
  if (navigator.gpu == null) {
    return {
      compatible: false,
      message: 'WebGPU not supported'
    }
  }
  const adapter = await navigator.gpu.requestAdapter()
  if (adapter == null) {
    return {
      compatible: false,
      message: 'No GPU adapter found'
    }
  }
  const device = await adapter.requestDevice()
  if (device == null) {
    return {
      compatible: false,
      message: 'No GPU device found'
    }
  }
  return {
    compatible: true
  }
}

function useChat () {
  const [, params] = useRoute('/:id?')
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const [asideOpen, setAsideOpen] = useState(false)
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [progress, setProgress] = useState('-')

  function loadAndSetChats () {
    list()
      .then(chats => {
        return chats.map(chat => {
          let lastUserMessage = chat.messages.reverse().find(msg => msg.role === 'user')?.content ?? 'Chat started'
          if (typeof lastUserMessage === 'object') {
            lastUserMessage = 'Chat started'
          }
          return {
            id: chat.id,
            lastMessage: lastUserMessage
          }
        })
      })
      .then(setChats)
  }

  useEffect(() => {
    if (params?.id == null) {
      setChat(null)
      return
    }
    selectChat(params.id)
  }, [params?.id])

  useEffect(() => {
    loadAndSetChats()
  }, [])  

  useEffect(() => {
    let cleanup = false 
    const worker = new Worker(
      new URL('../worker.ts', import.meta.url),
      {
        type: 'module'
      }
    )
    let engine: WebWorkerMLCEngine | null = null;
    (async function () {
      const compatibility = await checkCompatibility()
      if (!compatibility.compatible) {
        setProgress(compatibility.message)
        worker.terminate()
        return alert(compatibility.message)
      }
      if (cleanup) {
        return
      }
      engine = await CreateWebWorkerMLCEngine(
        worker,
        model,
        {
          initProgressCallback: (initProgress) => {
            setProgress(initProgress.text)
          }
        }
      )
      if (cleanup) {
        engine.unload()
        return
      }
      setEngine(engine)
    })()
    return () => {
      cleanup = true
      worker.terminate()
      engine?.unload()
      setEngine(null)
    }
  }, [])

  const handleSubmit = useCallback(async (evt: FormEvent) => {
    evt.preventDefault()
    if (engine == null) {
      return alert('Model not loaded, please wait')
    }
    const form = evt.target as HTMLFormElement
    const formData = new FormData(form)
    const formObj = Object.fromEntries(formData) as { message?: string }
    const {message} = formObj
    if (message == null || message.trim() === '') {
      return alert('Message cannot be empty')
    }
    form.reset()
    const engineMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: message
    }
    const chunks = await engine.chat.completions.create({
      messages: [
        systemMessage,
        ...chat?.messages ?? [],
        engineMessage
      ],
      stream: true
    })
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
      .then(() => {
        if (chat?.id == null) {
          loadAndSetChats()
        }
      })
    let replyContent = ''
    let chatState = chatUpdated
    for await (const chunk of chunks) {
      const [choice] = chunk.choices
      const content = choice?.delta.content ?? ''
      replyContent += content
      setChat(prev => {
        if (prev == null) {
          return null
        }
        const newChatState: Chat = {
          ...prev,
          messages: prev.messages.map(msg => {
            return msg.id === replyId ? { ...msg, content: replyContent } : msg
          })
        }
        chatState = newChatState
        return newChatState
      })
    }
    await upsert(chatState)
  }, [engine, chat])

  async function selectChat (id: string) {
    const chat = await get(id)
    if (chat != null) {
      setChat(chat)
    }
  } 

  async function deleteChat (id: string) {
    await remove(id)
      .then(loadAndSetChats)
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
