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
                  <SyntaxHighlighter
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={syntaxHighlighterTheme as any}
                    language={match ? match[1] : ''}
                    PreTag='div'
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
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
