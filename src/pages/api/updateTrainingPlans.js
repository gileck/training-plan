import { getDB } from './db.js';
import { getUser } from './userApi.js';


export default async function handler(req, res) {
    const { username } = await getUser(req);
    const db = await getDB();
    const trainingPlansFromLocalStorate = req.body.trainingPlansFromLocalStorate;
    await db.collection('trainingPlans').createIndex({ id: 1 }, { unique: true });

    for (const trainingPlan of trainingPlansFromLocalStorate) {
        const { name, exercises, numberOfWeeks, id: planId, workouts } = trainingPlan;
        await db.collection('trainingPlans').insertOne({
            id: `${username}_${planId}`,
            name: name,
            plan: {
                exercises,
                workouts,
                numberOfWeeks
            },
            user: username,
            dateCreated: new Date()
        }).catch((e) => {
            console.log('Training plan already exists', e.message);
        })
    }
    res.status(200).json({ message: 'Training plans updated successfully' });
}