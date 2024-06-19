import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import { UserProvider } from '../providers/UserContext'
import SideBar from '../components/sideBar/sideBar'
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [width, setWidth] = useState<number>(290);

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
    <Box sx={{height: "100%", p: 0, m: 0}}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <SideBar childrenFunction={undefined} width={width} setWidth={setWidth} />
            <Box sx={{ width: `calc(96% - ${width}px )`, ml: `calc(${width}px + 4%)`, height: "100%" }}>
              <Component {...pageProps} />
            </Box>
            
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Box>

  )
}