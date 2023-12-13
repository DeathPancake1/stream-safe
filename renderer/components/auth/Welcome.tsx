import { Box, Typography } from "@mui/material";

export default function Welcome(){
    return(
        <Box
            sx={{
                textAlign: 'center'
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
        </Box>
    )
}