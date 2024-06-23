import { memo, useEffect, useRef } from 'react'
import { Message } from './message'
import { useChatContext } from '../hooks/use-chat'

export const MessageList = memo(function MessageList () {
  const listRef = useRef<HTMLUListElement>(null)
  const {chat} = useChatContext()
  const messages = chat?.messages ?? []

  useEffect(() => {
    if (listRef.current != null) {      
      listRef.current.scrollTo(0, listRef.current.scrollHeight)
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <p className='text-gray-500'>New chat, no messages yet</p>
      </div>
    )
  }

  return (
    <ul 
      ref={listRef}
      className='flex flex-col flex-1 overflow-auto rounded p-2 gap-4 scroll-smooth bg-slate-200 dark:bg-zinc-900'
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