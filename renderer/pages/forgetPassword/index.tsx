import { Box, ThemeProvider} from "@mui/material";
import theme from "../../themes/theme";
import ForgetPasswordForm from "./ForgetPasswordForm";

export default function Page() {
    return (
      <ThemeProvider theme={theme}>
        <ForgetPasswordForm/>
      </ThemeProvider>
    );
  }
  
