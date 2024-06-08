"use client"
import React from "react";
import { Button, Card, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { AddCircle, Delete, EditLocationAlt, EditNotifications, EditOutlined, RemoveCircle } from "@mui/icons-material";
import { AddExerciseDialog, EditExerciseForm, CreateNewExerciseDialog } from "./AddExerciseListItem";
import _ from 'lodash'
import { useExercisesAPI } from "../exercisesAPI";
import EditIcon from '@mui/icons-material/Edit';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { isBodyWeightExercise } from "../exercisesAPI";
import { AppTabs } from "../tabs";
import { WorkoutPlan } from "./WorkoutPlan";
import { exercisesList, getLocalExercises } from "../exercisesList";
import { localStorageAPI } from "../localStorageAPI";
import { BodyPartsPlan } from "./BodyPartsPlan";
import { BuildTrainingPlanDialog } from "./BuildTrainingPlanDialog";
import { WorkoutList } from "./Workout";

const { getData, saveData, cleanData } = localStorageAPI();

export function EditPlan() {
    return <AppTabs noCard={true} Comps={[
        { label: 'Training Plan', Comp: <EditTrainingPlan /> },
        { label: 'Workout Plan', Comp: <WorkoutPlan /> },
        { label: 'Body Parts', Comp: <BodyPartsPlan /> },
    ]} />


}

function TrainingPlanPreviewDialog({
    SaveTrainingPlan,
    isTrainingPlanPreviewDialogOpen,
    onClose,
    trainingPlan,
}) {

    console.log({
        trainingPlan
    });

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

export function EditTrainingPlan() {

    const { saveTrainingPlan, createNewPlan, addWorkout, editExercise, addExercise, updateExercise, exercises, deleteExercise, cleanAllData } = useExercisesAPI()




    const exerciseToShow = exercises.map(e => ({ ...e, ...e.weeks[0] }))

    const [addExerciseDialogOpen, setOpen] = React.useState(false);
    const [buildTrainingPlanOpen, setBuildTrainingPlanOpen] = React.useState(false);
    const [createNewExerciseDialogOpen, setCreateNewExerciseDialogOpen] = React.useState(false);
    const [editExerciseOpened, setEditExercise] = React.useState({});
    const [isTrainingPlanPreviewDialogOpen, setIsTrainingPlanPreviewDialogOpen] = React.useState(false);
    const [previewTrainingPlan, setPreviewTrainingPlan] = React.useState(null);

    function createNewExercise() {
        setOpen(false);
        setCreateNewExerciseDialogOpen(true);
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

    const onAddButtonClicked = (exercise) => {
        updateExercise(exercise, { weeklyTarget: Number(exercise.weeklyTarget) + 1 });
    }

    const onRemoveButtonClicked = (exercise) => {
        updateExercise(exercise, { weeklyTarget: Number(exercise.weeklyTarget) - 1 });
    }

    const editExerciseInternal = (exercise) => {
        editExercise(exercise);
        setEditExercise({ ...editExerciseOpened, [exercise.id]: false });
    }

    const onDeleteButtonClicked = (exercise) => {
        deleteExercise(exercise);
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
    async function onBuildTrainingPlan({
        plan,
        name,
        replaceTrainingPlan
    }) {

        const {
            exercises: newExercisesList,
            workouts,
            newExercises: newExercisesToAdd,
        } = plan;

        const newWorkouts = workouts.map(workout => {
            return {
                exercises: workout.workoutExercises.map(({ name, sets }) => {
                    return {
                        ...newExercisesList.find(e => e.name === name),
                        name,
                        sets,
                        weeklySets: sets,
                    }
                }),
                name: workout.name
            }
        })

        const _newExercisesList = newExercisesList.map(exercise => {
            return {
                ...exercise,
                weeklySets: _.sum(newWorkouts.map(w => w.exercises.find(e => e.name === exercise.name)?.sets || 0)),
            }
        })



        const previewTrainingPlan = createNewPlan({
            exercises: _newExercisesList,
            workouts: newWorkouts,
            name
        })

        setPreviewTrainingPlan(previewTrainingPlan);
        setIsTrainingPlanPreviewDialogOpen(true);

        newExercisesToAdd.forEach(newExercise => {
            saveData('exercisesList', [...getLocalExercises(), newExercise]);
        });

        setBuildTrainingPlanOpen(false);

    }

    function SaveTrainingPlanInternal() {
        saveTrainingPlan(previewTrainingPlan)
        setIsTrainingPlanPreviewDialogOpen(false)
        
    }


    return (
        <div>

            <TrainingPlanPreviewDialog
                isTrainingPlanPreviewDialogOpen={isTrainingPlanPreviewDialogOpen}
                onClose={() => setIsTrainingPlanPreviewDialogOpen(false)}
                trainingPlan={previewTrainingPlan}
                SaveTrainingPlan={SaveTrainingPlanInternal}
            />

            <AddExerciseDialog
                exercises={exercises}
                onAddExercise={onAddExercise}
                addExerciseDialogOpen={addExerciseDialogOpen}
                onClose={() => setOpen(false)}
                createNewExercise={createNewExercise}
                exerciseList={exercisesList}

            />

            <BuildTrainingPlanDialog
                buildTrainigPlanDialigOpen={buildTrainingPlanOpen}
                exercises={exercises}
                onBuildTrainingPlan={onBuildTrainingPlan}
                onClose={() => setBuildTrainingPlanOpen(false)}
                exerciseList={exercisesList}

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
                justifyContent: 'space-between',
            }}>


                <Button
                    sx={{ fontSize: '13px', marginRight: '10px' }}
                    startIcon={<AddCircle />}
                    variant="contained"
                    onClick={() => setOpen(!addExerciseDialogOpen)}>
                    Add Exercise

                </Button>
                <Button
                    sx={{ fontSize: '13px', float: 'right' }}
                    startIcon={<AddCircle />}
                    variant="contained"
                    onClick={() => setBuildTrainingPlanOpen(true)}>
                    Training Plan

                </Button>
            </div>
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
            exerciseList={exerciseList}
            onCancel={onClose}
            exerciseToEdit={exerciseToEdit}
            exercises={exercises}
            onAddExercise={onAddExercise}
        />

    </Dialog>
}