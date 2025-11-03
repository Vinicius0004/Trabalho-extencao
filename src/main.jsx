import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.jsx'
import { store } from './redux/store.js'
import { initializeLocalStorage } from './utils/initDb.js'
import './styles/global.css'

initializeLocalStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
