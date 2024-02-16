import { Box, ThemeProvider } from "@mui/material";
import theme from "../../themes/theme";
import VerifyOtpForm from "./verifyOtpForm";

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
        </Box>
        <VerifyOtpForm/>
      </ThemeProvider>
    );
  }
  