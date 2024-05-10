import { Alert, Box, Button, Link, List, ListItem, ListItemIcon, ListItemText, Rating, Snackbar, Typography } from "@mui/material";
import theme from "../../themes/theme";
import LanguageIcon from '@mui/icons-material/Language';
import { autoUpdater } from "electron";
import DoneIcon from '@mui/icons-material/Done';
import { useGetChannelInfoById } from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { useEffect, useState } from "react";

export default function ChannelInfo({ id }) {
    const primaryColor = theme.palette.primary.main
    const secondaryColor = theme.palette.secondary.main
    const { mutate: getChannelInfoById, isLoading: getChannelInfoByIdLoading } = useGetChannelInfoById();
    const { userData, updateUser } = useUser()
    const [channelInfo, setChannelInfo] = useState<any>()
    const [open, setOpen] = useState<boolean>()
    const [mid,setMid] = useState<number>(0)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };


    useEffect(() => {
        getChannelInfoById({ channelId: id, jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        console.log(response)
                        setChannelInfo(response.data.message)
                    }
                    else {
                        setOpen(true)
                    }
                }
            })
    }, [id])

    useEffect(() => {
        console.log(channelInfo)
        if(channelInfo!=undefined){
            if (channelInfo.channelContent.length % 2 == 0) {
                setMid( channelInfo.channelContent.length / 2)
            }
            else setMid( channelInfo.channelContent.length / 2 + 1)
        }

    }, [channelInfo])
    return (

        <Box sx={{ backgroundColor: secondaryColor }}>
            {channelInfo!=undefined &&
                <>
                    <Typography variant="h3" sx={{ whiteSpace: "nowrap", fontWeight: "600", mb: "0.7rem" }} >
                        {channelInfo.title}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }} >
                        <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
                        {channelInfo.description}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: "0.5rem"
                    }}>
                        <Typography>
                            <Box fontWeight='fontWeightMedium' display='inline'>Rating: </Box>
                        </Typography>
                        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                    </Box>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box fontWeight='fontWeightMedium' display='inline-block'>Created by:&nbsp; </Box>
                        <Link href="#">Amongus Elmasry</Link>
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: "0.7rem"

                    }}>
                        <LanguageIcon />
                        <Typography>
                            {channelInfo.language}
                        </Typography>
                    </Box>
                    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center",width:"100%" }}>
                        <img style={{ width: "70%", height: "70%", marginBottom: "0.5rem" }} src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/01/Capstone_Course.jpeg.jpg" />
                        <Button style={{ padding: "0.5rem", width: "70%", backgroundColor: primaryColor, color: secondaryColor, marginBottom: "2rem" }}>Subscribe Now</Button>
                        <Box style={{ width: "70%", border: "2px solid #e8edea", borderRadius: "0.3rem" }}>
                            <Typography variant="h5" sx={{ fontWeight: "500", m: "1rem 1rem" }} >Channel content</Typography>
                            <Box style={{ display: "flex", justifyContent: "space-between", margin: "1rem" }}>
                                <Box style={{ flex: 1 }}>
                                    {
                                        channelInfo.channelContent.slice(0, mid).map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <DoneIcon />
                                                </ListItemIcon>
                                                <ListItemText >
                                                    <Typography sx={{ fontSize: "0.9rem" }}>
                                                        {item}
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    {channelInfo.channelContent.slice(mid, channelInfo.channelContent.length).map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <DoneIcon />
                                            </ListItemIcon>
                                            <ListItemText >
                                                <Typography sx={{ fontSize: "0.9rem" }}>
                                                    {item}
                                                </Typography>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </Box>
                            </Box>


                        </Box>
                    </Box>
                </>
            }
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Error loading the page</Alert>
            </Snackbar>
        </Box>

    )
}