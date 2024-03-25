import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { IconButton, TextField } from '@mui/material';
import { AddCircle, Label, RemoveCircle } from '@mui/icons-material';


export function SelectExercise({ exercise, exercises, setExercises, numberOfSets, setNumberOfSets }) {


    const handleChange = (event) => {
        setExercises(event.target.value);
    };

    const handleNumberOfSetsChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value)) {
            setNumberOfSets(value);
        }
    };

    return (
        <Box sx={{}}>
            <FormControl fullWidth>
                <InputLabel>Exercise</InputLabel>
                <Select
                    value={exercise}
                    onChange={handleChange}
                >
                    {
                        exercises.map((exercise, index) => (
                            <MenuItem key={index} value={exercise.name}>{exercise.name}</MenuItem>
                        ))
                    }
                </Select>
                <TextField
                    id="outlined-basic"
                    label="Number of Sets"
                    variant="outlined"
                    value={numberOfSets}
                    onChange={handleNumberOfSetsChange}
                    type="number"
                />
            </FormControl>
        </Box>
    );
}


const emails = ['username@gmail.com', 'user02@gmail.com'];

export function AddExercise(props) {
    const { onClose, open, exercises } = props;
    const [exercise, setExercises] = React.useState('');
    const [numberOfSets, setNumberOfSets] = React.useState('');

    function onAddButtonClicked() {
        onClose({
            exercise,
            numberOfSets
        });
    }
    const handleClose = () => {
        onClose()
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Add Exercise</DialogTitle>
            <SelectExercise
                exercises={exercises}
                exercise={exercise}
                setExercises={setExercises}
                numberOfSets={numberOfSets}
                setNumberOfSets={setNumberOfSets}
            />
            <Button onClick={onAddButtonClicked}>Add</Button>
        </Dialog>
    );
}