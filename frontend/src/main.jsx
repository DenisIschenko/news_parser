import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const theme = createTheme({
    palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />  {/* додає базові стилі для коректного відображення */}
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
