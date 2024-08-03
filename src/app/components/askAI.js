import React from "react";

import { useExercisesAPI } from "../exercisesAPI";
import { Chat } from "./chat";



export function AskAI() {
    const { currentTrainingPlan } = useExercisesAPI()

    console.log({ currentTrainingPlan });
    function getResponse({ input }) {
        return fetch('/api/askAI', {
            method: 'POST',
            body: JSON.stringify({
                text: input,
                currentTrainingPlan: currentTrainingPlan.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())

    }


    return <Chat
        getResponse={getResponse}
        chatId='ask-training-plan-chat'
    />

}