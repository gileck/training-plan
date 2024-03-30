import { Button, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import { localStorageAPI } from "../localStorageAPI";
import { Delete } from "@mui/icons-material";
import { useExercisesAPI } from "../exercisesAPI";

export function Settings() {
    const { changeNumberOfWeeks, numberOfWeeks } = useExercisesAPI()
    function cleanData() {
        localStorageAPI().cleanData('exercises')
    }
    function onNumberOfWeeksChanged(e) {
        changeNumberOfWeeks(e.target.value)
    }
    return (
        <List>
            <ListItem>
                <ListItemText primary="Number of weeks" />
                <TextField value={numberOfWeeks} type="number" onChange={onNumberOfWeeksChanged} />

            </ListItem>
            <ListItem>
                <ListItemText primary="Clear Local Storage" />
                <IconButton onClick={cleanData}>
                    <Delete color="error" />
                </IconButton>


            </ListItem>
        </List>
    )
}