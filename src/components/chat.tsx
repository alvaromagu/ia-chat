import { ChatAside } from './chat-aside'
import { ChatFooter } from './chat-footer'
import { MessageList } from './message-list'

export function Chat () {
  return (
    <div className='flex gap-2 p-2 flex-1 overflow-auto'>
      <ChatAside />
      <main className='flex flex-col gap-2 flex-1 bg-slate-200 dark:bg-zinc-900 overflow-auto max-w-3xl mx-auto'>
        <MessageList />
        <ChatFooter />
      </main>
    </div>
  )
}