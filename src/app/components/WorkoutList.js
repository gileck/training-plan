import React, { useState } from "react";
import { List, ListItem, ListItemText, IconButton, Fab, Box, LinearProgress, Divider, Collapse, ListItemSecondaryAction } from "@mui/material";
import { ArrowLeft, ArrowRight, ExpandLess, ExpandMore, Assistant, NavigationOutlined, Close } from '@mui/icons-material';
import { Exercise } from "./Exercise";
import { ExerciseAskAIDialog } from "./ExerciseAskAIDialog";
import { RecoveryStatus } from "./RecoveryStatus";
import { colors } from './colors';

export function WorkoutList({
    exercises,
    workouts,
    selectedExercises,
    onWorkoutArrowClicked,
    selectExercise,
    setSelectedExercises,
    onSetComplete,
    onExerciseDone,
    numberOfWeeks,
    setRoute,
    shouldKeepCurrentWeekOpened,
    currentWeekOpened,
    saveConfig,
    disableEdit,
    shouldShowRecoveryStatus
}) {
    const firstWeekWithExercisesLeft = _.range(0, numberOfWeeks).find(week => !workouts.every(w => w.exercises.every(e => e.weeks[week].totalWeeklySets >= e.weeks[week].weeklyTarget))) || 0
    const weekOpened = shouldKeepCurrentWeekOpened ? currentWeekOpened : firstWeekWithExercisesLeft

    const [selectedWeek, setSelectedWeek] = useState(weekOpened || 0)
    // const firstWorkoutWithExercisesLeft = workouts.find(w => w.exercises.some(e => e.weeks[firstWeekWithExercisesLeft].totalWeeklySets < e.weeks[firstWeekWithExercisesLeft].weeklyTarget))
    const totalSetsThisWeek = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].totalWeeklySets || 0), 0), 0)
    const thisWeekSetsTarget = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc, e) => acc + (e.weeks[selectedWeek].weeklyTarget || 0), 0), 0)
    // const totalSets = _.sumBy(workouts, w => _.sumBy(w.exercises, e => _.sumBy(e.weeks, 'totalWeeklySets')))
    // const totalSetsTarget = _.sumBy(workouts, w => _.sumBy(w.exercises, e => _.sumBy(e.weeks, 'weeklyTarget')))
    const isWeekDone = totalSetsThisWeek >= thisWeekSetsTarget
    const [AskAIExerciseDialogOpen, setAskAIExerciseDialogOpen] = useState(false)
    // const [openWorkouts, setOpenWorkouts] = useState({
    //     [firstWorkoutWithExercisesLeft?.id]: true
    // });

    const [openWorkouts, setOpenWorkouts] = useState({});

    function onSelectedWeekChanges(newWeek) {
        setSelectedWeek(newWeek)
        saveConfig('current-week-opened', newWeek)
    }

    function isWorkoutFinished(workout) {
        return workout.exercises.every((exercise) => {
            const e = getExercise(exercise);
            if (!e) {
                return false
            }
            return e.sets.done >= e.sets.target;
        })

    }

    const openWorkout = (workoutId) => setOpenWorkouts({ ...openWorkouts, [workoutId]: !openWorkouts[workoutId] })

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
            }
        }
        return exerciseData;
    }

    function openAskAIDialog(exercise, selectedWeek) {
        console.log('openAskAIDialog', exercise);
        setAskAIExerciseDialogOpen({ exercise, selectedWeek })
    }


    return (<>
        <ExerciseAskAIDialog
            open={AskAIExerciseDialogOpen}
            onClose={() => setAskAIExerciseDialogOpen(false)}
            exercise={AskAIExerciseDialogOpen}
        />
        {
            selectedExercises.length > 0 ? <><Fab

                variant="extended"
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: '70px',
                    right: "130px",
                    "width": "200px",
                }}>

                {/* <NavigationOutlined sx={{ mr: 1 }} /> */}
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
                        onClick={() => setSelectedExercises([])}
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
                {/* <Fab
                    size="small"

                    color="secondary"
                    sx={{
                        position: 'fixed',
                        bottom: '70px',
                        right: '20px',

                    }}>

                </Fab> */}




            </> : ''}
        < List
            sx={{
                paddingTop: '0px',


            }}

        >
            <ListItem
                sx={{
                    backgroundColor: colors.listHeaderBackground,
                    paddingBottom: '0px',
                }}
            >

                <ListItemText
                    sx={{
                        // color: colors.listHeaderText,
                    }}
                    primary={<div style={{ fontSize: '25px' }}>
                        Workouts
                    </div>}

                    secondary={<React.Fragment>
                        <div>Week:
                            <IconButton
                                sx={{ padding: '3px', mb: '2px' }}
                                disabled={selectedWeek === 0}

                                onClick={() => onSelectedWeekChanges((selectedWeek - 1) % numberOfWeeks)}>
                                <ArrowLeft sx={{ fontSize: '15px' }} />
                            </IconButton>
                            {selectedWeek + 1}

                            <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>

                            {numberOfWeeks}

                            <IconButton
                                sx={{ padding: '3px' }}
                                disabled={selectedWeek === numberOfWeeks - 1}

                                onClick={() => onSelectedWeekChanges(selectedWeek + 1 % numberOfWeeks)}>
                                <ArrowRight sx={{ fontSize: '15px' }} />
                            </IconButton>

                        </div>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0px',
                            }}
                        >
                            <div>
                                Sets:
                                <span style={{ marginLeft: '5px', }}>{totalSetsThisWeek}</span>
                                <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>
                                <span style={{ marginRight: '5px', }}>{thisWeekSetsTarget}</span>
                                {isWeekDone ? '✅' : ''}
                            </div>
                            <Box sx={{
                                position: 'absolute',
                                right: '20px',
                                marginBottom: '50px'
                            }}>
                                <div>
                                    {shouldShowRecoveryStatus ? <RecoveryStatus /> : ''}



                                    <Assistant
                                        onClick={() => setRoute('askAI')}
                                        sx={{
                                            fontSize: '20px',
                                            height: '20px',
                                            color: '#7c69dc'
                                        }}

                                    />

                                </div>
                            </Box>

                        </Box>
                        <Box>
                            <LinearProgress
                                sx={{
                                    marginTop: '10px'
                                }}
                                variant="determinate"
                                value={totalSetsThisWeek / thisWeekSetsTarget * 100}
                            />
                            {/* <LinearProgress
                                color="secondary"
                                sx={{
                                    marginTop: '5px'
                                }}
                                variant="determinate"
                                value={totalSets / totalSetsTarget * 100}
                            /> */}
                        </Box>

                    </React.Fragment>}

                />



            </ListItem>
            <Divider />
            {
                workouts.map((workout) => (
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
                                    ${isWorkoutFinished(workout) ? '✅' : ''}
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
                            {
                                workout.exercises.map((exercise) => (
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

                                ))
                            }
                        </Collapse>
                        <Divider />
                    </React.Fragment>
                ))
            }
        </List >
    </>

    )
}