import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/ThemeProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
            <Toaster position="top-center" expand={false} richColors />
          </QueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
