import { getDB } from "../db"
import { getUser } from "../userApi"
import fs from 'fs'
import { put, head } from '@vercel/blob';

export default async function handler(req, res) {
    const { username } = await getUser(req)
    if (!username) {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const { exercise } = req.body
    console.log({ exercise })
    if (!exercise) {
        return res.status(400).json({
            message: 'Exercise is required'
        })
    }
    if (exercise.imageData) {
        const imageBuffer = Buffer.from(exercise.imageData.split(',')[1], 'base64')
        const uploadedImage = await put(exercise.name, imageBuffer, {
            access: 'public'
        })
        exercise.image = uploadedImage.url
    }
    if (!exercise.image.includes('https')) {
        // const imageData = fs.readFileSync(exercise.image)
        // const uploadedImage = await put(exercise.name, imageData, {
        //     access: 'public'
        // })
        // exercise.image = uploadedImage.url
    }
    if (!exercise.name) {
        return res.status(400).json({
            message: 'Exercise name is required'
        })
    }
    const db = await getDB()
    const existingExercise = await db.collection('exercises').findOne({ name: exercise.name })
    if (existingExercise) {
        const updatedExercise = await db.collection('exercises').updateOne({ name: exercise.name }, { $set: exercise })
        return res.status(200).json({
            updatedExercise
        })
    }
    if (!exercise.image && !exercise.imageData) {
        return res.status(400).json({
            message: 'Exercise image is required'
        })
    }

    const result = await db.collection('exercises').insertOne(exercise)

    console.log({ result })


    return res.status(200).json({
        result
    })
}