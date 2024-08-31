import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Divider } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Progress({ activity }) {
    const [graphData, setGraphData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    console.log({ activity, graphData });

    useEffect(() => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        const dataByDay = activity.reduce((acc, item) => {
            const date = new Date(item.date);
            date.setHours(0, 0, 0, 0);
            const key = date.toISOString();
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += item.numberOfSetsDone;
            return acc;
        }, {});

        const sortedData = last7Days.map(date => ({
            day: daysOfWeek[date.getDay()],
            date: date.toLocaleDateString(),
            sets: dataByDay[date.toISOString()] || 0
        }));

        setGraphData(sortedData);
    }, [activity]);

    const handleBarClick = (data) => {
        const clickedDate = new Date(data.date);
        const exercisesForDay = activity.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === clickedDate.toDateString();
        });

        // Group exercises by name
        const groupedExercises = exercisesForDay.reduce((acc, item) => {
            const key = item.exercise.name;
            if (!acc[key]) {
                acc[key] = { ...item, totalSets: 0 };
            }
            acc[key].totalSets += item.numberOfSetsDone;
            return acc;
        }, {});

        setSelectedDay({ date: data.date, exercises: Object.values(groupedExercises) });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedDay(null);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return (
        <Box >
            <BarChart
                data={graphData}
                width={500}
                height={500}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                    labelFormatter={(value, name, props) => value}
                    formatter={(value) => [`${value} sets`, 'Sets']}
                />
                <Legend />
                <Bar dataKey="sets" fill="#8884d8" name="Number of Sets" onClick={handleBarClick} />
            </BarChart>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Exercises on {selectedDay?.date}</DialogTitle>
                <DialogContent>
                    <List>
                        {selectedDay?.exercises
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((exercise, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${exercise.exercise.name} (${exercise.totalSets} sets)`}
                                            secondary={`Last set at: ${formatDate(exercise.date)}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
}