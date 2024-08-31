import React, { useState } from 'react';
import { ListItem, Box, ListItemText, IconButton, Typography, Chip, ListItemAvatar, Dialog } from "@mui/material";
import { CheckCircle, AddCircle as AddCircleIcon, RemoveCircle, ArrowUpward, ArrowDownward, Assistant, Close } from '@mui/icons-material';
import { getPrimaryMuscle, getSecondaryMuscles } from "../exercisesAPI";
import { colors } from './colors';
import { getImageUrl } from '../exercisesList';

export function Exercise({
    shouldShowArrows,
    onWorkoutArrowClicked,
    isSelected,
    selectExercise,
    selectedWeek,
    exercise,
    onRemoveSetComplete,
    onAddSetComplete,
    onSetDone,
    disableEdit,
    openAskAIDialog
}) {
    if (!exercise) {
        return null;
    }

    const weeklyTargetReached = exercise.sets.done >= exercise.sets.target;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ListItem
            sx={{

                flexDirection: 'column',
                alignItems: 'flex-start',
                backgroundColor: isSelected ? colors.exerciseBackgroundSelected : colors.exerciseBackground,
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',

                }}>

                {getImageUrl(exercise.name) ? <ListItemAvatar
                    sx={{
                        margin: "auto",
                        marginRight: '15px',
                    }}
                    onClick={handleClickOpen}
                >
                    <img
                        width={60}
                        height={60}
                        src={getImageUrl(exercise.name)} />
                </ListItemAvatar> : ''}

                {isSelected ? <div style={{
                    display: 'grid',
                    marginRight: '15px',
                    color: 'gray',
                }}>
                    <ArrowUpward
                        onClick={() => onWorkoutArrowClicked(exercise, -1)}
                    />
                    <ArrowDownward
                        onClick={() => onWorkoutArrowClicked(exercise, 1)}
                    />
                </div> : ''}

                <ListItemText
                    onClick={() => selectExercise(exercise.id)}

                    primary={
                        <Typography
                            sx={{ textDecoration: weeklyTargetReached ? 'line-through' : '' }}
                        >{exercise.name}</Typography>
                    }
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {
                                    exercise.sets ?
                                        `Sets: ${exercise.sets.done || 0} / ${exercise.sets.target}` : ''
                                }
                            </Typography>
                            <Typography
                                sx={{ ml: '0px' }}
                                component="div"
                                variant="body2"
                                color="text.secondary"

                            >

                                {exercise.weight > 0 ? `${exercise.numberOfReps}x${exercise.weight}kg` : `${exercise.numberOfReps} reps`}
                                {exercise.weight === 0 ? " (body weight)" : ""}
                            </Typography>
                        </React.Fragment>
                    } />
                <IconButton
                    disabled={disableEdit || exercise.sets.done === exercise.sets.target}
                    onClick={() => onSetDone()}

                >
                    <CheckCircle
                        sx={{
                            fontSize: '30px',
                        }}
                    />
                </IconButton>
                <IconButton
                    disabled={disableEdit || exercise.sets.done >= exercise.sets.target}
                    onClick={() => onAddSetComplete()}

                >

                    <AddCircleIcon
                        sx={{
                            fontSize: '30px',
                        }}
                    />
                </IconButton>
                <IconButton
                    disabled={disableEdit || exercise.sets.done === 0}
                    onClick={() => onRemoveSetComplete()}
                >

                    <RemoveCircle
                        sx={{
                            fontSize: '30px',
                        }}
                    />
                </IconButton>
            </Box>
            <Box sx={{
                pt: 1,
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            }}>
                <div>
                    {getPrimaryMuscle(exercise.name) ? <Chip
                        sx={{ mr: 1 }}
                        key={getPrimaryMuscle(exercise.name)}
                        label={getPrimaryMuscle(exercise.name)}
                        size="small"
                    /> : ''}
                    {getSecondaryMuscles(exercise.name).map((bodyPart) => (
                        <Chip
                            sx={{ mr: 1 }}
                            key={bodyPart}
                            label={bodyPart}
                            size="small"
                            variant="outlined"
                        />
                    ))}
                </div>

                <div>
                    <Assistant
                        onClick={() => openAskAIDialog(exercise)}
                        sx={{
                            color: '#7c69dc',
                            fontSize: '20px',
                        }}
                    />
                </div>
            </Box>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {exercise.name}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>
                <img
                    width="100%"
                    src={getImageUrl(exercise.name)}
                    alt={exercise.name}
                />
            </Dialog>
        </ListItem >
    );
}