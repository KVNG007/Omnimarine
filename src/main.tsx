import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MaritimeDataProvider } from '@/data/MaritimeDataContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MaritimeDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MaritimeDataProvider>
  </StrictMode>,
)
