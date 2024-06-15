import { FormEvent, ReactNode, Suspense, lazy, memo, useCallback, useEffect, useRef, useState } from 'react'
import { ChatCompletionMessageParam, CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { dracula } from './dracula'

type Message = ChatCompletionMessageParam & { id: string }
const model = 'Llama-3-8B-Instruct-q4f32_1-MLC'
const storedMessages = JSON.parse(localStorage.getItem('messages') ?? '[]') as Message[]

const LazyMarkdown = lazy(() => import('react-markdown'))
const LazySyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => ({ default: mod.Prism })))

function App() {
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [progress, setProgress] = useState('')
  const [messages, setMessages] = useState<Message[]>(storedMessages)

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
        { role: 'system', content: 'You are a helpful AI assistant. You answer in the language in which the question is written.' },
        ...messages,
        { role: 'user', content: message }
      ],
      stream: true
    })
    const replyId = crypto.randomUUID()
    setMessages(prev => {
      return [...prev, { id: replyId, role: 'assistant', content: '...' }]
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
    <div className='h-dvh flex flex-col dark:bg-zinc-950 dark:text-white font-onest'>
      <header className='sticky dark:bg-zinc-900 p-5 text-center top-0'>
        <h1 className='text-2xl'>IA CHAT</h1>
      </header>
      <main className='flex flex-col gap-2 flex-1 p-2 m-auto max-w-xl w-full relative overflow-y-auto'>
        <Chat messages={messages} />
        <footer>
          <form className='flex gap-2' onSubmit={handleSubmit}>
            <textarea
              name='message'
              className='w-full dark:bg-zinc-800 p-2 rounded resize-none field-content max-h-20'
              placeholder='Type a message...'
              required
            />
            <label
              className='p-2 dark:bg-zinc-800 rounded px-3 hover:dark:text-blue-400 transition-colors flex items-center justify-center cursor-pointer pointer-events-none opacity-60'
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
                <path d='M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5' />
              </svg>
              <input name='file' type='file' className='hidden' accept='image/*' />
            </label>
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

const Chat = memo(function Chat ({ messages}: { messages: Message[] }) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current != null) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight })
    }
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  return (
    <ul 
      ref={listRef}
      className='dark:bg-zinc-900 flex flex-col flex-1 overflow-y-auto rounded p-2 gap-4 scroll-smooth'
    >
      {messages.map((message) => {
        return (
          <li
            key={message.id}
          >
            <Message message={message} />
          </li>
        )
      })}
    </ul>
  )
})

function Message ({
  message
}: {
  message: Message
}) {  
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 ${
      isUser ? 'justify-end' : 'justify-start'
    }`}>
      <div className='flex items-start overflow-x-auto'>
        {!isUser && (
          <small className='px-2 pt-1 pb-1.5 dark:bg-zinc-800 w-min rounded-xl'>BOT</small>
        )}
        <div className='overflow-x-auto'>
          <MessageContent content={message.content} isUser={isUser} />
        </div>
      </div>
    </div>
  )
}

const MessageContent = memo(function MessageContent ({
  content,
  isUser
}: {
  content: Message['content']
  isUser: boolean
}) {
  if (content == null) {
    return null
  }

  const pClassName =  `px-3 rounded-lg ${
    isUser ? 'py-2 dark:bg-zinc-800 max-w-[40ch]' : ''
  }`

  if (typeof content === 'string') {
    return (
      <Suspense fallback={<SimpleMessageContent className={pClassName} content={content} />}>
        <LazyMarkdown
          className={pClassName}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            code ({className, children, node, ref, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return (
                match == null 
                  ?
                    <InlineCode>
                      {children}
                    </InlineCode>
                  : 
                    <LazySyntaxHighlighter
                      style={dracula}
                      language={match ? match[1] : ''}
                      PreTag='div'
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </LazySyntaxHighlighter>
              )
            }
          }}
        >
          {content}
        </LazyMarkdown>
      </Suspense>
    )
  }

  return (
    <div className={pClassName}>
      {content.map((line, index) => {
        const {type} = line
        if (type === 'text') {
          return (
            <MessageContent key={index} content={line.text} isUser={isUser} />
          )
        }

        return (
          <img key={index} src={line.image_url.url} />
        )
      })}
    </div>
  )
})

function InlineCode({
  children
}: {
  children: ReactNode
}) {  
  return (
    <code className='bg-dracula rounded-md p-1 whitespace-normal'>
      {children}
    </code>
  )
}

function SimpleMessageContent ({
  content,
  className
}: {
  content: string
  className: string
}) {
  return (
    <p className={className}>{content}</p>
  )
}

export default App
