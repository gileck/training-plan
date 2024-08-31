import React, { useContext, useEffect, useState } from "react";
import { DialogActions, DialogTitle, Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress, Tabs, Tab } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from "./Progress";
import { ActivityTable } from "./ActivityTable";
import { AppContext } from "../AppContext";



export function Activity() {
    const { params: { route } } = useContext(AppContext)
    const [tabValue, setTabValue] = useState(route === 'progress' ? 'progress' : 'activity');
    const [isLoading, setIsLoading] = useState(true);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const Comps = {
        activity: ActivityTable,
        progress: Progress
    }

    const Comp = Comps[tabValue] || Comps.activity;



    return <>
        {isLoading ? <LinearProgress color="secondary" /> : ''}
        <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd'
            }}
        >
            <Tab
                value="activity"
                label="Activity"
                sx={{
                    textTransform: 'none',
                    '&.Mui-selected': {
                        color: '#1976d2',
                        backgroundColor: '#e3f2fd'
                    }
                }}
            />
            <Tab
                value="progress"
                label="Progress"
                sx={{
                    textTransform: 'none',
                    '&.Mui-selected': {
                        color: '#1976d2',
                        backgroundColor: '#e3f2fd'
                    }
                }}
            />
        </Tabs>
        <Comp setIsLoading={setIsLoading} />
    </>
}
