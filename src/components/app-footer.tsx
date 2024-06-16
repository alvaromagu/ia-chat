import { useChatContext } from '../hooks/use-chat'

export function AppFooter () {
  const {progress} = useChatContext()

  return (
    <footer className='sticky bg-slate-200 dark:bg-zinc-900 p-2 text-center bottom-0'>
      <small>{progress ?? 'model loaded'}</small>
    </footer>
  )
}