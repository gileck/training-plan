import { getUser } from '../userApi.js';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function duplicateActivity(req, res) {
    const { username } = await getUser(req);
    const { id } = req.body;

    if (!username) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();

    try {
        // Find the original activity
        const originalActivity = await db.collection('activity').findOne({
            username,
            _id: new ObjectId(id)
        });

        if (!originalActivity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Create new activity object without the _id
        const { _id, ...activityWithoutId } = originalActivity;

        // Insert the duplicate
        const result = await db.collection('activity').insertOne({
            ...activityWithoutId,
        });

        // Return the new activity with its id
        return res.status(200).json({
            activity: {
                ...activityWithoutId,
                _id: result.insertedId
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
