import { FormControl } from "@mui/base";
import { Button, Box, ButtonBase, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, Chip } from "@mui/material";
import { useState } from "react";
import { getAllBodyParts } from "../exercisesAPI";
import { CheckBox } from "@mui/icons-material";
import { BuildTrainingPlan } from "./buildTrainingPlanLogic";

export function BuildTrainingPlanDialog({
    exercises,
    onBuildTrainingPlan,
    onClose,
    exerciseList,
    buildTrainigPlanDialigOpen
}) {

    const [workoutType, setWorkoutType] = useState([]);
    const [weeklyExercises, setWeeklyExercises] = useState(3);
    const [level, setLevel] = useState(3);
    const [focusMuscles, setFocusMuscles] = useState([])

    function handleFocusMuscleChange(e) {
        const value = e.target.value;
        console.log({ value });

        if (value.length > 3 && value.length >= focusMuscles.length) {
            return;
        }

        setFocusMuscles(value)

        // setFocusMuscles((prev) => {
        //     if (prev.includes(value)) {
        //         return prev.filter((v) => v !== value)
        //     } else {
        //         return [...prev, value]
        //     }
        // });
    }

    function onBuildTrainingPlanInternal() {

        console.log({

            workoutType,
            weeklyExercises,
            level,
            focusMuscles
        });

        const traininPlan = BuildTrainingPlan({
            exerciseList,
            weeklyExercises,
            level,
            focusMuscles,
            workoutType
        })

        console.log({
            traininPlan
        });


        onBuildTrainingPlan(traininPlan)



    }

    function onWorkoutTypeChanged(workoutType, e) {
        const value = e.target.checked;
        setWorkoutType(
            (prev) => {
                if (value) {
                    return [...prev, workoutType]
                } else {
                    return prev.filter((wt) => wt !== workoutType)
                }
            }
        )
        console.log({ workoutType, value });
    }

    return (
        <Dialog
            disableEscapeKeyDown
            open={buildTrainigPlanDialigOpen}
            onClose={() => onClose()}
            fullWidth={true}
        >
            <DialogTitle>
                Build Training Plan
            </DialogTitle>

            <Box component="form" sx={{ padding: '15px' }}>
                <FormGroup>
                    <FormControl sx={{ marginBottom: '30px' }} component="div" >



                        <InputLabel>Select</InputLabel>
                        <RadioGroup>
                            <FormControlLabel
                                value="gym"
                                control={<Checkbox onChange={(e) => onWorkoutTypeChanged('gym', e)} />}
                                label="Gym"
                            />
                            <FormControlLabel
                                value="outdoor"
                                control={<Checkbox onChange={(e) => onWorkoutTypeChanged('outdoor', e)} />}
                                label="Outdoor"
                            />
                            <FormControlLabel
                                value="studio"
                                control={<Checkbox onChange={(e) => onWorkoutTypeChanged('Studio', e)} />}
                                label="Studio"
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{ display: 'flex', }}>
                        <InputLabel
                            id="label_weeklyExercises"
                            sx={{
                                marginTop: '7px',
                                marginRight: '10px'

                            }}
                        >Weekly exercises</InputLabel>
                        <Select
                            labelId="label_weeklyExercises"
                            defaultValue="3"
                            size="small"
                            sx={{

                            }}
                            onChange={(e) => setWeeklyExercises(e.target.value)}
                        >
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem selected value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                            <MenuItem value="6">6</MenuItem>
                            <MenuItem value="7">7</MenuItem>
                        </Select>
                    </Box>


                    <Box sx={{ display: 'flex', marginTop: '20px' }}>


                        <InputLabel
                            id="level"
                            sx={{
                                marginTop: '7px',
                                marginRight: '10px'

                            }}
                        >Level</InputLabel>
                        <Select
                            labelId="level"
                            label="Level"
                            defaultValue="3"
                            size="small"
                            sx={{

                            }}
                            onChange={(e) => setLevel(e.target.value)}
                        >

                            <MenuItem value="1">First Time</MenuItem>
                            <MenuItem value="2">Beginner</MenuItem>
                            <MenuItem selected value="3">Intermediate</MenuItem>
                            <MenuItem value="4">Advanced</MenuItem>
                            <MenuItem value="5">Professional</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ marginTop: '20px', mb: "20px" }}>
                        <InputLabel
                            id="focusMuscles"
                            sx={{
                                marginTop: '7px',
                                marginRight: '10px'

                            }}
                        >Focus Muscles (Up to 3)</InputLabel>
                        <Select
                            label="Focus Muscles"
                            labelId="focusMuscles"
                            multiple
                            size="small"
                            value={focusMuscles}
                            onChange={handleFocusMuscleChange}
                            sx={{
                                maxWidth: '200px'
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {
                                getAllBodyParts().map((bodyPart, index) => (

                                    <MenuItem key={index} value={bodyPart}>
                                        <Checkbox checked={focusMuscles.indexOf(bodyPart) > -1} />
                                        {bodyPart}

                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </Box>

                </FormGroup>
                <Button
                    variant="contained"
                    onClick={onBuildTrainingPlanInternal}
                >
                    Build Training Plan
                </Button>
            </Box >


        </Dialog >
    );




}