"use client"
import { Box, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
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
      <Typography variant="h4" noWrap component="div">
        Welcome to<br />
      </Typography>
      <Typography variant="h2" noWrap component="div">
        Stream Safe<br />
      </Typography>
      <Typography variant="h6" noWrap component="div">
        your gateway to secure content sharing
      </Typography>
      <LoginForm />
    </Box>
  );
}
