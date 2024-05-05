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
          <SideBar childrenFunction={ChannelInfo({id:"febad3be-c9a4-495f-b879-a1e1ebfbb57f"})}/>
        </Box>
      </ThemeProvider>
      )
    
}