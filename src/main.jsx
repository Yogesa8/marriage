import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/invite.css'
import './styles/splash.css'
import './styles/music.css'
import './styles/celebrations.css'
import './styles/perspective-tunnel.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
