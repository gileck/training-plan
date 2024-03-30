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
import { Button, Collapse } from "@mui/material";
import { useExercisesAPI } from "../exercisesAPI";
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
                                primary={`Week ${week}`}
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
        <List component="div" disablePadding>
            {_.take(exercises, 3)
                // .sort((a, b) => (a.totalWeeklySets - a.weeklyTarget) - (b.totalWeeklySets - b.weeklyTarget))
                .map((exercise) => (
                    <Exercise key={exercise.id}
                        exercise={exercise}
                        onRemoveSetComplete={() => onSetComplete(exercise, -1)}
                        onAddSetComplete={() => onSetComplete(exercise, 1)}
                    />
                ))}


        </List>
    );
}
function Exercise({ exercise, onRemoveSetComplete, onAddSetComplete }) {
    const weeklyTargetReached = exercise.totalWeeklySets >= exercise.weeklyTarget;
    return (
        <ListItem sx={{ pl: 4 }}>
            <ListItemText
                style={{ textDecoration: weeklyTargetReached ? 'line-through' : '' }}
                primary={exercise.name}
                secondary={`
                Sets: ${exercise.totalWeeklySets || 0} / ${exercise.weeklyTarget}
                (${exercise.numberOfReps}x${exercise.weight}kg)
                `} />


            <IconButton onClick={() => onAddSetComplete()}>
                <AddCircleIcon />
            </IconButton>
            <IconButton onClick={() => onRemoveSetComplete()}>
                <RemoveCircle />
            </IconButton>
        </ListItem>
    );
}
