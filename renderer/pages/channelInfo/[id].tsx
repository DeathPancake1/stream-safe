import { Alert, Box, Button, Link, List, ListItem, ListItemIcon, ListItemText, Rating, Snackbar, Typography } from "@mui/material";
import theme from "../../themes/theme";
import LanguageIcon from '@mui/icons-material/Language';
import DoneIcon from '@mui/icons-material/Done';
import { useGetChannelInfoById } from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { useEffect, useState } from "react";
import { useGetPhotoByPath, useGetPhotoPathById } from "../../api/hooks/photo-hook";
import { useRouter } from 'next/router';

export default function ChannelInfo() {
    const router = useRouter();
    const { id } = router.query; // Get the id from the URL
    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;
    const { mutate: getChannelInfoById, isLoading: getChannelInfoByIdLoading } = useGetChannelInfoById();
    const { mutate: getPhotoPathById, isLoading: getPhotoPathByIdLoading } = useGetPhotoPathById();
    const { mutate: getPhotoByPath, isLoading: getPhotoByPathLoading } = useGetPhotoByPath();
    const { userData, updateUser } = useUser();
    const [channelInfo, setChannelInfo] = useState<any>();
    const [photoPath, setPhotoPath] = useState<string>();
    const [open, setOpen] = useState<boolean>();
    const [mid, setMid] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    useEffect(() => {
        if (typeof id === 'string') {
            getChannelInfoById({ channelId: id, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            setChannelInfo(response.data.message);
                        }
                        else {
                            setOpen(true);
                        }
                    }
                });
        }
    }, [id]);

    useEffect(() => {
        if (channelInfo) {
            if (channelInfo.thumbnailId) {
                getPhotoPathById({ photoId: channelInfo.thumbnailId, jwt: userData.jwt },
                    {
                        onSuccess: (response) => {
                            if (response.status === 201) {
                                var apiPath = response.data.message;
                                setPhotoPath(apiPath);
                            }
                        }
                    });
            }
            if (channelInfo.channelContent.length % 2 === 0) {
                setMid(channelInfo.channelContent.length / 2);
            } else {
                setMid(Math.ceil(channelInfo.channelContent.length / 2));
            }
        }
    }, [channelInfo]);

    useEffect(() => {
        if (photoPath) {
            getPhotoByPath({ photoPath, jwt: userData.jwt },
                {
                    onSuccess: async (response) => {
                        if (response.status === 201) {
                            const url = await URL.createObjectURL(response.data);
                            setImageUrl(url);
                        } else {
                            setImageUrl('https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');
                        }
                    }
                });
        } else {
            setImageUrl('https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');
        }
    }, [photoPath]);

    return (
        <Box sx={{ backgroundColor: secondaryColor }}>
            {channelInfo &&
                <>
                    <Typography variant="h3" sx={{ whiteSpace: "nowrap", fontWeight: "600", mb: "0.7rem" }} >
                        {channelInfo.title}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }} >
                        <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
                        {channelInfo.description}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box fontWeight='fontWeightMedium' display='inline-block'>Created by:&nbsp; </Box>
                        <Link href="#">Amongus Elmasry</Link>
                    </Typography>
                    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        {imageUrl &&
                            <img style={{ width: "70%", height: "70%", marginBottom: "0.5rem" }} src={imageUrl} />
                        }
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
    );
}
