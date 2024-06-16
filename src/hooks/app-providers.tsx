import { ChatProvider } from './use-chat'
import { ThemeProvider } from './use-theme'

export function AppProviders ({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </ThemeProvider>
  )
}
