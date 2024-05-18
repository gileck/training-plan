import { FormControl } from "@mui/base";
import { Button, Box, ButtonBase, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, Chip, TextField, Alert, Link, DialogActions } from "@mui/material";
import React, { useState } from "react";
import { getAllBodyParts } from "../exercisesAPI";
import { Add, AddCircle, CheckBox, CheckBoxOutlineBlankRounded, CheckBoxRounded, CheckRounded, CopyAll, Description, Error, ErrorOutline, LinkRounded, OpenInNewOutlined } from "@mui/icons-material";
import { BuildTrainingPlan } from "./buildTrainingPlanLogic";
import { Prompt } from "next/font/google";
import { buildPrompt } from "../trainingPlanPrompt";
import { FormBuilder } from "./FormBuilder";


function PromptDialog({ prompDialogOpen, onClose, prompt, onAddTrainingPlan, trainingPlanParams }) {
    const [isValidJson, setIsValidJson] = useState(null)
    const [json, setJson] = useState(null)
    const [planName, setPlanName] = useState(null)
    const [shouldShowAlert, setShouldShowAlert] = useState(false)
    const [replaceTrainingPlan, setReplaceTrainingPlan] = useState(false)

    function onReplaceTrainingPlanCheckboxChanged(e) {
        setReplaceTrainingPlan(e.target.checked)
    }

    function onPlanNameChanged(e) {
        setPlanName(e.target.value)
    }

    function onCopyPromptClicked() {
        console.log({ trainingPlanParams });
        navigator.clipboard.writeText(buildPrompt(trainingPlanParams))
        setShouldShowAlert(true)
    }

    function onAddTrainingPlanClicked() {
        onAddTrainingPlan({ name: planName, plan: json, replaceTrainingPlan })
        // onAddTrainingPlan({ name: planName, plan: JSON })


    }
    function onInputChanged(e) {
        // console.log(e.target.value);
        const cleanValue = e.target.value.replace('```', '').replace('```', '').replace('json', '').trim()
        let json
        try {
            json = JSON.parse(cleanValue)
            setJson(json)
            setIsValidJson(true)
        } catch (error) {
            console.log(error);
            setIsValidJson(false)
        }
    }
    return <Dialog
        open={prompDialogOpen}
        onClose={onClose}
        size="xl"
        fullWidth={true}

        sx={{
            width: '100%',

        }}
    >
        <DialogTitle>
            Build Training Plan
        </DialogTitle>
        <Box
            sx={{
                padding: '20px'

            }}
        >


            <div>

                <Link

                    target="_blank"
                    href={`https://chat.openai.com/chat?model=gpt-4o&q=${buildPrompt(trainingPlanParams).replace(/\s+/g, ' ').trim()}`}>
                    <OpenInNewOutlined />
                    Open in openai.com
                </Link>


            </div>
            OR
            <div>

                <Button onClick={onCopyPromptClicked}>
                    <CopyAll />
                    Copy Prompt
                </Button>
                {shouldShowAlert && <Alert severity="success">

                    Prompt was copied to clipboard.
                    Paste in the AI chatbot, and then paste the JSON object below.
                </Alert>}
            </div>
            {/* <TextField
                    onChange={onPlanNameChanged}
                    sx={{ width: '80%' }}
                    placeholder="Name"
                /> */}
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <TextField
                    onChange={onInputChanged}
                    sx={{ width: '80%' }}
                    placeholder="Paste JSON object here"
                />
                <span
                    style={{
                        marginTop: '15px',
                        marginLeft: '15px',
                        display: 'inline-block',
                    }}
                >
                    {isValidJson === false && <ErrorOutline sx={{ color: 'darkred' }} />}

                    {isValidJson === true && <CheckRounded sx={{ color: 'green' }} />}
                </span>
            </div>

            {/* <Checkbox
                onChange={onReplaceTrainingPlanCheckboxChanged}
            /> Replace Current Plan */}


            <Button
                sx={{ marginTop: '20px' }}
                variant="contained"
                startIcon={<AddCircle />}
                onClick={onAddTrainingPlanClicked}
                disabled={!isValidJson}

            >
                Add Training Plan
            </Button>
        </Box>

    </Dialog >
}

