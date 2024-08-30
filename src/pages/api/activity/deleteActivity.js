import { getUser } from '../userApi.js';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
const DAY = 1000 * 60 * 60 * 24;
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const { items } = req.body
    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const db = await getDB();

    const result = await db.collection('activity').deleteMany({
        username,
        _id: {
            $in: items.map(item => new ObjectId(item))
        }
    })

    res.status(200).json({
        result
    });
}