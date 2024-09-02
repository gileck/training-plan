import { Chat } from "@/app/components/chat";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Cancel, Check, Info } from "@mui/icons-material";
import { AppContext } from "../AppContext";

function VerifyChange({ onAccept, onReject, showDetails, changes }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    function onAcceptInternal() {
        onAccept()
        setShowDetailsDialog(false)
    }
    function onRejectInternal() {
        onReject()
        setIsRejected(true)
        setShowDetailsDialog(false)
    }
    return <Box>
        <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)}>
            <DialogContent>
                <Typography>
                    {changes.map(({ action, params }) => {
                        return <Card sx={{
                            p: 1
                        }}>

                            <Typography>{action}</Typography>
                            <Typography>{Object.entries(params).map(([key, value]) => {
                                return <pre>{key}: {JSON.stringify(value, '/n', 2)}</pre>
                            })}</Typography>
                            <Divider />
                        </Card>
                    })}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant={'contained'} startIcon={<Check />} onClick={onAcceptInternal}>Accept</Button>

                <Button onClick={onRejectInternal}>Reject</Button>
                <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogActions>
        </Dialog>
        <Box>
            <Button disabled={isRejected} variant={'contained'} startIcon={<Check />} onClick={onAccept}>Accept</Button>
            <Button disabled={isRejected} startIcon={<Info />} onClick={() => setShowDetailsDialog(true)}>Details</Button>
            <Button disabled={isRejected} startIcon={<Cancel />} onClick={onRejectInternal}>Reject</Button>
        </Box>
    </Box>

}

export function EditPlanChat({ trainingPlan, ...actions }) {

    console.log({ trainingPlan })

    const { openAlert } = useContext(AppContext)

    async function getResponse({ input }) {
        const { result, apiPrice } = await fetch('/api/ai/editPlanAI', {
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
            Comp: () => <VerifyChange
                changes={changes}
                onAccept={() => {
                    changes.forEach(({ action, params }) => {
                        actions[action](...Object.values(params))
                    })
                    openAlert('Done! The changes have been applied to the training plan')

                }}
                onReject={() => {
                    console.log('reject')
                }}
            />
        }

    }

    return <>

        <Chat
            getResponse={getResponse}
            chatId="edit-plan-chat"
            height={'70vh'}
        />
    </>

}