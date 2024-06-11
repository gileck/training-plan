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
import { RemoveCircle, ExpandLess, ExpandMore, Label, ExpandMoreOutlined, ExpandLessRounded, ArrowLeft, ArrowRight, NavigationOutlined, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { AppContext } from "../AppContext";
import Fab from '@mui/material/Fab';
import { localStorageAPI } from "@/app/localStorageAPI";

// import { Exercise } from "./TrainingPlan";

const colors = {
    listHeaderBackground: '#a8cbe1',
    listHeaderText: '#FFFFFF',
    listHeaderSecondaryText: '#FFFFFF',
    workoutBackground: '#e4e4e4',
    exerciseBackground: '#FAFAFA',
    exerciseBackgroundSelected: '#96ddff',
}


function Exercise({ shouldShowArrows, onWorkoutArrowClicked, isSelected, selectExercise, selectedWeek, exercise, onRemoveSetComplete, onAddSetComplete, onSetDone }) {
    if (!exercise) {
        return null;
    }

    const weeklyTargetReached = exercise.sets.done >= exercise.sets.target;
    return (
        <ListItem
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

                {isSelected ? <div style={{
                    display: 'grid',
                    marginRight: '15px',
                    color: 'gray',
                }}>
                    <ArrowUpward
                        onClick={() => onWorkoutArrowClicked(exercise, -1)}
                    />
                    <ArrowDownward
                        onClick={() => onWorkoutArrowClicked(exercise, 1)}
                    />
                </div> : ''}

                <ListItemText
                    onClick={() => selectExercise(exercise.id)}
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
                                sx={{ ml: '0px' }}
                                component="div"
                                variant="body2"
                                color="text.secondary"

                            >

                                {exercise.weight > 0 ? `${exercise.numberOfReps}x${exercise.weight}kg` : `${exercise.numberOfReps} reps`}
                                {exercise.weight === 0 ? " (body weight)" : ""}
                            </Typography>
                        </React.Fragment>
                    } />
                <IconButton onClick={() => onSetDone()}>
                    <CheckCircleIcon />
                </IconButton>
                <IconButton
                    disabled={exercise.sets.done >= exercise.sets.target}
                    onClick={() => onAddSetComplete()}>
                    <AddCircleIcon />
                </IconButton>
                <IconButton
                    disabled={exercise.sets.done === 0}
                    onClick={() => onRemoveSetComplete()}>
                    <RemoveCircle />
                </IconButton>
            </Box>
            <Box sx={{ pt: 1 }}> {/* This Box is optional and provides padding top */}
                {getPrimaryMuscle(exercise.name) ? <Chip
                    sx={{ mr: 1 }}
                    key={getPrimaryMuscle(exercise.name)}
                    label={getPrimaryMuscle(exercise.name)}
                    size="small"
                /> : ''}
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

    const { saveData, getData, getConfig, saveConfig } = localStorageAPI()
    const shouldKeepCurrentWeekOpened = getConfig('keep-current-week-opened') || false
    const currentWeekOpened = getConfig('current-week-opened') || 0

    console.log({
        shouldKeepCurrentWeekOpened,
        currentWeekOpened
    });
    const { workouts, exercises, updateExercise, numberOfWeeks, changeExerciseOrderInWorkout } = useExercisesAPI()

    const [selectedExercises, setSelectedExercises] = useState(getData('selectedExercises') || [])



    //shouldShowArrows, 
    //onWorkoutArrowClicked,
    function onWorkoutArrowClicked(wid, eid, value) {
        console.log({ value, wid, eid });
        changeExerciseOrderInWorkout(wid, eid, value)
    }

    function selectExercise(exerciseId) {

        let newSelectedExercises = [];
        if (selectedExercises.includes(exerciseId)) {
            newSelectedExercises = selectedExercises.filter(id => id !== exerciseId)
        } else {
            newSelectedExercises = [exerciseId, ...selectedExercises]
        }
        setSelectedExercises(newSelectedExercises)
        saveData('selectedExercises', newSelectedExercises)

    }



    function onSetComplete(workoutId, exercise, sets, selectedWeek) {

        updateExercise(workoutId, exercise.id, selectedWeek, {
            totalWeeklySets: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0) + Number(sets)
        });
    }

    function onExerciseDone(workoutId, exercise, selectedWeek) {
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



    const { setRoute } = useContext(AppContext);
    return (<div>




        <WorkoutList
            exercises={exercises}
            workouts={workouts}
            selectedExercises={selectedExercises}
            setSelectedExercises={setSelectedExercises}
            onWorkoutArrowClicked={onWorkoutArrowClicked}
            selectExercise={selectExercise}
            onSetComplete={onSetComplete}
            onExerciseDone={onExerciseDone}
            numberOfWeeks={numberOfWeeks}
            setRoute={setRoute}
            shouldKeepCurrentWeekOpened={shouldKeepCurrentWeekOpened}
            currentWeekOpened={currentWeekOpened}
            saveConfig={saveConfig}
        />




    </div >
    );
}

export function WorkoutList({
    exercises,
    workouts,
    selectedExercises,
    onWorkoutArrowClicked,
    selectExercise,
    onSetComplete,
    onExerciseDone,
    numberOfWeeks,
    setRoute,
    shouldKeepCurrentWeekOpened,
    currentWeekOpened,
    saveConfig
}) {
    const firstWeekWithExercisesLeft = _.range(0, numberOfWeeks).find(week => !workouts.every(w => w.exercises.every(e => e.weeks[week].totalWeeklySets >= e.weeks[week].weeklyTarget))) || 0
    const weekOpened = shouldKeepCurrentWeekOpened ? currentWeekOpened : firstWeekWithExercisesLeft

    const [selectedWeek, setSelectedWeek] = useState(weekOpened || 0)
    const firstWorkoutWithExercisesLeft = workouts.find(w => w.exercises.some(e => e.weeks[firstWeekWithExercisesLeft].totalWeeklySets < e.weeks[firstWeekWithExercisesLeft].weeklyTarget))
    const totalSetsThisWeek = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0), 0)
    const thisWeekSetsTarget = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0), 0)
    const isWeekDone = totalSetsThisWeek >= thisWeekSetsTarget

    const [openWorkouts, setOpenWorkouts] = useState({
        [firstWorkoutWithExercisesLeft?.id]: true
    });

    function onSelectedWeekChanges(newWeek) {
        setSelectedWeek(newWeek)
        saveConfig('current-week-opened', newWeek)
    }

    function isWorkoutFinished(workout) {
        return workout.exercises.every((exercise) => {
            const e = getExercise(exercise);
            if (!e) {
                return false
            }
            return e.sets.done >= e.sets.target;
        })

    }

    const openWorkout = (workoutId) => setOpenWorkouts({ ...openWorkouts, [workoutId]: !openWorkouts[workoutId] })

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


    return (

        <>
            {
                selectedExercises.length > 0 ? <Fab
                    onClick={() => setRoute('runExercise', {
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
                    Super Set ({selectedExercises.length})
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

                                    onClick={() => onSelectedWeekChanges((selectedWeek - 1) % numberOfWeeks)}>
                                    <ArrowLeft sx={{ fontSize: '15px' }} />
                                </IconButton>
                                {selectedWeek + 1}

                                <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>

                                {numberOfWeeks}

                                <IconButton
                                    sx={{ padding: '3px' }}
                                    disabled={selectedWeek === numberOfWeeks - 1}

                                    onClick={() => onSelectedWeekChanges(selectedWeek + 1 % numberOfWeeks)}>
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
                                                shouldShowArrows={true}
                                                onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(workout.id, e.id, v)}
                                                isSelected={selectedExercises.includes(exercise.id)}
                                                selectExercise={selectExercise}
                                                selectedWeek={selectedWeek}
                                                key={exercise.id}
                                                exercise={getExercise(exercise)}
                                                onRemoveSetComplete={() => onSetComplete(workout.id, exercise, -1, selectedWeek)}
                                                onAddSetComplete={() => onSetComplete(workout.id, exercise, 1, selectedWeek)}
                                                onSetDone={() => onExerciseDone(workout.id, exercise, selectedWeek)}
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
        </>

    )
}