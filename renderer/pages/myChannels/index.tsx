import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

export default function myChannels() {
    const [registeredOrOwned, setRegisteredOrOwned] = useState<boolean>(false)
    
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: '600' }} >My Channels</Typography>
            <Tabs value={registeredOrOwned?1:0} onChange={()=>setRegisteredOrOwned((prevValue)=>(!prevValue))}>
                <Tab label="Registered"  />
                <Tab label="Owned"  />
            </Tabs>
        </Box>
    )
}