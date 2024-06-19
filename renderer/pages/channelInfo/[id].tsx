import {
    Alert,
    Box,
    Button,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Rating,
    Snackbar,
    Typography,
} from "@mui/material";
import theme from "../../themes/theme";
import LanguageIcon from "@mui/icons-material/Language";
import DoneIcon from "@mui/icons-material/Done";
import {
    useCheckIfMember,
    useGetChannelInfoById,
} from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { useEffect, useState } from "react";
import {
    useGetPhotoByPath,
    useGetPhotoPathById,
} from "../../api/hooks/photo-hook";
import { useRouter } from "next/router";
import { useUserById } from "../../api/hooks/user-by-id-hook";
import { useCreateChannelRequests } from "../../api/hooks/request-hook";
import { response } from "express";

interface User {
    firstname: string;
    lastname: string;
    photoId: number | null;
}

export default function ChannelInfo() {
    const router = useRouter();
    const { id } = router.query; // Get the id from the URL
    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;
    const { mutate: getChannelInfoById, isLoading: getChannelInfoByIdLoading } =
        useGetChannelInfoById();
    const { mutate: getPhotoPathById, isLoading: getPhotoPathByIdLoading } =
        useGetPhotoPathById();
    const { mutate: getPhotoByPath, isLoading: getPhotoByPathLoading } =
        useGetPhotoByPath();
    const { mutate: createRequest } =
        useCreateChannelRequests();
    const { mutate: checkIfMember } = useCheckIfMember();
    const { userData, updateUser } = useUser();
    const [channelInfo, setChannelInfo] = useState<any>();
    const [photoPath, setPhotoPath] = useState<string>();
    const [status, setStatus] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [owner, setOwner] = useState<User>({
        firstname: "",
        lastname: "",
        photoId: 0,
    });
    const { mutate: getUserById } = useUserById();

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        setOpen(false);
    };

    const handleMessage = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        router.push(`/chats/${channelInfo.id}/channel`)
    };

    const handleRequest = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        createRequest(
            {
                jwt: userData.jwt,
                channelId: id as string
            },
            {
                onSuccess: (response) =>{
                    if(response.status === 201){
                        setRefresh((prev)=>!prev)
                    }
                }
            }
        )
    };

    useEffect(() => {
        if (typeof id === "string") {
            getChannelInfoById(
                { channelId: id, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            setChannelInfo(response.data.message);
                        } else {
                            setOpen(true);
                        }
                    },
                }
            );
        }
    }, [id]);

    useEffect(() => {
        if (channelInfo) {
            if (channelInfo.thumbnailId) {
                getPhotoPathById(
                    { photoId: channelInfo.thumbnailId, jwt: userData.jwt },
                    {
                        onSuccess: (response) => {
                            if (response.status === 201) {
                                var apiPath = response.data.message;
                                setPhotoPath(apiPath);
                            }
                        },
                    }
                );
            }
        }
    }, [channelInfo]);

    useEffect(() => {
        if (photoPath) {
            getPhotoByPath(
                { photoPath, jwt: userData.jwt },
                {
                    onSuccess: async (response) => {
                        if (response.status === 201) {
                            const url = await URL.createObjectURL(
                                response.data
                            );
                            setImageUrl(url);
                        } else {
                            setImageUrl(
                                "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                            );
                        }
                    },
                }
            );
        } else {
            setImageUrl(
                "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
            );
        }
    }, [photoPath]);

    useEffect(() => {
        if (channelInfo) {
            getUserById(
                {
                    jwt: userData.jwt,
                    ownerId: channelInfo.ownerId,
                },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            setOwner(response.data.message);
                        }
                    },
                }
            );
        }
    }, [channelInfo]);

    useEffect(() => {
        checkIfMember(
            { jwt: userData.jwt, channelId: id as string },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setStatus(response.data.message);
                    }
                },
            }
        );
    }, [refresh]);

    return (
        <Box sx={{ backgroundColor: secondaryColor }}>
            {channelInfo && (
                <>
                    <Typography
                        variant="h3"
                        sx={{
                            whiteSpace: "nowrap",
                            fontWeight: "600",
                            mb: "0.7rem",
                        }}
                    >
                        {channelInfo.title}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box fontWeight="fontWeightMedium" display="inline">
                            Description:{" "}
                        </Box>
                        {channelInfo.description}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box fontWeight="fontWeightMedium" display="inline">
                            Privacy Type:{" "}
                        </Box>
                        {channelInfo.private ? "private" : "public"}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box fontWeight="fontWeightMedium" display="inline">
                            Subscribers Count:{" "}
                        </Box>
                        {channelInfo.totalMembers}
                    </Typography>
                    <Typography sx={{ mb: "0.5rem" }}>
                        <Box
                            fontWeight="fontWeightMedium"
                            display="inline-block"
                        >
                            Created by:&nbsp;{" "}
                        </Box>
                        {owner.firstname + " " + owner.lastname}
                    </Typography>
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {imageUrl && (
                            <img
                                style={{
                                    width: "70%",
                                    height: "70%",
                                    marginBottom: "0.5rem",
                                }}
                                src={imageUrl}
                            />
                        )}
                        {status === "Not Member" && (
                            <Button
                                style={{
                                    padding: "0.5rem",
                                    width: "70%",
                                    backgroundColor: primaryColor,
                                    color: secondaryColor,
                                    marginBottom: "2rem",
                                }}
                                onClick={handleRequest}
                            >
                                Request Join
                            </Button>
                        )}
                        {status === "Member" && (
                            <Button
                                style={{
                                    padding: "0.5rem",
                                    width: "70%",
                                    backgroundColor: primaryColor,
                                    color: secondaryColor,
                                    marginBottom: "2rem",
                                }}
                                onClick={handleMessage}
                            >
                                Message
                            </Button>
                        )}
                        {status === "Pending" && (
                            <Button
                                variant="contained"
                                disabled
                                style={{
                                    padding: "0.5rem",
                                    width: "70%",
                                    marginBottom: "2rem",
                                }}
                            >
                                Pending
                            </Button>
                        )}
                    </Box>
                </>
            )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    Error loading the page
                </Alert>
            </Snackbar>
        </Box>
    );
}
