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
    const [trainingPlans, setTrainingPlans] = useState(getData('trainingPlans') || []);
    const savedTrainingPlanId = getData('currentTrainingPlanId') || trainingPlans[0]?.id;
    const savedTrainingPlan = trainingPlans.find(tp => tp.id === savedTrainingPlanId) || trainingPlans[0]
    const [currentTrainingPlanId, setCurrentTrainingPlanId] = useState(savedTrainingPlan?.id || null);
    const currentTrainingPlan = trainingPlans.find(tp => tp.id === currentTrainingPlanId) || trainingPlans[0];

    function selectTrainingPlan(planId) {
        setCurrentTrainingPlanId(planId);
        saveData('currentTrainingPlanId', planId);
    }


    function saveTrainingPlan(trainingPlan) {
        const newTrainingPlans = trainingPlans.map(tp => {
            if (tp.id === trainingPlan.id) {
                return trainingPlan;
            }
            return tp;
        })
        setTrainingPlans(newTrainingPlans);
        saveData('trainingPlans', newTrainingPlans);
    }

    function createTrainingPlanFromObject({ tpObject, name }) {
        return {
            name: name || `Training Plan ${trainingPlans.length + 1}`,
            exercises: tpObject.exercises,
            workouts: tpObject.workouts,
            numberOfWeeks: tpObject.numberOfWeeks || 8
        }
    }

    function saveNewTraininPlan({ newTrainingPlan }) {
        newTrainingPlan.id = newTrainingPlan.id || _.uniqueId("plan_")
        const newTrainingPlans = [
            ...trainingPlans,
            newTrainingPlan
        ]
        setTrainingPlans(newTrainingPlans);
        saveData('trainingPlans', newTrainingPlans);
    }


    function addTrainingPlan({ name, numberOfWeeks }) {
        const newTrainingPlan = createNewPlan({ exercises: [], workouts: [], name, numberOfWeeks });
        saveNewTraininPlan({ newTrainingPlan });
    }

    function addTrainingPlanFromObject({ name, tpObject }) {
        const newTrainingPlan = createTrainingPlanFromObject({ tpObject, name })
        saveNewTraininPlan({ newTrainingPlan });
    }

    function addTrainingPlanFromPlan({ name, plan }) {
        const newTrainingPlan = createNewPlan({ exercises: plan.exercises, workouts: plan.workouts, name, numberOfWeeks: plan.numberOfWeeks });
        saveNewTraininPlan({ newTrainingPlan });
    }



    function calcWeeklyAllTarget(weeklyTarget, week, overloadValue, index) {
        const progressiveOverload = overloadValue && (overloadValue / 100) || 0.05; // 5% increase per week
        if (week % 2 === index) {
            return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
        }
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week) === 0 ? 0 : Number(week) - 1));
    }

    function calcWeelklyTarget(weeklyTarget, week, overloadValue) {
        const progressiveOverload = _.isNumber(overloadValue) ? (overloadValue / 100) : 0;
        return Math.round(weeklyTarget * Math.pow(1 + progressiveOverload, Number(week)));
    }


    // function editExercise(exercise) {
    //     const newExercises = exercises.map((e) => {
    //         if (e.id === exercise.id) {
    //             return Object.assign(e, exercise, {
    //                 weeks: calcWeekValues(_.range(0, numberOfWeeks), exercise)
    //             })
    //         }
    //         return e;
    //     });

    //     const newWorkouts = workouts.map(w => {
    //         w.exercises = w.exercises.map(e => {
    //             if (e.name === exercise.name) {
    //                 exercise.weeklySets = e.sets;
    //                 return createExerciseObject(exercise, w.name, e)
    //             }
    //             return e;
    //         })
    //         return w;
    //     })

    //     setExercisesData(newExercises);
    //     setWorkoutData(newWorkouts);
    // }

    function calcWeekValues(range, { overloadType, overloadValue, numberOfReps, weight, weeklySets }, { weeks, sets } = {}) {
        const calcFn = type => overloadType === "all" ? calcWeeklyAllTarget : (overloadType === type ? calcWeelklyTarget : v => v)

        const getCurrentTotalWeeklySets = week => weeks ? weeks[week]?.totalWeeklySets || 0 : 0;

        return range.map(week => ({
            week,
            totalWeeklySets: getCurrentTotalWeeklySets(week),
            weeklyTarget: calcFn('sets')(sets || weeklySets, week, overloadValue, 0),
            numberOfReps: calcFn('reps')(numberOfReps, week, overloadValue, 1),
            weight: calcFn('weight')(weight || 0, week, overloadValue, 2),
        }))
    }

    function buildExerciseObject(plan, { id, overloadValue, overloadType, name, numberOfReps, weight, weeklySets }) {
        return {
            id: id || plan.exercises.length,
            name,
            totalSets: 0,
            overloadType,
            overloadValue,
            numberOfReps,
            weight,
            weeklySets,
            weeks: calcWeekValues(_.range(0, plan.numberOfWeeks), { overloadType, overloadValue, numberOfReps, weight, weeklySets })
        }
    }








    // function addExerciseToWorkout({
    //     workoutId,
    //     exerciseName,
    //     sets
    // }) {
    //     console.log({ workoutId, exerciseName, sets });

    //     const workout = workouts.find(w => w.id === workoutId)
    //     const exercise = exercises.find(e => e.name === exerciseName)
    //     exercise.weeklySets = sets
    //     const exerciseWorkoutObject = createExerciseObject(exercise, workout.name)
    //     console.log({ exerciseWorkoutObject });
    //     workout.exercises.push(exerciseWorkoutObject)
    //     editWorkout(workout)
    // }

    // function changeExerciseOrderInWorkout(wid, eid, value) {
    //     const workout = workouts.find(w => w.id === wid)
    //     console.log({ workout });
    //     const index = workout.exercises.findIndex(e => e.id === eid)
    //     const newIndex = index + value;
    //     if (newIndex < 0 || newIndex >= workout.exercises.length) {
    //         return;
    //     }
    //     const newExercises = [...workout.exercises];
    //     const temp = newExercises[index];
    //     newExercises[index] = newExercises[newIndex];
    //     newExercises[newIndex] = temp;
    //     const newWorkouts = workouts.map(w => {
    //         if (w.id === wid) {
    //             return {
    //                 ...w,
    //                 exercises: newExercises
    //             }
    //         }
    //         return w;
    //     })
    //     setWorkoutData(newWorkouts);


    // }

    function createExerciseObject({ numberOfWeeks }, exercise, workoutName, currentExercise) {
        return {
            name: exercise.name,
            sets: exercise.weeklySets,
            id: `${exercise.name}-${workoutName}`,
            weeks: calcWeekValues(_.range(0, numberOfWeeks), exercise, currentExercise)
        }
    }

    function buildWorkoutObject({ numberOfWeeks }, { name, exercises }) {
        return {
            id: _.uniqueId('workout-'),
            name,
            exercises: exercises.map(e => createExerciseObject({ numberOfWeeks }, e, name))
        }
    }




    function createNewPlan({ exercises: newExercises, workouts: newWorkouts, name, numberOfWeeks }) {
        return {
            exercises: newExercises.map((e, index) => buildExerciseObject({ name, numberOfWeeks }, { ...e, id: index + 1 })),
            workouts: newWorkouts.map(w => buildWorkoutObject({ numberOfWeeks }, w)),
            name: name || `Training Plan ${trainingPlans.length + 1}`,
            numberOfWeeks: numberOfWeeks || 8
        }
    }

    function createTrainingPlanActions(trainingPlan) {
        if (!trainingPlan) {
            return null
        }
        const { exercises, workouts, numberOfWeeks } = trainingPlan;

        function addExercise(exercise) {
            trainingPlan.exercises.push(buildExerciseObject(trainingPlan, exercise))
            saveTrainingPlan(trainingPlan);
        }
        function editExercise(exercise) {
            const index = trainingPlan.exercises.findIndex(e => e.id === exercise.id);
            trainingPlan.exercises[index] = buildExerciseObject(trainingPlan, exercise);
            saveTrainingPlan(trainingPlan);
        }
        function deleteExercise(exercise) {
            trainingPlan.exercises = trainingPlan.exercises.filter(e => e.id !== exercise.id);
            saveTrainingPlan(trainingPlan);
        }
        function addWorkout(workout) {
            trainingPlan.workouts.push(buildWorkoutObject(trainingPlan, workout))
            saveTrainingPlan(trainingPlan);
        }
        function editWorkout(workout) {
            const index = trainingPlan.workouts.findIndex(w => w.id === workout.id);
            trainingPlan.workouts[index] = workout;
            saveTrainingPlan(trainingPlan);
        }
        function deleteWorkout(workout) {
            trainingPlan.workouts = trainingPlan.workouts.filter(w => w.id !== workout.id);
            saveTrainingPlan(trainingPlan);
        }
        function calculateExerciseDoneForTrainingPlan(exercise, week) {
            const result1 = trainingPlan.workouts.map(w => {
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
        function addExerciseToWorkoutForTrainingPlan({ workoutId, exerciseName, sets }) {
            const workout = trainingPlan.workouts.find(w => w.id === workoutId)
            const exercise = trainingPlan.exercises.find(e => e.name === exerciseName)
            exercise.weeklySets = sets
            const exerciseWorkoutObject = createExerciseObject(trainingPlan, exercise, workout.name)
            workout.exercises.push(exerciseWorkoutObject)
            editWorkout(workout)
        }
        function changeExerciseOrderInWorkoutForTrainingPlan(wid, eid, value) {
            const workout = trainingPlan.workouts.find(w => w.id === wid)
            const index = workout.exercises.findIndex(e => e.id === eid)
            const newIndex = index + value;
            if (newIndex < 0 || newIndex >= workout.exercises.length) {
                return;
            }
            const newExercises = [...workout.exercises];
            const temp = newExercises[index];
            newExercises[index] = newExercises[newIndex];
            newExercises[newIndex] = temp;
            const newWorkouts = trainingPlan.workouts.map(w => {
                if (w.id === wid) {
                    return {
                        ...w,
                        exercises: newExercises
                    }
                }
                return w;
            })
            trainingPlan.workouts = newWorkouts;
            saveTrainingPlan(trainingPlan);
        }

        function setNumberOfWeeks(numberOfWeeks) {
            trainingPlan.exercises = trainingPlan.exercises.map(e => {
                return {
                    ...e,
                    weeks: calcWeekValues(_.range(0, numberOfWeeks), e)
                }
            })
            trainingPlan.workouts = trainingPlan.workouts.map(w => {
                w.exercises = w.exercises.map(e => {
                    const exercise = trainingPlan.exercises.find(ex => ex.name === e.name);
                    if (!exercise) {
                        throw new Error(`Exercise ${e.name} not found in exercises list`);
                    }
                    return {
                        ...e,
                        weeks: calcWeekValues(_.range(0, numberOfWeeks), exercise, e)
                    }
                })
                return w;
            })
            trainingPlan.numberOfWeeks = numberOfWeeks;
            saveTrainingPlan(trainingPlan);
        }

        const updateExercise = (workoutId, exerciseId, weekIndex, partialUpdate) => {

            const { workouts } = trainingPlan;

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

            trainingPlan.workouts = newWorkouts;
            saveTrainingPlan(trainingPlan);

        }

        function getExercisesByWeeks() {
            const { exercises } = trainingPlan;
            const flat = _.flatMap(exercises, exercise => exercise.weeks.map((week) => ({ ...exercise, ...week, weeks: undefined })))
            const groupByWeek = _.groupBy(flat, 'week');
            return groupByWeek;
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

        function getWeeksDone() {
            return _.range(0, trainingPlan.numberOfWeeks).map(week => {
                return {
                    week,
                    totalSetsDone: calculateTotalSetsDoneWeek(week),
                    totalSetsTarget: calculateTotalSetsTargetWeek(week),
                    isDone: calculateTotalSetsDoneWeek(week) >= calculateTotalSetsTargetWeek(week)
                }
            })
        }

        function getTotalSets() {
            const totalSets = workouts.map(w => {
                return w.exercises.reduce((acc, ex) => {
                    return acc + ex.weeks.reduce((acc2, week) => acc2 + week.weeklyTarget, 0);
                }, 0)
            })
            const sum = totalSets.reduce((acc, val) => acc + val, 0);
            const totalSetsDone = workouts.map(w => {
                return w.exercises.reduce((acc, ex) => {
                    return acc + ex.weeks.reduce((acc2, week) => acc2 + week.totalWeeklySets, 0);
                }, 0)
            })
            const setsDone = totalSetsDone.reduce((acc, val) => acc + val, 0);
            return {
                totalSets: sum,
                totalSetsDone: setsDone
            }
        }

        function updateName(name) {
            trainingPlan.name = name;
            saveTrainingPlan(trainingPlan);
        }

        return {
            exercises: trainingPlan.exercises,
            workouts: trainingPlan.workouts,
            numberOfWeeks: trainingPlan.numberOfWeeks,
            addWorkout,
            editExercise,
            addExercise,
            updateExercise,
            deleteWorkout,
            deleteExercise,
            editWorkout,
            calculateExerciseDone: calculateExerciseDoneForTrainingPlan,
            addExerciseToWorkout: addExerciseToWorkoutForTrainingPlan,
            changeExerciseOrderInWorkout: changeExerciseOrderInWorkoutForTrainingPlan,
            setNumberOfWeeks,
            getExercisesByWeeks,
            calculateTotalSetsDoneWeek,
            calculateTotalSetsTargetWeek,
            getTotalSets,
            getWeeksDone,
            updateName
        }
    }

    function deleteTrainingPlan(id) {
        const newTrainingPlans = trainingPlans.filter(tp => tp.id !== id);
        setTrainingPlans(newTrainingPlans);
        saveData('trainingPlans', newTrainingPlans);
    }

    function findTrainingPlanById(planId) {
        return trainingPlans.find(tp => tp.id === planId);
    }


    return {
        createNewPlan,
        saveTrainingPlan,
        cleanData,
        addTrainingPlan,
        deleteTrainingPlan,
        trainingPlans,
        createTrainingPlanActions,
        findTrainingPlanById,
        selectTrainingPlan,
        currentTrainingPlan,
        addTrainingPlanFromPlan,
        addTrainingPlanFromObject,

    }
}