import { useEffect } from 'react'
import { useChatContext } from '../hooks/use-chat'
import { ChatFooter } from './chat-footer'
import { MessageList } from './message-list'

export function Chat () {
  const {asideOpen, setAsideOpen} = useChatContext()

  useEffect(() => {
    if (!asideOpen) return
    console.log(asideOpen)
    function handleClick () {
      setAsideOpen(false)
      console.log('click')
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [asideOpen])

  return (
    <div className='flex gap-2 p-2 overflow-auto'>
      <aside 
        onClick={evt => evt.stopPropagation()}
        className={`bg-slate-200 dark:bg-zinc-900 p-2 w-60 flex overflow-auto flex-col gap-2 max-md:transition-transform max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-10 ${asideOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`} 
      >
        <h2 className='text-lg font-semibold'>Chats</h2>
        <ul className='flex flex-col gap-2'>
          {Array.from({length: 100}).map((_, index) => (
            <li key={index} className='p-2 bg-slate-300 dark:bg-zinc-800 rounded hover:bg-slate-400 dark:hover:bg-zinc-700 transition-colors cursor-pointer'>
              Chat {index + 1}
            </li>
          ))}
        </ul>
      </aside>
      <main className='flex flex-col gap-2 flex-1 bg-slate-200 dark:bg-zinc-900 overflow-auto max-w-3xl mx-auto'>
        <MessageList />
        <ChatFooter />
      </main>
    </div>
  )
}