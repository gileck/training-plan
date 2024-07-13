import { getUser } from './userApi.js';
import { getDB } from './db.js';
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const db = await getDB();
    const { id } = req.body;

    const result = await db.collection('trainingPlans').deleteOne({
        id,
        user: username,
    }).catch((e) => {
        console.log('Training plan already exists', e.message);
    })





    res.status(200).json({
        result
    });
}