import { Box, Container, Divider, Fab, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelCard from "../../components/channelCard/channelCard";
import { useGetMyChannels } from "../../api/hooks/channel-hook";
import AddIcon from "@mui/icons-material/Add";
import CreateChannelModal from "./createChannelModal";
import InboxIcon from '@mui/icons-material/Inbox';
import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function MyChannels() {
    const [tabValue, setTabValue] = useState<string>("registered");
    const { userData } = useUser();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const { mutate: getMyChannels, isLoading: getMyChannelsLoading } =
        useGetMyChannels();
    const [registeredChannelsArray, setRegisteredChannelsArray] = useState([]);
    const [ownedChannelsArray, setOwnedChannelsArray] = useState([]);

    const handleNewChannelModal = () => {
        setOpenModal(true);
    };

    const requests = [
        { name: 'Alice', channel: 'General' },
        { name: 'Bob', channel: 'Development' },
        { name: 'Charlie', channel: 'Marketing' },
    ];

    useEffect(() => {
        getMyChannels(
            { jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setOwnedChannelsArray(
                            response.data.message["ownedChannels"]
                        );
                        setRegisteredChannelsArray(
                            response.data.message["registeredChannels"]
                        );
                    }
                },
            }
        );
    }, []);

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: "600" }}>
                My Channels
            </Typography>
            <Tabs
                value={tabValue}
                onChange={(event, newValue) => setTabValue(newValue)}
            >
                <Tab label="Registered" value="registered" />
                <Tab label="Owned" value="owned" />
                <Tab label="Requests" value="requests" />
            </Tabs>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: "4.2rem",
                }}
            >
                {tabValue === "owned" &&
                    ownedChannelsArray?.map((channel) => (
                        <div key={channel.id} style={{ margin: "10px" }}>
                            <ChannelCard
                                title={channel.title}
                                ownerId={channel.ownerId}
                                imageId={channel.thumbnailId}
                                description={channel.description}
                                channelId={channel.id}
                            />
                        </div>
                    ))}
                {tabValue === "registered" &&
                    registeredChannelsArray?.map((channel) => (
                        <div key={channel.id} style={{ margin: "10px" }}>
                            <ChannelCard
                                title={channel.title}
                                ownerId={channel.ownerId}
                                imageId={channel.thumbnailId}
                                description={channel.description}
                                channelId={channel.id}
                            />
                        </div>
                    ))}
                {tabValue === "requests" &&
                    <Container sx={{ border: '1px solid', borderColor: 'grey.300', margin: '16px' }}>
                        <List sx={{ width: '100%' }}>
                            {requests.map((request, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="accept">
                                                    <CheckCircleIcon sx={{ color: 'green' }} />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="reject">
                                                    <CancelOutlinedIcon sx={{ color: 'red' }} />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemText primary={`${request.name} requests to join ${request.channel}`} />
                                    </ListItem>
                                    {index < requests.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Container>
                }
            </div>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                }}
                onClick={handleNewChannelModal}
            >
                <AddIcon />
            </Fab>
            {openModal && (
                <CreateChannelModal open={openModal} setOpen={setOpenModal} />
            )}
        </Box>
    );
}
