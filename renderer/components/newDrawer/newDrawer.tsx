import { useEffect, useState } from "react";
import { useSearchUser } from "../../api/hooks/search-hook";
import { useUser } from "../../providers/UserContext";
import ChatType from "../../types/chat-type";
import { useLiveQuery } from "dexie-react-hooks";
import { videosDB } from "../../indexedDB";
import { Box, CircularProgress, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Iconbar from "../drawer/Iconbar";
import SearchBox from "../SearchBox";
import theme from "../../themes/theme";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function NewDrawer() {
    const { mutate: search, isLoading: searchLoading } = useSearchUser();
    const [chats, setChats] = useState<ChatType[]>([]);
    const { userData, updateUser } = useUser();
    const [uniqueReceivers, setUniqueReceivers] = useState<string[]>([])
    const [uniqueSenders, setUniqueSenders] = useState<string[]>([])
    const [combinedUniqueUsers, setCombinedUniqueUsers] = useState<string[]>([]);
    const [searchLength, setSearchLength] = useState<number>(0);
    useLiveQuery(
        async () => {
            const sentMessages = await videosDB.videos
                .where('sender')
                .equalsIgnoreCase(userData.email)
                .sortBy('date');

            const receivedMessages = await videosDB.videos
                .where('receiver')
                .equalsIgnoreCase(userData.email)
                .sortBy('date');

            const allMessages = [...sentMessages, ...receivedMessages];

            const uniqueUsers = Array.from(new Set(allMessages.map((video) => {
                if (video.sender === userData.email) {
                    return video.receiver;
                } else {
                    return video.sender;
                }
            })));

            // Sort unique users by the latest message time
            uniqueUsers.sort((userA, userB) => {
                const latestMessageTimeA = getLatestMessageTimeForUser(userA, allMessages);
                const latestMessageTimeB = getLatestMessageTimeForUser(userB, allMessages);

                return latestMessageTimeB - latestMessageTimeA;
            });

            setCombinedUniqueUsers(uniqueUsers);
        },
        [userData.email]
    );
    const getLatestMessageTimeForUser = (user, messages) => {
        const latestMessage = messages
            .filter((video) => video.sender === user || video.receiver === user)
            .sort((a, b) => b.date - a.date)
            .shift();

        return latestMessage ? latestMessage.date : 0;
    };

    const handleSearch = async ({ email }: { email: string }) => {
        setSearchLength(email.length)
        if (email.length >= 3) {
            search(
                { email, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.data) {
                            setChats(response.data);
                        }
                    }
                }
            );
        }
        else {
            setChats([])
        }
    };


    useEffect(() => {
        // Combine unique senders and receivers into a single array
        const combinedUsers = Array.from(new Set([...uniqueReceivers, ...uniqueSenders]));

        // Set the combined unique users state
        setCombinedUniqueUsers(combinedUsers);
    }, [uniqueReceivers, uniqueSenders]);

    return (
        <Box>
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <Divider />
                    <Iconbar />
                    <SearchBox search={handleSearch} />
                    <Typography
                        sx={{
                            textAlign: 'center'
                        }}
                        fontSize={12}
                        color={theme.palette.grey[400]}
                    >
                        Chats
                    </Typography>
                    {
                        searchLoading ?
                            <CircularProgress />
                            :
                            chats.length > 0 ?
                                chats.map((chat, index) => (
                                    <ListItem
                                        key={chat.email}
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <AccountCircleIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={chat.email}
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                                :
                                searchLength < 3 ?
                                    combinedUniqueUsers.map((email, index) => (
                                        <ListItem
                                            key={email}
                                            disablePadding
                                        >
                                            <ListItemButton
                                            >
                                                <ListItemIcon>
                                                    <AccountCircleIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={email}
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                    :
                                    <Typography
                                        sx={{
                                            textAlign: 'center',
                                            paddingTop: '10px',
                                            opacity: '0.5',
                                            maxWidth: '100%',
                                            width: 'fit-content',
                                            height: 'fit-content',
                                            margin: 'auto'
                                        }}
                                    >
                                        There are no results for the search query
                                    </Typography>
                    }
                </List>
            </Box>
        </Box >
    )
}
