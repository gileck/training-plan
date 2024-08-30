import React, { useEffect, useState } from "react";
import { DialogActions, DialogTitle, Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress, Tabs, Tab } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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


function Progress({ activity }) {
    const [graphData, setGraphData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

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
        <Box sx={{ width: '100%', height: 400, padding: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={graphData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
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
            </ResponsiveContainer>

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

function ActivityTable({ activity, setIsLoading, setActivity }) {

    const [selectedItem, setSelectedItem] = useState(null);
    const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);



    const toDateString = (timestamp) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
    }



    const [selectedItems, setSelectedItems] = useState([]);
    const [selectEnabled, setSelectEnabled] = useState(false);

    const toggleEnableSelect = () => {
        setSelectEnabled((prevSelectEnabled) => !prevSelectEnabled);
    }

    const handleSelect = (id) => {
        if (selectedItems.includes(id)) {
            handleDeselect(id);
            return;
        }
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
    };

    const handleSelectAll = () => {
        setSelectedItems(activity.map((item) => item._id));
    };

    const handleDeselect = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((selectedItem) => selectedItem !== id)
        );
    };

    const handleDeselectAll = () => {
        setSelectedItems([]);
    };

    const deleteItem = (id) => {
        setIsLoading(true);
        fetch('/api/activity/deleteActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [id],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log({ data });
                setActivity((prevActivity) =>
                    prevActivity.filter((item) => item._id !== id)
                );
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error deleting data', e.message);
            });
    }


    const deleteItems = () => {
        setIsLoading(true);
        fetch('/api/activity/deleteActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: selectedItems,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log({ data });
                setActivity((prevActivity) =>
                    prevActivity.filter((item) => !selectedItems.includes(item._id))
                );
                setSelectedItems([]);
                setIsLoading(false);

            })
            .catch((e) => {
                console.error('Error deleting data', e.message);
            });
    }

    function handleDateChange(newDate, id) {
        setEditDateDialogOpen(false);
        setIsLoading(true);
        fetch('/api/activity/updateActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                date: newDate,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log({ data });
                setActivity((prevActivity) =>
                    prevActivity.map((item) =>
                        item._id === selectedItem._id ? { ...item, date: newDate } : item
                    )
                );
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error updating data', e.message);
            });
    }




    return (

        <>

            {selectedItem ? <EditDateDialog
                open={editDateDialogOpen}
                onClose={() => setEditDateDialogOpen(false)}
                onDateChange={handleDateChange}
                item={selectedItem}
            /> : ''}

            <Box
                sx={{
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        visibility: activity.length > 0 ? 'v    isible' : 'hidden',
                    }}
                >
                    <Button
                        sx={{ color: "#0063fe", fontSize: '11px' }}
                        onClick={() => toggleEnableSelect()}
                    >{selectEnabled ? 'Cancel' : 'Edit'}</Button>
                    <Button
                        sx={{ color: "#0063fe", fontSize: '11px' }}
                        disabled={!selectEnabled}
                        onClick={() => handleSelectAll()}
                    >Select All</Button>
                    <Button
                        sx={{ color: "#0063fe", fontSize: '11px' }}
                        disabled={selectedItems.length === 0}
                        onClick={() => handleDeselectAll()}
                    >Deselect All</Button>
                    <Button
                        startIcon={<Delete />}
                        disabled={selectedItems.length === 0}
                        sx={{ color: "#0063fe", fontSize: '11px' }}
                        onClick={() => deleteItems()}
                    >
                        Delete
                    </Button>
                </Box>
                <Divider />

                <List>
                    {activity.map((item, index) => (
                        <>
                            <ListItem key={index}>
                                {selectEnabled ? <Checkbox
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => handleSelect(item._id)}
                                /> : ''}
                                <ListItemText
                                    primary={item.exercise.name + ` x${item.numberOfSetsDone}`}
                                    secondary={toDateString(item.date)}
                                />
                                <ListItemSecondaryAction
                                    sx={{
                                        visibility: !selectEnabled ? 'hidden' : 'visible',
                                    }}
                                >
                                    <IconButton
                                        onClick={() => {
                                            setEditDateDialogOpen(true)
                                            setSelectedItem(item)
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            deleteItem(item._id)
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>

                                </ListItemSecondaryAction>

                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </Box>
        </>
    );
}