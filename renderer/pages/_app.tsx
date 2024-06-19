import { Box, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../themes/theme'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState, useEffect } from 'react'
import { UserProvider } from '../providers/UserContext'
import SideBar from '../components/sideBar/sideBar'
import '../styles/globals.css';
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [width, setWidth] = useState<number>(290);
  const [contentStyle, setContentStyle] = useState({});
  const router = useRouter();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  }));

  useEffect(() => {
    const isAuthRoute = /^\/(login|signup|verify|resetPassword|forgetPassword)/.test(router.pathname);
    if (isAuthRoute) {
      setContentStyle({ width: '100%', marginLeft: '0' });
    } else {
      setContentStyle({ width: `calc(96% - ${width}px)`, marginLeft: `calc(${width}px + 4%)` });
    }
  }, [router.pathname, width]);

  return (
    <Box sx={{ height: "100%", p: 0, m: 0 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <SideBar childrenFunction={undefined} width={width} setWidth={setWidth} />
            <Box sx={{ ...contentStyle, height: "100%" }}>
              <Component {...pageProps} />
            </Box>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Box>
  )
}
