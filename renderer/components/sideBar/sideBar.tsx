import React, { useEffect, useState } from "react";
import theme from "../../themes/theme";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Face, Logout } from '@mui/icons-material';
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";
import { Search, Groups, Settings, HelpOutline } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import icon from '../../../resources/icon.ico'
import MuiListItem from "@mui/material/ListItem";


export default function SideBar() {
    const router = useRouter()

    return (
        <div>
            <Drawer open={true} sx={{ '& .MuiDrawer-paper': { backgroundColor: theme.palette.primary.main, padding: "0.5rem", height: "100vh", overflow: 'auto' } }}>
                <List sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <ListItem sx={{ m: "2rem 0px 1.25rem 0px" }}>
                        <ListItemIcon >
                            <img style={{ width: "50px", height: "50px" }} src={icon.src} alt="ds" />
                        </ListItemIcon>
                        <ListItemText style={{ color: theme.palette.secondary.main }} primary={
                            <Typography variant="h4">
                                Stream Safe
                            </Typography>
                        } />
                    </ListItem>
                    <Divider variant="middle" sx={{ background: theme.palette.secondary.main, mb: "0.7rem" }} />
                    {['Explore', 'My Channels', 'Logout'].map((text) => (
                        <ListItem key={text} disablePadding sx={{
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                backgroundColor: "White", color: theme.palette.primary.main,
                                '&, & .MuiListItemIcon-root': {
                                    color: theme.palette.primary.main,
                                  },
                            }
                        }
                        } >
                            <ListItemButton >
                                <ListItemIcon sx={{ color: "White" }}>
                                    {(() => {
                                        switch (text) {
                                            case 'Explore':
                                                return <Search />;
                                            case 'My Channels':
                                                return <Groups />;
                                            case 'Settings':
                                                return <Settings />;
                                            case 'Logout':
                                                return <LogoutIcon />;
                                        }
                                    })()}
                                </ListItemIcon>
                                <ListItemText  primary={
                                    <Typography sx={{ fontSize: "1.25rem" }} >{text}</Typography>
                                } />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <Box sx={{ height: '100%', display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <ListItem disablePadding sx={{ alignSelf: 'flex-end' }}>
                            <ListItemButton>
                                <ListItemIcon >
                                    <HelpOutline color="secondary" />
                                </ListItemIcon>
                                <ListItemText style={{ color: theme.palette.secondary.main }} primary={
                                    <Typography sx={{ fontSize: '1.25rem' }}>
                                        Help
                                    </Typography>
                                } />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </List>
            </Drawer>
        </div>
    )
}