import { getUser } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const db = await getDB();
    const { trainingPlan } = req.body;
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





    res.status(200).json({
        result
    });
}