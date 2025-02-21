import React, { useEffect, useState } from "react";
import { useExercisesAPI } from "../exercisesAPI";
import { Exercise } from "./Exercise";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button, IconButton, Typography, Divider } from "@mui/material";
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

    const [exerciseOrder, setExerciseOrder] = useState([]);
    const [showFinished, setShowFinished] = useState(false);
    const [expandedWeeks, setExpandedWeeks] = useState({});

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
        setExerciseOrder(exercises);
    }, [workouts]);

    useEffect(() => {
        setExpandedWeeks(prev => ({
            ...prev,
            [selectedWeek]: true,
            [selectedWeek - 1]: true
        }));
    }, [selectedWeek]);

    const toggleWeek = (week) => {
        setExpandedWeeks(prev => ({
            ...prev,
            [week]: !prev[week]
        }));
    };

    const WeekDivider = ({ week, exerciseCount }) => (
        <Box
            onClick={() => toggleWeek(week)}
            sx={{
                position: 'relative',
                cursor: 'pointer',
                mt: 3,
                mb: 2,
                color: 'grey',
            }}
        >
            <Divider sx={{ borderColor: 'grey' }} />
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Typography variant="body2" color="gray">
                    Week {Number(week) + 1}
                </Typography>
                {expandedWeeks[week] ?
                    <ExpandLessIcon fontSize="small" /> :
                    <ExpandMoreIcon fontSize="small" />
                }
            </Box>
        </Box>
    );

    const exercises = exerciseOrder
        .flatMap(e => e.weeks.map(ew => ({ ...e, ...ew })))
        .filter(e => e.week <= selectedWeek || e.week === selectedWeek + 1)

    const unfinishedExercises = exercises.filter(e => !getExercise(e).sets.isFinished).sort((a, b) => a.week - b.week)
    const finishedExercises = exercises
        .filter(e => {
            return getExercise(e).sets.isFinished && e.week >= selectedWeek
        })
        .sort((a, b) => b.week - a.week)


    const unfinishedByWeek = unfinishedExercises.reduce((acc, exercise) => {
        const week = exercise.week;
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(exercise);
        return acc;
    }, {});

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 1 }}>
            {Object.entries(unfinishedByWeek)
                .sort(([weekA], [weekB]) => Number(weekA) - Number(weekB))
                .map(([week, exercises]) => (
                    <div key={week}>
                        <WeekDivider
                            week={week}
                            exerciseCount={exercises.length}
                        />

                        {expandedWeeks[week] && exercises.map((exercise) => (
                            <div key={exercise.id} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                                <Exercise
                                    openAskAIDialog={() => openAskAIDialog(exercise, exercise.week)}
                                    shouldShowArrows={true}
                                    onWorkoutArrowClicked={(e, v) => onWorkoutArrowClicked(exercise.workoutId, e.id, v)}
                                    isSelected={selectedExercises.includes(exercise.id)}
                                    selectExercise={selectExercise}
                                    selectedWeek={exercise.week}
                                    shouldShowWeek={false}
                                    exercise={getExercise(exercise)}
                                    onRemoveSetComplete={() => onSetComplete(exercise.workoutId, exercise, -1, exercise.week)}
                                    onAddSetComplete={() => onSetComplete(exercise.workoutId, exercise, 1, exercise.week)}
                                    onSetDone={() => onExerciseDone(exercise.workoutId, exercise, exercise.week)}
                                    disableEdit={disableEdit}
                                />
                            </div>
                        ))}
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
                                shouldShowWeek={true}
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