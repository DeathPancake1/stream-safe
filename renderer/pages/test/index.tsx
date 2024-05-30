import { ThemeProvider } from "@emotion/react";
import theme from "../../themes/theme";
import { Box } from "@mui/material";
import SideBar from "../../components/sideBar/sideBar";
import ChannelInfo from "../../components/channelInfo/channelInfo";

export default function Test(){
    return (
        <ThemeProvider theme={theme}>
        <Box
          sx={{
            display:"flex",
            width: '100%',
            height: '100%',
            marginTop: '5%'
          }}
        >
          <SideBar childrenFunction={ChannelInfo({id:"d61e7a63-9363-4eae-b7e1-2619722889db"})}/>
        </Box>
      </ThemeProvider>
      )
    
}