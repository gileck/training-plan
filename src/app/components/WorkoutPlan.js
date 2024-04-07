import React, { useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Card, Button, Chip, Collapse, Divider, ListItemSecondaryAction, Typography } from "@mui/material";
import { Checkbox, ListItemIcon } from "@mui/material";
import { getPrimaryMuscle, getSecondaryMuscles, getAllBodyParts, getBodyParts, getCategory, getPullPushType, useExercisesAPI } from "../exercisesAPI";
import { RemoveCircle, AddCircle, AddCircleOutline, Delete, Edit, ExpandLess, ExpandMore, Label } from "@mui/icons-material";

function WorkoutExercise({ exercise, onRemoveSetComplete, onAddSetComplete, onDeleteExercise }) {
    const weeklyTargetReached = exercise.totalWeeklySets >= exercise.weeklyTarget;
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
                                Sets: {exercise.sets}

                            </Typography>
                        </React.Fragment>
                    } />



                <IconButton onClick={() => onDeleteExercise()}>
                    <Delete />
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
        </ListItem>
    );
}

function AddExerciseToWorkoutDialog({ open, handleClose, onAddExercise, exercises, workout }) {
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [selectedSets, setSelectedSets] = useState(0)
    function onExerciseSelected(e) {
        setSelectedExercise(e.target.value)
    }
    function onSetsChanged(e) {
        setSelectedSets(e.target.value)
    }
    function onAddButtonClicked() {
        onAddExercise(selectedExercise, selectedSets)
        handleClose()
    }
    return <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        size="small"
    >
        <DialogTitle>Add Exercise</DialogTitle>
        <DialogContent>
            <Box component="form" sx={{ padding: '15px' }}>
                <FormGroup>


                    <FormControl sx={{ marginBottom: '30px' }} component="div" >
                        <InputLabel id="addExercise-Select">Exercise</InputLabel>
                        <Select
                            labelId="addExercise-Select"
                            id="addExercise-Select"
                            label="Exercise"
                            value={selectedExercise}
                            onChange={onExerciseSelected}
                        >
                            {
                                exercises.map((exercise) => (
                                    <MenuItem key={exercise.id} value={exercise.name}>{exercise.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={{ marginBottom: '10px' }} component="div" >
                        <TextField
                            label="Sets"
                            id="sets"
                            type="number"
                            value={selectedSets}
                            onChange={onSetsChanged}
                        />
                    </FormControl>
                </FormGroup>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
                startIcon={<AddCircleOutline />}
                variant="contained"
                onClick={onAddButtonClicked}>
                Add
            </Button>
        </DialogActions>
    </Dialog>

}

function SelectWorkoutDialog({
    open,
    handleClose,
    onExercisePullPushChanged,
    onBodyPartChanged,
    onExerciseTypeChanged,
    changeSelectedWeek,
    exType,
    bodyParts,
    selectedWeek,
    pullPushType,
    numberOfWeeks,
    saveWorkout
}) {

    const [workoutName, setWorkoutName] = useState('')
    function onWorkoutNameChanged(e) {
        setWorkoutName(e.target.value)
    }

    function onSaveButtonClicked() {
        saveWorkout({ workoutName, exType, bodyParts, selectedWeek, pullPushType })
        handleClose()
    }


    return <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth={true}
    >
        <DialogTitle sx={{
            backgroundColor: '#d4ecf4',
        }}>Create Workout</DialogTitle>
        <DialogContent>
            <Box component="form" sx={{ padding: '15px' }}>
                <FormGroup>
                    <FormControl sx={{ marginBottom: '10px', padding: '10px' }} component="div" >
                        {/* <InputLabel id="name">Exercise Type</InputLabel> */}

                        <TextField label="Workout Name  " id="name" value={workoutName} onChange={onWorkoutNameChanged} />
                    </FormControl>

                    {/* <FormControl sx={{ marginBottom: '10px', padding: '10px' }} component="div" >
                        <InputLabel id="Select">Week</InputLabel>
                        <Select value={selectedWeek} onChange={changeSelectedWeek}>
                            {
                                _.range(0, numberOfWeeks).map((week) => (
                                    <MenuItem key={week} value={week}>Week {week}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl> */}
                    <FormControl sx={{ marginBottom: '10px', padding: '10px' }} component="div" >
                        <InputLabel id="Select">Exercise Type</InputLabel>

                        <Select value={exType} onChange={onExerciseTypeChanged}>
                            <MenuItem value={"fullBody"}>Full Body</MenuItem>
                            <MenuItem value={"Upper body"}>Upper Body</MenuItem>
                            <MenuItem value={"Legs"}>Legs</MenuItem>
                        </Select>
                    </FormControl>



                    <FormControl sx={{ marginBottom: '10px', padding: '10px' }} component="div" >
                        <InputLabel id="Select">Pull/Push</InputLabel>
                        <Select value={pullPushType} onChange={onExercisePullPushChanged}>
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"Pull"}>Pull</MenuItem>
                            <MenuItem value={"Push"}>Push</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ marginBottom: '10px', padding: '10px' }} component="div" >
                        <InputLabel id="Select">Body Parts</InputLabel>
                        <Select
                            labelId="Select"
                            multiple
                            value={bodyParts || []}
                            onChange={onBodyPartChanged}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                            renderValue={(selected) => (
                                <Box sx={{}}>
                                    {selected.map((value) => (
                                        <div>
                                            <span key={value}>{value}</span>
                                        </div>
                                    ))}
                                </Box>
                            )}
                        >
                            <MenuItem key={'all'} value={'All'}>
                                <Checkbox checked={bodyParts.indexOf("All") > -1} />
                                <ListItemText primary={"All"} />
                            </MenuItem>
                            {
                                getAllBodyParts().map((part) => (

                                    <MenuItem key={part} value={part}>
                                        <Checkbox checked={bodyParts.indexOf(part) > -1} />
                                        <ListItemText primary={part} />

                                    </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>
                </FormGroup>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
                variant="contained"
                onClick={onSaveButtonClicked}>
                Add
            </Button>

        </DialogActions>
    </Dialog>

}



export function WorkoutPlan() {

    const { workouts, exercises, updateExercise, numberOfWeeks, saveWorkoutAPI, deleteWorkout, editWorkout } = useExercisesAPI()
    console.log({ workouts, exercises });

    const [open, setOpen] = useState(false);
    const [openAddExercise, setOpenAddExercise] = useState(false)
    const [currentWorkoutId, setCurrentWorkoutId] = useState('')
    const [exType, setExerciseType] = useState('fullBody')
    const [selectedWeek, setSelectedWeek] = useState(0)
    const [bodyParts, setBodyParts] = useState([])
    const [pullPushType, setPullPushType] = useState('all')
    const [openWorkouts, setOpenWorkouts] = useState({})
    function displayWorkout(workoutId) {
        openWorkouts['left'] = false
        setOpenWorkouts({ ...openWorkouts, [workoutId]: !openWorkouts[workoutId] })
    }

    function getExercise(name) {
        return exercises.find(e => e.name === name)
    }
    function getExercises() {
        return exercises
            .map(e => ({ ...e, ...e.weeks[selectedWeek] }))
            .filter(e => exType === "fullBody" ? true : getCategory(e.name) === exType)
            // .filter(e => bodyParts === "all" ? true : getBodyParts(e.name).includes(bodyPart))
            .filter(e => bodyParts.includes('All') ? true : bodyParts.some(part => getBodyParts(e.name).includes(part)))
            .filter(e => pullPushType === "all" ? true : getPullPushType(e.name) === pullPushType)
    }
    const exerciseToShow = getExercises()


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function createExerciseObject(e, workoutName) {
        return {
            name: e.name,
            sets: e.weeklyTarget,
            id: `${e.name}-${workoutName}`,
            weeks: _.range(0, numberOfWeeks).map(week => ({
                week,
                totalWeeklySets: 0,
                weeklyTarget: e.weeklyTarget
            }))

        }
    }

    function saveWorkout({ workoutName }) {
        const exercises = getExercises().map(e => createExerciseObject(e, workoutName))
        saveWorkoutAPI({ name: workoutName, exercises })
        console.log('workout', workoutName, exercises);
    }

    function onSetComplete(workout, exercise, sets) {
        workout.exercises = workout.exercises.map(e => e.id === exercise.id ? {
            ...e,
            sets: Number(e.sets || 0) + Number(sets),
            weeks: e.weeks.map(w => {
                return {
                    ...w,
                    weeklyTarget: Number(e.sets || 0) + Number(sets),
                }
            })
        } : e)
        editWorkout(workout)
        // updateExercise(exercise.id, 0, {
        //     totalWeeklySets: Number(exercise.totalWeeklySets || 0) + Number(sets)
        // });
    }

    function onExercisePullPushChanged(e) {
        setPullPushType(e.target.value);
    }

    function onBodyPartChanged(e) {
        setBodyParts(e.target.value);
    }

    function onExerciseTypeChanged(e) {
        setExerciseType(e.target.value);
    }
    function changeSelectedWeek(e) {
        setSelectedWeek(e.target.value);
    }
    function onDeleteIconClicked(workoutId) {
        deleteWorkout(workoutId)
    }
    function onAddIconClicked(workoutId) {
        setCurrentWorkoutId(workoutId)
        setOpenAddExercise(true)
    }
    function onEditIconClicked(workoutId) {
        const workout = workouts.find(w => w.id === workoutId)
    }
    function updateWorkoutExercise({ currentWorkoutId, exerciseName, sets }) {
        console.log({ currentWorkoutId, exerciseName, sets });

        const workout = workouts.find(w => w.id === currentWorkoutId)
        const e = createExerciseObject({
            ...getExercise(exerciseName),
            weeklyTarget: sets
        }, workout.name)
        workout.exercises.push(e)
        editWorkout(workout)
    }
    function deleteExerciseFromWorkout(workout, exercise) {
        workout.exercises = workout.exercises.filter(e => e.id !== exercise.id)
        editWorkout(workout)
    }
    function getExercisesNotInsideWorkouts() {
        return exercises
            .filter(e => !workouts.some(w => w.exercises.some(ex => ex.name === e.name)))
            .map(e => ({ ...e, sets: 0 }))
    }
    const exercisesNotInsideWorkouts = getExercisesNotInsideWorkouts()

    function getExercisesLeft() {
        return exercises.map(e => {
            const name = e.name
            const sets = Number(e.weeklySets)
            const workoutExercise = workouts.map(w => w.exercises.find(ex => ex.name === name)).filter(e => e)
            const totalSets = workoutExercise.reduce((acc, ex) => acc + Number(ex.sets), 0)
            console.log({
                name,
                sets,
                totalSets,
                left: sets - totalSets

            });

            return {
                name,
                sets,
                totalSets,
                left: sets - totalSets
            }
        })
    }
    return (
        <div>

            <SelectWorkoutDialog
                open={open}
                handleClose={handleClose}
                onExercisePullPushChanged={onExercisePullPushChanged}
                onBodyPartChanged={onBodyPartChanged}
                onExerciseTypeChanged={onExerciseTypeChanged}
                changeSelectedWeek={changeSelectedWeek}
                exType={exType}
                bodyParts={bodyParts}
                selectedWeek={selectedWeek}
                pullPushType={pullPushType}
                numberOfWeeks={numberOfWeeks}
                saveWorkout={saveWorkout}
            />

            <AddExerciseToWorkoutDialog
                open={openAddExercise}
                handleClose={() => setOpenAddExercise(false)}
                onAddExercise={(exerciseName, sets) => { updateWorkoutExercise({ currentWorkoutId, exerciseName, sets }) }}
                exercises={exercises}
            // exercises={exercises.filter(e => !exerciseToShow.find(ex => ex.name === e.name))}
            />


            <Button
                variant="contained"
                sx={{
                    marginBottom: '10px'
                }}
                startIcon={<AddCircleOutline />}
                Label="Add Workout"
                onClick={handleClickOpen}>
                Add Workout
            </Button>
            <List
                sx={{
                    border: '0.1px solid lightgray',
                    padding: '0px',
                }}
            >
                {
                    workouts.map((workout) => (
                        <Card key={workout.id}>
                            <ListItem
                                sx={{ backgroundColor: '#d4ecf4' }}
                                key={workout.id}
                                onClick={() => displayWorkout(workout.id)}>
                                <ListItemText
                                    primary={workout.name}
                                    secondary={`Total Sets: ${workout.exercises.reduce((acc, exercise) => acc + (Number(exercise.sets) || 0), 0)}`}
                                />
                                <ListItemSecondaryAction >
                                    <IconButton onClick={() => displayWorkout(workout.id)}>
                                        {openWorkouts[workout.id] ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                    <IconButton onClick={() => onAddIconClicked(workout.id)} >
                                        <AddCircle />
                                    </IconButton>
                                    <IconButton onClick={() => onDeleteIconClicked(workout.id)} >
                                        <Delete />
                                    </IconButton>

                                </ListItemSecondaryAction>
                            </ListItem>
                            <Collapse in={openWorkouts[workout.id]}>
                                {
                                    workout.exercises.map((exercise) => (
                                        <React.Fragment key={exercise.id}>
                                            <Divider />

                                            <WorkoutExercise
                                                key={exercise.id}
                                                exercise={exercise}
                                                onRemoveSetComplete={() => onSetComplete(workout, exercise, -1)}
                                                onAddSetComplete={() => onSetComplete(workout, exercise, 1)}
                                                onDeleteExercise={() => deleteExerciseFromWorkout(workout, exercise)}
                                            />
                                        </React.Fragment>
                                    ))
                                }
                            </Collapse>
                            <Divider />
                        </Card>
                    ))
                }
            </List>

            { exercisesNotInsideWorkouts.length > 0 ? (<Card>
                <CardHeader
                    sx={{ backgroundColor: '#d4ecf4', padding: '10px' }}
                    title={
                        <Typography >Exercises Left
                            <IconButton onClick={() => displayWorkout('left')}>
                                {openWorkouts['left'] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Typography>

                    }
                    onClick={() => displayWorkout('left')}
                >


                </CardHeader>
                <Collapse in={openWorkouts['left']}>
                    <List>
                        {
                            exercisesNotInsideWorkouts.map((exercise) => (
                                <ListItem key={exercise.id}>
                                    <ListItemText
                                        primary={exercise.name}
                                        secondary={`
                                    
                                    Sets: ${exercise.totalSets}  / ${exercise.sets}
                                    
                                    `}
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
                </Collapse>


            </Card>) : null}

        </div >
    );
}