import { useEffect } from 'react'
import { useChatContext } from '../hooks/use-chat'

import { cn } from '../utils/cn'
import { Link } from 'wouter'

export function ChatAside () {
  const {isAsideOpen, setIsAsideOpen, chats, chat, deleteChat} = useChatContext()

  useEffect(() => {
    if (!isAsideOpen) return
    function handleClick () {
      setIsAsideOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isAsideOpen])

  return (
    <aside 
      onClick={evt => evt.stopPropagation()}
      className={`bg-slate-200 dark:bg-zinc-900 p-2 w-60 flex overflow-auto flex-col gap-2 max-md:shadow-2xl max-md:bg-slate-300 max-md:dark:bg-zinc-800 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-10 ${isAsideOpen ? 'max-md:animate-fade-in-right' : 'max-md:animate-fade-out-left'}`} 
    >
      <header className='flex items-center mb-4'>
        <h2 className='text-lg font-semibold flex-1'>Chats</h2>
        <Link
          href='/'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1' />
            <path d='M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z' />
            <path d='M16 5l3 3' />
          </svg>
        </Link>
      </header>
      <ul className='flex flex-col gap-2'>
        {chats.map((c) => (
          <li 
            key={c.id} 
            className={
              cn(
                'flex gap-2 p-2 bg-slate-300 dark:bg-zinc-800 max-md:bg-slate-200 max-md:dark:bg-zinc-900 rounded hover:bg-slate-400 dark:hover:bg-zinc-700 transition-colors',
                chat?.id === c.id && 'bg-slate-400 dark:bg-zinc-700'
              )
            }
          >
            <Link 
              href={`/${c.id}`}
              className='flex-1 text-nowrap text-ellipsis overflow-hidden'
            >
              {c.lastMessage}
            </Link>
            <button
              onClick={() => {
                deleteChat(c.id)
              }}
              className='hover:text-red-400'
            >
              <svg 
                xmlns='http://www.w3.org/2000/svg' 
                width={20} 
                height={20} 
                viewBox='0 0 24 24' 
                fill='none' 
                stroke='currentColor' 
                strokeWidth={2} 
                strokeLinecap='round' 
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M4 7l16 0' />
                <path d='M10 11l0 6' />
                <path d='M14 11l0 6' />
                <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
                <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}