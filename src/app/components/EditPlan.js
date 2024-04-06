"use client"
import React from "react";
import { Button, Card, Collapse, Dialog, DialogActions, DialogTitle, Divider, } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { AddCircle, Delete, EditLocationAlt, EditNotifications, RemoveCircle } from "@mui/icons-material";
import { AddExerciseDialog, EditExerciseForm } from "./AddExerciseListItem";
import _ from 'lodash'
import { useExercisesAPI } from "../exercisesAPI";
import EditIcon from '@mui/icons-material/Edit';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { isBodyWeightExercise } from "../exercisesAPI";
import { AppTabs } from "../tabs";
import { WorkoutPlan } from "./WorkoutPlan";

export function EditPlan() {
    return <AppTabs noCard={true} Comps={[
        { label: 'Training Plan', Comp: <EditTrainingPlan /> },
        { label: 'Workout Plan', Comp: <WorkoutPlan /> },
    ]} />


}

export function EditTrainingPlan() {

    const { addExercise, updateExercise, exercises, deleteExercise } = useExercisesAPI()


    const exerciseToShow = exercises.map(e => ({ ...e, ...e.weeks[0] }))

    const [addExerciseDialogOpen, setOpen] = React.useState(false);
    const [editExerciseOpened, setEditExercise] = React.useState({});

    function handleEditExerciseClicked(id) {
        setEditExercise({ ...editExerciseOpened, [id]: !editExerciseOpened[id] });
    }
    function onAddExercise(newExercise) {
        if (newExercise) {
            addExercise(newExercise);
        }
        setOpen(false)
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

    function printSets(exercise) {
        return <React.Fragment>
            <div>
                Weekly Sets: {exercise.weeklyTarget}

                <div>
                    Reps: <span style={{ marginLeft: "2px" }}>
                        {isBodyWeightExercise(exercise.name) && exercise.numberOfReps ? `${exercise.numberOfReps}` : ""}
                        {!isBodyWeightExercise(exercise.name) && exercise.numberOfReps && exercise.weight ?
                            exercise.numberOfReps + 'x' + exercise.weight + 'kg' : ''}
                    </span>
                </div>
            </div>
            <div>
                Progressive Overload: {exercise.overloadType} ({exercise.overloadValue}%)
            </div>
        </React.Fragment >
    }


    return (
        <div>
            <AddExerciseDialog
                exercises={exercises}
                onAddExercise={onAddExercise}
                addExerciseDialogOpen={addExerciseDialogOpen}
                onClose={() => setOpen(false)}

            />
            <Button
                startIcon={<AddCircle />}
                variant="contained"
                onClick={() => setOpen(!addExerciseDialogOpen)}>
                Add Exercise

            </Button>
            <Divider sx={{ marginTop: '15px' }} />
            <List>
                {exerciseToShow
                    .map((exercise) => (
                        <React.Fragment key={exercise.id}>


                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={exercise.name}

                                        secondary={printSets(exercise)} />

                                    <IconButton onClick={() => handleEditExerciseClicked(exercise.id)}>
                                        <EditCalendarIcon />
                                    </IconButton>
                                    <IconButton onClick={() => onDeleteButtonClicked(exercise)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemButton>
                                <EditExerciseDialog
                                    exerciseToEdit={exercise}
                                    open={editExerciseOpened[exercise.id]}
                                    onAddExercise={editExerciseInternal}
                                    exercises={exercises}
                                    onClose={() => handleEditExerciseClicked(exercise.id)}
                                />
                            </ListItem>
                            <Divider />

                        </React.Fragment>

                    ))}


            </List>

        </div>
    )

}

function EditExerciseDialog({ exercises, exerciseToEdit, onAddExercise, open, onClose }) {
    return <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
    >
        <DialogTitle>Edit Exercise</DialogTitle>
        <EditExerciseForm
            onCancel={onClose}
            exerciseToEdit={exerciseToEdit}
            exercises={exercises}
            onAddExercise={onAddExercise}
        />

    </Dialog>
}