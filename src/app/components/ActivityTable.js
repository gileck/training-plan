import React, { useState } from "react";
import { Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress, Tabs, Tab, Collapse, DialogTitle, DialogActions } from "@mui/material";
import { ListItem, ListItemText } from "@mui/material";
import { Delete, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useFetch } from "@/useFetch";
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

export function ActivityTable({ setIsLoading }) {
    const { data, loading, error, setData } = useFetch('/api/activity/activity')
    const setActivity = (cb) => setData(prevData => ({ activity: cb(prevData.activity) }))
    const activity = data.activity || [];
    setIsLoading(loading)
    const [selectedItem, setSelectedItem] = useState(null);
    const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectEnabled, setSelectEnabled] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

    const toDateString = (timestamp) => {
        const date = new Date(timestamp);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return `${dayName}, ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const toggleEnableSelect = () => {
        setSelectEnabled((prevSelectEnabled) => !prevSelectEnabled);
    };

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
                setActivity((prevActivity) =>
                    prevActivity.filter((item) => item._id !== id)
                );
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error deleting data', e.message);
            });
    };

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
                setActivity((prevActivity) =>
                    prevActivity.filter((item) => !selectedItems.includes(item._id))
                );
                setSelectedItems([]);
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error deleting data', e.message);
            });
    };

    const deleteItemsByDate = (date) => {
        const itemsToDelete = activity.filter(item => getDateString(item.date) === getDateString(date)).map(item => item._id);
        setIsLoading(true);
        fetch('/api/activity/deleteActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: itemsToDelete,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setActivity((prevActivity) =>
                    prevActivity.filter((item) => !itemsToDelete.includes(item._id))
                );
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error deleting data', e.message);
            });
    };

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

    const toDateHeaderString = (dateString, totalSets) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return `${dayName}, ${date.toLocaleDateString()} (Total Sets: ${totalSets})`;
    };

    const getDateString = (date) => {
        return new Date(date).getDate() + "_" + new Date(date).getMonth() + "_" + new Date(date).getFullYear()
    }

    const groupByDateAndExercise = (activities) => {
        return activities.reduce((acc, item) => {
            const date = getDateString(item.date)
            if (!acc[date]) {
                acc[date] = { exercises: {}, totalSets: 0, date: item.date };
            }
            const exerciseName = item.exercise.name;
            if (!acc[date].exercises[exerciseName]) {
                acc[date].exercises[exerciseName] = { items: [], totalSets: 0 };
            }
            acc[date].exercises[exerciseName].items.push(item);
            acc[date].exercises[exerciseName].totalSets += item.numberOfSetsDone;
            acc[date].totalSets += item.numberOfSetsDone;
            return acc;
        }, {});
    };

    const groupedActivities = groupByDateAndExercise(activity);


    const handleToggleGroup = (date, exerciseName) => {
        setExpandedGroups((prevExpandedGroups) => ({
            ...prevExpandedGroups,
            [date]: {
                ...prevExpandedGroups[date],
                [exerciseName]: !prevExpandedGroups[date]?.[exerciseName],
            },
        }));
    };

    return (
        <>
            {selectedItem ? <EditDateDialog
                open={editDateDialogOpen}
                onClose={() => setEditDateDialogOpen(false)}
                onDateChange={handleDateChange}
                item={selectedItem}
            /> : ''}

            <Box sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', visibility: activity.length > 0 ? 'visible' : 'hidden' }}>
                    <Button sx={{ color: "#0063fe", fontSize: '11px' }} onClick={() => toggleEnableSelect()}>{selectEnabled ? 'Cancel' : 'Edit'}</Button>
                    <Button sx={{ color: "#0063fe", fontSize: '11px' }} disabled={!selectEnabled} onClick={() => handleSelectAll()}>Select All</Button>
                    <Button sx={{ color: "#0063fe", fontSize: '11px' }} disabled={selectedItems.length === 0} onClick={() => handleDeselectAll()}>Deselect All</Button>
                    <Button startIcon={<Delete />} disabled={selectedItems.length === 0} sx={{ color: "#0063fe", fontSize: '11px' }} onClick={() => deleteItems()}>Delete</Button>
                </Box>
                <Divider />

                <List>
                    {Object.keys(groupedActivities).map((date) => (
                        <React.Fragment key={date}>
                            <ListItem sx={{ backgroundColor: '#f0f0f0' }}>
                                <ListItemText primary={toDateHeaderString(groupedActivities[date].date, groupedActivities[date].totalSets)} />
                                {selectEnabled && (
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => deleteItemsByDate(groupedActivities[date].date)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                            <Divider />
                            {Object.keys(groupedActivities[date].exercises).map((exerciseName) => (
                                <React.Fragment key={exerciseName}>
                                    <ListItem onClick={() => handleToggleGroup(date, exerciseName)} sx={{ backgroundColor: 'white' }}>
                                        <ListItemText primary={`${exerciseName} (x${groupedActivities[date].exercises[exerciseName].totalSets})`} />
                                        {expandedGroups[date]?.[exerciseName] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={expandedGroups[date]?.[exerciseName]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {groupedActivities[date].exercises[exerciseName].items.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem sx={{ pl: 4 }}>
                                                        {selectEnabled ? <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleSelect(item._id)} /> : ''}
                                                        <ListItemText primary={item.exercise.name + ` x${item.numberOfSetsDone}`} secondary={toDateString(item.date)} />
                                                        <ListItemSecondaryAction sx={{ visibility: !selectEnabled ? 'hidden' : 'visible' }}>
                                                            <IconButton onClick={() => { setEditDateDialogOpen(true); setSelectedItem(item); }}>
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton onClick={() => { deleteItem(item._id); }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                    <Divider />
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider /> {/* Added Divider between exercise groups */}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

        </>
    );
}
