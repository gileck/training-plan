import { startTransition, useCallback, useContext, useEffect, useState } from "react";
import { useFetch } from "@/useFetch";
import { Dialog, DialogTitle, TextField, Card, CardMedia, CardContent, Typography, Grid, CardActions, Box, Chip, Select, MenuItem, FormControl, InputLabel, Divider, Button, Tooltip, useMediaQuery } from "@mui/material";
import _ from 'lodash'
import { EditExerciseForm } from "./AddExerciseListItem";
import { AppContext } from "../AppContext";
import { Check, CheckCircle, Search } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { getImageUrl } from "../exercisesList";
function SelectExercisesInput({
    searchTerm,
    setSearchTerm,
    selectedMuscleGroup,
    setSelectedMuscleGroup,
    muscleGroups,
    setPage
}) {
    return <Box>
        <TextField
            fullWidth
            variant="outlined"
            label={
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Search />
                    <Typography>Search Exercise</Typography>
                </div>
            }

            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1); // Reset page when search term changes
            }}
            style={{ marginBottom: '20px' }}
            placeholder="Start typing exercise name..."
        />
        <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
            <InputLabel>Muscle Group</InputLabel>
            <Select
                value={selectedMuscleGroup}
                onChange={(e) => {
                    setSelectedMuscleGroup(e.target.value);
                    setPage(1); // Reset page when muscle group changes
                }}
                label="Muscle Group"
            >
                {muscleGroups.map(group => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
}

function getNumberOfChips() {
    try {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme?.breakpoints?.down?.('sm'));
        const isMediumScreen = useMediaQuery(theme?.breakpoints?.down?.('md'));
        const isLargeScreen = useMediaQuery(theme?.breakpoints?.up?.('lg'));
        return isSmallScreen ? 2 : isMediumScreen ? 2 : isLargeScreen ? 4 : 5;
    } catch (e) {
        return 1
    }
}


