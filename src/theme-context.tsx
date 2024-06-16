import { CSSProperties, createContext, useContext, useEffect, useState } from 'react'
import { dark, light } from './syntax-hightlighter-theme'

type Theme = 'dark' | 'light'

type ThemeState = {
  theme: Theme
  syntaxHighlighterTheme: { [key: string]: CSSProperties }
}

const darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
const initialTheme: Theme = darkMedia.matches ? 'dark' : 'light'
const initialSyntaxHighlighterTheme = initialTheme === 'dark' ? dark : light
export const initialState: ThemeState = {
  theme: initialTheme,
  syntaxHighlighterTheme: initialSyntaxHighlighterTheme
}

function useTheme() {
  const [theme, setTheme] = useState(initialState)

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setTheme({
        theme: event.matches ? 'dark' : 'light',
        syntaxHighlighterTheme: event.matches ? dark : light
      })
    }
    darkMedia.addEventListener('change', listener)
    return () => {
      darkMedia.removeEventListener('change', listener)
    }
  }, [])

  return theme
}

const ThemeContext = createContext<ThemeState | null>(null)

export function useThemeContext() {
  const theme = useContext(ThemeContext)
  if (theme == null) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

