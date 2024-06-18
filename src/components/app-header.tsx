import { useChatContext } from '../hooks/use-chat'

export function AppHeader () {
  const {setAsideOpen} = useChatContext()

  function handleAsideClick (evt: React.MouseEvent<HTMLElement>) {
    evt.stopPropagation()
    setAsideOpen(prev => !prev)
  }

  return (
    <header className='sticky bg-slate-200 dark:bg-zinc-900 p-5 top-0 flex justify-between md:justify-center'>
      <button 
        onClick={handleAsideClick}
      >
        <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M4 8l16 0' />
          <path d='M4 16l16 0' />
        </svg>
      </button>
      <h1 className='text-2xl'>IA CHAT</h1>
      <button>
        <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1' />
          <path d='M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z' />
          <path d='M16 5l3 3' />
        </svg>
      </button>
    </header>
  )
}