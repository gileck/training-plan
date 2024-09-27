import { getUser } from '../userApi.js';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
const DAY = 1000 * 60 * 60 * 24;
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const { key, date, answer } = req.body
    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!key || !date || !answer) {
        res.status(400).json({ error: 'Missing key, date, or answer' });
        return
    }
    const db = await getDB();

    const count = await db.collection('dailyHealthMetrics').count({
        key, date, username
    })

    console.log({ count });

    if (count > 0) {
        const result = await db.collection('dailyHealthMetrics').updateOne({
            key, date, username
        }, {
            $set: {
                answer
            }
        })
        res.status(200).json({
            result,
            success: true,
            updated: true,

        });
    } else {
        const result = await db.collection('dailyHealthMetrics').insertOne({
            key, date, username, answer
        })
        res.status(200).json({
            success: true,
            inserted: true,
            result
        });
    }



}