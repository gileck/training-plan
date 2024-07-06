import { useState } from "react";
import { Button, Divider, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Switch, TextField } from "@mui/material";
import { localStorageAPI } from "../localStorageAPI";
import { Delete, Label } from "@mui/icons-material";
import { useExercisesAPI } from "../exercisesAPI";

export function Settings() {
    const { changeNumberOfWeeks, numberOfWeeks } = useExercisesAPI()
    const [cleanDataOption, setCleanDataOption] = useState('')
    const [localStorageDataEnter, setLocalStorageDataEnter] = useState('')
    const [keepCurrentWeekOpened, setKeepCurrentWeekOpened] = useState(localStorageAPI().getConfig('keep-current-week-opened') || false)

    function cleanData() {
        const res = confirm("Are you sure you want to clear " + cleanDataOption + "?")
        if (res) {
            localStorageAPI().cleanData(cleanDataOption)
        }
    }

    function onNumberOfWeeksChanged(e) {
        const newNumberofWeeks = Number(e.target.value)
        if (newNumberofWeeks < numberOfWeeks) {
            const res = confirm(`This will delete the data of the last ${numberOfWeeks - newNumberofWeeks} workouts. Are you sure you want to continue?`)
            if (res) {
                changeNumberOfWeeks(newNumberofWeeks)
            } else {
                // setSelectedNumberOfWeeks(numberOfWeeks)
            }
        } else {
            changeNumberOfWeeks(newNumberofWeeks)
        }
    }
    function onClearDataChanged(e) {
        console.log('onClearDataChanged', e.target.value)
        setCleanDataOption(e.target.value)
    }

    function onApiKeyChanged(e) {
        const key = e.target.value
        localStorageAPI().saveData('openai-api-key', { key })
    }

    function onSetLocalStorageClicked() {
        try {
            const obj = JSON.parse(localStorageDataEnter)
            for (const key in obj) {
                localStorageAPI().saveData(key, obj[key])
            }
        } catch (e) {
            console.error(e)
        }
    }

    function onSetLocalStorageEntered(e) {
        setLocalStorageDataEnter(e.target.value)
    }

    function copyLocalStorage() {
        const { getData } = localStorageAPI()
        const trainingPlans = getData('trainingPlans')
        navigator.clipboard.writeText(JSON.stringify({ trainingPlans }))
    }

    function onKeepCurrentWeekOpenedChange(e) {
        setKeepCurrentWeekOpened(e.target.checked)
        localStorageAPI().saveConfig('keep-current-week-opened', e.target.checked)
    }


    return (
        <List>

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
            <Divider />

            {/* <ListItem>
                <ListItemText primary="OPEN-AI API key:" />

                <TextField onInput={onApiKeyChanged} label="API KEY" />
            </ListItem> */}

            <ListItem>
                <ListItemText primary="Set Local Storage" />
                <TextField
                    sx={{
                        width: '300px'

                    }}
                    onInput={onSetLocalStorageEntered} label="Paste Object" />
                <Button
                    sx={{
                        marginLeft: '20px'

                    }}
                    variant="contained"
                    onClick={onSetLocalStorageClicked}>Set</Button>
            </ListItem>
            <Divider />

            <ListItem>
                <ListItemText primary="Copy Local Storage" />
                <Button
                    variant="contained"
                    onClick={copyLocalStorage}>Copy</Button>
            </ListItem>

            <Divider />

            <ListItem>
                <ListItemText primary="Keep Current Week Opened" />
                <Switch
                    checked={keepCurrentWeekOpened}
                    onChange={onKeepCurrentWeekOpenedChange}
                />
            </ListItem>





        </List>
    )
}