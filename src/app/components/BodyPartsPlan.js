import { Box, Chip, Collapse, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material"
import { getAllBodyParts, getBodyParts, getPrimaryMuscle, getSecondaryMuscles, useExercisesAPI } from "../exercisesAPI"
import React from "react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

export function BodyPartsPlan() {
    const { exercises } = useExercisesAPI()
    const bodyParts = getAllBodyParts()
    const [bodyPartsOpen, setBodyPartsOpen] = React.useState({})
    console.log({ bodyParts })
    const exercisesByBodyPart = bodyParts.map(bp => {
        const primaryExercises = exercises.filter(e => getPrimaryMuscle(e.name) === bp)
        const secondaryExercises = exercises.filter(e => getSecondaryMuscles(e.name).includes(bp))
        return {
            name: bp,
            primaryExercises,
            secondaryExercises,
            exercises: [...primaryExercises, ...secondaryExercises],
            primaryExercisesSets: primaryExercises.reduce((acc, e) => acc + e.weeklySets, 0),
            secondaryExercisesSets: secondaryExercises.reduce((acc, e) => acc + e.weeklySets, 0),
        }
    }).sort((a, b) => b.primaryExercisesSets - a.primaryExercisesSets)
    console.log({ exercisesByBodyPart });
    return (
        <List>


            {exercisesByBodyPart.map((bp, index) => (
                <React.Fragment key={index}>
                    <ListItem
                        onClick={() => setBodyPartsOpen({ ...bodyPartsOpen, [bp.name]: !bodyPartsOpen[bp.name] })}
                        key={index}>
                        <ListItemText
                            primary={bp.name}
                            secondary={<React.Fragment>
                                <div>
                                    Primary: {bp.primaryExercisesSets} sets
                                </div>
                                <div>
                                    Secondary: {bp.secondaryExercisesSets} sets
                                </div>
                            </React.Fragment>
                            }

                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => setBodyPartsOpen({ ...bodyPartsOpen, [bp.name]: !bodyPartsOpen[bp.name] })}>
                                {bodyPartsOpen[bp.name] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItemSecondaryAction>

                    </ListItem>

                    <Collapse in={bodyPartsOpen[bp.name]} timeout="auto" unmountOnExit>
                        <Divider />

                        <List
                            sx={{
                                pl: 2,
                                backgroundColor: 'background.paper',
                            }}
                        >
                            {bp.exercises.map((exercise, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        sx={{ flexDirection: 'column', alignItems: 'flex-start' }}

                                        key={index}>
                                        <ListItemText
                                            primary={exercise.name}
                                            secondary={`Total Sets: ${exercise.weeklySets}`}
                                        />
                                        <Box sx={{ pt: 1 }}>
                                            <Chip
                                                sx={{ mr: 1 }}
                                                key={getPrimaryMuscle(exercise.name)}
                                                label={getPrimaryMuscle(exercise.name)}
                                                size="small"
                                            />
                                            {getSecondaryMuscles(exercise.name).map((bodyPart) => (
                                                <Chip
                                                    sx={{ mr: 1 }}
                                                    key={bodyPart}
                                                    label={bodyPart}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </ListItem>
                                    {index !== bp.exercises.length - 1 && <Divider />}
                                </React.Fragment>

                            ))}
                        </List>
                    </Collapse>
                    <Divider />


                </React.Fragment>

            ))}

        </List>
    )
}
