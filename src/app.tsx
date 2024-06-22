import { AppHeader } from './components/app-header'
import { AppFooter } from './components/app-footer'
import { AppProviders } from './hooks/app-providers'
import { Chat } from './components/chat'
import { Redirect, Route, Switch } from 'wouter'

export default function App() {
  return (
    <AppProviders>
      <div className='h-dvh flex flex-col bg-slate-100 dark:bg-zinc-950 dark:text-white font-onest'>
        <AppHeader />
          <Switch>
            <Route path='/:id?' component={Chat} />
            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
        <AppFooter />
      </div>
    </AppProviders>
  )
}
