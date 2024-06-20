import React, { useEffect, useState } from "react";
import theme from "../../themes/theme";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import Looks5Icon from "@mui/icons-material/Looks5";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks3Icon from "@mui/icons-material/Looks3";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Search, Groups, Settings, HelpOutline } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import icon from "../../../resources/icon.ico";
import secureLocalStorage from "react-secure-storage";
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";
import { useHomeLogic } from "../../helpers/logicHooks/Home/HomeLogic";
import { useReceiverSeen } from "../../api/hooks/key-hook";
import { useGetNewMessages } from "../../api/hooks/messages-hook";
import formatPrivateKey from "../../helpers/keyExchange/formatPrivate";
import decryptPrivate from "../../helpers/keyExchange/decryptPrivate";
import { addChannel, addChannelVideo, addKey, addVideo } from "../../indexedDB";
import ChatIcon from '@mui/icons-material/Chat';
import { useGetMessagesFromChannel } from "../../api/hooks/channel-hook";
import encryptAESHex from "../../helpers/encryption/encryptAESHex";

interface Props {
    childrenFunction: any;
    width: number;
    setWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function SideBar(props: Props) {
    const { userData, updateUser } = useUser();
    const [display, setDisplay] = useState<string>("none");
    const [selectedItem, setSelectedItem] = useState<string>("Explore");

    const [refreshCountdown, setRefreshCountdown] = useState<number>(0);
    const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);

    const { mutate: receiveKeys } = useReceiverSeen();
    const { mutate: getNewMessages } = useGetNewMessages();
    const { mutate: getNewChannelMessages }= useGetMessagesFromChannel()

    const getPrivateKey = () => {
        const privateKey = secureLocalStorage.getItem("privateKey").toString();
        const privateKeyFormatted = formatPrivateKey(privateKey);
        return privateKeyFormatted;
    };

    const processReceivedKeys = (response) => {
        const newKeys = response.data;
        newKeys.forEach(async (key) => {
            if (key.type === "USER") {
                const senderEmail = key.senderEmail;
                const encryptedKey = key.encryptedKey;

                const privateKey = getPrivateKey();
                const decryptedKey = await decryptPrivate(
                    privateKey,
                    encryptedKey
                );
                const id = addKey(senderEmail, decryptedKey);
            } else {
                const channelId = key.channelId;
                const encryptedKey = key.encryptedKey;
                const privateKey = getPrivateKey();
                const decryptedKey = await decryptPrivate(
                    privateKey,
                    encryptedKey
                );
                const channel = key.channel;
                const id = addChannel(
                    channel.title,
                    channelId,
                    decryptedKey,
                    key.senderEmail,
                    userData.email
                );
            }
        });
    };

    const processNewMessages = (response) => {
        const newMessages = response.data;
        newMessages.forEach(async (message) => {
            const date = Date.parse(message.sentDate);
            const id = addVideo(
                message.path,
                message.name,
                message.senderEmail,
                message.receiverEmail,
                date,
                false,
                message.iv,
                message.type
            );
        });
    };

    const processNewChannelMessages = (response) => {
        const newMessages = response.data;
        newMessages.forEach(async (message) => {
            const date = Date.parse(message.video.sentDate);
            const privateKey = getPrivateKey();
            const decryptedKey = await decryptPrivate(privateKey, message.usedKey.encryptedKey)
            const masterKey = secureLocalStorage.getItem("masterKey").toString();
            const encryptedSym = await encryptAESHex(masterKey, decryptedKey)
            const id = addChannelVideo(
                message.video.path,
                message.video.name,
                message.video.channelId,
                date,
                false,
                message.video.iv,
                message.video.type,
                encryptedSym
            );
        });
    };

    const handleRefresh = () => {
        setIsRefreshDisabled(true);
        setRefreshCountdown(5); // Set the countdown duration in seconds

        // Start countdown
        const countdownInterval = setInterval(() => {
            setRefreshCountdown((prevCount) => prevCount - 1);
        }, 1000);

        // Trigger API calls after refresh button click
        receiveKeys({ jwt: userData.jwt }, { onSuccess: processReceivedKeys });
        getNewMessages(
            { jwt: userData.jwt },
            { onSuccess: processNewMessages }
        );

        getNewChannelMessages(
            { jwt: userData.jwt },
            { onSuccess: processNewChannelMessages }
        );

        // Stop countdown after the specified duration
        setTimeout(() => {
            clearInterval(countdownInterval);
            setIsRefreshDisabled(false);
        }, 5000); // 5000 milliseconds (5 seconds) in this example
    };

