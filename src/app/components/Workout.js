import React, { useContext, useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Chip, Collapse, Divider, ListItemSecondaryAction, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getPrimaryMuscle, getSecondaryMuscles, useExercisesAPI } from "../exercisesAPI";
import { RemoveCircle, ExpandLess, ExpandMore, Label, ExpandMoreOutlined, ExpandLessRounded, ArrowLeft, ArrowRight, NavigationOutlined } from "@mui/icons-material";
import { AppContext } from "../AppContext";
import Fab from '@mui/material/Fab';

// import { Exercise } from "./TrainingPlan";

const colors = {
    listHeaderBackground: '#a8cbe1',
    listHeaderText: '#FFFFFF',
    listHeaderSecondaryText: '#FFFFFF',
    workoutBackground: '#e4e4e4',
    exerciseBackground: '#FAFAFA',
    exerciseBackgroundSelected: '#96ddff',
}


function Exercise({ isSelected, selectExercise, selectedWeek, exercise, onRemoveSetComplete, onAddSetComplete, onSetDone }) {
    if (!exercise) {
        return null;
    }

    const weeklyTargetReached = exercise.sets.done >= exercise.sets.target;
    return (
        <ListItem
            // onClick={() => selectExercise('runExercise', {
            //     exerciseIds: exercise.id,
            //     week: selectedWeek
            // })}
            onClick={() => selectExercise(exercise.id)}
            sx={{

                flexDirection: 'column',
                alignItems: 'flex-start',
                backgroundColor: isSelected ? colors.exerciseBackgroundSelected : colors.exerciseBackground,
            }}
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
    const firstWeekWithExercisesLeft = _.range(0, numberOfWeeks).find(week => !workouts.every(w => w.exercises.every(e => e.weeks[week].totalWeeklySets >= e.weeks[week].weeklyTarget)))
    const firstWorkoutWithExercisesLeft = workouts.find(w => w.exercises.some(e => e.weeks[firstWeekWithExercisesLeft].totalWeeklySets < e.weeks[firstWeekWithExercisesLeft].weeklyTarget))
    const [selectedExercises, setSelectedExercises] = useState([])

    const [selectedWeek, setSelectedWeek] = useState(firstWeekWithExercisesLeft || 0)
    const [openWorkouts, setOpenWorkouts] = useState({
        [firstWorkoutWithExercisesLeft?.id]: true
    });

    function selectExercise(exerciseId) {

        if (selectedExercises.includes(exerciseId)) {
            setSelectedExercises(selectedExercises.filter(id => id !== exerciseId))
            return;
        } else {
            setSelectedExercises([exerciseId, ...selectedExercises])

            // if (selectedExercises.length === 2) {
            //     setSelectedExercises([exerciseId, selectedExercises[0]])
            //     return;
            // } else {
            //     setSelectedExercises([exerciseId, ...selectedExercises])
            // }

        }

    }

    function getExercise(exercise) {
        const e = exercises.find(e => e.name === exercise.name);
        if (!e || !e.weeks) {
            return null
        }
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
            totalWeeklySets: Number(exercise.weeks[selectedWeek].weeklyTarget || 0)
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

    const openWorkout = (workoutId) => setOpenWorkouts({ ...openWorkouts, [workoutId]: !openWorkouts[workoutId] })
    function isWorkoutFinished(workout) {
        return workout.exercises.every((exercise) => {
            const e = getExercise(exercise);
            return e.sets.done >= e.sets.target;
        })
    }
    const totalSetsThisWeek = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0), 0)
    const thisWeekSetsTarget = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0), 0)
    const isWeekDone = totalSetsThisWeek >= thisWeekSetsTarget
    const { setRoute } = useContext(AppContext);
    return (<div>
        {
            selectedExercises.length > 0 ? <Fab
                onClick={() => setRoute('runExercise', {
                    exerciseIds: selectedExercises.join(','),
                    week: selectedWeek
                })
                }
                variant="extended"
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: '70px',
                    right: "130px",
                }}>

                {/* <NavigationOutlined sx={{ mr: 1 }} /> */}
                Super Set
            </Fab> : ''}
        < List
            sx={{
                paddingTop: '0px',

            }}

        >
            <ListItem
                sx={{
                    backgroundColor: colors.listHeaderBackground,
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                }}
            >
                <ListItemText
                    sx={{
                        // color: colors.listHeaderText,
                    }}
                    primary={<div style={{ fontSize: '25px' }}>
                        Workouts
                    </div>}

                    secondary={<React.Fragment>
                        <div>Week:
                            <IconButton
                                sx={{ padding: '3px', mb: '2px' }}
                                disabled={selectedWeek === 0}

                                onClick={() => setSelectedWeek((selectedWeek - 1) % numberOfWeeks)}>
                                <ArrowLeft sx={{ fontSize: '15px' }} />
                            </IconButton>
                            {selectedWeek + 1}

                            <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>

                            {numberOfWeeks}

                            <IconButton
                                sx={{ padding: '3px' }}
                                disabled={selectedWeek === numberOfWeeks - 1}

                                onClick={() => setSelectedWeek(selectedWeek + 1 % numberOfWeeks)}>
                                <ArrowRight sx={{ fontSize: '15px' }} />
                            </IconButton>

                        </div>

                        <div>Sets:
                            <span style={{ marginLeft: '5px', }}>{totalSetsThisWeek}</span>
                            <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>
                            <span style={{ marginRight: '5px', }}>{thisWeekSetsTarget}</span>
                            {isWeekDone ? '✅' : ''}
                        </div>
                    </React.Fragment>}

                />



            </ListItem>
            <Divider />
            {
                workouts.map((workout) => (
                    <React.Fragment key={workout.id}>

                        <ListItem

                            sx={{
                                backgroundColor: colors.workoutBackground,
                            }}

                            onClick={() => openWorkout(workout.id)} key={workout.id}>
                            <ListItemText
                                sx={{}}
                                primary={`
                                    ${workout.name}
                                    ${isWorkoutFinished(workout) ? '✅' : ''}
                                `}
                                secondary={<React.Fragment>
                                    <div>

                                        <span style={{ marginRight: '5px' }}>Sets:</span>
                                        {workout.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0)}
                                        <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>

                                        {workout.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0)}
                                    </div>
                                </React.Fragment>}
                            />

                            <ListItemSecondaryAction>
                                <IconButton onClick={() => openWorkout(workout.id)}>
                                    {openWorkouts[workout.id] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </ListItemSecondaryAction>

                        </ListItem>
                        {openWorkouts[workout.id] ? <Divider /> : ''}

                        <Collapse in={openWorkouts[workout.id]} timeout="auto" unmountOnExit>
                            {
                                workout.exercises.map((exercise) => (
                                    <React.Fragment key={exercise.id}>
                                        <Exercise
                                            isSelected={selectedExercises.includes(exercise.id)}
                                            selectExercise={selectExercise}
                                            selectedWeek={selectedWeek}
                                            key={exercise.id}
                                            exercise={getExercise(exercise)}
                                            onRemoveSetComplete={() => onSetComplete(workout.id, exercise, -1)}
                                            onAddSetComplete={() => onSetComplete(workout.id, exercise, 1)}
                                            onSetDone={() => onExerciseDone(workout.id, exercise)}
                                        />
                                        <Divider />
                                    </React.Fragment>

                                ))
                            }
                        </Collapse>
                        <Divider />
                    </React.Fragment>
                ))
            }
        </List>
        {/* 
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
        </Box > */}

    </div >
    );
}