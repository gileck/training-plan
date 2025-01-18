import React from "react";
import { ListItem, ListItemText, IconButton, Fab, Box, Divider, Collapse, ListItemSecondaryAction } from "@mui/material";
import { ExpandLess, ExpandMore, Close } from '@mui/icons-material';
import { Exercise } from "./Exercise";
import { colors } from './colors';

export function WorkoutListBody({
    workouts,
    selectedExercises,
    onWorkoutArrowClicked,
    selectExercise,
    clearSelectedExercises,
    onSetComplete,
    onExerciseDone,
    setRoute,
    selectedWeek,
    openWorkouts,
    openWorkout,
    getExercise,
    openAskAIDialog,
    disableEdit
}) {
    return (
        <>
            {workouts.map((workout) => (
                <React.Fragment key={workout.id}>
                    <ListItem
                        sx={{
                            backgroundColor: colors.workoutBackground,
                        }}
                        onClick={() => openWorkout(workout.id)} key={workout.id}>
                        <ListItemText
                            sx={{}}
                            primary={`
                                ${workout.name}
                                ${workout.exercises.every((exercise) => {
                                const e = getExercise(exercise);
                                if (!e) return false;
                                return e.sets.done >= e.sets.target;
                            }) ? '✅' : ''}
                            `}
                            secondary={<React.Fragment>
                                <div>
                                    <span style={{ marginRight: '5px' }}>Sets:</span>
                                    {workout.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0)}
                                    <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>
                                    {workout.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0)}
                                </div>
                            </React.Fragment>}
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => openWorkout(workout.id)}>
                                {openWorkouts[workout.id] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {openWorkouts[workout.id] ? <Divider /> : ''}
                    <Collapse in={openWorkouts[workout.id]} timeout="auto" unmountOnExit>
                        {workout.exercises.map((exercise) => (
                            <React.Fragment key={exercise.id}>
                                <Exercise
                                    openAskAIDialog={() => openAskAIDialog(exercise, selectedWeek)}
                                    shouldShowArrows={true}
                                    onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(workout.id, e.id, v)}
                                    isSelected={selectedExercises.includes(exercise.id)}
                                    selectExercise={selectExercise}
                                    selectedWeek={selectedWeek}
                                    key={exercise.id}
                                    exercise={getExercise(exercise)}
                                    onRemoveSetComplete={() => onSetComplete(workout.id, exercise, -1, selectedWeek)}
                                    onAddSetComplete={() => onSetComplete(workout.id, exercise, 1, selectedWeek)}
                                    onSetDone={() => onExerciseDone(workout.id, exercise, selectedWeek)}
                                    disableEdit={disableEdit}
                                />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </Collapse>
                    <Divider />
                </React.Fragment>
            ))}
        </>
    );
} 