"use client";
import React from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { localStorageAPI } from "../localStorageAPI";
import { ExpandLess, ExpandMore, RemoveCircle } from "@mui/icons-material";
import _ from 'lodash'
import { Button, Chip, Collapse, Divider, Typography } from "@mui/material";
import { useExercisesAPI, getBodyParts, getCategory, getSecondaryMuscles, getPrimaryMuscle } from "../exercisesAPI";
import AddExerciseListItem from "./AddExerciseListItem";
const { getData, saveData } = localStorageAPI();

export function TrainingPlan() {
    const [open, setOpen] = React.useState({});
    const { getExercisesByWeeks, cleanData, updateExercise, addExercise, calculateExerciseDone } = useExercisesAPI()
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
                                calculateExerciseDone={calculateExerciseDone}
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
export function ExercisesWeekly({ exercises, updateExercise, week, calculateExerciseDone }) {
    function onSetComplete(exercise, sets) {
        updateExercise(exercise.id, week, {
            totalWeeklySets: Number(exercise.totalWeeklySets || 0) + Number(sets)
        });
    }

    function getExercises() {
        return exercises.map(exercise => {
            const exerciseData = {
                ...exercise,
                sets: {
                    done: calculateExerciseDone(exercise, week),
                    target: Number(exercise.weeklyTarget || 0),
                }
            }
            return exerciseData;
        });
    }

    return (
        <List component="div" disablePadding sx={{ ml: '15px' }}>
            <Divider />
            {getExercises()
                // .sort((a, b) => (a.totalWeeklySets - a.weeklyTarget) - (b.totalWeeklySets - b.weeklyTarget))
                .map((exercise) => (
                    <React.Fragment key={exercise.id}>

                        <Exercise
                            key={exercise.id}
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
export function Exercise({ exercise, onRemoveSetComplete, onAddSetComplete, onSetDone }) {
    const weeklyTargetReached = exercise.sets.done >= exercise.sets.target;
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
                                {
                                    exercise.sets ?
                                        `Sets: ${exercise.sets.done || 0} / ${exercise.sets.target}` : ''
                                }

                            </Typography>
                            <Typography
                                sx={{ ml: '10px', display: !exercise.bodyWeight && exercise.numberOfReps && exercise.weight ? 'inline' : 'none' }}
                                component="span"
                                variant="body2"
                                color="text.secondary"

                            >
                                ({exercise.numberOfReps}x{exercise.weight}kg)
                            </Typography>
                        </React.Fragment>
                    } />
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
        </ListItem >
    );
}
