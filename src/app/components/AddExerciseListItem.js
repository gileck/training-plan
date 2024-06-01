import React, { useState } from 'react';
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Delete, ExpandCircleDown, ExpandCircleUp, ExpandMore, ExpandLess, Label, } from "@mui/icons-material";
import {
    Autocomplete,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField
} from '@mui/material';
import { localStorageAPI } from '../localStorageAPI';
import { getExercisesList } from '../exercisesList';
import { getAllBodyParts, getPrimaryMuscle, isBodyWeightExercise, isStaticExercise } from "../exercisesAPI";

// import { exercisesList } from '../exercisesList';
export function CreateNewExerciseDialog({
    exercises,
    onCreateNewExercise,
    isDialogOpen,
    onClose,

}) {
    const [exerciseName, setExerciseName] = useState('');
    const [isBodyWeight, setIsBodyWeight] = useState(false);
    const [exerciseCategory, setExerciseCategory] = useState('');
    const [pushPull, setPushPull] = useState('');
    const [primaryMuscle, setPrimaryMuscle] = useState('');
    const [secondaryMuscle, setSecondaryMuscle] = useState([]);

    const handleExerciseNameChange = (event) => {
        setExerciseName(event.target.value);
    }
    const handleExerciseTypeChange = (event) => {
        setIsBodyWeight(event.target.checked);
    }
    const handleExerciseCategoryChange = (event) => {
        setExerciseCategory(event.target.value);
    }
    const handlePushPullChange = (event) => {
        setPushPull(event.target.value);
    }
    const handlePrimaryMuscleChange = (event) => {
        setPrimaryMuscle(event.target.value);
    }
    const handleSecondaryMuscleChange = (event) => {
        setSecondaryMuscle(event.target.value);
    }
    const handleAddExercise = () => {
        if (!exerciseName || !exerciseCategory || !primaryMuscle) {
            return;
        }
        console.log({
            name: exerciseName,
            isBodyWeight,
            category: exerciseCategory,
            pushPull: pushPull,
            primaryMuscle: primaryMuscle,
            secondaryMuscle: secondaryMuscle
        });
        onCreateNewExercise({
            name: exerciseName,
            isBodyWeight,
            category: exerciseCategory,
            pushPull: pushPull,
            primaryMuscle: primaryMuscle,
            secondaryMuscle: secondaryMuscle
        })
    }
    return (
        <Dialog
            disableEscapeKeyDown
            open={isDialogOpen}
            onClose={() => onClose()}
        >
            <DialogTitle>
                Create Exercise
            </DialogTitle>
            <FormGroup sx={{ padding: '40px' }}>
                <FormControl sx={{ mb: '10px' }}>
                    <TextField
                        label="Exercise Name"
                        onChange={
                            handleExerciseNameChange
                        } />
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <FormControlLabel

                        control={<Switch onChange={handleExerciseTypeChange} checked={isBodyWeight} />}
                        label="isBodyWeight"
                    />
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        onChange={handleExerciseCategoryChange}>
                        <MenuItem value="Upper body">Upper body</MenuItem>
                        <MenuItem value="Left">Legs</MenuItem>
                        <MenuItem value="Core">Core</MenuItem>
                        <MenuItem value="fullBody">Full Body</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <InputLabel>Push/Pull</InputLabel>
                    <Select
                        label="Push/Pull"
                        onChange={handlePushPullChange}>
                        <MenuItem value="push">Push</MenuItem>
                        <MenuItem value="pull">Pull</MenuItem>
                        <MenuItem value={null}>None</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <InputLabel>Primary Muscle</InputLabel>
                    <Select
                        label="Primary Muscle"
                        onChange={handlePrimaryMuscleChange}>

                        {
                            getAllBodyParts().map((bodyPart, index) => (
                                <MenuItem key={index} value={bodyPart}>{bodyPart}</MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <InputLabel>Secondary Muscle</InputLabel>
                    <Select
                        label="Secondary Muscle"
                        multiple value={secondaryMuscle} onChange={handleSecondaryMuscleChange}>
                        {
                            getAllBodyParts().map((bodyPart, index) => (
                                <MenuItem key={index} value={bodyPart}>{bodyPart}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <Button
                    iconStart={<AddIcon />}
                    variant='contained'
                    onClick={handleAddExercise}>Add</Button>
            </FormGroup>
        </Dialog>
    );
}

export function AddExerciseDialog({
    exerciseList,
    createNewExercise,
    onAddExercise,
    exercises,
    addExerciseDialogOpen,
    onClose
}) {


    return (
        <Dialog
            disableEscapeKeyDown
            open={addExerciseDialogOpen}
            onClose={() => onClose()}
            fullWidth={true}
        >
            <DialogTitle>
                Add Exercise
            </DialogTitle>
            <EditExerciseForm
                exerciseList={exerciseList}
                onCancel={() => onClose()}
                exercises={exercises}
                onAddExercise={onAddExercise}
                createNewExercise={createNewExercise}
            />
        </Dialog>
    );
}

export function EditExerciseForm({
    exerciseList,
    onAddExercise,
    exerciseToEdit,
    exercises,
    onCancel,
    createNewExercise
}) {

    const exerciseOptions = getExercisesList().filter(e => !exercises.find(ex => ex.name === e.name))
    const [exercise, setExercise] = useState(exerciseToEdit || exerciseOptions[0]);
    const [totalWeeklySets, setTotalWeeklySets] = useState(exerciseToEdit?.weeklySets || 5);
    const [reps, setReps] = useState(exerciseToEdit?.numberOfReps || 8);
    const [weight, setWeight] = useState(exerciseToEdit?.weight);
    const [overloadType, setOverloadType] = useState(exerciseToEdit?.overloadType || 'sets');
    const [overloadValue, setOverloadValue] = useState(exerciseToEdit?.overloadValue || 5);

    console.log({ exercise });
    const onAddButtonClicked = () => {
        onAddExercise(Object.assign(exerciseToEdit || {}, {
            ...exercise,
            name: exercise.name,
            weeklySets: Number(totalWeeklySets),
            numberOfReps: Number(reps),
            weight: exercise.bodyWeight ? 0 : Number(weight),
            overloadType,
            overloadValue: Number(overloadValue),

        }))
    }

    const handleOverloadTypeChange = (event) => {
        setOverloadType(event.target.value);
    }

    function getOverloadLabel(overloadType) {
        if (overloadType === 'sets') {
            return 'Sets'
        } else if (overloadType === 'reps') {
            return isStaticExercise(exercise.name) ? 'Duration' : 'Reps'
        } else if (overloadType === 'weight') {
            return 'Weight'
        } else if (overloadType === 'duration') {
            return 'Duration'
        }

        else {
            return 'All'
        }
    }


    return (
        <List
            sx={{
                background: '#f2f2f2',
                borderRadius: '10px',
                borderColor: 'grey',
                padding: '10px',

            }} component="div" disablePadding>
            <ListItem>
                <Autocomplete
                    size='small'
                    blurOnSelect
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    disablePortal
                    aria-label={"Exercise"}
                    groupBy={(exercise) => getPrimaryMuscle(exercise.label)}
                    label={"Exercise"}
                    value={exercise.name}
                    options={exerciseOptions
                        .sort((a, b) => getPrimaryMuscle(a.name).localeCompare(getPrimaryMuscle(b.name)))
                        .map((option) => ({ label: option.name, value: option }))}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                    onChange={(event, newValue) => {
                        console.log({ newValue });
                        if (newValue && newValue.value) {
                            setExercise(newValue.value)
                        }
                    }}
                />

                {createNewExercise ? <IconButton onClick={createNewExercise}>
                    <AddCircleIcon />
                </IconButton> : ''}

            </ListItem>
            <ListItem>

                <TextField
                    label="Weekly Sets"
                    size='small'
                    sx={{ width: '100px' }}
                    value={totalWeeklySets}
                    onChange={(e) => setTotalWeeklySets(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    label={isStaticExercise(exercise.name) ? 'Duration(sec)' : 'Reps'}
                    size='small'
                    sx={{ width: '100px' }}

                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    type="number" />
            </ListItem>
            <ListItem>
                <TextField
                    size='small'
                    // disabled={true}
                    disabled={isBodyWeightExercise(exercise.name)}
                    label="Weight (kg)"
                    sx={{ width: '100px' }}
                    value={isBodyWeightExercise(exercise.name) ? 0 : weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText>Progressive Overload:</ListItemText>
            </ListItem>

            <ListItem>


                <Select
                    size='small'
                    sx={{ width: '150px' }}
                    value={overloadType}
                    onChange={handleOverloadTypeChange}>
                    {
                        ['sets', 'reps', 'weight', 'duration'].map((overloadType, index) => (
                            <MenuItem key={index} value={overloadType}>
                                {getOverloadLabel(overloadType)}
                            </MenuItem>
                        ))
                    }
                </Select>
            </ListItem>
            <ListItem>
                <TextField
                    size='small'
                    sx={{ width: '100px' }}
                    label="Overload %"
                    value={overloadValue}
                    onChange={(e) => setOverloadValue(e.target.value)}
                    type="number" />
            </ListItem>
            <Divider />

            <ListItem>
                <Button
                    onClick={onAddButtonClicked}
                    variant="contained"
                    color="primary"
                >Add</Button>
                <Button
                    onClick={onCancel}
                    sx={{ marginLeft: '10px' }}
                    variant="outlined"
                >Cancel</Button>

            </ListItem>
        </List>
    )
}

