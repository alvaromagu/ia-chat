import { AppHeader } from './components/app-header'
import { AppFooter } from './components/app-footer'
import { AppProviders } from './hooks/app-providers'
import { Chat } from './components/chat'

export default function App() {
  return (
    <AppProviders>
      <div className='h-dvh flex flex-col bg-slate-100 dark:bg-zinc-950 dark:text-white font-onest'>
        <AppHeader />
        <Chat />
        <AppFooter />
      </div>
    </AppProviders>
  )
}
