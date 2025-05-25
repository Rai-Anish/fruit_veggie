import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import '@mantine/core/styles.css'
import { createTheme, MantineProvider } from '@mantine/core'
import { type MantineColorsTuple } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals' // Optional: If you use Mantine ModalsManager
import { Notifications } from '@mantine/notifications'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

const customColor: MantineColorsTuple = [
  '#e6ffee',
  '#d3f9e0',
  '#a8f2c0',
  '#7aea9f',
  '#54e382',
  '#3bdf70',
  '#2bdd66',
  '#1bc455',
  '#0bae4a',
  '#00973c',
]

const theme = createTheme({
  colors: {
    customColor,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>
)
