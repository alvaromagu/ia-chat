import { CSSProperties } from 'react'
import { dracula as baseDracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const dracula: { [key: string]: CSSProperties; } = {
  ...baseDracula,
  'code[class*="language-"]': {
    ...baseDracula['code[class*="language-"]'],
    fontFamily: undefined
  },
  'pre[class*="language-"]': {
    ...baseDracula['pre[class*="language-"]'],
    fontFamily: undefined
  }
}