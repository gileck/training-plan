import { getUser } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    const { username } = req.query.username && { username: req.query.username } || await getUser(req);
    const db = await getDB();
    // await db.collection('trainingPlans').deleteMany({ user: username });

    const plans = await db.collection('trainingPlans').find({ user: username }).toArray();

    const plansToReturn = plans.map(({ id, name, plan, user, dateCreated }) => {
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