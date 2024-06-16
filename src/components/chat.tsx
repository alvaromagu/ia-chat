import { ChatFooter } from './chat-footer'
import { MessageList } from './message-list'

export function Chat () {
  return (
    <main className='flex flex-col gap-2 flex-1 p-2 m-auto max-w-xl w-full relative overflow-y-auto'>
      <MessageList />
      <ChatFooter />
    </main>
  )
}