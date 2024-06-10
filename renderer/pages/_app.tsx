import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import MyAppBar from '../components/appBar/MyAppBar'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect, useState } from 'react'
import { UserProvider, useUser } from '../providers/UserContext'
import SideBar from '../components/sideBar/sideBar'

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
    <Box>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <SideBar childrenFunction={undefined} width={width} setWidth={setWidth} />
            <Box sx={{ width: `calc(96% - ${width}px )`, ml: `calc(${width}px + 4%)` }}>
              <Component {...pageProps} />
            </Box>
            
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Box>

  )
}