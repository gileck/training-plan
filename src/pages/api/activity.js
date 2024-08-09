import { getUser } from './userApi.js';
import { getDB } from './db.js';
const DAY = 1000 * 60 * 60 * 24;
export default async function handler(req, res) {
    const { username } = await getUser(req);
    console.log({ username });
    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const db = await getDB();

    const LAST_7_DAYS = new Date();
    LAST_7_DAYS.setDate(LAST_7_DAYS.getDate() - 7);

    // console.log({ LAST_7_DAYS });

    const activity = await db.collection('activity').find({
        username,
        date: {
            $gte: LAST_7_DAYS.getTime()
        }
    }).toArray();

    // console.log({ activity });





    res.status(200).json({
        activity
    });
}