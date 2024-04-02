import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getAllBodyParts, getBodyParts, getCategory, getPullPushType, useExercisesAPI } from "../exercisesAPI";
import { Exercise, ExercisesWeekly } from "./TrainingPlan";
import { useState } from "react";

function createWorkeout({ numberOfExercises, pullPush }, exercises) {
    const filteredExercises = exercises.filter(e => e.pullPush === pullPush)
    return filteredExercises.slice(0, numberOfExercises)

}

export function Workout() {
    const { exercises, updateExercise, numberOfWeeks } = useExercisesAPI()
    const [exType, setExerciseType] = useState('fullBody')
    const [selectedWeek, setSelectedWeek] = useState(0)
    const [bodyParts, setBodyParts] = useState(null)
    const [pullPushType, setPullPushType] = useState('all')
    const exerciseToShow = exercises
        .map(e => ({ ...e, ...e.weeks[selectedWeek] }))
        .filter(e => exType === "fullBody" ? true : getCategory(e.name) === exType)
        // .filter(e => bodyParts === "all" ? true : getBodyParts(e.name).includes(bodyPart))
        .filter(e => !bodyParts ? true : bodyParts.some(part => getBodyParts(e.name).includes(part)))
        .filter(e => pullPushType === "all" ? true : getPullPushType(e.name) === pullPushType)

    function onSetComplete(exercise, sets) {
        updateExercise(exercise.id, 0, {
            totalWeeklySets: Number(exercise.totalWeeklySets || 0) + Number(sets)
        });
    }

    function onExercisePullPushChanged(e) {
        setPullPushType(e.target.value);
    }

    function onBodyPartChanged(e) {
        setBodyParts(e.target.value);
    }

    function onExerciseTypeChanged(e) {
        setExerciseType(e.target.value);
    }
    function changeSelectedWeek(e) {
        setSelectedWeek(e.target.value);
    }
    return (
        <div>
            <div>
                {/* <span
                    style={{ marginRight: '20px' }}>
                    Filter:
                </span> */}
                <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Body Parts</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={bodyParts || []}
                            onChange={onBodyPartChanged}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}>
                            <MenuItem key={'all'} value={'all'}>All</MenuItem>
                            {
                                getAllBodyParts().map((part) => (
                                    <MenuItem key={part} value={part}>{part}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                <Select value={selectedWeek} onChange={changeSelectedWeek}>
                    {
                        _.range(0, numberOfWeeks).map((week) => (
                            <MenuItem key={week} value={week}>Week {week}</MenuItem>
                        ))
                    }
                </Select>
                <Select value={exType} onChange={onExerciseTypeChanged}>
                    <MenuItem value={"fullBody"}>Full Body</MenuItem>
                    <MenuItem value={"Upper body"}>Upper Body</MenuItem>
                    <MenuItem value={"Legs"}>Legs</MenuItem>
                </Select>


                <Select value={pullPushType} onChange={onExercisePullPushChanged}>
                    <MenuItem value={"all"}>All</MenuItem>
                    <MenuItem value={"Pull"}>Pull</MenuItem>
                    <MenuItem value={"Push"}>Push</MenuItem>
                </Select>


            </div>
            {
                exerciseToShow.map((exercise) => (
                    <Exercise
                        key={exercise.id}
                        exercise={exercise}
                        onRemoveSetComplete={() => onSetComplete(exercise, -1)}
                        onAddSetComplete={() => onSetComplete(exercise, 1)}
                    />
                ))
            }
        </div >
    );
}