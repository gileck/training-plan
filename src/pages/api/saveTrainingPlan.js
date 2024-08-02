import { getUser } from './userApi.js';
import { getDB } from './db.js';
import { sendLog, sendMessage } from '@/telegramBot/bot.js';
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
            dateUpdated: new Date()
        }
    })

    if (options && options.action) {
        const { exerciseId, workoutId, weekIndex } = options;
        // const exercise = trainingPlan.exercises.find(e => e.id === options.exerciseId);
        const exercise = trainingPlan.workouts.find(w => w.id === workoutId).exercises.find(e => e.id === exerciseId)
        const currentWeek = exercise.weeks[weekIndex];
        // await sendMessage(`Training plan updated for ${username} with action ${action}`);
        await sendLog(`${name} finisied ${exercise?.name} (${currentWeek.totalWeeklySets}/${currentWeek.weeklyTarget})`);
        if (currentWeek.totalWeeklySets >= currentWeek.weeklyTarget) {
            await sendMessage(`${name} just completed the weekly target of ${currentWeek.weeklyTarget} sets for ${exercise?.name}`);
        }
    }


    res.status(200).json({
        result
    });
}