export function BuildTrainingPlanDialog({
    exercises,
    onBuildTrainingPlan,
    onClose,
    exerciseList,
    buildTrainigPlanDialigOpen
}) {


    const [prompDialogOpen, setPrompDialogOpen] = useState(false)
    const [trainingPlanParams, setTrainingPlanParams] = useState({
        numberOfWorkouts: 5,
        level: 3,
        focusMusclesVsRest: 70,
        location: ["gym"],
        focusMuscles: [],
        adaptations: []
    })

    console.log({ trainingPlanParams });
    function onFormChanged(values) {
        console.log({ values });
        setTrainingPlanParams(values)
    }






    // console.log({ workoutType });

    function handleFocusMuscleChange(e) {
        const value = e.target.value;
        console.log({ value });

        if (value.length > 3 && value.length >= focusMuscles.length) {
            return;
        }

        setFocusMuscles(value)

        // setFocusMuscles((prev) => {
        //     if (prev.includes(value)) {
        //         return prev.filter((v) => v !== value)
        //     } else {
        //         return [...prev, value]
        //     }
        // });
    }

    function onBuildTrainingPlanInternal() {
        onClose()
        setPrompDialogOpen(true)
    }

    function onWorkoutTypeChanged(workoutType, e) {
        const value = e.target.checked;
        setWorkoutType(
            (prev) => {
                if (value) {
                    return [...prev, workoutType]
                } else {
                    return prev.filter((wt) => wt !== workoutType)
                }
            }
        )
        console.log({ workoutType, value });
    }

    function onAddTrainingPlan(params) {
        setPrompDialogOpen(false)
        onBuildTrainingPlan(params)
        onClose()
    }


    const formElements = {
        numberOfWorkouts: {
            type: 'singleSelect',
            label: 'Weekly Workouts',
            default: 3,
            children: _.range(1, 8).map((value) => ({ label: value, value }))
        },
        level: {
            type: 'singleSelect',
            label: 'Level',
            default: 3,
            children: [
                { label: "First Time", value: 1 },
                { label: "Beginner", value: 2 },
                { label: "Intermediate", value: 3 },
                { label: "Advanced", value: 4 },
                { label: "Professional", value: 5 }
            ]
        },
        location: {
            type: 'multiSelect',
            label: 'Location',
            default: ['gym'],
            options: {
                multiple: true,
            },
            children: [
                { label: 'Gym', value: 'gym' },
                { label: 'Outdoor', value: 'outdoor' },
                { label: 'Studio', value: 'studio' },
                { label: 'Home', value: 'home' }
            ],
        },
        focusMuscles: {
            validate: value => value.length < 4,
            inline: false,
            type: 'multiSelect',
            label: 'Focus Muscles (3 Max)',
            default: [],
            options: {
                multiple: true,
            },
            children: getAllBodyParts().map(part => ({
                label: part,
                value: part
            })),
        },
        focusMusclesVsRest: {
            type: "Slider",
            default: '70',
            labelFn: (value) => `Focus Muscles Ratio: ${value}% `,
            description: 'How Focused should the training plan be on the focused muscles vs other body parts',
            options: {
                getAriaValueText: (value) => value,
                valueLabelDisplay: "auto",
                sx: { width: '80%', marginLeft: '20px' },
                step: 10,
                marks: true,
                min: 0,
                max: 100,
                marks: [{
                    value: 0,
                    label: 'Diverse',
                }, {
                    value: 100,
                    label: "Focused"
                }]
            }
        },
        adaptations: {
            validate: value => value.length < 3,
            type: 'multiSelect',
            label: 'Training Goals (2 Max)',
            default: [],
            options: {
                multiple: true,
            },
            children: [
                { label: 'Muscle Size (Hypertrophy)', value: 'muscleSize' },
                { label: 'Muscle Strength', value: 'muscleStrength' },
                { label: 'Power / Speed', value: 'power' },
                { label: 'Loose Fat', value: 'burnFat' },
            ],
        },
    }

    return (
        <>

            <PromptDialog
                trainingPlanParams={trainingPlanParams}
                onAddTrainingPlan={onAddTrainingPlan}
                prompDialogOpen={prompDialogOpen}
                onClose={() => setPrompDialogOpen(false)}
            />
            <Dialog
                disableEscapeKeyDown
                open={buildTrainigPlanDialigOpen}
                onClose={() => onClose()}
                fullWidth={true}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: 'lightblue'
                    }}
                >
                    Build Training Plan
                </DialogTitle>

                <FormBuilder
                    formElements={formElements}
                    onChange={onFormChanged}
                />

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={onBuildTrainingPlanInternal}
                    >
                        Build Training Plan
                    </Button>
                </DialogActions>

            </Dialog >
        </>
    );




}