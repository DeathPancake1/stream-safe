import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadThumbnail from "./uploadThumbnail";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import { useCreateChannel } from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { addChannel } from "../../indexedDB";

interface props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function CreateChannelModal({ open, setOpen }: props) {
    const {mutate: createChannel} = useCreateChannel()
    const {userData, updateUser} = useUser()
    const [file, setFile] = useState<File>()

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (title: string, description: string, privateChan: boolean) => {
        const channelSymmetricKey = await generateSymmetricKey256()
        createChannel(
            {
                title: title,
                description: description,
                private: privateChan,
                jwt: userData.jwt,
                thumbnailPhoto: file
            },
            {
                onSuccess: (response)=>{
                    addChannel(title, response.data, channelSymmetricKey, userData.email, userData.email)
                } 
            }
        )
        
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(
                            (formData as any).entries()
                        );
                        const title = formJson.title;
                        const description = formJson.description;
                        const privateChan = formJson.private ===  "on";
                        handleSubmit(title, description, privateChan)
                        handleClose()
                    },
                }}
            >
                <DialogTitle>Create a new channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a channel you must provide the following info
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="title"
                        label="Title"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="description"
                        label="Description"
                        multiline
                        fullWidth
                        variant="standard"
                        rows={2}
                    />
                    <Box sx={{ marginTop: 4 }}>
                        <Typography>Channel thumbnail</Typography>
                        <UploadThumbnail setSelectedFile={setFile} />
                    </Box>

                    <FormControlLabel
                        name="private"
                        sx={{ margin: "auto", marginTop: 4}}
                        control={<Switch />}
                        label="Private"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
