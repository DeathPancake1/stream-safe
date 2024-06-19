import { Box, Container, Divider, Fab, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelCard from "../../components/channelCard/channelCard";
import { useGetMyChannels } from "../../api/hooks/channel-hook";
import AddIcon from "@mui/icons-material/Add";
import CreateChannelModal from "./createChannelModal";
import React from "react";
import Requests from "./requests";
import { useLiveQuery } from "dexie-react-hooks";
import { channelsDB } from "../../indexedDB/channel.db";

export default function MyChannels() {
    const [tabValue, setTabValue] = useState<string>("registered");
    const { userData } = useUser();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [registeredChannelsArray, setRegisteredChannelsArray] = useState([]);
    const [ownedChannelsArray, setOwnedChannelsArray] = useState([]);

    const handleNewChannelModal = () => {
        setOpenModal(true);
    };



    useLiveQuery(async () => {
        if (userData?.email) {
          const registeredChannelsFromDb = await channelsDB.channels
            .where('userEmail')
            .equalsIgnoreCase(userData.email)
            .and(channel => channel.ownerEmail !== userData.email)
            .sortBy('date');
    
          const registeredChannels = Array.from(new Set(registeredChannelsFromDb.map((channel) => ({
            name: channel.name,
            channelId: channel.channelId,
            ownerEmail: channel.ownerEmail,
            key: channel.channelKey,
          }))));
    
          setRegisteredChannelsArray(registeredChannels);
    
          // Query for channels where user is the owner
          const ownedChannelsFromDb = await channelsDB.channels
            .where('ownerEmail')
            .equalsIgnoreCase(userData.email)
            .sortBy('date');
    
          const ownedChannels = Array.from(new Set(ownedChannelsFromDb.map((channel) => ({
            name: channel.name,
            channelId: channel.channelId,
            ownerEmail: channel.ownerEmail,
            key: channel.channelKey,
          }))));
    
          setOwnedChannelsArray(ownedChannels);
        }
    }, [userData?.email]);

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
                    <Requests />
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
