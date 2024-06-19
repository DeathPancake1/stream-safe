import {
    Container,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
    useGetChannelRequests,
    useRespondChannelRequest,
} from "../../api/hooks/request-hook";
import { useUser } from "../../providers/UserContext";
import secureLocalStorage from "react-secure-storage";
import { useLiveQuery } from "dexie-react-hooks";
import { Channels, channelsDB } from "../../indexedDB/channel.db";
import decryptAESHex from "../../helpers/decryption/decryptAESHex";
import { useFindEmail } from "../../api/hooks/search-hook";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";

export default function Requests() {
    const { mutate: getChannelRequests } = useGetChannelRequests();
    const { mutate: respondChannelRequest } = useRespondChannelRequest();
    const { userData, updateUser } = useUser();
    const [requests, setRequests] = useState([]);
    const [channels, setChannels] = useState<Channels[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const { mutate: findByEmail } = useFindEmail();

    const handleGetChannelRequests = () => {
        getChannelRequests(
            { jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 200) {
                        setRequests(response.data);
                    }
                },
            }
        );
    };

    const handleRespond =
        (
            requestId: number,
            senderEmail: string,
            response: boolean,
            channelId: string
        ) =>
        async (event) => {
            event.preventDefault();
            const masterKey = secureLocalStorage
                .getItem("masterKey")
                .toString();
            let channel: Channels;
            for (let i = 0; i < channels.length; i++) {
                if (channels[i].channelId === channelId) {
                    channel = channels[i];
                }
            }
            const decryptedKey = await decryptAESHex(
                masterKey,
                channel.channelKey
            );
            await findByEmail(
                { email: senderEmail, jwt: userData.jwt },
                {
                    onSuccess: async (res) => {
                        if (res.status === 201) {
                            let user = res.data;
                            const cipherText = await encryptPublic(
                                user.publicKey,
                                decryptedKey
                            );
                            respondChannelRequest(
                                {
                                    jwt: userData.jwt,
                                    requestId: requestId,
                                    response: response,
                                    key: cipherText,
                                },
                                {
                                    onSuccess: (response) => {
                                        if (response.status === 201) {
                                            setRefresh((prev) => !prev);
                                        }
                                    },
                                }
                            );
                        }
                    },
                }
            );
            
            
        };

    useLiveQuery(async () => {
        const channelsFromDb = await channelsDB.channels
            .where("ownerEmail")
            .equalsIgnoreCase(userData.email)
            .sortBy("date");

        const uniqueChannel = Array.from(
            new Set(
                channelsFromDb.map((channel) => {
                    return {
                        id: channel.id,
                        name: channel.name,
                        channelId: channel.channelId,
                        ownerEmail: channel.ownerEmail,
                        channelKey: channel.channelKey,
                        userEmail: channel.userEmail,
                    };
                })
            )
        );

        setChannels(uniqueChannel);
    }, [userData.email]);

    useEffect(() => {
        handleGetChannelRequests();
    }, [refresh]);
    return (
        <Container
            sx={{
                border: "1px solid",
                borderColor: "grey.300",
                margin: "16px",
            }}
        >
            <List sx={{ width: "100%" }}>
                {requests.map((request, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="accept"
                                        onClick={handleRespond(
                                            request.id,
                                            request.senderEmail,
                                            true,
                                            request.channelId
                                        )}
                                    >
                                        <CheckCircleIcon
                                            sx={{ color: "green" }}
                                        />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="reject"
                                        onClick={handleRespond(
                                            request.id,
                                            request.senderEmail,
                                            false,
                                            request.channelId
                                        )}
                                    >
                                        <CancelOutlinedIcon
                                            sx={{ color: "red" }}
                                        />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={`${request.senderEmail} requests to join ${request.channelId}`}
                            />
                        </ListItem>
                        {index < requests.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
}
