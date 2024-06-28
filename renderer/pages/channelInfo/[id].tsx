import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    Rating,
    Snackbar,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../themes/theme";
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
import { ChatTypeEnum } from "../../types/chat-type-enum";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    const { mutate: createRequest } = useCreateChannelRequests();
    const { mutate: checkIfMember } = useCheckIfMember();
    const { userData, updateUser } = useUser();
    const [channelInfo, setChannelInfo] = useState<any>();
    const [photoPath, setPhotoPath] = useState<string>();
    const [status, setStatus] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
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
        router.push(`/chats/${channelInfo.id}/${ChatTypeEnum.channel}`);
    };

    const handleRequest = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        createRequest(
            {
                jwt: userData.jwt,
                channelId: id as string,
            },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setRefresh((prev) => !prev);
                    }
                },
            }
        );
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

    const handleBack = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        router.back()
    };

    return (
        <Box>
            <Button
                onClick={handleBack}
                size="large"
                sx={{
                    zIndex: 2002,
                    position: "fixed",
                    top: 4,
                    right: 4,
                    padding: "4px",
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background color to black
                    color: 'common.white', // Use Material-UI's common white color
                    '&:hover': { // Target the hover state
                        color: '#000', // Set text color to black on hover
                    },
                }}
            >
                <ArrowBackIcon sx={{ width: 25, height: 25 }} />  {/* Ensure white icon */}
                <Typography variant="body1" sx={{ marginLeft: '8px', marginRight: '8px' }}>back</Typography>
            </Button>
            <Box sx={{ backgroundColor: secondaryColor, padding: "1rem" }}>
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
                        <Divider></Divider>
                        <Box>
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
                        </Box>
                        <Box
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Box sx={{
                                width: "70%", maxHeight: "500px", marginBottom: '10px'
                            }}>
                                <Box sx={{
                                    width: 'fit-content',
                                    height: 'fit-content',
                                    margin: 'auto'
                                }}>
                                    {imageUrl && (
                                        <img
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "500px",
                                                marginBottom: "0.5rem",
                                                objectFit: "contain" // Maintain aspect ratio
                                            }}
                                            src={imageUrl}
                                        />
                                    )}
                                </Box>
                                {status === "Not Member" && (
                                    <Button
                                        style={{
                                            padding: "0.5rem",
                                            backgroundColor: primaryColor,
                                            color: secondaryColor,
                                            marginBottom: "2rem",
                                            margin: 'auto'
                                        }}
                                        fullWidth
                                        onClick={handleRequest}
                                    >
                                        Request Join
                                    </Button>
                                )}
                                {status === "Member" && (
                                    <Button
                                        style={{
                                            padding: "0.5rem",
                                            backgroundColor: primaryColor,
                                            color: secondaryColor,
                                            marginBottom: "2rem",
                                            margin: 'auto'
                                        }}
                                        onClick={handleMessage}
                                        fullWidth
                                    >
                                        See Content
                                    </Button>
                                )}
                                {status === "Pending" && (
                                    <Button
                                        variant="contained"
                                        disabled
                                        style={{
                                            padding: "0.5rem",
                                            marginBottom: "2rem",
                                            margin: 'auto'
                                        }}
                                        fullWidth
                                    >
                                        Pending
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </>
                )}
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        Error loading the page
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}
