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

    const db = await getDB()

    const result = await db.collection('exercises').updateOne({
        name: exercise.name
    }, {
        $set: exercise
    })

    res.status(200).json({
        result
    })
}