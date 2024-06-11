import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
}

const model = 'Llama-3-8B-Instruct-q4f32_1-MLC'

function App() {
  const listRef = useRef<HTMLUListElement>(null)
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [progress, setProgress] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const worker = new Worker(
      new URL('./worker.ts', import.meta.url),
      {
        type: 'module'
      }
    );
    (async function () {
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
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    if (listRef.current != null) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight })
    }
  }, [messages])

  const handleSubmit = useCallback(async (evt: FormEvent) => {
    if (engine == null) {
      return alert('Model not loaded, please wait')
    }
    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    const formData = new FormData(form)
    const {message} = Object.fromEntries(formData) as { message?: string }
    if (message == null || message.trim() === '') {
      return alert('Message cannot be empty')
    }
    form.reset()
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: message
      }
    ])
    const chunks = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message }
      ],
      stream: true
    })
    const replyId = crypto.randomUUID()
    setMessages(prev => {
      return [...prev, { id: replyId, role: 'system', content: '...' }]
    })
    let replyContent = ''
    for await (const chunk of chunks) {
      const [choice] = chunk.choices
      const content = choice?.delta.content ?? ''
      replyContent += content
      setMessages(prev => {
        return prev.map(msg => {
          return msg.id === replyId ? { ...msg, content: replyContent } : msg
        })
      })
    }
  }, [engine, messages])

  return (
    <div className='h-dvh flex flex-col dark:bg-zinc-950 dark:text-white'>
      <header className='sticky dark:bg-zinc-900 p-5 text-center top-0'>
        <h1 className='text-2xl'>IA CHAT</h1>
      </header>
      <main className='flex flex-col gap-2 flex-1 p-2 m-auto max-w-xl w-full relative overflow-y-auto'>
        <ul 
          ref={listRef}
          className='dark:bg-zinc-900 flex flex-col flex-1 overflow-hidden overflow-y-auto rounded p-2 gap-4 scroll-smooth'
        >
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <li
                key={message.id}
                className={`flex gap-2 w-full ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className='flex items-start'>
                  {!isUser && (
                    <small className='px-2 pt-1 pb-1.5 dark:bg-zinc-800 w-min rounded-xl'>BOT</small>
                  )}
                  <p
                    className={`px-3 rounded-lg ${
                      isUser ? 'py-2 dark:bg-zinc-800 max-w-[40ch]' : ''
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
        <footer>
          <form className='flex gap-2' onSubmit={handleSubmit}>
            <textarea
              name='message'
              className='w-full dark:bg-zinc-800 p-2 rounded resize-none'
              placeholder='Type a message...'
              required
            />
            <button
              type='submit'
              className='p-2 dark:bg-zinc-800 rounded px-3 hover:dark:text-blue-400 transition-colors'
            >
              <svg xmlns='http://www.w3.org/2000/svg' 
                width={24} 
                height={24} 
                viewBox='0 0 24 24' 
                fill='none' 
                stroke='currentColor' 
                strokeWidth={2} 
                strokeLinecap='round' 
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M10 14l11 -11' />
                <path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5' />
              </svg>
            </button>
          </form>
        </footer>
      </main>
      <footer className='sticky dark:bg-zinc-900 p-2 text-center bottom-0'>
        <small>{progress ?? 'model loaded'}</small>
      </footer>
    </div>
  )
}

export default App
