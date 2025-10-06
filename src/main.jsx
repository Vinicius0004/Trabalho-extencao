import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { NotificationsProvider } from './context/NotificationsContext.jsx'
import './styles/global.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>,
)
