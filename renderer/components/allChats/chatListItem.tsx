import { ListItem, IconButton, ListItemText } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import { useRouter } from "next/router";
import { ChatTypeEnum } from "../../types/chat-type-enum";

export default function ChatListItem({email} : {email: string}) {
    const router = useRouter()
    const handleOpenChat = () => {
        router.push(`/chats/${email}/${ChatTypeEnum.chat}`)
    }

    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton edge="end" aria-label="accept" onClick={handleOpenChat}>
                        <ChatIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemText primary={`${email}`} />
        </ListItem>
    );
}
