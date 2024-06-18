import { memo, useEffect, useRef } from 'react'
import { Message } from './message'
import { useChatContext } from '../hooks/use-chat'

export const MessageList = memo(function MessageList () {
  const listRef = useRef<HTMLUListElement>(null)
  const {messages} = useChatContext()

  useEffect(() => {
    if (listRef.current != null) {      
      listRef.current.scrollTo(0, listRef.current.scrollHeight)
    }
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  return (
    <ul 
      ref={listRef}
      className='flex flex-col flex-1 overflow-auto rounded p-2 gap-4 scroll-smooth'
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