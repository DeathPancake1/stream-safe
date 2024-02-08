import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddButton(){
    return(
        <Fab
            size="small" 
            color="secondary" 
            aria-label="add"
            sx={{
            boxShadow: 'none'
            }}
            >
              <AddIcon />
        </Fab>
    )
}