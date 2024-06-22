import { ChatCompletionMessageParam, CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { FormEvent, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { systemMessage } from '../constants/system'
import { Chat } from '../types/chat'

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
  const [chat, setChat] = useState<Chat | null>(null)
  const [asideOpen, setAsideOpen] = useState(true)
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [progress, setProgress] = useState('-')

  useEffect(() => {
    let worker: Worker
    (async function () {
      const compatibility = await checkCompatibility()
      if (!compatibility.compatible) {
        setProgress(compatibility.message)
        return alert(compatibility.message)
      }
      worker = new Worker(
        new URL('../worker.ts', import.meta.url),
        {
          type: 'module'
        }
      )
      const engine = await CreateWebWorkerMLCEngine(
        worker,
        model,
        {
          initProgressCallback: (initProgress) => {
            setProgress(initProgress.text)
          }
        }
      )
      setEngine(engine)
    })()
    return () => {
      worker?.terminate()
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
    setChat(prev => {
      return {
        id: prev?.id ?? crypto.randomUUID(),
        messages: [
          ...prev?.messages ?? [],
          { ...engineMessage, id: crypto.randomUUID() },
          { id: replyId, role: 'assistant', content: '...' }
        ]
      }
    })
    let replyContent = ''
    for await (const chunk of chunks) {
      const [choice] = chunk.choices
      const content = choice?.delta.content ?? ''
      replyContent += content
      setChat(prev => {
        if (prev == null) {
          return null
        }
        return {
          ...prev,
          messages: prev.messages.map(msg => {
            return msg.id === replyId ? { ...msg, content: replyContent } : msg
          })
        }
      })
    }
  }, [engine, chat])

  return { messages: chat?.messages ?? [], progress, asideOpen, handleSubmit, setAsideOpen }
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
