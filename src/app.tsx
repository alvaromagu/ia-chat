import { AppProviders } from './hooks/app-providers'
import { Chat } from './components/chat'
import { Redirect, Route, Switch } from 'wouter'

export default function App() {
  return (
    <AppProviders>
      <div className='h-dvh flex flex-col bg-slate-100 dark:bg-zinc-950 dark:text-white font-onest'>
        <Switch>
          <Route path='/:id?' component={Chat} />
          <Route>
            <Redirect to='/' />
          </Route>
        </Switch>
      </div>
    </AppProviders>
  )
}
