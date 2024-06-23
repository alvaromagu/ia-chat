import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { ChatAside } from './chat-aside'
import { ChatFooter } from './chat-footer'
import { MessageList } from './message-list'

export function Chat () {
  return (
    <div className='flex gap-2 p-2 flex-1 overflow-auto'>
      <ChatAside />
      <main className='flex flex-col gap-2 flex-1 overflow-auto max-w-3xl mx-auto'>
        <AppHeader />
        <MessageList />
        <ChatFooter />
        <AppFooter />
      </main>
    </div>
  )
}