"use client"
import React, { useContext, useState } from "react";
import { Avatar, Button, Card, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormGroup, InputLabel, ListItemAvatar, MenuItem, Select, TextField, } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { Add, AddCircle, Delete, EditLocationAlt, EditNotifications, EditOutlined, FindReplace, FindReplaceSharp, FindReplaceTwoTone, Label, RemoveCircle, Replay, ReplayCircleFilled } from "@mui/icons-material";
import { AddExerciseDialog, EditExerciseForm, CreateNewExerciseDialog, ReplaceExerciseDialog } from "./AddExerciseListItem";
import _ from 'lodash'
import { useExercisesAPI } from "../exercisesAPI";
import EditIcon from '@mui/icons-material/Edit';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { isBodyWeightExercise } from "../exercisesAPI";
import { AppTabs } from "../tabs";
import { WorkoutPlan } from "./WorkoutPlan";
import { exercisesList, getImageUrl, getLocalExercises } from "../exercisesList";
import { localStorageAPI } from "../localStorageAPI";
import { BodyPartsPlan } from "./BodyPartsPlan";
import { BuildTrainingPlanDialog } from "./BuildTrainingPlanDialog";
import { WorkoutList } from "./WorkoutList";
import { AppContext } from "../AppContext";
import { EditPlanChat } from "@/app/components/EditPlanChat";
import { AddCustomExercise } from "./SelectExercise";

const { getData, saveData, cleanData } = localStorageAPI();


