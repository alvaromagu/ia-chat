import { CSSProperties } from 'react'
import { dracula, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const dark: { [key: string]: CSSProperties; } = {
  ...dracula,
  'code[class*="language-"]': {
    ...dracula['code[class*="language-"]'],
    fontFamily: undefined
  },
  'pre[class*="language-"]': {
    ...dracula['pre[class*="language-"]'],
    fontFamily: undefined
  }
}

export const light: { [key: string]: CSSProperties; } = {
  ...oneLight,
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    fontFamily: undefined
  },
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    fontFamily: undefined
  }
}