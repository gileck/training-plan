import { startTransition, useCallback, useContext, useEffect, useState } from "react";
import { useFetch } from "@/useFetch";
import { Dialog, DialogTitle, TextField, Card, CardMedia, CardContent, Typography, Grid, CardActions, Box, Chip, Select, MenuItem, FormControl, InputLabel, Divider } from "@mui/material";
import _ from 'lodash'
import { EditExerciseForm } from "./AddExerciseListItem";
import { AppContext } from "../AppContext";
import { Check, CheckCircle } from "@mui/icons-material";
let state = {
    loading: false
}

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
            label="Search Exercise"
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

function ExerciseCard({
    exercises,
    onExerciseSelected,
    isExerciseExists
}) {
    return (
        <Grid container spacing={2}>
            {exercises?.map((exercise) => (
                <Grid item xs={6} sm={6} key={exercise.id}>
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
                            image={`images/${exercise.image}`}
                        />
                        <Divider />

                        <CardActions>
                            <Box>
                                <Typography variant="h6" component="div">
                                    {exercise.name}
                                </Typography>
                                <Box
                                    sx={{
                                        marginTop: '10px'
                                    }}
                                >

                                    {
                                        exercise.bodyParts.map(bodyPart => (
                                            <Chip
                                                size="small"
                                                sx={{
                                                    fontSize: '10px',
                                                    marginRight: '5px',
                                                    marginBottom: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    color: '#000',
                                                    fontWeight: exercise.bodyParts.indexOf(bodyPart) === 0 ? 'bold' : 'normal'
                                                }}
                                                label={bodyPart} />
                                        ))
                                    }
                                </Box>
                            </Box>


                            {isExerciseExists(exercise.name) && <CheckCircle color="success" />}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export function SelectExercise({ onAddExercise, isExerciseExists, getExerciseFromTrainingPlan }) {
    const [selectedExercise, setSelectedExercise] = useState(null);

    return <>
        <SelectExerciseInternal
            isExerciseExists={isExerciseExists}
            getExerciseFromTrainingPlan={getExerciseFromTrainingPlan}
            onExerciseSelected={setSelectedExercise}
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
export function SelectExerciseInternal({ onExerciseSelected, isExerciseExists, getExerciseFromTrainingPlan }) {
    // const { data } = useFetch('/api/exercises/getAllExercisesRaw');
    const { data } = useFetch('/api/exercises/getExercises');
    const exercisesList = data?.exercises.map(e => ({
        ...e, bodyParts: [e.primaryMuscle, ...e.secondaryMuscles]
    })) || []
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
    const itemsPerPage = 30;
    const muscleGroups = ['All', ...new Set(exercisesList.map(e => e.bodyParts).flat())];


    const debouncedFilteredExercises = useCallback(_.debounce(setFilteredExercises, 1000), [])

    useEffect(() => {
        // if (searchTerm.length < 2 && selectedMuscleGroup === 'All') {
        //     setFilteredExercises([])
        //     return
        // }
        const filteredExercises = exercisesList?.filter(exercise =>
            exercise.image &&
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedMuscleGroup === 'All' || exercise.bodyParts.includes(selectedMuscleGroup))
        )
        debouncedFilteredExercises(filteredExercises.slice(0, itemsPerPage * page))

    }, [searchTerm, page, selectedMuscleGroup])

    useEffect(() => {
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleScroll = () => {
        if (state.loading) return

        const value = window.innerHeight + document.documentElement.scrollTop
        const offsetHeight = document.documentElement.offsetHeight

        if (value / offsetHeight > 0.6) {
            state.loading = true
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            state.loading = false
        }, 3000)
    }, [page])

    function onExerciseSelectedInternal(exercise) {
        if (isExerciseExists(exercise.name)) {
            onExerciseSelected(getExerciseFromTrainingPlan(exercise.name))
        } else {
            onExerciseSelected({ name: exercise.name })
        }

    }

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
            <ExerciseCard
                isExerciseExists={isExerciseExists}
                exercises={filteredExercises}
                onExerciseSelected={onExerciseSelectedInternal}
            />


        </Box >
    );
}