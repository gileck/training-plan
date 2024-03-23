"use client"
import React from "react";
import { Card, } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Delete, RemoveCircle } from "@mui/icons-material";
import { AddExercise } from "./addExercise";
import { localStorageAPI } from "../localStorageAPI";
import AddExerciseListItem from "./AddExerciseListItem";
import _ from 'lodash'
import { useExercisesAPI } from "../exercisesAPI";
export function EditPlan() {

    const { addExercise, updateExercise, exercises, deleteExercise } = useExercisesAPI()

    console.log({ exercises });

    const exerciseToShow = _.groupBy(exercises, 'week')[1] || []
    const [open, setOpen] = React.useState(false);

    function onAddExercise(newExercise) {
        if (newExercise) {
            addExercise(newExercise);
        }
    }

    const onAddButtonClicked = (exercise) => {
        updateExercise(exercise, { weeklyTarget: Number(exercise.weeklyTarget) + 1 });
    }

    const onRemoveButtonClicked = (exercise) => {
        updateExercise(exercise, { weeklyTarget: Number(exercise.weeklyTarget) - 1 });

    }

    const onDeleteButtonClicked = (exercise) => {
        deleteExercise(exercise);
    }



    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <div>
                <List>
                    {exerciseToShow
                        .map((exercise) => (
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={exercise.name} secondary={`Weekly Target: ${exercise.weeklyTarget}`} />
                                    <IconButton onClick={() => onAddButtonClicked(exercise)}>
                                        <AddCircleIcon />
                                    </IconButton>
                                    <IconButton onClick={() => onRemoveButtonClicked(exercise)}>
                                        <RemoveCircle />
                                    </IconButton>
                                    <IconButton onClick={() => onDeleteButtonClicked(exercise)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        ))}

                    <AddExerciseListItem
                        selectedValue={''}
                        exercises={exercises}
                        onAddExercise={onAddExercise}
                    />
                </List>

            </div>
        </Box>
    )

}