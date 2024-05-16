import _ from 'lodash'
import { getAllBodyParts, getBodyParts } from '../exercisesAPI'
import { Athiti } from 'next/font/google'
export function BuildTrainingPlan(params) {

    const {
        exerciseList,
        weeklyExercises,
        level,
        focusMuscles,
        workoutType,
        focusMusclesRatio
    } = params

    const totalSetsPerWorkoutByLevel = [15, 20, 25, 30, 35]
    const totalSetsPerWeek = totalSetsPerWorkoutByLevel[level - 1] * weeklyExercises

    const exercisesToAdd = []

    const bodyParts = getAllBodyParts()



    const exerciseToUse = exerciseList.filter((exercise) => {
        if (workoutType.includes('gym')) {
            return true
        }
        return !exercise.gym
    })

    const parts = {}
    for (const part of bodyParts) {
        parts[part] = []
        for (const exercise of exerciseToUse) {
            if (exercise.primaryMuscle === part) {
                parts[part].unshift(exercise.name)

            }
            if (exercise.secondaryMuscles.includes(part)) {
                parts[part].push(exercise.name)
            }

        }

    }

    console.log({ parts });

    const exercisesListByPrimaryMuscle = _.groupBy(exerciseToUse, 'primaryMuscle')
    const exercisesListBySecondaryMuscles = _.groupBy(exerciseToUse, 'secondaryMuscles')
    const exercisesByName = _.keyBy(exerciseToUse, 'name')



    const distributionByBodyPart = calculateSetDistribution({
        totalSetsPerWeek,
        bodyParts,
        focusBodyParts: focusMuscles,
        focusMusclesRatio: 50
    });

    const list = Object.entries(distributionByBodyPart)
        .sort((a, b) => b[1] - a[1])
        .map(([part]) => part)
    // debugger

    for (const part of list) {
        const exercisesNames = parts[part] || []
        for (const exerciseName of exercisesNames) {
            if (distributionByBodyPart[part] < 0) break
            const exercise = exercisesByName[exerciseName]

            let setsToAdd = (exercise.primaryMuscle === part) ? 10 : 5
            setsToAdd = distributionByBodyPart[part] > setsToAdd ? setsToAdd : distributionByBodyPart[part]
            if (setsToAdd > 0) {
                exercisesToAdd.push({
                    exerciseName,
                    sets: setsToAdd,
                    part: part
                })
                distributionByBodyPart[part] -= setsToAdd
                const otherBodyParts = [exercise.primaryMuscle, ...exercise.secondaryMuscles].filter((p) => p !== part)
                for (const secondaryMuscle of otherBodyParts) {
                    distributionByBodyPart[secondaryMuscle] -= Math.round(setsToAdd * 0.5)
                }

            }


        }
    }








    console.log({
        exercisesListByPrimaryMuscle,
        exercisesListBySecondaryMuscles,
        distributionByBodyPart,
        exercisesToAdd

    });



    const exercises = {
        'Bicep Curls': {
            overloadValue: 8,
            overloadType: 'weight',
            name: 'Bicep Curls',
            numberOfReps: 11,
            weight: 21,
            weeklySets: 4
        },
        'Shoulder Press': {
            overloadValue: 2,
            overloadType: 'reps',
            name: 'Shoulder Press',
            numberOfReps: 4,
            weight: 15,
            weeklySets: 8
        },
    }

    function buildWorkoutExercises(exercisesObj) {
        return Object.entries(exercisesObj).map(([name, weeklySets]) => {
            return {
                ...exercises[name],
                weeklySets
            }
        })


    }

    return {
        exercises: Object.values(exercises),
        workouts: [{
            name: 'Day 1',
            exercises: buildWorkoutExercises({
                'Bicep Curls': 1,
                'Shoulder Press': 2
            })
        },
        {
            name: 'Day 2',
            exercises: buildWorkoutExercises({
                'Bicep Curls': 3,
                'Shoulder Press': 6
            })

        }
        ]
    }

}

function calculateSetDistribution({ totalSetsPerWeek, bodyParts, focusBodyParts, focusMusclesRatio }) {
    const totalBodyParts = bodyParts.length;
    const focusPartsCount = focusBodyParts.length;
    const restPartsCount = totalBodyParts - focusPartsCount;

    // Focus body parts get 80% of the sets of the rest body parts
    const focusPartSetsPerWeek = Math.round(((focusMusclesRatio / 100) * totalSetsPerWeek) / focusPartsCount)
    const restPartSetsPerWeek = Math.round((totalSetsPerWeek - (focusPartsCount * focusPartSetsPerWeek)) / restPartsCount)

    const distribution = {};

    bodyParts.forEach(part => {
        if (focusBodyParts.includes(part)) {
            distribution[part] = focusPartSetsPerWeek;
        } else {
            distribution[part] = restPartSetsPerWeek;
        }
    });

    return distribution;
}

// // Example usage
// const bodyParts = [
//     "Chest", "Triceps", "Shoulders", "Quadriceps", "Hamstrings", "Glutes",
//     "Back", "Biceps", "Core", "Calves", "Hip Flexors", "Forearms"
// ];
// const focusBodyParts = ["Chest", "Back", "Shoulders"];

// const result = calculateSetDistribution({ bodyParts, focusBodyParts, focusMusclesRatio: 60 });
// console.log(result);
