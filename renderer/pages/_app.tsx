import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import MyAppBar from '../components/appBar/MyAppBar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
 
export default function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())
    
    return (
        <Box>
            <MyAppBar children={undefined}/>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </QueryClientProvider>
        </Box>
        
    )
}