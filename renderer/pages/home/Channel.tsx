import {
    Box,
    Divider,
    Typography,
    Button,
    Popover,
    IconButton,
} from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelType from "../../types/channel-type";
import ChannelCurrentMessage from "./ChannelCurrentMessage";
import ChannelBody from "./ChannelBody";
import React from "react";
import MembersPopover from "./MembersPopover";
import theme from "../../themes/theme";
import { useLiveQuery } from "dexie-react-hooks";
import { channelsDB } from "../../indexedDB/channel.db";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

interface Props {
    channel?: ChannelType;
    setChannel: (data: ChannelType) => void;
}

export default function Channel({
    channel = {
        channelId: "",
        ownerEmail: "",
        name: "",
        key: "",
    },
    setChannel,
}: Props) {
    const { userData, updateUser } = useUser();
    const [openPopover, setOpenPopover] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [channelKey, setChannelKey] = useState<string>("");
    const router = useRouter();

    const handleOpenPopover = (event) => {
        if (channel.ownerEmail === userData.email) {
            setAnchorEl(event.currentTarget);
            setOpenPopover(true);
        }
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        setOpenPopover(false);
    };

    const handleBack = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        router.back();
    };

    useLiveQuery(async () => {
        if (channel.channelId) {
            const channelsFromDb = await channelsDB.channels
                .where("channelId")
                .equals(channel.channelId)
                .toArray();

            if (channelsFromDb.length > 0) {
                const uniqueChannel = channelsFromDb[0];
                setChannelKey(uniqueChannel.channelKey);
            } else {
                setChannelKey(null);
            }
        }
    }, [channel]);

    useEffect(() => {
        if (channelKey) {
            setChannel({
                ...channel,
                key: channelKey,
            });
        }
    }, [channelKey]);

    return (
        <Box
            sx={{
                maxWidth: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {channel ? (
                // When email exists, show the chat box
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        height: "100%",
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                zIndex: 2002,
                                top: 0,
                                right: 0,
                                padding: "4px",
                                display: "inline",
                            }}
                        >
                            <IconButton
                                onClick={handleBack}
                                size="large"
                                sx={{ width: 20, height: 25, color: "black" }}
                                color="primary"
                            >
                                <ArrowBackIcon
                                    sx={{
                                        width: 25,
                                        height: 25,
                                        color: "black",
                                    }}
                                />
                            </IconButton>
                        </Box>
                        <Typography sx={{ display: "inline" }} fontSize={24}>
                            {channel.name}
                        </Typography>
                        <Box
                            onClick={handleOpenPopover}
                            sx={{
                                cursor:
                                    channel.ownerEmail === userData.email
                                        ? "pointer"
                                        : "default",
                            }}
                        >
                            <Typography
                                fontSize={10}
                                color={theme.palette.grey[700]}
                            >
                                {channel.ownerEmail === userData.email &&
                                    "Click for more info"}
                            </Typography>
                            <Typography fontSize={12}>
                                {"Owner Email: " + channel.ownerEmail}
                            </Typography>
                        </Box>
                        <Divider />
                    </Box>
                    {channel.channelId && channel.key !== "" && (
                        <MembersPopover
                            anchorEl={anchorEl}
                            openPopover={openPopover}
                            handleClose={handleClose}
                            channel={channel}
                        />
                    )}

                    {/* Display the exchanged messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "3px",
                            width: "100%",
                        }}
                    >
                        {channel && channel.key && (
                            <ChannelBody channel={channel} />
                        )}
                    </Box>

                    {/* Divider */}
                    <Divider />

                    {/* Button to upload a file */}
                    {channel.ownerEmail === userData.email &&
                    channel &&
                    channel.key ? (
                        <ChannelCurrentMessage channel={channel} />
                    ) : (
                        <Box
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Typography>
                                Only channel owner allowed to send messages
                            </Typography>
                        </Box>
                    )}
                </Box>
            ) : (
                // When email doesn't exist, show the welcome component
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Welcome />
                </Box>
            )}
        </Box>
    );
}
