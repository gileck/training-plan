import React, { useContext, useState } from 'react';
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
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useExercisesAPI } from '../exercisesAPI';
import { localStorageAPI } from '../localStorageAPI';
import { TrainingPlan } from './TrainingPlan';
import { Alert, DialogActions, Icon, LinearProgress, ListItemSecondaryAction, MenuItem, MenuList, Select, TextField, Typography } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Assistant as AssistantIcon } from '@mui/icons-material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { Delete, ExpandCircleDown, ExpandCircleUp, ExpandMore, ExpandLess, Label, Edit, ArrowDropDown, ContentPaste, AirTwoTone, Computer, RadioButtonUncheckedRounded, CopyAll, Copyright, CopyAllTwoTone, Menu, Done, DoneAllOutlined, DoneOutlineRounded, DoneAllRounded, } from "@mui/icons-material";
import { Dialog } from '@mui/material';
import { EditPlan, EditTrainingPlan, EditTrainingPlanInternal } from './EditPlan';
import { AppContext } from '../AppContext';
import { WorkoutList } from './Workout';
import { BuildTrainingPlanDialog } from './BuildTrainingPlanDialog';
import { getLocalExercises } from '../exercisesList'
function TrainingPlanMenuDialog({ open, onClose, planId, trainingPlans, deleteTrainingPlan, duplicateTrainingPlan, markTrainingPlanAsDone }) {
    const { setRoute } = useContext(AppContext);
    const plan = trainingPlans.find(p => p.id === planId)
    console.log({
        plan,
        trainingPlans,
        planId
    });
    if (!plan) {
        onClose()
        return null
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{
                    backgroundColor: 'lightblue'
                }}
            >
                {plan.name}
            </DialogTitle>
            <DialogContent>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            setRoute('edit_plan', {
                                trainingPlan: planId
                            });
                            onClose();
                        }}
                    >
                        <IconButton>
                            <Edit />
                        </IconButton>
                        Edit
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            duplicateTrainingPlan(planId);
                            onClose();
                        }}
                    >
                        <IconButton>
                            <CopyAll />
                        </IconButton>
                        Duplicate
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(plan));
                            onClose();
                        }}
                    >
                        <IconButton>
                            <ContentPaste />
                        </IconButton>
                        Copy
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            markTrainingPlanAsDone(planId);
                            onClose();
                        }}
                    >
                        <IconButton>
                            <DoneAllRounded />
                        </IconButton>
                        Mark as done
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            const res = confirm(`Are you sure you want to delete ${plan.name}?`);
                            if (res) {
                                deleteTrainingPlan(planId);
                            }
                            onClose();
                        }}
                    >
                        <IconButton>
                            <Delete />
                        </IconButton>
                        Delete
                    </MenuItem>
                </MenuList>
            </DialogContent>
        </Dialog>
    );
}
function AddTrainingPlanDialog({ open, onClose: closeDialog, onCreateTrainingPlanClicked, openBuilTrainingPlanWithAI }) {
    const [name, setName] = useState('')
    const [numberOfWeeks, setNumberOfWeeks] = useState(8)
    const { saveData } = localStorageAPI()
    const [errorUploadingObject, setErrorUploadingObject] = useState(false)
    function onClose() {
        setErrorUploadingObject(false)
        setName('')
        closeDialog()
    }
    function saveTrainingPlanObject(text) {

        let tpObject
        try {
            tpObject = JSON.parse(text)
        } catch (e) {
            console.error(e)
            setErrorUploadingObject(true)
            return
        }

        onCreateTrainingPlanClicked({
            name,
            tpObject
        })
        onClose()
    }
    function createNewPlan() {
        onCreateTrainingPlanClicked({ name, numberOfWeeks })
        onClose()
    }
    return <Dialog open={open} onClose={onClose}>
        <DialogTitle
            sx={{
                backgroundColor: 'lightblue'
            }}
        >
            Create Training Plan
        </DialogTitle>
        <DialogContent>
            <Box
                sx={{
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Select
                    label="Number of Weeks"
                    value={numberOfWeeks}
                    onChange={(e) => {
                        const weeks = parseInt(e.target.value);
                        setNumberOfWeeks(weeks)
                    }}
                >
                    {_.range(1, 16).map((week) => (
                        <MenuItem key={week} value={week}>
                            {week}
                        </MenuItem>
                    ))}
                </Select>

                {/* <TextField label="Import Training Plan" value={tpObject} onChange={(e) => setTrainingPlanObject(e.target.value)} /> */}
                <Button
                    startIcon={<ContentPaste />}
                    variant='contained'
                    onClick={() => {
                        setErrorUploadingObject(false)
                        navigator.clipboard.readText()
                            .then(text => {
                                saveTrainingPlanObject(text)
                            })
                            .catch(err => {
                                console.error('Failed to read clipboard contents: ', err);
                            });
                    }}>Paste Object</Button>
                <Button

                    startIcon={<AssistantIcon />}
                    variant='contained'
                    onClick={() => {
                        openBuilTrainingPlanWithAI()
                        onClose()
                    }}>Build with AI</Button>

                <Button
                    startIcon={<AddCircleIcon />}
                    variant="contained" onClick={createNewPlan}>Create New Plan</Button>



            </Box>
            {errorUploadingObject && <Alert severity="error">Error uploading object</Alert>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
        </DialogActions>

    </Dialog>

}


export function TrainingPlansList({
    trainingPlans,
    currentTrainingPlan,
    createTrainingPlanActions,
    onTrainingPlanMenuOpenClicked,
    selectTrainingPlanClicked

}) {

    const [trainingPlansOpen, setTrainingPlansOpen] = useState({})
    function toggleTrainingPlan(id) {
        setTrainingPlansOpen({ ...trainingPlansOpen, [id]: !trainingPlansOpen[id] })
    }

    return <List >{
        trainingPlans.map((plan, index) => {
            const { getTotalSets, getWeeksDone, isEmptyPlan } = createTrainingPlanActions(plan)

            const { totalSets, totalSetsDone } = getTotalSets()
            const weeksDone = getWeeksDone().filter(w => w.isDone).length
            return <>
                <ListItem key={index}
                    sx={{
                        backgroundColor: currentTrainingPlan?.id === plan.id ? '#dcecf5' : 'white'
                    }}
                >
                    <ListItemIcon
                        onClick={() => selectTrainingPlanClicked(plan.id)}
                    >
                        <Label
                            sx={{
                                color: currentTrainingPlan?.id === plan.id ? 'green' : 'gray'
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={<span style={{}}>{plan.name}
                            <span style={{ marginLeft: "10px" }}>
                                {!isEmptyPlan() && weeksDone === plan.numberOfWeeks && '✅'}
                            </span>

                        </span>}

                        secondary={<>
                            <div>
                                {isEmptyPlan() ? 0 : weeksDone} / {plan.numberOfWeeks} weeks

                            </div>
                            {/* <div>
                                    {totalSetsDone} / {totalSets} sets
                                </div> */}
                        </>}
                        onClick={() => toggleTrainingPlan(plan.name)}


                    />
                    <ListItemSecondaryAction
                        sx={{
                            display: 'flex',
                            gap: 1

                        }}
                    >
                        {/* <IconButton
                                onClick={() => onEditTrainingPlanClicked(plan.id)}
                                edge="end" aria-label="edit">
                                <Edit />
                            </IconButton>
                            <IconButton
                                onClick={() => onDuplicateTrainingPlanClicked(plan.id)}
                                edge="end" aria-label="duplicate">
                                <CopyAllTwoTone />
                            </IconButton>
                            <IconButton
                                onClick={() => onDeleteTrainingPlanClicked(plan.id)}
                                edge="end" aria-label="delete">
                                <Delete />
                            </IconButton> */}
                        <IconButton
                            onClick={() => onTrainingPlanMenuOpenClicked(plan.id)}
                            edge="end" aria-label="menu">
                            <MoreHorizIcon />
                        </IconButton>
                        {/* <IconButton onClick={() => toggleTrainingPlan(plan.id)}>
                                {trainingPlansOpen[plan.id] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton> */}
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={trainingPlansOpen[plan.name]} timeout="auto" unmountOnExit>
                    <>
                        <Box sx={{
                            padding: 2,
                            backgroundColor: 'white'
                        }}>
                            <WorkoutList
                                workouts={plan.workouts}
                                exercises={plan.exercises}
                                numberOfWeeks={plan.numberOfWeeks || 8}
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
                                saveConfig={() => { }}
                                disableEdit={true}

                            />
                        </Box>

                    </>
                </Collapse >
                <Divider />
            </>
        })
    }
    </List >
}
export function TrainingPlans() {


    const { markTrainingPlanAsDone, duplicateTrainingPlan, createTrainingPlanActions, deleteTrainingPlan, addTrainingPlan, trainingPlans, selectTrainingPlan, currentTrainingPlan, addTrainingPlanFromObject, addTrainingPlanFromPlan } = useExercisesAPI()
    console.log({
        trainingPlans
    });
    const [buildAiTrainingPlanOpen, setBuildAiTrainingPlanOpen] = useState(false);
    const [isTrainingPlanModalOpen, setIsTrainingPlanModalOpen] = useState(false)
    const [trainingPlanMenuOpenId, setTrainingPlanMenuOpenId] = useState(null)
    const [trainingPlansOpen, setTrainingPlansOpen] = useState({})
    const { setRoute } = useContext(AppContext);
    const { saveData } = localStorageAPI()


    function selectTrainingPlanClicked(planId) {
        selectTrainingPlan(planId)
    }

    function toggleTrainingPlan(id) {
        setTrainingPlansOpen({ ...trainingPlansOpen, [id]: !trainingPlansOpen[id] })
    }

    function onCreateTrainingPlanClicked({ name, tpObject, plan, numberOfWeeks }) {
        if (tpObject) {
            addTrainingPlanFromObject({ name, tpObject })
        } else if (plan) {
            addTrainingPlanFromPlan({ name, plan })
        } else {
            addTrainingPlan({ name, numberOfWeeks })
        }
    }


    async function onBuildAiTrainingPlan({
        plan,
        name
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

        addTrainingPlanFromPlan({
            plan: {
                exercises: _newExercisesList,
                workouts: newWorkouts,
            },
            name
        })

        newExercisesToAdd.forEach(newExercise => {
            saveData('exercisesList', [...getLocalExercises(), newExercise]);
        });

        setBuildAiTrainingPlanOpen(false);
    }

    function onTrainingPlanMenuOpenClicked(id) {
        setTrainingPlanMenuOpenId(id)
    }

    return (
        <Box
            sx={{
                padding: 1
            }}
        >
            <Button
                sx={{
                    marginBottom: 2

                }}
                startIcon={<AddCircleIcon />}
                variant='contained'
                onClick={() => setIsTrainingPlanModalOpen(true)}>Add Training Plan</Button>

            <BuildTrainingPlanDialog
                buildTrainigPlanDialigOpen={buildAiTrainingPlanOpen}
                onBuildTrainingPlan={onBuildAiTrainingPlan}
                onClose={() => setBuildAiTrainingPlanOpen(false)}
            />

            <AddTrainingPlanDialog
                open={isTrainingPlanModalOpen}
                onClose={() => setIsTrainingPlanModalOpen(false)}
                onCreateTrainingPlanClicked={onCreateTrainingPlanClicked}
                openBuilTrainingPlanWithAI={() => setBuildAiTrainingPlanOpen(true)}
            />
            {trainingPlanMenuOpenId ? <TrainingPlanMenuDialog
                markTrainingPlanAsDone={markTrainingPlanAsDone}
                deleteTrainingPlan={deleteTrainingPlan}
                duplicateTrainingPlan={duplicateTrainingPlan}
                trainingPlans={trainingPlans}
                open={trainingPlanMenuOpenId !== null}
                planId={trainingPlanMenuOpenId}
                onClose={() => setTrainingPlanMenuOpenId(null)}
            /> : null}

            <TrainingPlansList
                trainingPlans={trainingPlans}
                currentTrainingPlan={currentTrainingPlan}
                createTrainingPlanActions={createTrainingPlanActions}
                onTrainingPlanMenuOpenClicked={onTrainingPlanMenuOpenClicked}
                selectTrainingPlanClicked={selectTrainingPlanClicked}
            />

        </Box>
    )






}