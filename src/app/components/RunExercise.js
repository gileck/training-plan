import { useContext, useEffect, useState } from "react";
import { useExercisesAPI } from "../exercisesAPI";
import { AppContext } from "../AppContext";
import { Grid, Button, IconButton, Paper, Box, Typography, Divider, Stack, CircularProgress } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { AddCircle, Delete, DeleteForever, DeleteForeverRounded, PauseCircleFilledOutlined, PlayArrow, PlayCircleFilledOutlined, RemoveCircle, RemoveCircleOutlineSharp } from "@mui/icons-material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import { localStorageAPI } from "../localStorageAPI";

const primaryTextFontSize = 25;
const secondaryTextFontSize = 20;
const buttonFontSize = 60;
const padding = 20

function TimerClock({ seconds }) {
    const [time, setTime] = useState(seconds);
    const [isRunning, setIsRunning] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            if (!isRunning) return;
            if (time === 0) {
                clearInterval(interval);
            }
            if (time > 0) {
                setTime(time - 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    })

    function toDisplayTime(time) {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }


    return (
        <div>
            <Box
                sx={{
                    padding: 1
                }}
                display="flex"
                justifyContent="space-between"
                alignItems="center" my={2}>
                <IconButton
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {
                        isRunning ? <PauseCircleFilledOutlined
                            sx={{ fontSize: 60 }}
                        /> : <PlayCircleFilledOutlined
                            sx={{ fontSize: 60 }}
                        />

                    }
                </IconButton>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        size={120}
                        variant="determinate"
                        value={time / seconds * 100}

                        sx={{
                            color: isRunning ? 'green' : 'gray',
                        }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            onClick={() => setIsRunning(!isRunning)}
                            variant="caption"
                            sx={{
                                fontSize: 30
                            }}
                            color={isRunning ? 'green' : 'gray'}>
                            {toDisplayTime(time)}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={() => { setTime(seconds); setIsRunning(true) }}
                >

                    <ReplayIcon
                        sx={{ fontSize: 60 }}
                    />
                </IconButton>
            </Box>


        </div>
    )

}

const { getData, saveData } = localStorageAPI()
export function RunExercise(props) {

    const { createTrainingPlanActions, currentTrainingPlan } = useExercisesAPI()

    const { params: { week } } = useContext(AppContext);

    const { exercises, workouts, updateExercise } = createTrainingPlanActions(currentTrainingPlan)

    const selectedExercisesFromLocal = getData('selectedExercises') || [];


    const [selectedExercises, setExerciseIds] = useState(selectedExercisesFromLocal);

    function removeExercise(id) {
        const newSelectedExercises = selectedExercises.filter(e => e !== id);
        console.log({ newSelectedExercises });
        setExerciseIds(newSelectedExercises);
        saveData('selectedExercises', newSelectedExercises)
    }



    const exercisesToShow =
        selectedExercises
            .map(id => workouts.flatMap(w => w.exercises.map(e => Object.assign(e, { workoutId: w.id }))).find(e => e.id === id))
            .map(exercise => {
                return Object.assign(exercise, exercise.weeks[Number(week)])
            })

    function updateSet(exercise, sets) {
        updateExercise(exercise.workoutId, exercise.id, Number(week), {
            totalWeeklySets: Number(exercise.totalWeeklySets || 0) + Number(sets)
        }, {
            action: sets > 0 ? 'SetComplete' : null,
            numberOfSetsDone: sets
        });
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
                Super Set
            </Typography>
            <Divider variant="middle" />

            {
                exercisesToShow.map((exercise, index) => (
                    <>

                        <div container spacing={1} alignItems="center" sx={{ my: 1, mx: 1 }}>
                            <div style={{ padding: 7 }}>

                                <Typography
                                    sx={{
                                        fontSize: primaryTextFontSize,
                                    }}
                                >

                                    {exercise.name}

                                    <span
                                        style={{ float: 'right' }}
                                    >
                                        <IconButton size="xs" onClick={() => removeExercise(exercise.id)}>
                                            <DeleteForeverRounded />
                                        </IconButton>
                                    </span>
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'gray',
                                        fontSize: secondaryTextFontSize
                                    }}
                                >



                                    {exercise.weight > 0 ? `${exercise.numberOfReps}x${exercise.weight}kg` : `${exercise.numberOfReps} reps`}
                                    {exercise.weight === 0 ? " (body weight)" : ""}
                                </Typography>
                            </div>
                            <Grid
                                display="flex"
                                justifyContent="center"
                                sx={{
                                    padding: 1
                                }}
                            >
                                <IconButton
                                    size="xl"
                                    onClick={() => updateSet(exercise, 1)}
                                    disabled={exercise.totalWeeklySets === exercise.weeklyTarget}
                                >
                                    <AddCircle
                                        sx={{ fontSize: buttonFontSize }}
                                    />
                                </IconButton>
                                <Typography sx={{
                                    fontSize: 50,
                                }}>
                                    {exercise.totalWeeklySets} / {exercise.weeklyTarget}
                                </Typography>
                                <IconButton
                                    onClick={() => updateSet(exercise, -1)}
                                    disabled={exercise.totalWeeklySets === 0}

                                >
                                    <RemoveCircle
                                        sx={{ fontSize: buttonFontSize }}
                                    />
                                </IconButton>
                            </Grid>
                        </div >
                        <Divider variant="middle" />
                    </>
                ))
            }


            <Divider variant="middle" />
            <div>
                <TimerClock seconds={120} />
            </div>

        </Paper >
    );

}