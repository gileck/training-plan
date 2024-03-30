"use client";
import React from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { allExercises } from "./exercises";
import { localStorageAPI } from "../localStorageAPI";
import { ExpandLess, ExpandMore, RemoveCircle } from "@mui/icons-material";
import _ from 'lodash'
import { Button, Chip, Collapse, Divider, Typography } from "@mui/material";
import { useExercisesAPI, getBodyParts, getCategory } from "../exercisesAPI";
import AddExerciseListItem from "./AddExerciseListItem";
const { getData, saveData } = localStorageAPI();

export function TrainingPlan() {
    const [open, setOpen] = React.useState({});
    const { getExercisesByWeeks, cleanData, updateExercise, addExercise } = useExercisesAPI()
    const groupByWeek = getExercisesByWeeks();
    console.log(' groupByWeek', groupByWeek);
    function handleCollapseClick(week) {
        setOpen({ ...open, [week]: !open[week] });
    }
    function onAddExercise(newExercise, week) {
        if (newExercise) {
            addExercise(newExercise, week);
        }
    }
    return (
        <div>
            <List component="nav" aria-labelledby="nested-list-subheader">
                {Object.keys(groupByWeek).map((week) => (
                    <React.Fragment key={week.id}>
                        <ListItem key={week} onClick={() => handleCollapseClick(week)}>
                            <ListItemText
                                primary={`Week ${Number(week) + 1}`}
                                secondary={`Total Sets: 
                                        ${groupByWeek[week].reduce((acc, exercise) => acc + (Number(exercise.totalWeeklySets) || 0), 0)} 
                                        / 
                                        ${groupByWeek[week].reduce((acc, exercise) => acc + Number(exercise.weeklyTarget), 0)}`}
                            />
                            {open[week.id] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse
                            in={open[week]}
                            timeout="auto"
                            unmountOnExit

                        >
                            <ExercisesWeekly
                                week={week}
                                onAddExercise={e => onAddExercise(e, week)}
                                updateExercise={updateExercise}
                                exercises={groupByWeek[week]} />


                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        </div>

    );
}
export function ExercisesWeekly({ exercises, updateExercise, week }) {
    function onSetComplete(exercise, sets) {
        updateExercise(exercise.id, week, {
            totalWeeklySets: Number(exercise.totalWeeklySets || 0) + Number(sets)
        });
    }

    return (
        <List component="div" disablePadding sx={{ ml: '15px' }}>
            <Divider />
            {_.take(exercises, 3)
                // .sort((a, b) => (a.totalWeeklySets - a.weeklyTarget) - (b.totalWeeklySets - b.weeklyTarget))
                .map((exercise) => (
                    <React.Fragment key={exercise.id}>

                        <Exercise key={exercise.id}
                            exercise={exercise}
                            onRemoveSetComplete={() => onSetComplete(exercise, -1)}
                            onAddSetComplete={() => onSetComplete(exercise, 1)}
                        />
                        <Divider />
                    </React.Fragment>

                ))}


        </List>
    );
}
function Exercise({ exercise, onRemoveSetComplete, onAddSetComplete }) {
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
                                Sets: {exercise.totalWeeklySets || 0} / {exercise.weeklyTarget}


                            </Typography>
                            <Typography
                                sx={{ ml: '10px' }}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                ({exercise.numberOfReps}x{exercise.weight}kg)
                            </Typography>
                        </React.Fragment>
                    } />



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
                    key={getCategory(exercise.name)}
                    label={getCategory(exercise.name)}
                    size="small"
                />

                {getBodyParts(exercise.name).map((bodyPart) => (
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
