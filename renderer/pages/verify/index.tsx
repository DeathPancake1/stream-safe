import { Box, ThemeProvider } from "@mui/material";
import theme from "../../themes/theme";
import VerifyOtpForm from "./verifyOtpForm";
import { useRouter } from "next/router";

export default function Page() {
  
  const router = useRouter();
  const type  = router.query.type;
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
          }}
        >
          <VerifyOtpForm type={type} />
        </Box>
      </ThemeProvider>
    );
  }
  