import { useState } from 'react';
import _ from 'lodash';
import { localStorageAPI } from "./localStorageAPI";
import { getExercisesList } from "./exercisesList";

export function getPrimaryMuscle(name) {
    return getExercisesList().find(e => e.name === name)?.primaryMuscle;
}
export function getSecondaryMuscles(name) {
    return getExercisesList().find(e => e.name === name)?.secondaryMuscles || [];
}
export function getBodyParts(name) {
    const e = getExercisesList().find(e => e.name === name)
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
    return getExercisesList().find(e => e.name === name)?.category;
}

export function getAllBodyParts() {
    return _.uniq(_.flatMap(getExercisesList(), e => getBodyParts(e.name)));
}

export function getPullPushType(name) {
    return getExercisesList().find(e => e.name === name)?.pullPush;
}

export function isBodyWeightExercise(name) {
    return getExercisesList().find(e => e.name === name)?.bodyWeight;
}

export function isStaticExercise(name) {
    return getExercisesList().find(e => e.name === name)?.static;
}

export function useExercisesAPI() {

    const { getData, saveData, cleanData } = localStorageAPI();

    function calcWeeklyAllTarget(weeklyTarget, week, overloadValue, index) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        console.log({
            week,
            index,
            value: week % 2 === index,
            weeklyTarget,
            progressiveOverload: Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)))
        })
        if (week % 2 === index) {
            return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
        }
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week) === 0 ? 0 : Number(week) - 1));
    }

    function calcWeelklyTarget(weeklyTarget, week, overloadValue) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
    }

    const localExercises = getData('exercises') || [];
    const [exercises, setExercises] = useState(localExercises);
    const [numberOfWeeks, setWeeksValue] = useState(getData('numberOfWeeks') || 7);
    const [workouts, setWorkouts] = useState(getData('workouts') || []);
    console.log({
        workouts,
        exercises
    });

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


    function editExercise(exercise) {
        const newExercises = exercises.map((e) => {
            if (e.id === exercise.id) {
                return Object.assign(e, exercise, {
                    weeks: calcWeekValues(_.range(0, numberOfWeeks), exercise)
                })
            }
            return e;
        });
        setExercisesData(newExercises);
    }

    function calcWeekValues(range, { overloadType, overloadValue, numberOfReps, weight, weeklySets }) {
        const calcFn = type => overloadType === "all" ? calcWeeklyAllTarget : (overloadType === type ? calcWeelklyTarget : v => v)


        return range.map(week => ({
            week,
            totalWeeklySets: 0,
            weeklyTarget: calcFn('sets')(weeklySets || 10, week, overloadValue, 0),
            numberOfReps: calcFn('reps')(numberOfReps || 8, week, overloadValue, 1),
            weight: calcFn('weight')(weight || 0, week, overloadValue, 2),
        }))
    }

    function buildExerciseObject({ id, overloadValue, overloadType, name, numberOfReps, weight, weeklySets }) {
        return {
            id: id || exercises.length,
            name,
            totalSets: 0,
            overloadType,
            overloadValue,
            numberOfReps,
            weight,
            weeklySets,
            weeks: calcWeekValues(_.range(0, numberOfWeeks), { overloadType, overloadValue, numberOfReps, weight, weeklySets })
        }
    }

    function addExercise(params) {
        const newExerciseList = [...exercises, buildExerciseObject(params)]
        setExercisesData(newExerciseList);

    }
    const deleteExercise = (exercise) => {
        const newExercises = exercises.filter(e => e.name !== exercise.name);
        setExercisesData(newExercises);
        const newWorkouts = workouts.map(w => {
            w.exercises = w.exercises.filter(e => e.name !== exercise.name);
            return w;
        })
        setWorkoutData(newWorkouts);

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

    function buildWorkoutObject({ name, exercises }) {
        return {
            id: _.uniqueId('workout-'),
            name,
            exercises: exercises.map(e => createExerciseObject(e, name))
        }
    }

    function addWorkout({ name, exercises }) {
        const newWorkouts = [
            ...workouts,
            buildWorkoutObject({ name, exercises })
        ]
        setWorkouts(newWorkouts);
        saveData('workouts', newWorkouts);
    }

    function deleteWorkout(workoutId) {
        const newWorkouts = workouts.filter(w => w.id !== workoutId);
        setWorkouts(newWorkouts);
        saveData('workouts', newWorkouts);
    }

    function cleanAllData() {
        setExercisesData([]);
        setWorkoutData([]);
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

    function calculateSetsDoneWeek(week, field) {
        const result1 = workouts.map(w => {
            return w.exercises.reduce((acc, ex) => {
                return acc + ex.weeks[week][field];
            }, 0)
        })
        const sum = result1.reduce((acc, val) => acc + val, 0);
        return sum;
    }

    function calculateTotalSetsDoneWeek(week) {
        return calculateSetsDoneWeek(week, 'totalWeeklySets');

    }

    function calculateTotalSetsTargetWeek(week) {
        return calculateSetsDoneWeek(week, 'weeklyTarget');
    }

    function createExerciseObject(exercise, workoutName) {
        return {
            name: exercise.name,
            sets: exercise.weeklySets,
            id: `${exercise.name}-${workoutName}`,
            weeks: calcWeekValues(_.range(0, numberOfWeeks), exercise)
        }
    }

    function addExerciseToWorkout({
        workoutId,
        exerciseName,
        sets
    }) {
        console.log({ workoutId, exerciseName, sets });

        const workout = workouts.find(w => w.id === workoutId)
        const exercise = exercises.find(e => e.name === exerciseName)
        exercise.weeklySets = sets
        const exerciseWorkoutObject = createExerciseObject(exercise, workout.name)
        console.log({ exerciseWorkoutObject });
        workout.exercises.push(exerciseWorkoutObject)
        editWorkout(workout)
    }

    function changeExerciseOrderInWorkout(wid, eid, value) {
        const workout = workouts.find(w => w.id === wid)
        console.log({ workout });
        const index = workout.exercises.findIndex(e => e.id === eid)
        const newIndex = index + value;
        if (newIndex < 0 || newIndex >= workout.exercises.length) {
            return;
        }
        const newExercises = [...workout.exercises];
        const temp = newExercises[index];
        newExercises[index] = newExercises[newIndex];
        newExercises[newIndex] = temp;
        const newWorkouts = workouts.map(w => {
            if (w.id === wid) {
                return {
                    ...w,
                    exercises: newExercises
                }
            }
            return w;
        })
        setWorkoutData(newWorkouts);


    }

    function createNewPlan(newExercises, newWorkouts) {
        setExercisesData(newExercises.map((e, index) => buildExerciseObject({ ...e, id: index + 1 })))
        setWorkoutData(newWorkouts.map(buildWorkoutObject))
    }


    return {
        createNewPlan,
        exercises,
        addExercise,
        deleteExercise,
        updateExercise,
        cleanData,
        cleanAllData,
        editExercise,
        getExercisesByWeeks,
        changeNumberOfWeeks,
        numberOfWeeks,
        addWorkout,
        workouts,
        deleteWorkout,
        editWorkout,
        calculateExerciseDone,
        addExerciseToWorkout,
        calculateTotalSetsDoneWeek,
        calculateTotalSetsTargetWeek,
        changeExerciseOrderInWorkout

    }
}