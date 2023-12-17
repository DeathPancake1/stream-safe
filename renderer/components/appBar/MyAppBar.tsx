"use client"

import React, { useEffect, useState } from "react";
import theme from "../../themes/theme";
import { AppBar, Box, Button, Chip, Link, ThemeProvider, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import { Face, Logout } from '@mui/icons-material';
import secureLocalStorage from "react-secure-storage";
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children: React.ReactElement;
  }
  
  function ElevationScroll(props: Props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });
  
    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }

export default function MyAppBar(props: Props){
    const { userData, updateUser } = useUser();
    const router = useRouter()

    const logout = ()=>{
        secureLocalStorage.removeItem('jwt')
        updateUser('')
        router.push('/login')
        
    }
    return(
        <ThemeProvider theme={theme}>
            <ElevationScroll {...props}>
                {/*@ts-ignore*/}
                <AppBar position="sticky" elevation={0} color="white" sx={{ paddingLeft: { sm: '0%', md: '15%' }, paddingRight: { sm: '0%', md: '15%' } }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Stream Safe
                        </Typography>
                        {
                            userData.email === ''?
                            <Box>
                                <Link href="/login">
                                    <Button variant="text" sx={{ paddingLeft: '40px', paddingRight: '40px', textTransform: 'none' }}>
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="contained"  sx={{ paddingLeft: '40px', paddingRight: '40px', textTransform: 'none' }}>
                                        Sign up
                                    </Button>
                                </Link>
                            </Box>
                            :
                            <Box>
                                <Chip icon={<Face />} label={userData.email} deleteIcon={<Logout />} onDelete={logout}/>
                            </Box>
                        }
                        
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </ThemeProvider>
    )
}