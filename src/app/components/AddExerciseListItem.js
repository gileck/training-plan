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
import { Button, Grid, MenuItem, Select, TextField } from '@mui/material';
import { exercisesList } from '../exercisesAPI';

function AddExerciseListItem({ onAddExercise }) {
    const [open, setOpen] = useState(false);

    function onAddExerciseInternal(exercise) {
        onAddExercise(exercise);
        setOpen(false);
    }


    const handleClick = () => {
        setOpen(!open)
    }


    return (
        <List>
            <ListItem onClick={handleClick}>
                <ListItemIcon>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                <ListItemText primary="" />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <EditExerciseForm
                    onAddExercise={onAddExerciseInternal}
                />
            </Collapse>
        </List>
    );
}

export function EditExerciseForm({ onAddExercise, exerciseToEdit }) {

    const [exerciseName, setExerciseName] = useState(exerciseToEdit?.name || exercisesList[0].name);
    const [totalWeeklySets, setTotalWeeklySets] = useState(exerciseToEdit?.weeklyTarget || 5);
    const [reps, setReps] = useState(exerciseToEdit?.numberOfReps || 8);
    const [weight, setWeight] = useState(exerciseToEdit?.weight || 12);
    const [overloadType, setOverloadType] = useState(exerciseToEdit?.overloadType || 'sets');
    const [overloadValue, setOverloadValue] = useState(exerciseToEdit?.overloadValue || 5);

    const onAddButtonClicked = () => {
        onAddExercise(Object.assign(exerciseToEdit || {}, {
            name: exerciseName,
            weeklyTarget: Number(totalWeeklySets),
            numberOfReps: Number(reps),
            weight: Number(weight),
            overloadType,
            overloadValue: Number(overloadValue),
        }))
    }

    const handleChange = (event) => {
        setExerciseName(event.target.value);
    }
    const handleOverloadTypeChange = (event) => {
        setOverloadType(event.target.value);
    }

    return (
        <List component="div" disablePadding>
            <ListItem>
                <Select
                    sx={{ width: '140px' }}
                    value={exerciseName}
                    onChange={handleChange}>   {
                        exercisesList.map((exercise, index) => (
                            <MenuItem key={index} value={exercise.name}>{exercise.name}</MenuItem>
                        ))
                    }
                </Select>
            </ListItem>
            <ListItem>

                <TextField
                    label="Weekly Sets"
                    value={totalWeeklySets}
                    onChange={(e) => setTotalWeeklySets(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    label="Reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    label="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText>Progressive Overload:</ListItemText>
            </ListItem>

            <ListItem>


                <Select
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
                    label="Overload"
                    value={overloadValue}
                    onChange={(e) => setOverloadValue(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />

            <ListItem>
                <ListItemButton onClick={onAddButtonClicked}>Add</ListItemButton>
                <ListItemButton>Clean</ListItemButton>

            </ListItem>
        </List>
    )
}

export default AddExerciseListItem;