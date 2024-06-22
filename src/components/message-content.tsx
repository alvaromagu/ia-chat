import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useThemeContext } from '../hooks/use-theme'
import { InlineCode } from './inline-code'
import { Message } from '../types/message'

export const MessageContent = memo(function MessageContent ({
  content,
  isUser
}: {
  content: Message['content']
  isUser: boolean
}) {
  const {syntaxHighlighterTheme} = useThemeContext()  

  if (content == null) {
    return null
  }

  const pClassName =  `px-3 rounded-lg ${
    isUser ? 'py-2 bg-slate-300 dark:bg-zinc-800 max-w-[40ch]' : ''
  }`

  if (typeof content === 'string') {
    return (
      <ReactMarkdown
        className={pClassName}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code ({className, children, node, ref, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return (
              match == null 
                ?
                  <InlineCode>
                    {children}
                  </InlineCode>
                : 
                  <>
                    <header className='relative'>
                      <button
                        className='absolute right-0 top-0 p-2'
                        onClick={() => navigator.clipboard.writeText(String(children))}
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' 
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
                          <path d='M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z' />
                          <path d='M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1' />
                        </svg>
                      </button>
                    </header>
                    <SyntaxHighlighter
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      style={syntaxHighlighterTheme as any}
                      language={match ? match[1] : ''}
                      PreTag='div'
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <div className={pClassName}>
      {content.map((line, index) => {
        const {type} = line
        if (type === 'text') {
          return (
            <MessageContent key={index} content={line.text} isUser={isUser} />
          )
        }

        return (
          <img key={index} src={line.image_url.url} />
        )
      })}
    </div>
  )
})
