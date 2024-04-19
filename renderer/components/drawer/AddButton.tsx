import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Switch, TextareaAutosize, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MinHeightTextarea from "../MinHeightTextarea";
import Field from "../auth/Field";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import { useCreateChannel } from "../../api/hooks/channel-hook";
import { useUser } from "../../providers/UserContext";
import { addKey } from "../../indexedDB";

interface FormData {
    title: string
    description: string
    private: boolean
}

export default function AddButton(){
    const {userData, updateUser} = useUser()
    const [openModal, setOpenModal] = useState<boolean>()

    const {mutate: createChannel} = useCreateChannel()

    const handleOpenModal = ()=>{
        setOpenModal(true)
    }
    const handleCloseModal = ()=>{
        setOpenModal(false)
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormData>({
        defaultValues: {
            title: '',
            description: '',
            private: true
        },
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const channelSymmetricKey = await generateSymmetricKey256()
        createChannel(
            {
                title: data.title,
                description: data.description,
                private: data.private,
                jwt: userData.jwt
            },
            {
                onSuccess: (response)=>{
                    addKey(response.data, channelSymmetricKey, 'channel')
                    handleCloseModal()
                }
            }
        )
        
    }

    const resetForm = () => {
        reset({
          title: '',
          description: '',
          private: true,
        })
    }

    useEffect(()=>{
        resetForm()
    }, [])

    return(
        <Box>
            <Dialog open={openModal}>
                <DialogTitle id="alert-dialog-title">
                {"Create Channel"}
                </DialogTitle>
                <DialogContent>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Field
                        type={"text"}
                        control={control}
                        name={"title"}
                        error={errors.title? true: false}
                        errorMessage={errors.title?.message}
                        placeholder={"Channel Title"}
                        rules={{
                            required: 'Title is required',
                            pattern: {
                                value: /^[A-Za-z0-9\s]+$/i,
                                message: 'Invalid title',
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name={"description"}
                        render={({ field }) => (
                            <MinHeightTextarea  
                                {...field}
                                minRows={3}
                                placeholder={"Description"}
                            />
                        )}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        <Typography
                            variant="body2" 
                            color="text" 
                            fontSize={20}
                            sx={{
                                margin: '10px',
                                maxWidth: '100%'
                            }}
                        >
                            Private
                        </Typography>
                        <Controller
                            control={control}
                            name={'private'}
                            render={({ field }) => (
                                <Switch 
                                    defaultChecked 
                                    {...field}
                                    sx={{
                                        margin: '10px',
                                        maxWidth: '100%'
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{
                            margin: '10px'
                        }}
                        type="submit"
                    >
                        Create Channel
                    </Button>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{
                            margin: '10px',
                            marginTop: '0px'
                        }}
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                </form>
                </DialogContent>
            </Dialog>
            <Fab
                size="small" 
                color="secondary" 
                aria-label="add"
                sx={{
                    boxShadow: 'none'
                }}
                onClick={handleOpenModal}
            >
                <AddIcon />
            </Fab>
        </Box>
        
    )
}