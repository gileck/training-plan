import { getResponseFromGpt } from "@/ai/ai";
import { getUser } from "./userApi";
import { getDB } from "./db";
import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { text, exercise } = req.body;

    console.log({
        text,
        exercise
    });
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();



    // const trainingPlan = await db.collection('trainingPlans').findOne({ id: currentTrainingPlan });

    const prompt = `

    you are an experienced fitness trainer.
    your client has come to you for help with one of their exercises.
    They already have an existing training plan. 
    They want to ask you a question about a specific exercise they are doing which is part of their training plan.

    this is the exercise details:

    ${JSON.stringify(exercise, null, 2)}

    this is the question they have asked you:
    
    ${text}
    `;

    console.log({ prompt });

    const { result, apiPrice, modelToUse, usage, duration, error, message } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: false,
        model: '3'
    })

    if (error) {
        console.error(message);
        res.status(500).json({ error, message });
        return;
    }

    res.status(200).json({ result, apiPrice });

    await sendLog(`
        AI: AskAI
        User: ${user.username}
        Question: ${text}
        Result: ${JSON.stringify(result || '').length} characters
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