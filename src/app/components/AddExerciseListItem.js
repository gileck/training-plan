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
import { Delete, ExpandCircleDown, ExpandCircleUp, ExpandMore, ExpandLess, } from "@mui/icons-material";
import { Grid, MenuItem, Select, TextField } from '@mui/material';
import { exercisesList } from '../exercisesAPI';

function AddExerciseListItem({ exercises, onAddExercise }) {
    const [open, setOpen] = useState(false);
    const [exercise, setExercise] = useState(exercises[0].name);
    const [totalWeeklySets, setTotalWeeklySets] = useState(5);
    const handleChange = (event) => {
        setExercise(event.target.value);
    }
    const handleClick = () => {
        setOpen(!open)
    }
    const onAddButtonClicked = () => {
        setOpen(false)
        onAddExercise({ name: exercise, weeklyTarget: totalWeeklySets })
        console.log("Add button clicked")
    }

    return (
        <List>
            <ListItem onClick={handleClick}>
                <ListItemIcon>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                <ListItemText primary="" />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Select
                                    sx={{ width: '140px' }}
                                    value={exercise}
                                    onChange={handleChange}>   {
                                        exercisesList.map((exercise, index) => (
                                            <MenuItem key={index} value={exercise.name}>{exercise.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Weekly Sets"
                                    sx={{ width: '100px', marginLeft: '15px' }}
                                    value={totalWeeklySets}
                                    onChange={(e) => setTotalWeeklySets(e.target.value)}
                                    type="number" />
                            </Grid>
                            <Grid item>
                                <IconButton onClick={onAddButtonClicked}>
                                    <AddCircleIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
}

export default AddExerciseListItem;