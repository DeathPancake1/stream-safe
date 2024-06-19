import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChatTypeEnum } from "../../../types/chat-type-enum";
import Chat from "../../home/Chat";
import Channel from "../../home/Channel";
import Welcome from "../../../components/auth/Welcome";
import ChannelType from "../../../types/channel-type";
import { useGetChannelInfoById } from "../../../api/hooks/channel-hook";
import { useUser } from "../../../providers/UserContext";
import { useUserById } from "../../../api/hooks/user-by-id-hook";

export default function ChatPage() {
    const router = useRouter();
    const { id, chatType } = router.query;
    const { mutate: getChannelInfo } = useGetChannelInfoById();
    const { mutate: getUserById } = useUserById();
    const [ownerId, setOwnerId] = useState<number>()
    const { userData, updateUser } = useUser();
    const [channelInfo, setChannelInfo] = useState<ChannelType>();

    useEffect(() => {
        if(chatType){
            if (chatType === ChatTypeEnum.channel) {
                getChannelInfo(
                    {
                        channelId: id as string,
                        jwt: userData.jwt,
                    },
                    {
                        onSuccess: (response) => {
                            if (response.status === 201) {
                                const channel : ChannelType = {
                                    channelId: response.data.message.id,
                                    key: "",
                                    name: response.data.message.title,
                                    ownerEmail: ""
                                }
                                setChannelInfo(channel);
                                setOwnerId(response.data.message.ownerId)
                            }
                        },
                    }
                );
            }
        }
        
    }, [id, chatType]);

    useEffect(() => {
        if(chatType === "channel" && ownerId){
            getUserById(
                { ownerId: ownerId, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            const channel : ChannelType = {
                                channelId: channelInfo.channelId,
                                key: "",
                                name: channelInfo.name,
                                ownerEmail: response.data.message.email
                            }
                            setChannelInfo(channel)
                            console.log(channelInfo.key)
                        }
                    },
                }
            );
        }
        
    }, [ownerId]);

    return (
        <Box component="main" sx={{ height:"98%", maxWidth: "98%", p: "1%" }}>
            {chatType && chatType === ChatTypeEnum.chat && userData.jwt ? (
                <Chat email={id as string} />
            ) : chatType && chatType === ChatTypeEnum.channel && userData.jwt && channelInfo && channelInfo.ownerEmail ? (
                <Channel channel={channelInfo} setChannel={setChannelInfo} />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Welcome />
                </Box>
            )}
        </Box>
    );
}