    const refreshIcon = (refreshCountdown) => {
        let componentToRender;

        switch (refreshCountdown) {
            case 5:
                componentToRender = <Looks5Icon />;
                break;
            case 4:
                componentToRender = <Looks4Icon />;
                break;
            case 3:
                componentToRender = <Looks3Icon />;
                break;
            case 2:
                componentToRender = <LooksTwoIcon />;
                break;
            case 1:
                componentToRender = <LooksOneIcon />;
                break;
            default:
                componentToRender = <RefreshIcon />;
        }

        return componentToRender;
    };

    const router = useRouter();

    const logout = () => {
        secureLocalStorage.removeItem("jwt");
        updateUser("", "");
        router.push("/login");
    };

    useEffect(() => {
        const currentRoute = router.pathname;
        const isNotAuthRoute = !/^\/(login|signup|forgetPassword|verify|resetPassword)/.test(
            currentRoute
        );
        if (!isNotAuthRoute) {
            setDisplay("none");
            props.setWidth(0);
        } else {
            setDisplay("block");
            props.setWidth(290);
        }

        if (userData.email === "" && isNotAuthRoute) {
            router.push("/login");
        }
    }, [router.pathname]);

    const handleItemClick = (text) => {
        if (text === "Logout") {
            logout();
        } else if (text === "My Channels") {
            setSelectedItem(text);
            router.push(`/myChannels`);
        } else if (text === "Explore") {
            setSelectedItem(text);
            router.push(`/allChannels`);
        } else if (text === "Chats") {
            setSelectedItem(text);
            router.push(`/chats`);
        }
        else if (text === "Refresh") {
            handleRefresh()
        }
    };

    return (
        <Box sx={{ display: `${display}` }}>
            <Drawer
                variant="permanent"
                open={true}
                sx={{
                    width: `${props.width}px`,
                    "& .MuiDrawer-paper": {
                        width: `${props.width}px`,
                        backgroundColor: theme.palette.primary.main,
                        padding: "0.5rem",
                        height: "100vh",
                        overflow: "auto",
                        margin: "0px",
                    },
                }}
            >
                <List
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <ListItem sx={{ m: "2rem 0px 1.25rem 0px" }}>
                        <ListItemIcon>
                            <img
                                style={{ width: "50px", height: "50px" }}
                                src={icon.src}
                                alt="ds"
                            />
                        </ListItemIcon>
                        <ListItemText
                            style={{ color: theme.palette.secondary.main }}
                            primary={
                                <Typography variant="h4">
                                    Stream Safe
                                </Typography>
                            }
                        />
                    </ListItem>
                    <Divider
                        variant="middle"
                        sx={{
                            background: theme.palette.secondary.main,
                            mb: "0.7rem",
                        }}
                    />
                    {["Explore", "My Channels", "Chats", "Refresh", "Logout"].map((text) => (
                        <ListItem
                            key={text}
                            disablePadding
                            sx={{
                                backgroundColor:
                                    selectedItem === text ? "white" : "inherit",
                            }}
                            onClick={() => handleItemClick(text)}
                        >
                            <ListItemButton
                                disabled = {text === "Refresh" && isRefreshDisabled}
                                sx={{
                                    color:
                                        selectedItem === text
                                            ? theme.palette.primary.main
                                            : theme.palette.secondary.main,
                                    backgroundColor:
                                        selectedItem === text
                                            ? theme.palette.secondary.main
                                            : theme.palette.primary.main,
                                    "&:hover": {
                                        backgroundColor: "White",
                                        color: theme.palette.primary.main,
                                        "&, & .MuiListItemIcon-root": {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color:
                                            selectedItem === text
                                                ? theme.palette.primary.main
                                                : "White",
                                    }}
                                >
                                    {(() => {
                                        switch (text) {
                                            case "Explore":
                                                return <Search />;
                                            case "My Channels":
                                                return <Groups />;
                                            case "Settings":
                                                return <Settings />;
                                            case "Chats":
                                                return <ChatIcon />;
                                            case "Logout":
                                                return <LogoutIcon />;
                                            case "Refresh":
                                                return refreshIcon(refreshCountdown)
                                            default:
                                                return null;
                                        }
                                    })()}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{ fontSize: "1.25rem" }}
                                        >
                                            {text}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}
                    >
                        <ListItem disablePadding sx={{ alignSelf: "flex-end" }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HelpOutline color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    style={{
                                        color: theme.palette.secondary.main,
                                    }}
                                    primary={
                                        <Typography
                                            sx={{ fontSize: "1.25rem" }}
                                        >
                                            Help
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </List>
                <div
                    style={{
                        width: "1px",
                        cursor: "ew-resize",
                        padding: "4px 0 0",
                        borderTop: "1px solid #ddd",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100,
                        backgroundColor: "black",
                    }}
                />
            </Drawer>
        </Box>
    );
}
