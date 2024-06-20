import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchBox from "../../components/SearchBox";
import { useEffect, useState } from "react";
import { useFindEmail, useSearchUser } from "../../api/hooks/search-hook";
import { useUser } from "../../providers/UserContext";
import ChatType from "../../types/chat-type";
import {
    useAddMembers,
    useExchangeChannelKey,
    useGetMembers,
    useRemoveMembers,
} from "../../api/hooks/channel-hook";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";
import ChannelType from "../../types/channel-type";
import secureLocalStorage from "react-secure-storage";
import decryptAESHex from "../../helpers/decryption/decryptAESHex";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import { addChannel } from "../../indexedDB";

interface Props {
    openPopover: boolean;
    anchorEl: HTMLButtonElement | null;
    handleClose: (event: any) => void;
    channel: ChannelType;
}

export default function MembersPopover({
    openPopover,
    anchorEl,
    handleClose,
    channel,
}: Props) {
    const { userData, updateUser } = useUser();
    const [searchChats, setSearchChats] = useState<ChatType[]>([]);
    const [subscribedMembers, setSubscribedMembers] = useState<string[]>([]);
    const [shownChats, setShownChats] = useState<string[]>([]);
    const { mutate: search, isLoading: searchLoading } = useSearchUser();
    const { mutate: getMembers, isLoading: isLoadingMembers } = useGetMembers();
    const { mutate: addMember } = useAddMembers();
    const { mutate: findUnique } = useFindEmail();
    const { mutate: removeMember } = useRemoveMembers();
    const { mutate: exchangeKey } = useExchangeChannelKey();

    const fetchMembers = async () => {
        await getMembers(
            {
                channelId: channel.channelId,
                jwt: userData.jwt,
            },
            {
                onSuccess: (response) => {
                    const members = response.data.subscribers.map(
                        (member) => member.email
                    );
                    setSubscribedMembers(members);
                },
            }
        );
    };

    useEffect(() => {
        fetchMembers();
    }, [channel, getMembers, userData.jwt, openPopover]);

    useEffect(() => {
        setShownChats(subscribedMembers);
    }, [subscribedMembers]);

    const handleSearch = async ({ email }: { email: string }) => {
        if (email.length > 2) {
            search(
                { email, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.data) {
                            setSearchChats(
                                response.data.filter(
                                    (chat) =>
                                        !subscribedMembers.includes(chat.email)
                                )
                            );
                        }
                    },
                }
            );

            setShownChats(
                subscribedMembers.filter((chat) =>
                    subscribedMembers.includes(email)
                )
            );
        } else {
            setSearchChats([]);
            setShownChats(subscribedMembers);
        }
    };

    const handleExchangeKey = async (email, channelSymmetricKey) => {
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
                                channelId: channel.channelId,
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

    const handleAddMember = async (newMember) => {
        findUnique(
            {
                email: newMember,
                jwt: userData.jwt,
            },
            {
                onSuccess: async (response) => {
                    const chat = response.data;
                    await addMember(
                        {
                            channelId: channel.channelId,
                            newMember,
                            jwt: userData.jwt,
                        },
                        {
                            onSuccess: async (response) => {
                                await fetchMembers();
                                const channelSymmetricKey = await generateSymmetricKey256();
                                const subscribers = [
                                    ...subscribedMembers,
                                    newMember,
                                ];

                                for (const memberEmail of subscribers) {
                                    await handleExchangeKey(memberEmail, channelSymmetricKey);
                                }

                                addChannel(channel.name, channel.channelId, channelSymmetricKey, userData.email, userData.email);

                                setSearchChats([]);
                            },
                        }
                    );
                },
            }
        );
    };

    const handleRemoveMember = async (oldMember) => {
        await removeMember(
            {
                channelId: channel.channelId,
                oldMember,
                jwt: userData.jwt,
            },
            {
                onSuccess: async (response) => {
                    await fetchMembers();
                    const channelSymmetricKey = await generateSymmetricKey256();

                    for (const memberEmail of subscribedMembers) {
                        if (memberEmail !== oldMember) {
                            await handleExchangeKey(memberEmail, channelSymmetricKey);
                        }
                    }

                    addChannel(channel.name, channel.channelId, channelSymmetricKey, userData.email, userData.email);
                    setSearchChats([]);
                },
            }
        );
    };

    return (
        <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            sx={{
                maxHeight: "40vh",
                maxWidth: "50vw",
            }}
        >
            <Box
                sx={{
                    marginBottom: "10px",
                }}
            >
                <SearchBox search={handleSearch} />
            </Box>

            {shownChats.map((email, index) => (
                <ListItem key={index}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={email}
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    />
                    <IconButton onClick={() => handleRemoveMember(email)}>
                        <RemoveIcon />
                    </IconButton>
                </ListItem>
            ))}
            {searchChats.map((chat, index) => (
                <ListItem key={chat.email}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={chat.email}
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    />
                    <IconButton onClick={() => handleAddMember(chat.email)}>
                        <AddIcon />
                    </IconButton>
                </ListItem>
            ))}
        </Popover>
    );
}
