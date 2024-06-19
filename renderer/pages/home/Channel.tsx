import { Box, Divider, Typography, Button, Popover } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelType from "../../types/channel-type";
import ChannelCurrentMessage from "./ChannelCurrentMessage";
import ChannelBody from "./ChannelBody";
import React from "react";
import MembersPopover from "./MembersPopover";
import theme from "../../themes/theme";

interface Props {
    channel?: ChannelType;
}

export default function Channel({
    channel = {
        channelId: "",
        ownerEmail: "",
        name: "",
        key: "",
    },
}: Props) {
    const { userData, updateUser } = useUser();
    const [openPopover, setOpenPopover] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

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
                    <Box
                        onClick={handleOpenPopover}
                        sx={{
                            cursor:
                                channel.ownerEmail === userData.email
                                    ? "pointer"
                                    : "default",
                        }}
                    >
                        <Typography fontSize={24}>{channel.name}</Typography>
                        <Typography
                            fontSize={10}
                            color={theme.palette.grey[700]}
                        >
                            {channel.ownerEmail === userData.email && "Click for more info"}
                        </Typography>
                        <Typography fontSize={12}>
                            {"Owner Email: " + channel.ownerEmail}
                        </Typography>
                        <Divider />
                    </Box>
                    {
                      channel.channelId &&
                        <MembersPopover
                            anchorEl={anchorEl}
                            openPopover={openPopover}
                            handleClose={handleClose}
                            channel={channel}
                        />
                    }

                    {/* Display the exchanged messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "3px",
                            width: "100%",
                        }}
                    >
                        <ChannelBody channel={channel} />
                    </Box>

                    {/* Divider */}
                    <Divider />

                    {/* Button to upload a file */}
                    {channel.ownerEmail === userData.email ? (
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
