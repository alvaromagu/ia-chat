import { ReactNode } from 'react'

export function InlineCode({
  children
}: {
  children: ReactNode
}) {  
  return (
    <code className='bg-oneLight dark:bg-dracula rounded-md px-1 whitespace-normal'>
      {children}
    </code>
  )
}