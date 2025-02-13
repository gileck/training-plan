import React, { useEffect, useState } from "react";
import { useExercisesAPI } from "../exercisesAPI";
import { Exercise } from "./Exercise";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button } from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function ExerciseList({
    workouts,
    selectedExercises,
    selectExercise,
    clearSelectedExercises,
    onSetComplete,
    onExerciseDone,
    setRoute,
    selectedWeek,
    openAskAIDialog,
    disableEdit,
}) {

    console.log({workouts});
    


    const [exerciseOrder, setExerciseOrder] = useState([]);
    const [showFinished, setShowFinished] = useState(false);

    function onWorkoutArrowClicked(wid, eid, value) {
        const newExerciseOrder = [...exerciseOrder];
        const index = newExerciseOrder.findIndex(e => e.id === eid);
        const newIndex = index + value;
        if (newIndex >= 0 && newIndex < newExerciseOrder.length) {
            [newExerciseOrder[index], newExerciseOrder[newIndex]] = [newExerciseOrder[newIndex], newExerciseOrder[index]];
            setExerciseOrder(newExerciseOrder);
        }
    }

    function getExercise(exercise) {
        const week = exercise.week
        const exercises = workouts.flatMap(workout => workout.exercises);
        const e = exercises.find(e => e.name === exercise.name);
        if (!e || !e.weeks) {
            return null
        }
        const exerciseData = {
            ...e,
            ...e.weeks[week],
            ...exercise,
            ...exercise.weeks[week],
            sets: {
                done: Number(exercise.weeks[week].totalWeeklySets || 0),
                target: Number(exercise.weeks[week].weeklyTarget || 0),
                isFinished: Number(exercise.weeks[week].totalWeeklySets || 0) >= Number(exercise.weeks[week].weeklyTarget || 0)
            }
        }
        return exerciseData;
    }

    useEffect(() => {
        const exercises = workouts.flatMap(workout => workout.exercises)
        console.log({exercises});
        
        setExerciseOrder(exercises);
    }, [workouts]);

    const exercises = exerciseOrder
    .flatMap(e => e.weeks.map(ew => ({...e, ...ew})))
    .sort((a, b) => a.week - b.week)
    .filter(e => e.week <= selectedWeek || e.week === selectedWeek + 1);


    const unfinishedExercises = exercises.filter(e => !getExercise(e).sets.isFinished);
    const finishedExercises = exercises.filter(e => getExercise(e).sets.isFinished);

    console.log({unfinishedExercises});
    

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 1 }}>
            {unfinishedExercises.map((exercise, index) => (
                <div key={exercise.id} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                    <Exercise
                        openAskAIDialog={() => openAskAIDialog(exercise, selectedWeek)}
                        shouldShowArrows={true}
                        onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(exercise.workoutId, e.id, v)}
                        isSelected={selectedExercises.includes(exercise.id)}
                        selectExercise={selectExercise}
                        selectedWeek={selectedWeek}
                        shouldShowWeek={true}
                        exercise={getExercise(exercise)}
                        onRemoveSetComplete={() => onSetComplete(exercise.workoutId, exercise, -1, selectedWeek)}
                        onAddSetComplete={() => onSetComplete(exercise.workoutId, exercise, 1, selectedWeek)}
                        onSetDone={() => onExerciseDone(exercise.workoutId, exercise, selectedWeek)}
                        disableEdit={disableEdit}
                    />
                </div>
            ))}

            {finishedExercises.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowFinished(!showFinished)}
                        startIcon={showFinished ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{
                            width: '100%',
                            mb: 2,
                            textTransform: 'none'
                        }}
                    >
                        {showFinished ? 'Hide' : 'Show'} {finishedExercises.length} Finished Exercises
                    </Button>

                    {showFinished && finishedExercises.map((exercise, index) => (
                        <div key={exercise.id} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                            <Exercise
                                openAskAIDialog={() => openAskAIDialog(exercise, exercise.week)}
                                shouldShowArrows={true}
                                onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(exercise.workoutId, e.id, v)}
                                isSelected={selectedExercises.includes(exercise.id)}
                                selectExercise={selectExercise}
                                selectedWeek={exercise.week}
                                exercise={getExercise(exercise)}
                                onRemoveSetComplete={() => onSetComplete(exercise.workoutId, exercise, -1, exercise.week)}
                                onAddSetComplete={() => onSetComplete(exercise.workoutId, exercise, 1, exercise.week)}
                                onSetDone={() => onExerciseDone(exercise.workoutId, exercise, exercise.week)}
                                disableEdit={disableEdit}
                            />
                        </div>
                    ))}
                </Box>
            )}
        </Box>
    );
} 