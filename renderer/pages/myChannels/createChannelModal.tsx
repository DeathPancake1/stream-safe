import { Dialog } from "@mui/material";

interface props{
    open: boolean
    setOpen: (value: boolean)=>void
}

export default function CreateChannelModal ({open, setOpen}: props) {
    return (
        <Dialog open={open}>
            Test
        </Dialog>
    )
}