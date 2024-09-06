import { getDB } from "../db"
import { getUser } from "../userApi"

export default async function handler(req, res) {
    const { username } = await getUser(req)
    if (!username) {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const db = await getDB()
    const exercises = await db.collection('exercises').find({}).toArray()
    res.status(200).json({
        exercises
    })
}