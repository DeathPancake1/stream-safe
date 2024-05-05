import { Alert, Box, Button, Link, List, ListItem, ListItemIcon, ListItemText, Rating, Snackbar, Typography } from "@mui/material";
import theme from "../../themes/theme";
import LanguageIcon from '@mui/icons-material/Language';
import { autoUpdater } from "electron";
import DoneIcon from '@mui/icons-material/Done';
import { useGetChannelInfoById } from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { useState } from "react";

export default function ChannelInfo({id}){
    const primaryColor = theme.palette.primary.main
    const secondaryColor = theme.palette.secondary.main
    const { mutate: getChannelInfoById, isLoading: getChannelInfoByIdLoading } = useGetChannelInfoById();
    const {userData, updateUser}= useUser()
    const [channelInfo,setChannelInfo] = useState<any>()
    const [open, setOpen] = useState<boolean>()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };


    getChannelInfoById({channelId:id,jwt: userData.jwt},
        {
            onSuccess: (response) => {
                if (response.status === 200) {
                    setChannelInfo( response.data)
                    console.log(channelInfo)
                }
                else{
                    setOpen(true)
                }
            }
            })
    const items = ["German A1","German B2", "Ahmed Hossam","3ntil elmany","bee eins"]
    var mid = 0;
    if(items.length%2==0){
        mid = items.length/2
    }
    else mid = items.length/2 + 1
    return(
        <Box sx={{backgroundColor: secondaryColor}}>
             <Typography variant="h3" sx={{whiteSpace:"nowrap",fontWeight:"600", mb:"0.7rem"}} >
                German A1
            </Typography>
            <Typography sx={{ mb:"0.5rem"}} >
            <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
             This German language course is designed for beginners who wish to develop
             a strong foundation in speaking, reading, writing, and understanding German.
              Whether you're interested in traveling to German-speaking countries, expanding your cultural horizons,
               or enhancing your career prospects, this course will provide you with the fundamental skills to communic
               ate effectively in German.
            </Typography>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom:"0.5rem"
            }}>
                <Typography>
                    <Box fontWeight='fontWeightMedium' display='inline'>Rating: </Box>
                </Typography>
                <Rating  name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
            </div>
            <Typography sx={{ mb:"0.5rem"}}>
                <Box fontWeight='fontWeightMedium' display='inline-block'>Created by:&nbsp; </Box>
                <Link href="#">Amongus Elmasry</Link>
            </Typography>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom:"0.7rem"

            }}>
                <LanguageIcon />
                <Typography>
                    English
                </Typography>
            </div>
            <Box style= {{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <img style={{width:"70%",height:"70%", marginBottom: "0.5rem"}} src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/01/Capstone_Course.jpeg.jpg" />
                <Button style={{padding:"0.5rem" ,width:"70%", backgroundColor:primaryColor, color:secondaryColor,marginBottom: "2rem"}}>Subscribe Now</Button>
                <Box style={{ width: "70%",border: "2px solid #e8edea", borderRadius:"0.3rem" }}>
                    <Typography variant="h5" sx={{fontWeight:"500", m:"1rem 1rem"}} >Channel content</Typography>
                    <Box style={{display:"flex",justifyContent:"space-between", margin:"1rem"}}>
                        <Box style={{flex:1}}>
                            { 
                            items.slice(0, mid).map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <DoneIcon/>
                                    </ListItemIcon>
                                    <ListItemText >
                                        <Typography sx={{fontSize:"0.9rem"}}>
                                            {item}
                                        </Typography>    
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </Box>
                        <Box style={{flex:1}}>
                            {items.slice(mid, items.length).map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <DoneIcon/>
                                    </ListItemIcon>
                                    <ListItemText >
                                        <Typography sx={{fontSize:"0.9rem"}}>
                                            {item}
                                        </Typography>    
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </Box>
                    </Box>

                
                </Box>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Error loading the page</Alert>
            </Snackbar>
        </Box>
        
    )
}