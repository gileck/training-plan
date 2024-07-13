import { getResponseFromGpt } from "@/ai/ai"
import { buildPrompt } from "@/app/trainingPlanPrompt"

export default async function handler(req, res) {
    // const inputText = req.inputText
    const trainingPlanParams = req.body.trainingPlanParams
    console.log({
        trainingPlanParams  
    });
    const prompt = buildPrompt(trainingPlanParams)
    // const prompt = buildPrompt({
    //     numberOfWorkouts: 2,
    //     level: 3,
    //     focusMusclesVsRest: 0.5,
    //     location: ['gym'],
    //     focusMuscles: ['chest', 'back', 'shoulders', 'legs', 'arms'],
    //     adaptations: ['hypertrophy', 'strength', 'endurance'],
    //     workoutLength: 60,
    //     intensity: 5
    // })
    // console.log({ inputText })


    const { result, apiPrice } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })
    res.status(200).json({ result, apiPrice })
}