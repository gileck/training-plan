import { useEffect, useState } from "react";
import { DialogActions, DialogTitle, Box, Button, Checkbox, Dialog, Divider, IconButton, List, ListItemSecondaryAction, TextField, DialogContent, LinearProgress } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

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

    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
    const [activity, setActivity] = useState([])

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
            {isLoading ? <LinearProgress color="secondary" /> : ''}

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
                        sx={{ color: "#0063fe" }}
                        onClick={() => toggleEnableSelect()}
                    >{selectEnabled ? 'Cancel' : 'Edit'}</Button>
                    <Button
                        sx={{ color: "#0063fe" }}
                        disabled={!selectEnabled}
                        onClick={() => handleSelectAll()}
                    >Select All</Button>
                    <Button
                        sx={{ color: "#0063fe" }}
                        disabled={selectedItems.length === 0}
                        onClick={() => handleDeselectAll()}
                    >Deselect All</Button>
                    <Button
                        startIcon={<Delete />}
                        disabled={selectedItems.length === 0}
                        sx={{ color: "#0063fe" }}
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