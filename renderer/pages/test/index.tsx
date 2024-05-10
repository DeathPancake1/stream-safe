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
          <SideBar childrenFunction={ChannelInfo({id:"1ec622a1-39bd-44c8-bbdf-28ec2779af0b"})}/>
        </Box>
      </ThemeProvider>
      )
    
}