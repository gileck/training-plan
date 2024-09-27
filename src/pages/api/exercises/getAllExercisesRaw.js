import { getDB } from "../db"
import { getUser } from "../userApi"
// import output from "./raw.js"

export default async function handler(req, res) {
    const { username } = await getUser(req)
    if (!username) {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const output = {}


    res.status(200).json({
        exercises: Object.values(output)
    })
}