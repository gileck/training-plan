import { useState } from 'react';
import _ from 'lodash';
import { localStorageAPI } from "./localStorageAPI";
import { exercisesList } from "./exercisesList";

export function getPrimaryMuscle(name) {
    return exercisesList.find(e => e.name === name)?.primaryMuscle;
}
export function getSecondaryMuscles(name) {
    return exercisesList.find(e => e.name === name)?.secondaryMuscles || [];
}
export function getBodyParts(name) {
    const e = exercisesList.find(e => e.name === name)
    if (!e) {
        console.error('Exercise not found', name);
        return [];
    }
    return [
        e.primaryMuscle,
        ...(e.secondaryMuscles || [])
    ]
}

export function getCategory(name) {
    return exercisesList.find(e => e.name === name)?.category;
}

export function getAllBodyParts() {
    return _.uniq(_.flatMap(exercisesList, e => getBodyParts(e.name)));
}

export function getPullPushType(name) {
    return exercisesList.find(e => e.name === name)?.pullPush;
}

export function isBodyWeightExercise(name) {
    return exercisesList.find(e => e.name === name)?.bodyWeight;
}

export function useExercisesAPI() {

    const { getData, saveData, cleanData } = localStorageAPI();

    function calcWeelklyTarget(weeklyTarget, week, overloadValue) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
    }

    const localExercises = getData('exercises') || [];
    const [exercises, setExercises] = useState(localExercises);
    const [numberOfWeeks, setWeeksValue] = useState(getData('numberOfWeeks') || 7);
    const [workouts, setWorkouts] = useState(getData('workouts') || []);


    function setNumberOfWeeks(_numberOfWeeks) {
        setWeeksValue(_numberOfWeeks);
        saveData('numberOfWeeks', _numberOfWeeks);

    }
    function setExercisesData(data) {
        setExercises(data);
        saveData('exercises', data);
    }

    function setWorkoutData(data) {
        setWorkouts(data);
        saveData('workouts', data);
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

    const updateExercise = (workoutId, exerciseId, weekIndex, partialUpdate) => {
        console.log({ workoutId, exerciseId, weekIndex, partialUpdate });
        const workout = workouts.find(w => w.id === workoutId);
        const exercise = workout.exercises.find(e => e.id === exerciseId);
        const newWorkouts = workouts.map(w => {
            if (w.id === workoutId) {
                return {
                    ...w,
                    exercises: workout.exercises.map(e => {
                        if (e.id === exerciseId) {
                            return {
                                ...exercise,
                                weeks: exercise.weeks.map(w => {
                                    if (w.week === weekIndex) {
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
                    })
                }
            }
            return w;
        })


        setWorkoutData(newWorkouts);

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

    function saveWorkoutAPI({ name, exercises }) {
        const workout = {
            id: Date.now(),
            name,
            exercises
        }
        workouts.push(workout);
        setWorkouts(workouts);
        saveData('workouts', workouts);
    }

    function deleteWorkout(workoutId) {
        const newWorkouts = workouts.filter(w => w.id !== workoutId);
        setWorkouts(newWorkouts);
        saveData('workouts', newWorkouts);
    }

    function editWorkout(workout) {
        const newWorkouts = workouts.map(w => {
            if (w.id === workout.id) {
                return workout;
            }
            return w;
        });
        setWorkouts(newWorkouts);
        saveData('workouts', newWorkouts);
    }

    function calculateExerciseDone(exercise, week) {
        const result1 = workouts.map(w => {
            const ex = w.exercises.find(e => e.name === exercise.name);
            if (ex) {
                return ex.weeks[week].totalWeeklySets;
            } else {
                return 0
            }
        })
        const sum = result1.reduce((acc, val) => acc + val, 0);
        return sum;

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
        numberOfWeeks,
        saveWorkoutAPI,
        workouts,
        deleteWorkout,
        editWorkout,
        calculateExerciseDone

    }
}