import React, { useEffect, useState } from "react";
import { DialogActions, DialogTitle, Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress, Tabs, Tab } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from "./Progress";
import { ActivityTable } from "./ActivityTable";

function EditDateDialog({ open, onClose, onDateChange, item }) {

    const [newDate, setNewDate] = useState(item.date);

    const updatgeDate = (newDate) => {
        if (!newDate) {
            return;
        }
        if (new Date(newDate).toString() === 'Invalid Date') {
            return;
        }

        setNewDate(newDate)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Edit Date</DialogTitle>
            <DialogContent>
                <TextField
                    type="datetime-local"
                    value={new Date(newDate).toISOString().slice(0, 16)}
                    onChange={(e) => updatgeDate(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onDateChange(new Date(newDate), item._id)}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}


export function Activity() {
    const [tabValue, setTabValue] = useState('activity');
    const [isLoading, setIsLoading] = useState(true);
    const [activity, setActivity] = useState([])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/activity/activity')
            .then(res => res.json())
            .then(data => {
                console.log({ data });
                setActivity(data.activity)
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error fetching data', e.message)
            })
    }, [])

    const Comps = {
        activity: ActivityTable,
        progress: Progress
    }

    const Comp = Comps[tabValue] || Comps.activity;



    return <>
        {isLoading ? <LinearProgress color="secondary" /> : ''}
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab value="activity" label="Activity" />
            <Tab value="progress" label="Progress" />
        </Tabs>
        <Comp activity={activity} setIsLoading={setIsLoading} setActivity={setActivity} />
    </>
}
