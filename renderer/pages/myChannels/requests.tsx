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
import { Channels, addChannel, channelsDB } from "../../indexedDB/channel.db";
import decryptAESHex from "../../helpers/decryption/decryptAESHex";
import { useFindEmail } from "../../api/hooks/search-hook";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";
import { channel } from "diagnostics_channel";
import {
    useGetMembers,
    useAddMembers,
    useRemoveMembers,
    useExchangeChannelKey,
} from "../../api/hooks/channel-hook";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import ChannelType from "../../types/channel-type";

type RequestType = {
    id: number,
    channelId: string,
    senderEmail: string,
    channel: any
}

export default function Requests() {
    const { mutate: getChannelRequests } = useGetChannelRequests();
    const { mutate: respondChannelRequest } = useRespondChannelRequest();
    const [subscribedMembers, setSubscribedMembers] = useState<string[]>([]);
    const { userData, updateUser } = useUser();
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const { mutate: getMembers, isLoading: isLoadingMembers } = useGetMembers();
    const { mutate: findUnique } = useFindEmail();
    const { mutate: exchangeKey } = useExchangeChannelKey();

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

    const fetchMembers = async (channelId) => {
        await getMembers(
            {
                channelId: channelId,
                jwt: userData.jwt,
            },
            {
                onSuccess: (response) => {
                    const members = response.data.subscribers.map(
                        (member) => member.email
                    );
                    setSubscribedMembers(members)
                },
            }
        );
    };

    const handleExchangeKey = async (email, channelSymmetricKey, channelId) => {
        return new Promise<void>((resolve, reject) => {
            findUnique(
                {
                    email: email,
                    jwt: userData.jwt,
                },
                {
                    onSuccess: async (response) => {
                        const member = response.data;
                        const encryptedWithPublic = await encryptPublic(
                            member.publicKey,
                            channelSymmetricKey
                        );
                        exchangeKey(
                            {
                                channelId: channelId,
                                jwt: userData.jwt,
                                email: member.email,
                                key: encryptedWithPublic,
                            },
                            {
                                onSuccess: (response) => {
                                    resolve();
                                },
                                onError: (error) => {
                                    console.error(error);
                                    reject(error);
                                },
                            }
                        );
                    },
                    onError: (error) => {
                        console.error(error);
                        reject(error);
                    }
                }
            );
        });
    };

    const handleAddMember = (
        requestId: number,
        senderEmail: string,
        answer: boolean,
        channelId: string
    ) => async (event) => {
        findUnique(
            {
                email: senderEmail,
                jwt: userData.jwt,
            },
            {
                onSuccess: async (response) => {
                    const chat = response.data;
                    await respondChannelRequest(
                        {
                            requestId: requestId,
                            response: answer,
                            jwt: userData.jwt,
                        },
                        {
                            onSuccess: async (response) => {
                                if (answer === true) {
                                    await fetchMembers(channelId);
                                    const channelSymmetricKey =
                                        await generateSymmetricKey256();
                                    const subscribers = [
                                        ...subscribedMembers,
                                        senderEmail,
                                    ];

                                    for (const memberEmail of subscribers) {
                                        await handleExchangeKey(
                                            memberEmail,
                                            channelSymmetricKey,
                                            channelId
                                        );
                                    }

                                    addChannel(
                                        "",
                                        channelId,
                                        channelSymmetricKey,
                                        userData.email,
                                        userData.email
                                    );
                                    setRefresh((prev)=>!prev)
                                }
                            },
                        }
                    );
                },
            }
        );
    };


    useEffect(() => {
        if (userData.email) {
            handleGetChannelRequests();
        }
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
                                        onClick={handleAddMember(
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
                                        onClick={handleAddMember(
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
                                primary={`${request.senderEmail} requests to join ${request.channel.title}`}
                            />
                        </ListItem>
                        {index < requests.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
}