function PlanSettings({ trainingPlan, setNumberOfWeeks, updateName }) {

    function onNumberOfWeeksChange(numberOfWeeks) {
        const newNumberofWeeks = Number(numberOfWeeks)
        if (newNumberofWeeks < trainingPlan.numberOfWeeks) {
            const res = confirm(`
            This will delete the data of the last ${trainingPlan.numberOfWeeks - newNumberofWeeks} weeks of workouts. 
            Are you sure you want to continue?`)
            if (res) {
                setNumberOfWeeks(newNumberofWeeks)
            }
        } else {
            setNumberOfWeeks(newNumberofWeeks)
        }
    }

    const debouncedUpdateName = _.debounce(updateName, 1000)
    function onTrainingPlanNameChange(name) {
        if (name) {
            debouncedUpdateName(name)
        }
    }

    return <Box>
        <FormGroup sx={{

            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '10px'
        }}>

            <FormControl>

                <TextField
                    label="Plan Name"
                    defaultValue={trainingPlan.name}
                    fullWidth
                    onChange={(e) => onTrainingPlanNameChange(e.target.value)}
                />
            </FormControl>


            <FormControl>
                <InputLabel>Number of Weeks</InputLabel>

                <Select
                    label="Number of Weeks"

                    value={trainingPlan.numberOfWeeks}
                    onChange={(e) => onNumberOfWeeksChange(e.target.value)}
                >
                    {_.range(1, 16).map((week) => (
                        <MenuItem key={week} value={week}>
                            {week}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </FormGroup>
    </Box>
}


export function EditPlan({ }) {
    const { createTrainingPlanActions, findTrainingPlanById, currentTrainingPlan } = useExercisesAPI()
    const { params: { trainingPlan: planId } } = useContext(AppContext);
    const trainingPlan = planId ? findTrainingPlanById(planId) : currentTrainingPlan
    if (!trainingPlan) return null;
    const actions = createTrainingPlanActions(trainingPlan)


    return <AppTabs noCard={true} Comps={[
        { label: 'Chat', Comp: <EditPlanChat trainingPlan={trainingPlan} {...actions} /> },
        { label: 'Exercises', Comp: <EditTrainingPlan trainingPlan={trainingPlan} {...actions} /> },
        { label: 'Workouts', Comp: <WorkoutPlan trainingPlan={trainingPlan} {...actions} /> },
        // { label: 'Body Parts', Comp: <BodyPartsPlan trainingPlan={trainingPlan} {...actions} /> },
        { label: 'Settings', Comp: <PlanSettings trainingPlan={trainingPlan} {...actions} /> },
    ]} />
}

function TrainingPlanPreviewDialog({
    SaveTrainingPlan,
    isTrainingPlanPreviewDialogOpen,
    onClose,
    trainingPlan,
}) {

    if (!trainingPlan) return null;
    return <Dialog
        open={isTrainingPlanPreviewDialogOpen}
        onClose={onClose}
        fullWidth={true}
        sx={{ //You can copy the code below in your theme
            background: 'transparent',
            '& .MuiPaper-root': {
                background: '#4a4a73'
            },
            '& .MuiBackdrop-root': {
                backgroundColor: 'transparent' // Try to remove this to see the result
            }
        }}

    >

        <DialogTitle
            sx={{
                color: "white"
            }}
        >Training Plan Preview</DialogTitle>
        <DialogContent>
            <Box

            >
                <WorkoutList
                    workouts={trainingPlan.workouts}
                    exercises={trainingPlan.exercises}
                    numberOfWeeks={trainingPlan.numberOfWeeks || 8}
                    isWorkoutFinished={() => false}
                    selectedExercises={[]}
                    selectedWeek={0}
                    onWorkoutArrowClicked={() => { }}
                    selectExercise={() => { }}
                    onSetUncompleted={() => { }}
                    onSetClicked={() => { }}
                    onExerciseClicked={() => { }}
                    firstWorkoutWithExercisesLeft={{}}
                    onExerciseDone={() => { }}
                    onSetComplete={() => { }}

                />

            </Box>
        </DialogContent>
        <DialogActions
            sx={{
                backgroundColor: '#59c2ff',
                justifyContent: "space-between",
                padding: "18px"
            }}
        >


            <Button onClick={onClose} sx={{ color: 'gray' }}>Cancel</Button>
            <Button variant="contained" sx={{ color: "007BFF" }} onClick={() => SaveTrainingPlan(trainingPlan)}>Save Training Plan</Button>

        </DialogActions>
    </Dialog>
}

function EditTrainingPlan({
    saveTrainingPlan,
    createNewPlan,
    addWorkout,
    editExercise,
    addExercise,
    updateExercise,
    exercises,
    deleteExercise,
    cleanAllData,
    isExerciseExists,
    replaceExerciseByName
}) {

    const { getImageUrl } = useContext(AppContext);


    const exerciseToShow = exercises.map(e => ({ ...e, ...e.weeks[0] }))

    const [addExerciseDialogOpen, setOpen] = React.useState(false);
    const [createNewExerciseDialogOpen, setCreateNewExerciseDialogOpen] = React.useState(false);
    const [editExerciseOpened, setEditExercise] = React.useState({});
    const [selectedExercise, setSelectedExercise] = React.useState(null);

    console.log('selectedExercise', selectedExercise)

    function onExerciseSelected(exercise) {
        console.log('selected', exercise)
        setSelectedExercise(null);

        replaceExerciseByName(selectedExercise, exercise.name);

        // setSelectedExercise(exercise);
        // setAddCustomExerciseOpen(true);
    }

    const getExerciseFromTrainingPlan = (exerciseName) => {
        return exercises.find(e => e.name === exerciseName)
    }

    function createNewExercise() {
        setOpen(false);
        setCreateNewExerciseDialogOpen(true);
    }

    function handleReplaceExercise(exerciseName) {
        // setOpen(true);
        setSelectedExercise(exerciseName);
    }

    function handleEditExerciseClicked(id) {
        setEditExercise({ ...editExerciseOpened, [id]: !editExerciseOpened[id] });
    }
    function onAddExercise(newExercise) {
        if (newExercise) {
            addExercise(newExercise);
        }
        setOpen(false)
    }



    const editExerciseInternal = (exercise) => {
        editExercise(exercise);
        setEditExercise({ ...editExerciseOpened, [exercise.id]: false });
    }

    const onDeleteButtonClicked = (exercise) => {
        if (window.confirm(`Are you sure you want to delete ${exercise.name} ?`)) {
            deleteExercise(exercise);
        }
    }

    const onCreateNewExercise = (exercise) => {
        saveData('exercisesList', [...getLocalExercises(), exercise]);
        setCreateNewExerciseDialogOpen(false);
        setOpen(true);
    }

    function printSets(exercise) {
        return <React.Fragment>
            <div>
                Weekly Sets: {exercise.weeklyTarget}

                <div>
                    Reps: <span style={{ marginLeft: "2px" }}>
                        {exercise.weight === 0 && exercise.numberOfReps ? `${exercise.numberOfReps} (body weight)` : ""}
                        {exercise.weight !== 0 ?
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

            {selectedExercise && <ReplaceExerciseDialog
                exercises={exercises}
                addExerciseDialogOpen={!!selectedExercise}
                onClose={() => setSelectedExercise(null)}
                isExerciseExists={isExerciseExists}
                getExerciseFromTrainingPlan={getExerciseFromTrainingPlan}
                onExerciseSelected={onExerciseSelected}

            />}

            <AddExerciseDialog
                exercises={exercises}
                onAddExercise={onAddExercise}
                addExerciseDialogOpen={addExerciseDialogOpen}
                onClose={() => setOpen(false)}
                createNewExercise={createNewExercise}
                exerciseList={exercisesList}
                isExerciseExists={isExerciseExists}
                getExerciseFromTrainingPlan={getExerciseFromTrainingPlan}

            />


            <CreateNewExerciseDialog
                exercises={exercises}
                onAddExercise={onAddExercise}
                isDialogOpen={createNewExerciseDialogOpen}
                onClose={() => setCreateNewExerciseDialogOpen(false)}
                onCreateNewExercise={onCreateNewExercise}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>


                <Button
                    sx={{ fontSize: '15px', marginTop: '10px', }}
                    startIcon={<Add />}
                    onClick={() => setOpen(!addExerciseDialogOpen)}>

                    Add Exercise

                </Button>
                {/* <Button
                    sx={{ fontSize: '13px', float: 'right' }}
                    startIcon={<AddCircle />}
                    variant="contained"
                    onClick={() => setBuildTrainingPlanOpen(true)}>
                    Training Plan

                </Button> */}
            </div>
            <Divider sx={{ marginTop: '15px' }} />
            <List>
                {exerciseToShow
                    .map((exercise) => (
                        <React.Fragment key={exercise.id}>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Box
                                            sx={{
                                                height: '100px',
                                                width: '100px',
                                                backgroundImage: `url(${getImageUrl(exercise.name)})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        ></Box>
                                    </ListItemAvatar>
                                    <ListItemText primary={exercise.name}
                                        secondary={printSets(exercise)} />
                                    <IconButton>
                                        <Replay onClick={() => handleReplaceExercise(exercise.name)} />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditExerciseClicked(exercise.id)}>
                                        <EditOutlined />
                                    </IconButton>
                                    <IconButton onClick={() => onDeleteButtonClicked(exercise)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemButton>
                                {editExerciseOpened[exercise.id] ?
                                    <EditExerciseDialog
                                        exerciseList={exercisesList}
                                        exerciseToEdit={exercise}
                                        open={editExerciseOpened[exercise.id]}
                                        onAddExercise={editExerciseInternal}
                                        exercises={exercises}
                                        onClose={() => handleEditExerciseClicked(exercise.id)}
                                    /> : ''
                                }

                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
            </List>
        </div>
    )

}

function EditExerciseDialog({ exerciseList, exercises, exerciseToEdit, onAddExercise, open, onClose }) {
    return <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
    >
        <DialogTitle>Edit Exercise</DialogTitle>
        <EditExerciseForm
            onCancel={onClose}
            exercise={exerciseToEdit}
            onAddExercise={onAddExercise}
            isEdit={true}
        />

    </Dialog>
}