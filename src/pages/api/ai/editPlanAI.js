import { getResponseFromGpt } from "@/ai/ai";
import { getUser } from "../userApi";
import { getDB } from "../db";
import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { text, trainingPlanId } = req.body;
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();

    const trainingPlan = await db.collection('trainingPlans').findOne({ id: trainingPlanId });
    console.log({trainingPlan})
    const planWithoutWeeks = {
        ...trainingPlan,
        plan: {
            ...trainingPlan.plan,
            exercises: trainingPlan.plan.exercises.map(exercise => {
                const { weeks, ...rest } = exercise;
                return rest;
            }),
            workouts: trainingPlan.plan.workouts.map(workout => {
                return {
                    ...workout,
                    exercises: workout.exercises.map(exercise => {
                        const { weeks, ...rest } = exercise;
                        return rest;
                    })
                }
            }),

        }
    }


    const prompt = `

    you are an experienced fitness trainer.
    a client has come to you for help with their fitness plan.
    They already have an existing training plan. 
    They want to change their training plan.

    this is their current training plan:

    ${JSON.stringify(planWithoutWeeks)}

    this is what they want to change in their current:
    
    ${text}
    
    ------------------
    
    return a JSON object with 2 keys:
    - changes: an array of changes you made to the training plan. Each change should be an object with the following keys:
    * type: the type of change you made. This can be one of the following: 'ADD_EXERCISE', 'REMOVE_EXERCISE', 'UPDATE_EXERCISE', 'ADD_WORKOUT', 'REMOVE_WORKOUT', 'UPDATE_WORKOUT'  
    * exerciseId: the id of the exercise you changed
    * workoutId: the id of the workout the exercise belongs to
    * value: an object with the new values of the exercise/workout. This should only include the values that were changed or added
    - message: a message to the client explaining the change you made to their training
    
    DO NOT CHANGE THE TYPE OR STRUCTURE OF THE TRAINING PLAN.
    `;

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



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