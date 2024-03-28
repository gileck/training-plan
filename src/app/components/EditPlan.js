"use client"
import React from "react";
import { Card, Collapse, } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { Delete, EditLocationAlt, EditNotifications, RemoveCircle } from "@mui/icons-material";
import AddExerciseListItem, { EditExerciseForm } from "./AddExerciseListItem";
import _ from 'lodash'
import { useExercisesAPI } from "../exercisesAPI";
export function EditPlan() {

    const { addExercise, updateExercise, exercises, deleteExercise } = useExercisesAPI()


    const exerciseToShow = _.groupBy(exercises, 'week')[1] || []
    const [open, setOpen] = React.useState(false);
    const [editExerciseOpened, setEditExercise] = React.useState({});
    console.log({ editExerciseOpened });

    function handleEditExerciseClicked(id) {
        setEditExercise({ ...editExerciseOpened, [id]: !editExerciseOpened[id] });
    }
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

    const editExerciseInternal = (exercise) => {
        addExercise(exercise);
        setEditExercise({ ...editExerciseOpened, [exercise.id]: false });
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
                            <React.Fragment key={exercise.id}>


                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary={exercise.name}

                                            secondary={`
                                        Weekly Sets: ${exercise.weeklyTarget}
                                        ${exercise.numberOfReps && exercise.weight ?
                                                "(" + exercise.numberOfReps + 'x' + exercise.weight + 'kg' + ")" : ''} 
                                            
                                    `} />

                                        <IconButton onClick={() => handleEditExerciseClicked(exercise.id)}>
                                            <EditLocationAlt />
                                        </IconButton>
                                        <IconButton onClick={() => onDeleteButtonClicked(exercise)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={editExerciseOpened[exercise.id]}>
                                    <EditExerciseForm
                                        onAddExercise={editExerciseInternal}
                                        exerciseToEdit={exercise}
                                    />
                                </Collapse>
                            </React.Fragment>
                        ))}

                    <AddExerciseListItem
                        exercises={exercises}
                        onAddExercise={onAddExercise}
                    />
                </List>

            </div>
        </Box>
    )

}