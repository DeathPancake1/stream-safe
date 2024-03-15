import { Box, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchBox from "../../components/SearchBox";
import { useEffect, useState } from "react";
import { useSearchUser } from "../../api/hooks/search-hook";
import { useUser } from "../../providers/UserContext";
import ChatType from "../../types/chat-type";
import { useAddMembers, useGetMembers } from "../../api/hooks/channel-hook";

interface Props{
    openPopover: boolean
    anchorEl: HTMLButtonElement | null
    handleClose: (event: any)=> void
    channelId: string
}

export default function MembersPopover({
    openPopover,
    anchorEl,
    handleClose,
    channelId
}: Props){
    const [searchLength, setSearchLength] = useState<number>(0)
    const {userData, updateUser} = useUser()
    const [searchChats, setSearchChats] = useState<ChatType[]>([]);
    const [subscribedMembers, setSubscribedMembers] = useState<string[]>([]);
    const [shownChats, setShownChats] = useState<string[]>([]);
    const { mutate: search, isLoading: searchLoading } = useSearchUser();
    const { mutate: getMembers, isLoading: isLoadingMembers } = useGetMembers();
    const { mutate: addMember } = useAddMembers()

    const fetchMembers = async () => {
        await getMembers(
            {
                channelId,
                jwt: userData.jwt
            },
            {
                onSuccess: (response)=>{
                    const members = response.data.subscribers.map(member => member.email);
                    setSubscribedMembers(members);
                }
            }
        )
    };

    useEffect(() => {
        fetchMembers();
    }, [channelId, getMembers, userData.jwt, openPopover]);

    

    useEffect(()=>{
        setShownChats(subscribedMembers)
    }, [subscribedMembers])

    const handleSearch = async ({ email }: { email: string }) => {
        setSearchLength(email.length)
        if (email.length > 2) {
            search(
                { email, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.data) {
                            setSearchChats(response.data.filter(chat => !subscribedMembers.includes(chat.email)));
                        }
                    }
                }
            );

            setShownChats(subscribedMembers.filter(chat => subscribedMembers.includes(email)))
            
        } else {
            setSearchChats([])
            setShownChats(subscribedMembers)
        }
    };

    const handleAddMembers = async (email) =>{
        const newMembers = [email]
        addMember(
            {
                channelId,
                newMembers,
                jwt: userData.jwt
            },
            {
                onSuccess(response) {
                    fetchMembers()
                    setSearchChats([])
                    setSearchLength(0)
                },
            }
        )
    }

    return (
        <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{
                maxHeight: '40vh',
                maxWidth: '50vw'
            }}
        >
            <Box
                sx={{
                    marginBottom: '10px'
                }}
            >
                <SearchBox search={handleSearch}/>
            </Box>

            {
                shownChats.map((email, index) => (
                    <ListItem
                        key={index}
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
                        <IconButton>
                            <RemoveIcon />
                        </IconButton>
                    </ListItem>
                ))
                
            }
            {
                searchChats.map((chat, index) => (
                    <ListItem
                        key={chat.email}
                    >
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
                        <IconButton
                            onClick={
                                ()=>handleAddMembers(chat.email)
                            }
                        >
                            <AddIcon />
                        </IconButton>
                    </ListItem>
                ))
                
            }
        </Popover>
    )
}
