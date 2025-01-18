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
    getExercise,
    openAskAIDialog,
    disableEdit,
}) {


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

    useEffect(() => {
        const exercises = workouts.flatMap(workout => workout.exercises);
        setExerciseOrder(exercises);
    }, [workouts]);

    const unfinishedExercises = exerciseOrder.filter(e => !getExercise(e).sets.isFinished);
    const finishedExercises = exerciseOrder.filter(e => getExercise(e).sets.isFinished);

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
                                openAskAIDialog={() => openAskAIDialog(exercise, selectedWeek)}
                                shouldShowArrows={true}
                                onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(exercise.workoutId, e.id, v)}
                                isSelected={selectedExercises.includes(exercise.id)}
                                selectExercise={selectExercise}
                                selectedWeek={selectedWeek}
                                exercise={getExercise(exercise)}
                                onRemoveSetComplete={() => onSetComplete(exercise.workoutId, exercise, -1, selectedWeek)}
                                onAddSetComplete={() => onSetComplete(exercise.workoutId, exercise, 1, selectedWeek)}
                                onSetDone={() => onExerciseDone(exercise.workoutId, exercise, selectedWeek)}
                                disableEdit={disableEdit}
                            />
                        </div>
                    ))}
                </Box>
            )}
        </Box>
    );
} 