import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Divider, Switch, FormControlLabel } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategory } from '../exercisesAPI'; // Import the getCategory function
import { useFetch } from "@/useFetch";

export function Progress({ setIsLoading }) {
    const { data, loading, error } = useFetch('/api/activity/activity')
    const activity = data?.activity || []
    setIsLoading(loading)
    const [graphData, setGraphData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showByType, setShowByType] = useState(true); // State to track the switch value

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
            const exerciseType = getCategory(item.exercise.name); // Get the exercise type using getCategory
            if (!acc[key]) {
                acc[key] = { upperBody: 0, lowerBody: 0, abs: 0, total: 0 };
            }
            if (exerciseType === 'Upper body') {
                acc[key].upperBody += item.numberOfSetsDone;
            } else if (exerciseType === 'Legs') {
                acc[key].lowerBody += item.numberOfSetsDone;
            } else if (exerciseType === 'Core') {
                acc[key].abs += item.numberOfSetsDone;
            }
            acc[key].total += item.numberOfSetsDone;
            return acc;
        }, {});

        const sortedData = last7Days.map(date => ({
            day: daysOfWeek[date.getDay()],
            date: date.toLocaleDateString(),
            upperBody: dataByDay[date.toISOString()]?.upperBody || 0,
            lowerBody: dataByDay[date.toISOString()]?.lowerBody || 0,
            abs: dataByDay[date.toISOString()]?.abs || 0,
            total: dataByDay[date.toISOString()]?.total || 0
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
        <Box>
            <BarChart
                data={graphData}
                width={500}
                height={500}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis ticks={[5, 10, 15, 20, 25, 30]} />
                <Tooltip
                    labelFormatter={(value, name, props) => value}
                    formatter={(value) => [`${value} sets`, 'Sets']}
                />
                <Legend />
                {showByType ? (
                    <>
                        <Bar
                            dataKey="upperBody"
                            name="Upper Body"
                            stackId="a"
                            fill="#ADD8E6"
                            onClick={handleBarClick}
                            isAnimationActive={false} // Disable animation
                        />
                        <Bar
                            dataKey="lowerBody"
                            name="Lower Body"
                            stackId="a"
                            fill="#008080"
                            onClick={handleBarClick}
                            isAnimationActive={false} // Disable animation
                        />
                        <Bar
                            dataKey="abs"
                            name="Core"
                            stackId="a"
                            fill="#dfd3a4"
                            onClick={handleBarClick}
                            isAnimationActive={false} // Disable animation
                        />
                    </>
                ) : (
                    <Bar
                        dataKey="total"
                        name="Total Sets"
                        fill="#673AB7"
                        onClick={handleBarClick}
                        isAnimationActive={false} // Disable animation
                    />
                )}
            </BarChart>
            <FormControlLabel
                control={<Switch checked={showByType} onChange={() => setShowByType(!showByType)} />}
                label="Show by Exercise Type"
            />
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