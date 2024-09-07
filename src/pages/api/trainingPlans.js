import { getUser } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    const { username } = req.query.username && { username: req.query.username } || await getUser(req);
    const db = await getDB();
    // await db.collection('trainingPlans').deleteMany({ user: username });

    const plans = await db.collection('trainingPlans').find({ user: username }).toArray();

    // await db.collection('trainingPlans').deleteOne({ id: "gileck_plan_63645" });




    const plansToReturn = plans.map(({ id, name, plan, user, dateCreated }) => {
        if (!plan.exercises) {
            plan.exercises = [];
        }
        if (!plan.workouts || plan.workouts[0] === null) {
            plan.workouts = [];
        }
        return {
            id,
            name,
            user,
            dateCreated,
            ...plan,
        }
    });

    res.status(200).json({
        plans: plansToReturn
    });
}