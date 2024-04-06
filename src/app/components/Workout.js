import React, { useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Button, Chip, Collapse, Divider, ListItemSecondaryAction, Typography } from "@mui/material";
import { Checkbox, ListItemIcon } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getPrimaryMuscle, getSecondaryMuscles, getAllBodyParts, getBodyParts, getCategory, getPullPushType, useExercisesAPI } from "../exercisesAPI";
import { RemoveCircle, AddCircle, AddCircleOutline, Delete, Edit, ExpandLess, ExpandMore, Label } from "@mui/icons-material";
// import { Exercise } from "./TrainingPlan";

function Exercise({ exercise, onRemoveSetComplete, onAddSetComplete, onSetDone }) {
    const weeklyTargetReached = exercise.sets.done >= exercise.sets.target;
    return (
        <ListItem


            sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>

                <ListItemText
                    style={{ textDecoration: weeklyTargetReached ? 'line-through' : '' }}
                    primary={exercise.name}
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {
                                    exercise.sets ?
                                        `Sets: ${exercise.sets.done || 0} / ${exercise.sets.target}` : ''
                                }

                            </Typography>
                            <Typography
                                sx={{ ml: '10px', display: !exercise.bodyWeight && exercise.numberOfReps && exercise.weight ? 'inline' : 'none' }}
                                component="span"
                                variant="body2"
                                color="text.secondary"

                            >
                                ({exercise.numberOfReps}x{exercise.weight}kg)
                            </Typography>
                        </React.Fragment>
                    } />


                <IconButton onClick={() => onSetDone()}>
                    <CheckCircleIcon />
                </IconButton>

                <IconButton onClick={() => onAddSetComplete()}>
                    <AddCircleIcon />
                </IconButton>
                <IconButton onClick={() => onRemoveSetComplete()}>
                    <RemoveCircle />
                </IconButton>
            </Box>
            <Box sx={{ pt: 1 }}> {/* This Box is optional and provides padding top */}

                <Chip
                    sx={{ mr: 1 }}
                    key={getPrimaryMuscle(exercise.name)}
                    label={getPrimaryMuscle(exercise.name)}
                    size="small"
                />



                {getSecondaryMuscles(exercise.name).map((bodyPart) => (
                    <Chip
                        sx={{ mr: 1 }}
                        key={bodyPart}
                        label={bodyPart}
                        size="small"
                        variant="outlined"
                    />
                ))}
            </Box>
        </ListItem >
    );
}




export function Workout() {

    const { workouts, exercises, updateExercise, numberOfWeeks } = useExercisesAPI()

    const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0].id)
    const [selectedWeek, setSelectedWeek] = useState(0)

    console.log({ workouts, exercises, selectedWorkoutId });


    function getExercise(exercise) {
        const e = exercises.find(e => e.name === exercise.name);
        const exerciseData = {
            ...e,
            ...e.weeks[selectedWeek],
            ...exercise,
            ...exercise.weeks[selectedWeek],
            sets: {
                done: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0),
                target: Number(exercise.weeks[selectedWeek].weeklyTarget || 0),
            }
        }
        return exerciseData;
    }

    function onSetComplete(workoutId, exercise, sets) {
        updateExercise(workoutId, exercise.id, selectedWeek, {
            totalWeeklySets: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0) + Number(sets)
        });
    }

    function onExerciseDone(workoutId, exercise) {
        updateExercise(workoutId, exercise.id, selectedWeek, {
            totalWeeklySets: Number(exercise.sets)
        });
    }

    function getAllExercises() {
        return workouts.map(w => {
            return w.exercises.map(e => ({
                ...e,
                workoutId: w.id
            }))
        }).flat();
    }

    const workout = selectedWorkoutId === 'all' ? null : workouts.find(w => w.id === selectedWorkoutId);
    return (
        <Box sx={{ padding: "10px" }}>
            <FormGroup sx={{ display: "flex", flexDirection: "row" }}>

                <FormControl sx={{ display: "inline-flex" }} component="div">
                    <InputLabel id="workout-select-label">Select Workout</InputLabel>
                    <Select
                        sx={{ minWidth: '200px' }}
                        labelId="workout-select-label"
                        id="workout-select-label"
                        label="Select Workout"
                        value={selectedWorkoutId === 'all' ? 'all' : workouts.find(w => w.id === selectedWorkoutId).id}



                        size="xl"
                        onChange={(e) => setSelectedWorkoutId(e.target.value)}
                    >
                        <MenuItem key={'all'} value={'all'}>All</MenuItem>

                        {
                            workouts.map((workout) => (
                                <MenuItem key={workout.id} value={workout.id}>{workout.name}</MenuItem>
                            ))

                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ display: "inline-flex", marginLeft: '10px' }} component="div">

                    <InputLabel id="week-select-label">Select Week</InputLabel>
                    <Select
                        labelId="week-select-label"
                        id="week-select-label"
                        label="Select Week"
                        value={selectedWeek}



                        size="xl"
                        onChange={(e) => setSelectedWeek(e.target.value)}
                    >
                        {
                            _.range(0, numberOfWeeks).map((week) => (
                                <MenuItem key={week} value={week}>Week {week + 1}</MenuItem>
                            ))

                        }
                    </Select>
                </FormControl>

            </FormGroup>
            <Box sx={{ marginTop: '10px' }}>


                {
                    workout && workout.exercises.map((exercise) => (
                        <React.Fragment key={exercise.id}>
                            <Divider />

                            <Exercise
                                key={exercise.id}
                                exercise={getExercise(exercise)}
                                onRemoveSetComplete={() => onSetComplete(workout.id, exercise, -1)}
                                onAddSetComplete={() => onSetComplete(workout.id, exercise, 1)}
                                onSetDone={() => onExerciseDone(workout.id, exercise)}
                            />
                        </React.Fragment>
                    ))
                }

                {
                    selectedWorkoutId === 'all' && getAllExercises().map((exercise) => (
                        <React.Fragment key={exercise.id}>
                            <Divider />

                            <Exercise
                                key={exercise.id}
                                exercise={getExercise(exercise)}
                                onRemoveSetComplete={() => onSetComplete(exercise.workoutId, exercise, -1)}
                                onAddSetComplete={() => onSetComplete(exercise.workoutId, exercise, 1)}
                                onSetDone={() => onExerciseDone(exercise.workoutId, exercise)}
                            />
                        </React.Fragment>
                    ))
                }
            </Box>

        </Box >
    );
}