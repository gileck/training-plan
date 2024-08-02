import { getResponseFromGpt } from "@/ai/ai";
import { getUser } from "./userApi";
import { getDB } from "./db";
import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { text, currentTrainingPlan } = req.body;
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();

    const trainingPlan = await db.collection('trainingPlans').findOne({ id: currentTrainingPlan });

    console.log({ trainingPlan });

    const prompt = `

    you are an experienced fitness trainer.
    a client has come to you for help with their fitness plan.
    They already have an existing training plan. 
    They want to ask you a question about their training plan.

    this is their training plan:

    ${JSON.stringify(trainingPlan)}

    this is the question they have asked you:
    
    ${text}
    `;

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: false,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });

    await sendLog(`
        AI: AskAI
        User: ${user.username}
        Question: ${text}
        Result: ${result.length} characters
        price: ${apiPrice}
        model: ${modelToUse}
        tokens: ${usage.total_tokens}
        duration: ${duration}
        date: ${new Date().toLocaleString()}
    `);

    await db.collection('ai-api-logs').insertOne({
        user: user.username,
        input: text,
        result,
        price: apiPrice,
        model: modelToUse,
        tokens: usage.total_tokens,
        date: new Date(),
        duration
    });

}