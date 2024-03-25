import { useState } from 'react';
import _ from 'lodash';
import { localStorageAPI } from "./localStorageAPI";


export const exercisesList = [
    { name: "Squats", weeklyTarget: 10 },
    { name: "ATG Split squats", weeklyTarget: 10 },
    { name: "Shoulder Press", weeklyTarget: 15 },
    { name: "Bicep Curls", weeklyTarget: 15 },
    { name: "Tricep Extensions", weeklyTarget: 10 },
    { name: "Pull Ups", weeklyTarget: 15 },
    { name: "Push Ups", weeklyTarget: 15 },
    { name: "Deeps", weeklyTarget: 10 },
    { name: "Core", weeklyTarget: 10 },
    { name: "Farmer Carry", weeklyTarget: 15 },
    { name: "Lunges", weeklyTarget: 10 },
    { name: "Kettlebell Swings", weeklyTarget: 10 },
    { name: "Snatch", weeklyTarget: 10 },
    { name: "Shoulder side raises", weeklyTarget: 10 },
    { name: "HIIT", weeklyTarget: 2 },
]
const SmallexercisesList = [
    { name: "Squats", weeklyTarget: 10 },
]

export function useExercisesAPI() {

    const { getData, saveData, cleanData } = localStorageAPI();

    function calcWeelklyTarget(weeklyTarget, week, overloadValue) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week) - 1));
    }

    const weeks = _.range(1, 8).map(week => {
        return SmallexercisesList.map((exercise, index) => ({
            id: `${week}-${index}`,
            week,
            name: exercise.name,
            totalSets: 0,
            totalWeeklySets: 0,
            weeklyTarget: calcWeelklyTarget(exercise.weeklyTarget, week),
        }));
    })

    const allExercises = weeks.flat();
    const localExercises = getData() || allExercises;
    console.log({ localExercises });
    const [exercises, setExercises] = useState(localExercises);


    function editExercide(exercise) {
        const newExercises = exercises.map((e) => {
            if (e.id === exercise.id) {
                return Object.assign(e, exercise)
            }
            return e;
        });
        setExercises(newExercises);
        saveData(newExercises);
    }
    function addExercise({ overloadValue, overloadType, name, numberOfReps, weight, weeklyTarget }) {

        console.log({
            overloadType, name, numberOfReps, weight, weeklyTarget
        });


        const newExerciseByWeek = _.range(1, 8).map(week => {
            const calcFn = type => overloadType === type ? calcWeelklyTarget : v => v

            return {
                id: `${week}-${exercises.length}`,
                week: Number(week),
                name,
                totalSets: 0,
                totalWeeklySets: 0,
                weeklyTarget: calcFn('sets')(weeklyTarget, week, overloadValue),
                numberOfReps: calcFn('reps')(numberOfReps || 8, week, overloadValue),
                weight: calcFn('weight')(weight || 12, week, overloadValue),
                overloadType,
                overloadValue

            }
        })

        const newExerciseList = [...exercises.filter(e => e.name !== name), ...newExerciseByWeek]
        setExercises(newExerciseList);
        saveData(newExerciseList)
    }
    const deleteExercise = (exercise) => {
        const newExercises = exercises.filter(e => e.name !== exercise.name);
        setExercises(newExercises);
        saveData(newExercises);
    }

    const updateExercise = (exercise, partialUpdate) => {
        const newExercises = exercises.map((e) => {
            if (e.id === exercise.id) {
                return { ...e, ...partialUpdate };
            }
            return e;
        });
        setExercises(newExercises);
        saveData(newExercises);
    }

    return {
        exercises,
        addExercise,
        deleteExercise,
        updateExercise,
        cleanData,
        editExercide
    }
}