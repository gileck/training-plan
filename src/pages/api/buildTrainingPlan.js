import { getResponseFromGpt } from "@/ai/ai"
import { buildPrompt } from "@/app/trainingPlanPrompt"
import { sendLog } from "@/telegramBot/bot";
import { getUser } from "./userApi";
export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    // const inputText = req.inputText
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
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



    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })





    res.status(200).json({ result, apiPrice })

    await sendLog(`
        AI: BuildTrainingPlan
        User: ${user.username}
        Result: ${JSON.stringify(result).length} characters
        price: ${apiPrice}
        model: ${modelToUse}
        tokens: ${usage.total_tokens}
        duration: ${duration}
        date: ${new Date().toLocaleString()}
    `);
    const db = await getDB();
    await db.collection('ai-api-logs').insertOne({
        user: user.username,
        input: trainingPlanParams,
        result,
        price: apiPrice,
        model: modelToUse,
        tokens: usage.total_tokens,
        date: new Date(),
        duration
    });
}