import { Box, Fab, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelCard from "../../components/channelCard/channelCard";
import { useGetMyChannels } from "../../api/hooks/channel-hook";
import AddIcon from '@mui/icons-material/Add';

export default function myChannels() {
    const [registeredOrOwned, setRegisteredOrOwned] = useState<boolean>(false)
    const { userData } = useUser();

    const { mutate: getMyChannels, isLoading: getMyChannelsLoading } = useGetMyChannels();
    const [registeredChannelsArray, setRegisteredChannelsArray] = useState([])
    const [ownedChannelsArray, setOwnedChannelsArray] = useState([])
    useEffect(() => {
        getMyChannels(
            { jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setOwnedChannelsArray(response.data.message["ownedChannels"]);
                        setRegisteredChannelsArray(response.data.message["registeredchannels"])
                    }
                },
            }
        );
    }, [])
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: '600' }} >My Channels</Typography>
            <Tabs value={registeredOrOwned ? 1 : 0} onChange={() => setRegisteredOrOwned((prevValue) => (!prevValue))}>
                <Tab label="Registered" />
                <Tab label="Owned" />
            </Tabs>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {registeredOrOwned && ownedChannelsArray?.map((channel) => (
                    <div key={channel.id} style={{ margin: "10px" }}>
                        <ChannelCard
                            title={channel.title}
                            ownerId={channel.ownerId}
                            imageId={channel.thumbnailId}
                            description={channel.description}
                        />
                    </div>
                ))}
                {!registeredOrOwned && registeredChannelsArray?.map((channel) => (
                    <div key={channel.id} style={{ margin: "10px" }}>
                        <ChannelCard
                            title={channel.title}
                            ownerId={channel.ownerId}
                            imageId={channel.thumbnailId}
                            description={channel.description}
                        />
                    </div>
                ))}
            </div>
            <Fab color="primary" aria-label="add" sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
            }}>
                <AddIcon />
            </Fab>
        </Box>
    )
}