import { dracula as baseDracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

// remove font family from next keys:
// 'code[class*=\"language-\"]'
// 'pre[class*=\"language-\"]'
export const dracula: {
  [key: string]: React.CSSProperties
} = {
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