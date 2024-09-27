import { getUser } from '../userApi.js';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
const DAY = 1000 * 60 * 60 * 24;
export default async function handler(req, res) {
    const { username } = await getUser(req);
    const { date } = req.query

    console.log({ date });

    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!date) {
        res.status(400).json({ error: 'Missing date' });
        return
    }
    const db = await getDB();

    const results = await db.collection('dailyHealthMetrics').find({
        date, username
    }).toArray();

    console.log({ results });

    res.status(200).json({
        results
    });


    // console.log({ count });

    // if (count > 0) {
    //     const result = await db.collection('dailyHealthMetrics').updateOne({
    //         key, date, username
    //     }, {
    //         $set: {
    //             answer
    //         }
    //     })
    //     res.status(200).json({
    //         result
    //     });
    // } else {
    //     const result = await db.collection('dailyHealthMetrics').insertOne({
    //         key, date, username, answer
    //     })
    //     res.status(200).json({
    //         result
    //     });
    // }



}