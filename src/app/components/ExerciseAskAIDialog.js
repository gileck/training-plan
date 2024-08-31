import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Chat } from "./chat";
import { colors } from './colors';

export function ExerciseAskAIDialog({ open, onClose, exercise: { exercise, selectedWeek } }) {
    if (!exercise) {
        return <></>
    }

    const exerciseDetails = {
        ...exercise,
        ...exercise[exercise.selectedWeek]
    }

    delete exerciseDetails.weeks

    console.log({ exerciseDetails });

    function getResponse({ input }) {
        console.log({ input });
        return fetch('/api/getAIReponseForExercise', {
            method: 'POST',
            body: JSON.stringify({
                text: input,
                exercise: exerciseDetails
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
    }

    return <div>
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={true}
        >
            <DialogTitle
                sx={{
                    backgroundColor: colors.listHeaderBackground,
                }}
            >Ask about {exerciseDetails.name}</DialogTitle>
            <DialogContent>
                <Chat
                    chatId={`ask-ai-${exerciseDetails.id}`}
                    getResponse={getResponse}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </div>
}