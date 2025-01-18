import React, { useState } from "react";
import _ from 'lodash';
import { WorkoutListUI } from "./WorkoutListUI";

export function WorkoutList({
    exercises,
    workouts,
    selectedExercises,
    onWorkoutArrowClicked,
    selectExercise,
    clearSelectedExercises,
    onSetComplete,
    onExerciseDone,
    numberOfWeeks,
    setRoute,
    shouldKeepCurrentWeekOpened,
    currentWeekOpened,
    saveConfig,
    disableEdit,
    shouldShowRecoveryStatus,
    getConfig
}) {
    const firstWeekWithExercisesLeft = _.range(0, numberOfWeeks).find(week => !workouts.every(w => w.exercises.every(e => e.weeks[week].totalWeeklySets >= e.weeks[week].weeklyTarget))) || 0
    const weekOpened = shouldKeepCurrentWeekOpened ? currentWeekOpened : firstWeekWithExercisesLeft

    const [selectedWeek, setSelectedWeek] = useState(weekOpened || 0)
    const totalSetsThisWeek = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0), 0)
    const thisWeekSetsTarget = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0), 0)
    const isWeekDone = totalSetsThisWeek >= thisWeekSetsTarget
    const [AskAIExerciseDialogOpen, setAskAIExerciseDialogOpen] = useState(false)
    const [openWorkouts, setOpenWorkouts] = useState({});

    function onSelectedWeekChanges(newWeek) {
        setSelectedWeek(newWeek)
        saveConfig('current-week-opened', newWeek)
    }

    function getExercise(exercise) {
        const e = exercises.find(e => e.name === exercise.name);
        if (!e || !e.weeks) {
            return null
        }
        const exerciseData = {
            ...e,
            ...e.weeks[selectedWeek],
            ...exercise,
            ...exercise.weeks[selectedWeek],
            sets: {
                done: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0),
                target: Number(exercise.weeks[selectedWeek].weeklyTarget || 0),
                isFinished: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0) >= Number(exercise.weeks[selectedWeek].weeklyTarget || 0)
            }
        }
        return exerciseData;
    }

    function openAskAIDialog(exercise, selectedWeek) {
        setAskAIExerciseDialogOpen({ exercise, selectedWeek })
    }

    const openWorkout = (workoutId) => setOpenWorkouts({ ...openWorkouts, [workoutId]: !openWorkouts[workoutId] })

    return (
        <WorkoutListUI
            exercises={exercises}
            workouts={workouts}
            selectedExercises={selectedExercises}
            onWorkoutArrowClicked={onWorkoutArrowClicked}
            selectExercise={selectExercise}
            clearSelectedExercises={clearSelectedExercises}
            onSetComplete={onSetComplete}
            onExerciseDone={onExerciseDone}
            numberOfWeeks={numberOfWeeks}
            setRoute={setRoute}
            selectedWeek={selectedWeek}
            onSelectedWeekChanges={onSelectedWeekChanges}
            totalSetsThisWeek={totalSetsThisWeek}
            thisWeekSetsTarget={thisWeekSetsTarget}
            isWeekDone={isWeekDone}
            AskAIExerciseDialogOpen={AskAIExerciseDialogOpen}
            setAskAIExerciseDialogOpen={setAskAIExerciseDialogOpen}
            openWorkouts={openWorkouts}
            openWorkout={openWorkout}
            getExercise={getExercise}
            openAskAIDialog={openAskAIDialog}
            disableEdit={disableEdit}
            shouldShowRecoveryStatus={shouldShowRecoveryStatus}
            saveConfig={saveConfig}
            getConfig={getConfig}
        />
    );
}