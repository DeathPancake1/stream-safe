"use client"

import theme from "../../themes/theme";
import { AppBar, Box, Button, Link, ThemeProvider, Toolbar, Typography } from "@mui/material";

export default function MyAppBar(){
    return(
        <ThemeProvider theme={theme}>
            <AppBar position="static" elevation={0} color="transparent" sx={{ paddingLeft: '15%', paddingRight: '15%' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Stream Safe
                    </Typography>
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
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}