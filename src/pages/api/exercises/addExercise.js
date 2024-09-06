import { getDB } from "../db"
import { getUser } from "../userApi"

export default async function handler(req, res) {
    const { username } = await getUser(req)
    if (!username) {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const { exercise } = req.body

    if (!exercise.name) {
        return res.status(400).json({
            message: 'Exercise name is required'
        })
    }

    const db = await getDB()

    const result = await db.collection('exercises').insertOne(exercise)

    return res.status(200).json({
        result
    })
}