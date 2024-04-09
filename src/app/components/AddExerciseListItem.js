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
import { Autocomplete, Button, Chip, Dialog, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { localStorageAPI } from '../localStorageAPI';

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
                        <MenuItem value="Chest">Chest</MenuItem>
                        <MenuItem value="Back">Back</MenuItem>
                        <MenuItem value="Shoulders">Shoulders</MenuItem>
                        <MenuItem value="Legs">Legs</MenuItem>
                        <MenuItem value="Arms">Arms</MenuItem>
                        <MenuItem value="Gluts">Gluts</MenuItem>
                        <MenuItem value="Hamstring">Hamstring</MenuItem>
                        <MenuItem value="Biceps">Biceps</MenuItem>
                        <MenuItem value="Triceps">Triceps</MenuItem>
                        <MenuItem value="Calves">Calves</MenuItem>
                        <MenuItem value="Forearms">Forearms</MenuItem>

                    </Select>
                </FormControl>
                <FormControl sx={{ mb: '10px' }}>
                    <InputLabel>Secondary Muscle</InputLabel>
                    <Select
                        label="Secondary Muscle"
                        multiple value={secondaryMuscle} onChange={handleSecondaryMuscleChange}>
                        <MenuItem value="Chest">Chest</MenuItem>
                        <MenuItem value="Back">Back</MenuItem>
                        <MenuItem value="Shoulders">Shoulders</MenuItem>
                        <MenuItem value="Legs">Legs</MenuItem>
                        <MenuItem value="Arms">Arms</MenuItem>
                        <MenuItem value="Gluts">Gluts</MenuItem>
                        <MenuItem value="Hamstring">Hamstring</MenuItem>
                        <MenuItem value="Biceps">Biceps</MenuItem>
                        <MenuItem value="Triceps">Triceps</MenuItem>
                        <MenuItem value="Calves">Calves</MenuItem>
                        <MenuItem value="Forearms">Forearms</MenuItem>
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
export function AddExerciseDialog({ exerciseList, createNewExercise, onAddExercise, exercises, addExerciseDialogOpen, onClose }) {


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

export function EditExerciseForm({ exerciseList, onAddExercise, exerciseToEdit, exercises, onCancel, createNewExercise }) {
    const { getData, saveData, cleanData } = localStorageAPI();
    const localExercises = getData('exercisesList');
    console.log({ localExercises });
    const filteredExercises = exerciseList.filter(e => !exercises.find(ex => ex.name === e.name))
    const exerciseOptions = [...filteredExercises, ...localExercises]
    const [exercise, setExercise] = useState(exerciseToEdit || exerciseOptions[0]);
    const [totalWeeklySets, setTotalWeeklySets] = useState(exerciseToEdit?.weeklySets || 5);
    const [reps, setReps] = useState(exerciseToEdit?.numberOfReps || 8);
    const [weight, setWeight] = useState(exerciseToEdit?.weight || 12);
    const [overloadType, setOverloadType] = useState(exerciseToEdit?.overloadType || 'sets');
    const [overloadValue, setOverloadValue] = useState(exerciseToEdit?.overloadValue || 5);

    const onAddButtonClicked = () => {
        onAddExercise(Object.assign(exerciseToEdit || {}, {
            ...exercise,
            name: exercise.name,
            weeklySets: Number(totalWeeklySets),
            numberOfReps: Number(reps),
            weight: exercise.bodyWeight ? null : Number(weight),
            overloadType,
            overloadValue: Number(overloadValue),

        }))
    }

    const handleOverloadTypeChange = (event) => {
        setOverloadType(event.target.value);
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
                    label={"Exercise"}
                    value={exercise.name}
                    options={exerciseOptions.map((option) => ({ label: option.name, value: option }))}
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
                    label="Reps"
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
                    disabled={exercise.bodyWeight}
                    label="Weight (kg)"
                    sx={{ width: '100px' }}
                    value={exercise.bodyWeight ? 0 : weight}
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
                    sx={{ width: '100px' }}
                    value={overloadType}
                    onChange={handleOverloadTypeChange}>   {
                        ['sets', 'reps', 'weight'].map((overloadType, index) => (
                            <MenuItem key={index} value={overloadType}>{overloadType}</MenuItem>
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

