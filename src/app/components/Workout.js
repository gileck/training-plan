import React, { useContext, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { AddCircle as AddCircleIcon, Assistant, AssistantDirectionSharp, ChatBubble, ChatBubbleOutline, ChatBubbleOutlineRounded, ChatBubbleTwoTone, Help, HelpCenter, HelpOutline, SmartToy, SupportAgent } from '@mui/icons-material';
import { Avatar, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, LinearProgress, ListItemAvatar, ListItemSecondaryAction, Typography } from "@mui/material";
import { CheckCircle } from '@mui/icons-material';
import { getPrimaryMuscle, getSecondaryMuscles, useExercisesAPI } from "../exercisesAPI";
import { RemoveCircle, ExpandLess, ExpandMore, Label, ExpandMoreOutlined, ExpandLessRounded, ArrowLeft, ArrowRight, NavigationOutlined, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { AppContext } from "../AppContext";
import Fab from '@mui/material/Fab';
import { localStorageAPI } from "@/app/localStorageAPI";
import theme from "@/app/theme";
import { Chat } from "./chat";
import { getImageUrl } from "../exercisesList";
import Image from "next/image";
import { RecoveryStatus } from "./RecoveryStatus";
import { WorkoutList } from "./WorkoutList";
// import { Exercise } from "./TrainingPlan";
import FireWorksAnimation from "./FireWorksAnimation";
function WorkoutFinishedAnimation() {
    const emojis = ["🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥"];
    const emojiElements = emojis.map((emoji, index) => (
        <span key={index} style={{
            position: 'absolute',
            top: `${Math.random() * window.innerHeight}px`,
            left: `${Math.random() * window.innerWidth}px`,
            fontSize: '5rem',
            animation: 'fade 3s ease-in-out',
            zIndex: 9999
        }}>
            {emoji}
        </span>
    ));

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 9999 }}>
            {emojiElements}
            <style jsx>{`
                @keyframes fade {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}







export function Workout() {
    const { saveData, getData, getConfig, saveConfig } = localStorageAPI()
    const shouldKeepCurrentWeekOpened = getConfig('keep-current-week-opened') || false
    const currentWeekOpened = getConfig('current-week-opened') || 0
    const [shouldShowWorkoutFinishedAnimation, setShouldShowWorkoutFinishedAnimation] = useState(false)

    function showWorkoutFinishedAnimation() {
        setShouldShowWorkoutFinishedAnimation(true)
        setTimeout(() => {
            setShouldShowWorkoutFinishedAnimation(false)
        }, 5000)
    }
    // const { workouts, exercises, updateExercise, numberOfWeeks, changeExerciseOrderInWorkout } = useExercisesAPI()
    const { currentTrainingPlan: trainingPlan, createTrainingPlanActions } = useExercisesAPI()
    if (!trainingPlan) {
        return <div></div>
    }
    const { workouts, exercises, updateExercise, numberOfWeeks, changeExerciseOrderInWorkout } = createTrainingPlanActions(trainingPlan)

    const [selectedExercises, setSelectedExercises] = useState(getData('selectedExercises') || [])
    //shouldShowArrows, 
    //onWorkoutArrowClicked,
    function onWorkoutArrowClicked(wid, eid, value) {
        console.log({ value, wid, eid });
        changeExerciseOrderInWorkout(wid, eid, value)
    }

    function selectExercise(exerciseId) {

        let newSelectedExercises = [];
        if (selectedExercises.includes(exerciseId)) {
            newSelectedExercises = selectedExercises.filter(id => id !== exerciseId)
        } else {
            newSelectedExercises = [exerciseId, ...selectedExercises]
        }
        setSelectedExercises(newSelectedExercises)
        saveData('selectedExercises', newSelectedExercises)

    }

    function WorkoutFinished(workoutId, exerciseId, selectedWeek, updateData) {
        const workout = workouts.find(w => w.id === workoutId)
        return workout.exercises.every(e => {
            if (e.id === exerciseId) {
                return updateData.totalWeeklySets >= e.weeks[selectedWeek].weeklyTarget
            }
            return e.weeks[selectedWeek].totalWeeklySets >= e.weeks[selectedWeek].weeklyTarget
        })
    }

    function onUpdateExercise(workoutId, exerciseId, selectedWeek, updateData, options) {
        updateExercise(workoutId, exerciseId, selectedWeek, updateData, options)
        if (WorkoutFinished(workoutId, exerciseId, selectedWeek, updateData)) {
            // showWorkoutFinishedAnimation()
        }
    }

    function onSetComplete(workoutId, exercise, sets, selectedWeek) {
        onUpdateExercise(workoutId, exercise.id, selectedWeek, {
            totalWeeklySets: Number(exercise.weeks[selectedWeek].totalWeeklySets || 0) + Number(sets)
        }, {
            action: sets > 0 ? 'SetComplete' : null,
            numberOfSetsDone: sets
        });
    }

    function onExerciseDone(workoutId, exercise, selectedWeek) {
        onUpdateExercise(workoutId, exercise.id, selectedWeek, {
            totalWeeklySets: Number(exercise.weeks[selectedWeek].weeklyTarget || 0)
        }, {
            action: 'ExerciseDone',
            numberOfSetsDone: exercise.weeks[selectedWeek].weeklyTarget - exercise.weeks[selectedWeek].totalWeeklySets
        })
    }




    const { setRoute } = useContext(AppContext);
    return (<div>

        {/* {shouldShowWorkoutFinishedAnimation && <WorkoutFinishedAnimation />} */}
        {/*{shouldShowWorkoutFinishedAnimation && <FireWorksAnimation />}*/}

        <WorkoutList
            exercises={exercises}
            workouts={workouts}
            selectedExercises={selectedExercises}
            setSelectedExercises={setSelectedExercises}
            onWorkoutArrowClicked={onWorkoutArrowClicked}
            selectExercise={selectExercise}
            onSetComplete={onSetComplete}
            onExerciseDone={onExerciseDone}
            numberOfWeeks={numberOfWeeks}
            setRoute={setRoute}
            shouldKeepCurrentWeekOpened={shouldKeepCurrentWeekOpened}
            currentWeekOpened={currentWeekOpened}
            saveConfig={saveConfig}
            shouldShowRecoveryStatus={true}

        />

    </div >
    );
}

