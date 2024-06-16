import { type Message } from '../types/message'
import { MessageContent } from './message-content'

export function Message ({
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
          <small className='px-2 pt-1 pb-1.5 bg-slate-300 dark:bg-zinc-800 w-min rounded-xl'>BOT</small>
        )}
        <div className='overflow-x-auto'>
          <MessageContent content={message.content} isUser={isUser} />
        </div>
      </div>
    </div>
  )
}
