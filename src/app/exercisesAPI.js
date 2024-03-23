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

    const { getData, saveData, removeData } = localStorageAPI();

    function calcWeelklyTarget(weeklyTarget, week) {
        const progressiveOverload = 0.05; // 5% increase per week
        return Math.round(initialSets * Math.pow(1 + progressiveOverload, weekNumber - 1));
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
    const [exercises, setExercises] = useState(allExercises);


    function addExercise(exercise) {
        const byWeek = _.groupBy(exercises, 'week');
        const byWeekIncludingNewExercise = _.mapValues(byWeek, (weeklyExercises, week) => {
            return [
                ...weeklyExercises,
                {
                    id: `${week}-${weeklyExercises.length}`,
                    week: Number(week),
                    name: exercise.name,
                    totalSets: 0,
                    totalWeeklySets: 0,
                    weeklyTarget: exercise.weeklyTarget,
                }
            ]
        })
        const all = Object.values(byWeekIncludingNewExercise).flat()
        setExercises(all)
        saveData(all)
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
        updateExercise
    }
}