"use client"
import { Box, ThemeProvider, Typography } from "@mui/material";
import SignupForm from "./SignupForm";
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
        }}
      >
        <Welcome />
        <SignupForm />
      </Box>
    </ThemeProvider>
  );
}
