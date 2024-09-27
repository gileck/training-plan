import { Chat } from "@/app/components/chat";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Cancel, Check, Info } from "@mui/icons-material";
import { AppContext } from "../AppContext";

export function PersonalCoachAI({ trainingPlan, ...actions }) {


}
export function PersonalCoachAIChat({ trainingPlan, ...actions }) {

    const { openAlert } = useContext(AppContext)

    async function getResponse({ input }) {
        const { result, apiPrice } = await fetch('/api/ai/personalCoachAI', {
            method: 'POST',
            body: JSON.stringify({
                text: input,
                trainingPlanId: trainingPlan.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        const { message, changes } = result;

        return {
            result: message,
            apiPrice,
        }
    }

    return <>
        <Chat
            getResponse={getResponse}
            chatId="personal-coach-chat"
            height={'70vh'}
        />
    </>

}