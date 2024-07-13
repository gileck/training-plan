import { getUser } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    // const { username } = await getUser(req);
    const db = await getDB();
    // await db.collection('trainingPlans').deleteMany({ user: username });

    const plans = await db.collection('trainingPlans').find({}).toArray();

    res.status(200).json({
        plans
    });
}