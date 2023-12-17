import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import MyAppBar from '../components/appBar/MyAppBar'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import { useState } from 'react'
import { UserProvider } from '../providers/UserContext'
 
export default function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: Infinity,
          },
        },
      }))
    
    return (
        <Box>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                  <UserProvider>
                    <MyAppBar children={undefined}/>
                    <Component {...pageProps} />
                    <ReactQueryDevtools initialIsOpen={false} />
                  </UserProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </Box>
        
    )
}