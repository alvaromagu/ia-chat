import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { ChatAside } from './chat-aside'
import { ChatFooter } from './chat-footer'
import { MessageList } from './message-list'

export function Chat () {
  return (
    <div className='flex gap-2 p-2 flex-1 overflow-auto'>
      <ChatAside />
      <div className='flex flex-col gap-2 flex-1 overflow-auto'>
        <AppHeader />
        <main className='flex flex-col gap-2 flex-1 overflow-auto bg-slate-200 dark:bg-zinc-900'>
          <div className='overflow-y-auto flex-1'>
            <MessageList />
          </div>
          <ChatFooter />
        </main>
        <AppFooter />
      </div>
    </div>
  )
}