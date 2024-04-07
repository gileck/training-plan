import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Delete, ExpandCircleDown, ExpandCircleUp, ExpandMore, ExpandLess, } from "@mui/icons-material";
import { Autocomplete, Button, Chip, Dialog, DialogTitle, Grid, MenuItem, Select, TextField } from '@mui/material';
import { exercisesList } from '../exercisesList';
export function AddExerciseDialog({ onAddExercise, exercises, addExerciseDialogOpen, onClose }) {
    return (
        <Dialog
            disableEscapeKeyDown
            open={addExerciseDialogOpen}
            onClose={() => onClose()}
            fullWidth={true}

        >
            <DialogTitle>
                Add Exercise
            </DialogTitle>
            <EditExerciseForm
                onCancel={() => onClose()}
                exercises={exercises}
                onAddExercise={onAddExercise}
            />
        </Dialog>
    );
}

export function EditExerciseForm({ onAddExercise, exerciseToEdit, exercises, onCancel }) {

    console.log({ exerciseToEdit });
    const exerciseOptions = exercisesList.filter(e => !exercises.find(ex => ex.name === e.name))
    const [exercise, setExercise] = useState(exerciseToEdit || exerciseOptions[0]);
    const [totalWeeklySets, setTotalWeeklySets] = useState(exerciseToEdit?.weeklySets || 5);
    const [reps, setReps] = useState(exerciseToEdit?.numberOfReps || 8);
    const [weight, setWeight] = useState(exerciseToEdit?.weight || 12);
    const [overloadType, setOverloadType] = useState(exerciseToEdit?.overloadType || 'sets');
    const [overloadValue, setOverloadValue] = useState(exerciseToEdit?.overloadValue || 5);
    console.log({ exercise });

    const onAddButtonClicked = () => {
        onAddExercise(Object.assign(exerciseToEdit || {}, {
            ...exercise,
            name: exercise.name,
            weeklySets: Number(totalWeeklySets),
            numberOfReps: Number(reps),
            weight: exercise.bodyWeight ? null : Number(weight),
            overloadType,
            overloadValue: Number(overloadValue),

        }))
    }

    const handleOverloadTypeChange = (event) => {
        setOverloadType(event.target.value);
    }


    return (
        <List
            sx={{
                background: '#f2f2f2',
                borderRadius: '10px',
                borderColor: 'grey',
                padding: '10px',

            }} component="div" disablePadding>
            <ListItem>
                <Autocomplete
                    size='small'
                    blurOnSelect
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    disablePortal
                    aria-label={"Exercise"}
                    label={"Exercise"}
                    value={exercise.name}
                    options={exerciseOptions.map((option) => ({ label: option.name, value: option }))}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                    onChange={(event, newValue) => {
                        console.log({ newValue });
                        if (newValue && newValue.value) {
                            setExercise(newValue.value)
                        }
                    }}
                />

            </ListItem>
            <ListItem>

                <TextField
                    label="Weekly Sets"
                    size='small'
                    sx={{ width: '100px' }}
                    value={totalWeeklySets}
                    onChange={(e) => setTotalWeeklySets(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    label="Reps"
                    size='small'
                    sx={{ width: '100px' }}

                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    size='small'
                    // disabled={true}
                    disabled={exercise.bodyWeight}
                    label="Weight (kg)"
                    sx={{ width: '100px' }}
                    value={exercise.bodyWeight ? 0 : weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText>Progressive Overload:</ListItemText>
            </ListItem>

            <ListItem>


                <Select
                    size='small'
                    sx={{ width: '100px' }}
                    value={overloadType}
                    onChange={handleOverloadTypeChange}>   {
                        ['sets', 'reps', 'weight'].map((overloadType, index) => (
                            <MenuItem key={index} value={overloadType}>{overloadType}</MenuItem>
                        ))
                    }
                </Select>
            </ListItem>
            <ListItem>
                <TextField
                    size='small'
                    sx={{ width: '100px' }}
                    label="Overload %"
                    value={overloadValue}
                    onChange={(e) => setOverloadValue(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />

            <ListItem>
                <Button
                    onClick={onAddButtonClicked}
                    variant="contained"
                    color="primary"
                >Add</Button>
                <Button
                    onClick={onCancel}
                    sx={{ marginLeft: '10px' }}
                    variant="outlined"
                >Cancel</Button>

            </ListItem>
        </List>
    )
}