function ExerciseCard({
    exercises,
    onExerciseSelected,
    isExerciseExists
}) {
    const { getImageUrl } = useContext(AppContext);

    const numberOfChips = getNumberOfChips()

    return (
        <Grid container spacing={2}>
            {exercises?.map((exercise) => (
                <Grid item xs={6} sm={4} lg={2} key={exercise.id}>
                    <Card
                        onClick={() => onExerciseSelected(exercise)} style={{
                            cursor: 'pointer',
                            height: '350px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}>
                        <CardMedia
                            component="img"
                            style={{ objectFit: 'contain', height: '200px' }}
                            image={!exercise.image.includes("https") ? `/images/${exercise.image}` : exercise.image}
                        />


                        <Divider />

                        <CardActions
                            sx={{
                                backgroundColor: '#f6f6f6',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px'
                            }}
                        >

                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100px',

                                }}
                            >
                                <Tooltip title={exercise.name}>
                                    <Typography variant="h6" component="div">
                                        {exercise.name.length > 25 ? `${exercise.name.substring(0, 25)}...` : exercise.name}
                                    </Typography>
                                </Tooltip>
                                <Box
                                    sx={{
                                        marginTop: '10px'
                                    }}
                                >

                                    {
                                        _.take(exercise.bodyParts, numberOfChips).map(bodyPart => (
                                            <Chip
                                                size="small"

                                                sx={{
                                                    fontSize: '10px',
                                                    marginRight: isExerciseExists(exercise.name) ? '2px' : '5px',
                                                    marginBottom: '5px',
                                                    backgroundColor: exercise.bodyParts.indexOf(bodyPart) === 0 ? '#ededed' : 'white',
                                                    color: '#000',
                                                    // fontWeight: exercise.bodyParts.indexOf(bodyPart) === 0 ? 'bold' : 'normal'
                                                }}
                                                label={bodyPart} />
                                        ))
                                    }
                                    {
                                        exercise.bodyParts.length > numberOfChips && <Tooltip title={exercise.bodyParts.slice(numberOfChips).join(', ')}><Chip
                                            size="small"
                                            color="default"
                                            sx={{
                                                fontSize: '10px',
                                                marginRight: '0px',
                                                marginBottom: '5px',
                                            }}
                                            label={`+${exercise.bodyParts.length - numberOfChips}`}


                                        /></Tooltip>
                                    }
                                    {isExerciseExists(exercise.name) && <CheckCircle
                                        sx={{
                                            float: 'right'
                                        }}
                                        color="success" />}
                                </Box>

                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export function AddCustomExercise({ onExerciseSelected }) {
    return <Box>
        <SelectExerciseInternal
            isExerciseExists={() => false}
            getExerciseFromTrainingPlan={() => { }}
            onExerciseSelected={onExerciseSelected}
        />
    </Box>
}
export function SelectExercise({ onAddExercise, isExerciseExists, getExerciseFromTrainingPlan, addCustomExerciseClicked }) {
    const [selectedExercise, setSelectedExercise] = useState(null);

    return <>
        <SelectExerciseInternal
            isExerciseExists={isExerciseExists}
            getExerciseFromTrainingPlan={getExerciseFromTrainingPlan}
            onExerciseSelected={setSelectedExercise}
            addCustomExerciseClicked={addCustomExerciseClicked}
        />
        <div>
            {selectedExercise ? <Dialog
                fullWidth={true}
                open={selectedExercise}
                onClose={() => setSelectedExercise(null)}>

                <EditExerciseForm
                    onAddExercise={onAddExercise}
                    exercise={selectedExercise}
                    onCancel={() => setSelectedExercise(null)}
                    isEdit={isExerciseExists(selectedExercise.name)}
                />
            </Dialog> : null}
        </div>
    </>

}
export function SelectExerciseInternal({ onExerciseSelected, isExerciseExists, getExerciseFromTrainingPlan, addCustomExerciseClicked }) {
    const [shouldUseRawExercises, setShouldUseRawExercises] = useState(false);

    const { data } = useFetch(shouldUseRawExercises ? '/api/exercises/getAllExercisesRaw' : '/api/exercises/getExercises');
    const exercisesList = data?.exercises?.map(e => ({
        bodyParts: e.bodyPart,
        ...(e.primaryMuscle ? { bodyParts: [e.primaryMuscle, ...e.secondaryMuscles] } : {}),
        ...e
    })) || []
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const muscleGroups = ['All', ...new Set(exercisesList.map(e => e.bodyParts).flat())];


    const filteredExercises = _(exercisesList).uniqBy('name').value().filter((exercise) =>
        exercise.image &&
        (selectedMuscleGroup === 'All' || exercise.bodyParts.includes(selectedMuscleGroup))
    ).map((exercise) => {
        const term = searchTerm.toLowerCase().trim()
        if (exercise.name.toLowerCase() === term) {
            return {
                exercise,
                rank: 1
            }
        }
        if (term.startsWith(exercise.name.toLowerCase())) {
            return {
                exercise,
                rank: 2
            }
        }
        if (exercise.name.toLowerCase().includes(term)) {
            return {
                exercise,
                rank: 3
            }
        }
        if (term.split(' ').filter(w => w.length > 2).some(word => exercise.name.toLowerCase().includes(word))) {
            return {
                exercise,
                rank: 4
            }
        }
        return null
    })
        .filter(e => e)
        .sort((a, b) => {
            return a.rank - b.rank
        })
        .map(e => e.exercise)


    const exercisesToShow = filteredExercises.slice(0, itemsPerPage * page)



    // const handleScroll = () => {
    //     if (state.loading) return

    //     const value = window.innerHeight + document.documentElement.scrollTop
    //     const offsetHeight = document.documentElement.offsetHeight

    //     if (value / offsetHeight > 0.6) {
    //         state.loading = true
    //         setPage(prevPage => prevPage + 1);
    //     }
    // };



    function onExerciseSelectedInternal(exercise) {
        if (isExerciseExists(exercise.name)) {
            onExerciseSelected(getExerciseFromTrainingPlan(exercise.name))
        } else {
            onExerciseSelected({ ...exercise, name: exercise.name })
        }

    }

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <Box sx={{ p: 1 }}>
            <SelectExercisesInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedMuscleGroup={selectedMuscleGroup}
                setSelectedMuscleGroup={setSelectedMuscleGroup}
                muscleGroups={muscleGroups}
                setPage={setPage}
            />
            <Box
                sx={{
                    marginBottom: '20px'
                }}
            >
                {
                    exercisesToShow.length === 0 && <Typography>No exercises found</Typography>
                }
                {

                    exercisesToShow.length > 0 && <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    ><Typography
                        sx={{
                            fontSize: '14px',
                            color: 'gray'
                        }}
                    >Showing {exercisesToShow.length} of {filteredExercises.length} exercises</Typography>
                        <Select
                            size="small"
                            sx={{
                                fontSize: '11px'
                            }}
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(e.target.value)
                            }}
                        >
                            <MenuItem selected value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={30}>40</MenuItem>
                            <MenuItem value={30}>50</MenuItem>
                        </Select>
                    </Box>
                }
            </Box>
            <ExerciseCard
                isExerciseExists={isExerciseExists}
                exercises={exercisesToShow}
                onExerciseSelected={onExerciseSelectedInternal}
            />
            <Box textAlign="center" mt={2}>
                <Button
                    disabled={exercisesToShow.length >= filteredExercises.length}
                    fullWidth={true}
                    variant="contained" onClick={handleLoadMore}>
                    LOAD MORE
                    {filteredExercises.length > (page * itemsPerPage) && ` (${filteredExercises.length - (page * itemsPerPage)})`}
                </Button>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '20px'
                }}
            >
                {!shouldUseRawExercises ? <Button
                    onClick={() => setShouldUseRawExercises(true)}
                >
                    Use Full Exercise List
                </Button> : ''}
            </Box>

        </Box>
    );
}