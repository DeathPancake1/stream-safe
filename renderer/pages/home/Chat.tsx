import { Box, Divider, Typography, Button, IconButton } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import ChatBody from "./ChatBody";
import ChatType from "../../types/chat-type";
import CurrentMessage from "./CurrentMessage";
import { useFindEmail } from "../../api/hooks/search-hook";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
    email?: string;
}

export default function Chat({ email = "" }: Props) {
    const { mutate: findEmail } = useFindEmail();
    const { userData, updateUser } = useUser();
    const router = useRouter();
    const [chat, setChat] = useState<ChatType>({
        firstname: "",
        lastname: "",
        email: "",
        publicKey: "",
    });

    const handleBack = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        router.back();
    };

    useEffect(() => {
        findEmail(
            {
                email,
                jwt: userData.jwt,
            },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setChat(response.data);
                    }
                },
            }
        );
    }, [email]);

    return (
        <Box
            sx={{
                maxWidth: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {chat.email ? (
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
                    <Box>
                        <Box
                            sx={{
                                zIndex: 2002,
                                top: 0,
                                right: 0,
                                padding: "4px",
                                display: "inline",
                            }}
                        >
                            <IconButton
                                onClick={handleBack}
                                size="large"
                                sx={{ width: 20, height: 25, color: "black" }}
                                color="primary"
                            >
                                <ArrowBackIcon sx={{ width: 25, height: 25, color: "black" }} />
                            </IconButton>
                        </Box>
                        <Typography fontSize={24} sx={{ display: "inline" }}>
                            {chat.firstname + " " + chat.lastname}
                        </Typography>
                        <Typography fontSize={12}>{chat.email}</Typography>
                        <Divider />
                    </Box>

                    {/* Display the exchanged messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "3px",
                            width: "100%",
                        }}
                    >
                        <ChatBody chat={chat} />
                    </Box>

                    {/* Divider */}
                    <Divider />

                    {/* Button to upload a file */}
                    <CurrentMessage chat={chat} />
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
