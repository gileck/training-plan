import { getUser } from './userApi.js';
import { getDB } from './db.js';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function uniqueId(prefix) {
    return `${prefix}${randomNum(0, 99999)}`
}
export default async function handler(req, res) {
    const { username } = await getUser(req)
    const db = await getDB()
    const { trainingPlan } = req.body;
    // await db.collection('trainingPlans').deleteMany({ user: username });
    const id = `${username}_${uniqueId("plan_")}`
    const result = await db.collection('trainingPlans').insertOne({
        id,
        name: trainingPlan.name,
        plan: {
            exercises: trainingPlan.exercises,
            workouts: trainingPlan.workouts,
            numberOfWeeks: trainingPlan.numberOfWeeks
        },
        user: username,
        dateCreated: new Date()
    }).catch((e) => {
        console.log('Training plan already exists', e.message);
    })
    res.status(200).json({
        result,
        id
    });
}