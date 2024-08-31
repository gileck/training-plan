import React, { useState } from "react";
import { DialogActions, DialogTitle, Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress, Tabs, Tab, Collapse } from "@mui/material";
import { ListItem, ListItemText } from "@mui/material";
import { Delete, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Progress } from "./Progress";

export function ActivityTable({ activity, setIsLoading, setActivity }) {
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
                console.log({ data });
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

    const toDateHeaderString = (dateString, totalSets) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return `${dayName}, ${dateString} (Total Sets: ${totalSets})`;
    };

    const groupByDateAndExercise = (activities) => {
        return activities.reduce((acc, item) => {
            const date = new Date(item.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { exercises: {}, totalSets: 0 };
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
                                <ListItemText primary={toDateHeaderString(date, groupedActivities[date].totalSets)} />
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
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </>
    );
}
