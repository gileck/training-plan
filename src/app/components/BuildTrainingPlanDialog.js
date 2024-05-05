import { FormControl } from "@mui/base";
import { Button, Box, ButtonBase, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import { useState } from "react";
import { getAllBodyParts } from "../exercisesAPI";

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
        setFocusMuscles((prev) => {
            if (prev.includes(value)) {
                return prev.filter((v) => v !== value)
            } else {
                return [...prev, value]
            }
        });
    }

    function onBuildTrainingPlanInternal() {

        console.log({
            workoutType,
            weeklyExercises,
            level
        });

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

                    <FormControl sx={{ marginBottom: '30px' }} component="div" >
                        <InputLabel>Weekly exercises</InputLabel>
                        <Select
                            label="Weekly exercises"
                            defaultValue="3"
                            size="xs"
                            sx={{
                                padding: '5px',

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
                    </FormControl>

                    <FormControl sx={{ marginBottom: '30px' }} component="div" >
                        <InputLabel>Level</InputLabel>
                        <Select
                            label="Level"
                            defaultValue="3"
                            size="xs"
                            sx={{
                                padding: '5px',

                            }}
                            onChange={(e) => setLevel(e.target.value)}
                        >

                            <MenuItem value="1">First Time</MenuItem>
                            <MenuItem value="2">Beginner</MenuItem>
                            <MenuItem selected value="3">Intermediate</MenuItem>
                            <MenuItem value="4">Advanced</MenuItem>
                            <MenuItem value="5">Professional</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mb: '10px' }}>
                        <InputLabel>Secondary Muscle</InputLabel>
                        <Select
                            label="Focus Muscles"
                            multiple
                            value={focusMuscles}
                            onChange={handleFocusMuscleChange}>
                            {
                                getAllBodyParts().map((bodyPart, index) => (
                                    <MenuItem key={index} value={bodyPart}>{bodyPart}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                </FormGroup>
                <Button
                    variant="contained"
                    onClick={onBuildTrainingPlanInternal}
                >
                    Build Training Plan
                </Button>
            </Box>


        </Dialog>
    );




}