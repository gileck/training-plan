import {Chat} from "@/app/components/chat";
import {useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Button, Dialog, DialogContent} from "@mui/material";
import Divider from "@mui/material/Divider";

function VerifyChange({changes}) {
    return <Box>
        <List>
            {
                changes.map(({type, value}) => {
                    return <ListItem>
                        <List>
                            <ListItem>{type}</ListItem>
                            <Divider/>
                            {

                                Object.entries(value).map(([key, val]) => {
                                    return <>
                                    <ListItem>
                                        <div>{key}: {val}</div>
                                    </ListItem>
                                        <Divider/>
                                    </>
                                })
                            }
                        </List>
                    </ListItem>
                })
            }
        </List>
        <Box>
            <Button variant={'contained'}>Accept</Button>
            <Button>Reject</Button>
        </Box>
    </Box>

}

export function EditPlanChat({trainingPlan}) {

    console.log({trainingPlan})

    async function getResponse({input}) {
        const {result, apiPrice} = await fetch('/api/ai/editPlanAI', {
            method: 'POST',
            body: JSON.stringify({
                text: input,
                trainingPlanId: trainingPlan.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        const {message, changes} = result;


        return {
            result: message,
            apiPrice,
            Comp: () => <VerifyChange
                changes={changes}
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