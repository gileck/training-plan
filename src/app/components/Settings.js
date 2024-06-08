import { useState } from "react";
import { Button, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import { localStorageAPI } from "../localStorageAPI";
import { Delete, Label } from "@mui/icons-material";
import { useExercisesAPI } from "../exercisesAPI";

export function Settings() {
    const { changeNumberOfWeeks, numberOfWeeks } = useExercisesAPI()
    const [cleanDataOption, setCleanDataOption] = useState('')
    function cleanData() {
        const res = confirm("Are you sure you want to clear " + cleanDataOption + "?")
        if (res) {
            localStorageAPI().cleanData(cleanDataOption)
        }
    }
    function onNumberOfWeeksChanged(e) {
        changeNumberOfWeeks(e.target.value)
    }
    function onClearDataChanged(e) {
        console.log('onClearDataChanged', e.target.value)
        setCleanDataOption(e.target.value)
    }

    function onApiKeyChanged(e) {
        const key = e.target.value
        localStorageAPI().saveData('openai-api-key', { key })
    }

    return (
        <List>
            <ListItem>
                <ListItemText primary="Number of weeks" />
                <TextField value={numberOfWeeks} type="number" onChange={onNumberOfWeeksChanged} />

            </ListItem>
            <ListItem>
                <ListItemText primary="Clear Local Storage" />

                <Select
                    onChange={onClearDataChanged}
                    value={cleanDataOption}
                    placeholder="Select option"

                >

                    {
                        Object.keys(localStorage).map((key, index) => (
                            <MenuItem key={index} value={key}>{key}</MenuItem>
                        ))
                    }
                </Select>

                <IconButton onClick={cleanData}>
                    <Delete color="error" />
                </IconButton>
            </ListItem>
            {/* <ListItem>
                <ListItemText primary="OPEN-AI API key:" />

                <TextField onInput={onApiKeyChanged} label="API KEY" />
            </ListItem> */}
        </List>
    )
}