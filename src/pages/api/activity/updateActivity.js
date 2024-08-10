import { getUser } from '../userApi.js';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
const DAY = 1000 * 60 * 60 * 24;
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const { id, date } = req.body
    console.log({ id, date });
    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const db = await getDB();

    const result = await db.collection('activity').updateOne({
        username,
        _id: new ObjectId(id)
    }, {
        $set: {
            date: new Date(date).getTime()
        }
    })


    res.status(200).json({
        result
    });
}