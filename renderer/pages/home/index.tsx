import { Box, Divider } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import { useState } from "react";

export default function Home(){
    return (
      <Box sx={{display: 'flex', height: `calc(100vh - 80px)`}}>
        <MyDrawer />
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Chat firstname="Test" lastname="Test" email="email@test.com"/>
        </Box>
      </Box>
    )
}