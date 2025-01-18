import React, { useState } from "react";
import { List, Divider, Fab, Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ExerciseAskAIDialog } from "./ExerciseAskAIDialog";
import { WorkoutHeader } from "./WorkoutHeader";
import { WorkoutListBody } from "./WorkoutListBody";
import { ExerciseList } from "./ExerciseList";

function SelectedExercisesButton({
    selectedExercises,
    clearSelectedExercises,
    setRoute,
    selectedWeek,
}) {
    return <Fab
        variant="extended"
        color="primary"
        sx={{
            position: 'fixed',
            bottom: '70px',
            right: "130px",
            "width": "200px",
        }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}
        >
            <Box>
            </Box>
            <Box
                onClick={() => setRoute('runExercise', { week: selectedWeek })}
            >
                <Box>
                    Super Set ({selectedExercises.length})
                </Box>
            </Box>
            <IconButton
                sx={{
                    p: 0,
                    ml: 1
                }}
                onClick={() => clearSelectedExercises()}
            >
                <Close
                    sx={{
                        color: "lightgray",
                    }}
                    size="small"
                />
            </IconButton>
        </Box>
    </Fab>

}

export function WorkoutListUI({
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
    selectedWeek,
    onSelectedWeekChanges,
    totalSetsThisWeek,
    thisWeekSetsTarget,
    isWeekDone,
    AskAIExerciseDialogOpen,
    setAskAIExerciseDialogOpen,
    openWorkouts,
    openWorkout,
    getExercise,
    openAskAIDialog,
    disableEdit,
    shouldShowRecoveryStatus,
    saveConfig,
    getConfig
}) {
    const [viewType, setViewType] = useState(getConfig('viewType') || 'workouts');
    const Component = viewType === 'workouts' ? WorkoutListBody : ExerciseList;

    function onViewTypeChange(viewType) {
        setViewType(viewType);
        saveConfig('viewType', viewType);
    }

    return (<>
        <ExerciseAskAIDialog
            open={AskAIExerciseDialogOpen}
            onClose={() => setAskAIExerciseDialogOpen(false)}
            exercise={AskAIExerciseDialogOpen}
        />
        {selectedExercises.length > 0 ? <>
            <SelectedExercisesButton
                selectedExercises={selectedExercises}
                clearSelectedExercises={clearSelectedExercises}
                setRoute={setRoute}
                selectedWeek={selectedWeek}
            />
        </> : ''}
        <List sx={{ paddingTop: '0px' }}>
            <WorkoutHeader
                numberOfWeeks={numberOfWeeks}
                setRoute={setRoute}
                selectedWeek={selectedWeek}
                onSelectedWeekChanges={onSelectedWeekChanges}
                totalSetsThisWeek={totalSetsThisWeek}
                thisWeekSetsTarget={thisWeekSetsTarget}
                isWeekDone={isWeekDone}
                shouldShowRecoveryStatus={shouldShowRecoveryStatus}
                viewType={viewType}
                onViewTypeChange={onViewTypeChange}
            />
            <Divider />
            <Component
                workouts={workouts}
                selectedExercises={selectedExercises}
                onWorkoutArrowClicked={onWorkoutArrowClicked}
                selectExercise={selectExercise}
                clearSelectedExercises={clearSelectedExercises}
                onSetComplete={onSetComplete}
                onExerciseDone={onExerciseDone}
                setRoute={setRoute}
                selectedWeek={selectedWeek}
                openWorkouts={openWorkouts}
                openWorkout={openWorkout}
                getExercise={getExercise}
                openAskAIDialog={openAskAIDialog}
                disableEdit={disableEdit}
            />
        </List>
    </>);
} 