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
      <div className='flex flex-1 items-center justify-center overflow-auto w-full max-w-3xl mx-auto'>
        <p className='text-gray-500'>New chat, no messages yet</p>
      </div>
    )
  }

  return (
    <ul 
      ref={listRef}
      className='flex flex-col flex-1 rounded p-2 gap-4 scroll-smooth overflow-auto w-full max-w-3xl mx-auto'
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