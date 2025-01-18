import { getUser } from './userApi.js';
import { getDB } from './db.js';
import { sendLog, sendMessage } from '@/telegramBot/bot.js';
// const DAY = 1000 * 60 * 60 * 24;

export default async function handler(req, res) {
    const { username, name } = await getUser(req);
    const db = await getDB();
    const { trainingPlan, options } = req.body;
    // await db.collection('trainingPlans').deleteMany({ user: username });

    const result = await db.collection('trainingPlans').updateOne({
        user: username,
        id: trainingPlan.id
    }, {
        $set: {
            plan: {
                exercises: trainingPlan.exercises,
                workouts: trainingPlan.workouts,
                numberOfWeeks: trainingPlan.numberOfWeeks
            },
            dateUpdated: new Date(),
            name: trainingPlan.name,
        }
    })



    if (options && options.operations) {
        for (const operation of options.operations) {
            if (!operation.action) continue;
            const { exerciseId, workoutId, weekIndex } = operation;
            const exercise = trainingPlan.workouts.find(w => w.id === workoutId).exercises.find(e => e.id === exerciseId)
            const currentWeek = exercise.weeks[weekIndex];

            // console.log({
            //     username,
            //     date: new Date(),
            //     trainingPlanId: trainingPlan.id,
            //     action: options.action,
            //     numberOfSetsDone: options.numberOfSetsDone,
            //     exercise: {
            //         id: exercise.id,
            //         name: exercise.name,
            //         weekIndex,
            //         totalWeeklySets: currentWeek.totalWeeklySets,
            //         weeklyTarget: currentWeek.weeklyTarget,
            //         numberOfReps: currentWeek.numberOfReps,
            //         weight: currentWeek.weight,
            //     }
            // });

            await db.collection('activity').insertOne({
                username,
                date: new Date().getTime(),
                trainingPlanId: trainingPlan.id,
                action: operation.action,
                numberOfSetsDone: operation.numberOfSetsDone,
                exercise: {
                    id: exercise.id,
                    name: exercise.name,
                    weekIndex,
                    totalWeeklySets: currentWeek.totalWeeklySets,
                    weeklyTarget: currentWeek.weeklyTarget,
                    numberOfReps: currentWeek.numberOfReps,
                    weight: currentWeek.weight,
                }
            })


            // await sendMessage(`Training plan updated for ${username} with action ${action}`);
            await sendLog(`${name} finisied ${exercise?.name} (${currentWeek.totalWeeklySets}/${currentWeek.weeklyTarget})`);
            if (currentWeek.totalWeeklySets >= currentWeek.weeklyTarget) {
                await sendMessage(`${name} just completed the weekly target of ${currentWeek.weeklyTarget} sets for ${exercise?.name}`);
            }
        }
    }


    res.status(200).json({
        result
    });
}