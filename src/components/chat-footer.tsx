import { useChatContext } from '../hooks/use-chat'

export function ChatFooter () {
  const {handleSubmit} = useChatContext()

  return (
  <footer className='bg-slate-200 dark:bg-zinc-900'>
    <form className='flex gap-2 py-2 px-2 max-w-3xl m-auto' onSubmit={handleSubmit}>
      <textarea
        name='message'
        className='w-full bg-slate-300 dark:bg-zinc-800 p-2 rounded resize-none field-content max-h-20'
        placeholder='Type a message...'
        required
      />
      <label
        className='p-2 bg-slate-300 dark:bg-zinc-800 rounded px-3 hover:dark:text-blue-400 transition-colors flex items-center justify-center cursor-pointer pointer-events-none opacity-60'
      >
        <svg xmlns='http://www.w3.org/2000/svg' 
          width={24} 
          height={24} 
          viewBox='0 0 24 24' 
          fill='none' 
          stroke='currentColor' 
          strokeWidth={2} 
          strokeLinecap='round' 
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5' />
        </svg>
        <input name='file' type='file' className='hidden' accept='image/*' />
      </label>
      <button
        type='submit'
        className='p-2 bg-slate-300 dark:bg-zinc-800 rounded px-3 hover:text-blue-800 hover:dark:text-blue-400 transition-colors'
      >
        <svg xmlns='http://www.w3.org/2000/svg' 
          width={24} 
          height={24} 
          viewBox='0 0 24 24' 
          fill='none' 
          stroke='currentColor' 
          strokeWidth={2} 
          strokeLinecap='round' 
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M10 14l11 -11' />
          <path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5' />
        </svg>
      </button>
    </form>
  </footer>
  )
}