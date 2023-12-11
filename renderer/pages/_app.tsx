import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import MyAppBar from '../components/appBar/MyAppBar'
 
export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Box>
            <MyAppBar />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Box>
        
    )
}