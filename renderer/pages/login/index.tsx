"use client"
import { Box, ThemeProvider, Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import theme from "../../themes/theme";
import Welcome from "../../components/auth/Welcome";

export default function Page() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          marginTop: '5%'
        }}
      >
        <Welcome/>
        <LoginForm />
      </Box>
    </ThemeProvider>
  );
}
