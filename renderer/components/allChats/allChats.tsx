import { useEffect, useState } from "react";
import { useSearchUser } from "../../api/hooks/search-hook";
import { useUser } from "../../providers/UserContext";
import ChatType from "../../types/chat-type";
import { useLiveQuery } from "dexie-react-hooks";
import ChatIcon from '@mui/icons-material/Chat';

import { videosDB } from "../../indexedDB";
import {
    Box,
    CircularProgress,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import SearchBox from "../SearchBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import ChatListItem from "./chatListItem";

export function AllChats() {
    const { mutate: search, isLoading: searchLoading } = useSearchUser();
    const [chats, setChats] = useState<ChatType[]>([]);
    const { userData, updateUser } = useUser();
    const [uniqueReceivers, setUniqueReceivers] = useState<string[]>([]);
    const [uniqueSenders, setUniqueSenders] = useState<string[]>([]);
    const [combinedUniqueUsers, setCombinedUniqueUsers] = useState<string[]>(
        []
    );
    const [searchLength, setSearchLength] = useState<number>(0);
    useLiveQuery(async () => {
        const sentMessages = await videosDB.videos
            .where("sender")
            .equalsIgnoreCase(userData.email)
            .sortBy("date");

        const receivedMessages = await videosDB.videos
            .where("receiver")
            .equalsIgnoreCase(userData.email)
            .sortBy("date");

        const allMessages = [...sentMessages, ...receivedMessages];

        const uniqueUsers = Array.from(
            new Set(
                allMessages.map((video) => {
                    if (video.sender === userData.email) {
                        return video.receiver;
                    } else {
                        return video.sender;
                    }
                })
            )
        );

        // Sort unique users by the latest message time
        uniqueUsers.sort((userA, userB) => {
            const latestMessageTimeA = getLatestMessageTimeForUser(
                userA,
                allMessages
            );
            const latestMessageTimeB = getLatestMessageTimeForUser(
                userB,
                allMessages
            );

            return latestMessageTimeB - latestMessageTimeA;
        });

        setCombinedUniqueUsers(uniqueUsers);
    }, [userData.email]);
    const getLatestMessageTimeForUser = (user, messages) => {
        const latestMessage = messages
            .filter((video) => video.sender === user || video.receiver === user)
            .sort((a, b) => b.date - a.date)
            .shift();

        return latestMessage ? latestMessage.date : 0;
    };

    const handleSearch = async ({ email }: { email: string }) => {
        setSearchLength(email.length);
        if (email.length >= 3) {
            search(
                { email, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.data) {
                            setChats(response.data);
                        }
                    },
                }
            );
        } else {
            setChats([]);
        }
    };

    useEffect(() => {
        // Combine unique senders and receivers into a single array
        const combinedUsers = Array.from(
            new Set([...uniqueReceivers, ...uniqueSenders])
        );

        // Set the combined unique users state
        setCombinedUniqueUsers(combinedUsers);
    }, [uniqueReceivers, uniqueSenders]);

    return (
        <Box>
            <Box sx={{ overflow: "auto" }}>
                <List>
                    <SearchBox search={handleSearch} />
                    <List sx={{ width: "100%", mt: "10px" }}>
                        {searchLoading ? (
                            <CircularProgress />
                        ) : chats.length > 0 ? (
                            chats.map((chat, index) => (
                                <Box key={index} sx={{ paddingRight: "30px" }}>
                                    <ChatListItem email={chat.email}/>
                                    {index < chats.length - 1 && (
                                        <Divider />
                                    )}
                                </Box>
                            ))
                        ) : searchLength < 3 ? (
                            combinedUniqueUsers.map((email, index) => (
                                <Box key={index} sx={{ paddingRight: "30px" }}>
                                    <ChatListItem email={email}/>
                                    {index < combinedUniqueUsers.length - 1 && (
                                        <Divider />
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    paddingTop: "10px",
                                    opacity: "0.5",
                                    maxWidth: "100%",
                                    width: "fit-content",
                                    height: "fit-content",
                                    margin: "auto",
                                }}
                            >
                                There are no results for the search query
                            </Typography>
                        )}
                    </List>
                </List>
            </Box>
        </Box>
    );
}
