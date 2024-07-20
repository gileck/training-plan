import { getUser, isAdmin } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    const db = await getDB();
    if (!await isAdmin(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const trainingPlans = await db.collection('trainingPlans').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    res.status(200).json({
        trainingPlans,
        users
    });
}