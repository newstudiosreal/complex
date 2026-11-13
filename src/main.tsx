import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { LockProvider } from './hooks/useLock'
import { NotifyProvider } from './hooks/useNotify'
import { SettingsProvider } from './hooks/useSettings'
createRoot(document.getElementById('root')!).render(<SettingsProvider><LockProvider><NotifyProvider><App/></NotifyProvider></LockProvider></SettingsProvider>)
