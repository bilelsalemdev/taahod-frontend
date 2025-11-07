import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp } from 'antd'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { AnimationProvider } from './contexts/AnimationContext'
import { queryClient } from './config/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AnimationProvider>
        <AuthProvider>
          <LanguageProvider>
            <AntApp>
              <App />
            </AntApp>
          </LanguageProvider>
        </AuthProvider>
      </AnimationProvider>
    </QueryClientProvider>
  </StrictMode>,
)
