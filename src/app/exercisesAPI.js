import { useState } from 'react';
import _ from 'lodash';
import { localStorageAPI } from "./localStorageAPI";

export const exercisesList = [
    { name: "Push-ups", bodyParts: ["Chest", "Triceps", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Squats", bodyParts: ["Quadriceps", "Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Lunges", bodyParts: ["Quadriceps", "Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Plank", bodyParts: ["Core"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Deadlifts", bodyParts: ["Back", "Glutes", "Hamstrings"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Bench Press", bodyParts: ["Chest", "Triceps", "Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Pull-ups", bodyParts: ["Back", "Biceps"], pullPush: "Pull", bodyWeight: true, category: "Upper body" },
    { name: "Sit-ups", bodyParts: ["Core"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Burpees", bodyParts: ["Full Body"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Mountain Climbers", bodyParts: ["Core", "Shoulders"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Bicep Curls", bodyParts: ["Biceps"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Shoulder Press", bodyParts: ["Shoulder"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Tricep Dips", bodyParts: ["Triceps"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Jump Squats", bodyParts: ["Quadriceps", "Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Kettlebell Swings", bodyParts: ["Glutes", "Hamstrings", "Back"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Box Jumps", bodyParts: ["Legs"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Wall Sit", bodyParts: ["Quadriceps", "Glutes"], pullPush: null, bodyWeight: false, category: "Legs" }
];

// export const exercisesList = [
//     { name: "Squats", weeklyTarget: 10 },
//     { name: "ATG Split squats", weeklyTarget: 10 },
//     { name: "Shoulder Press", weeklyTarget: 15 },
//     { name: "Bicep Curls", weeklyTarget: 15 },
//     { name: "Tricep Extensions", weeklyTarget: 10 },
//     { name: "Pull Ups", weeklyTarget: 15 },
//     { name: "Push Ups", weeklyTarget: 15 },
//     { name: "Deeps", weeklyTarget: 10 },
//     { name: "Core", weeklyTarget: 10 },
//     { name: "Farmer Carry", weeklyTarget: 15 },
//     { name: "Lunges", weeklyTarget: 10 },
//     { name: "Kettlebell Swings", weeklyTarget: 10 },
//     { name: "Snatch", weeklyTarget: 10 },
//     { name: "Shoulder side raises", weeklyTarget: 10 },
//     { name: "HIIT", weeklyTarget: 2 },
// ]
const SmallexercisesList = [
    { name: "Squats", weeklyTarget: 10 },
]

export function useExercisesAPI() {

    const { getData, saveData, cleanData } = localStorageAPI();

    function calcWeelklyTarget(weeklyTarget, week, overloadValue) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
    }

    const localExercises = getData('exercises') || [];
    console.log({ localExercises });
    const [exercises, setExercises] = useState(localExercises);
    const [numberOfWeeks, setWeeksValue] = useState(getData('numberOfWeeks') || 7);
    function setNumberOfWeeks(_numberOfWeeks) {
        setWeeksValue(_numberOfWeeks);
        saveData('numberOfWeeks', _numberOfWeeks);

    }
    function setExercisesData(data) {
        setExercises(data);
        saveData('exercises', data);
    }


    function editExercide(exercise) {
        const newExercises = exercises.map((e) => {
            if (e.id === exercise.id) {
                return Object.assign(e, exercise)
            }
            return e;
        });
        setExercisesData(newExercises);
    }

    function calcWeekValues(range, { overloadType, overloadValue, numberOfReps, weight, weeklySets }) {
        const calcFn = type => overloadType === type ? calcWeelklyTarget : v => v
        console.log('range', range);

        return range.map(week => ({
            week,
            totalWeeklySets: 0,
            weeklyTarget: calcFn('sets')(weeklySets || 10, week, overloadValue),
            numberOfReps: calcFn('reps')(numberOfReps || 8, week, overloadValue),
            weight: calcFn('weight')(weight || 12, week, overloadValue),
        }))
    }

    function addExercise({ overloadValue, overloadType, name, numberOfReps, weight, weeklySets }) {
        exercises.push({
            id: exercises.length,
            name,
            totalSets: 0,
            overloadType,
            overloadValue,
            numberOfReps,
            weight,
            weeklySets,
            weeks: calcWeekValues(_.range(0, numberOfWeeks), { overloadType, overloadValue, numberOfReps, weight, weeklySets })
        })
        const newExerciseList = [...exercises]
        setExercisesData(newExerciseList);

    }
    const deleteExercise = (exercise) => {
        const newExercises = exercises.filter(e => e.name !== exercise.name);
        setExercisesData(newExercises);

    }

    const updateExercise = (exerciseId, weekIndex, partialUpdate) => {
        const newExercises = exercises.map((e) => {
            if (e.id === exerciseId) {
                return {
                    ...e,
                    weeks: e.weeks.map((w, index) => {
                        if (index === Number(weekIndex)) {
                            return {
                                ...w,
                                ...partialUpdate
                            }
                        }
                        return w;
                    })
                }
            }
            return e;
        });
        setExercisesData(newExercises);

    }


    function getExercisesByWeeks() {
        const flat = _.flatMap(exercises, exercise => exercise.weeks.map((week) => ({ ...exercise, ...week, weeks: undefined })))
        const groupByWeek = _.groupBy(flat, 'week');
        return groupByWeek;
    }

    function changeNumberOfWeeks(weeksNumber) {
        const newExerciseList = exercises.map((exercise) => {
            return {
                ...exercise,
                weeks: Number(weeksNumber) <= exercise.weeks.length ?
                    exercise.weeks.slice(0, Number(weeksNumber)) :
                    [
                        ...exercise.weeks,
                        ...calcWeekValues(
                            _.range(exercise.weeks.length + 1, Number(weeksNumber) + 1),
                            {
                                ...exercise,
                                ...(exercise.weeks[0] || {})
                            }
                        )
                    ]

            }
        });
        setExercisesData(newExerciseList);
        setNumberOfWeeks(weeksNumber);
    }



    return {
        exercises,
        addExercise,
        deleteExercise,
        updateExercise,
        cleanData,
        editExercide,
        getExercisesByWeeks,
        changeNumberOfWeeks,
        numberOfWeeks
    }
}