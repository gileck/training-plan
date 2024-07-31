import { FormControl } from "@mui/base";
import { Button, Box, ButtonBase, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, Chip, TextField, Alert, Link, DialogActions, Divider, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { getAllBodyParts } from "../exercisesAPI";
import { Add, AddCircle, CheckBox, CheckBoxOutlineBlankRounded, CheckBoxRounded, CheckRounded, ContentPaste, CopyAll, Description, Error, ErrorOutline, LinkRounded, OpenInNewOutlined } from "@mui/icons-material";
import { BuildTrainingPlan } from "./buildTrainingPlanLogic";
import { Prompt } from "next/font/google";
import { buildPrompt } from "../trainingPlanPrompt";
import { FormBuilder } from "./FormBuilder";
import ContentPasteGoRoundedIcon from '@mui/icons-material/ContentPasteGoRounded';
import { AppContext } from "../AppContext";

function PromptDialog({ prompDialogOpen, onClose, prompt, onAddTrainingPlan, trainingPlanParams }) {
    const [isValidJson, setIsValidJson] = useState(null)
    const [json, setJson] = useState(null)
    const [planName, setPlanName] = useState(null)
    const [shouldShowAlert, setShouldShowAlert] = useState(false)
    const [replaceTrainingPlan, setReplaceTrainingPlan] = useState(false)
    const [pasteJsonValue, setPasteJsonValue] = useState('')

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
        setJson(null)
        setIsValidJson(null)
        onAddTrainingPlan({ name: planName, plan: json, replaceTrainingPlan })
        // onAddTrainingPlan({ name: planName, plan: JSON })


    }
    function onJsonAdded(rawJson) {
        const cleanValue = rawJson.replace('```', '').replace('```', '').replace('json', '').trim()
        let json
        try {
            json = JSON.parse(cleanValue)
            setJson(json)
            setIsValidJson(true)
            onAddTrainingPlan({ name: planName, plan: json, replaceTrainingPlan })

        } catch (error) {
            console.log(error);
            setIsValidJson(false)
        }
        if (!pasteJsonValue) {
            setPasteJsonValue(cleanValue)
        }
    }
    function onInputChanged(e) {
        // console.log(e.target.value);
        setPasteJsonValue(e.target.value)
        onJsonAdded(e.target.value)


    }
    async function onPasteButtonClicked() {
        const pasteContent = await navigator.clipboard.readText()
        onJsonAdded(pasteContent)

    }
    return <Dialog
        open={prompDialogOpen}
        onClose={onClose}
        size="xl"
        sx={{
            width: '100%',

        }}
    >
        <DialogTitle
            sx={{
                backgroundColor: 'lightblue'

            }}
        >
            Build Training Plan with AI
        </DialogTitle>
        <Box
            sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,

            }}
        >

            <TextField
                onChange={onPlanNameChanged}
                sx={{ width: '60%' }}
                placeholder="Name"
            />


            <div>


                <Link
                    target="_blank"
                    href={`https://chat.openai.com/chat?model=gpt-4o&q=${buildPrompt(trainingPlanParams).replace(/\s+/g, ' ').trim()}`}>
                    <OpenInNewOutlined />
                    Open in openai.com
                </Link>
            </div>
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
                    value={pasteJsonValue}
                    onChange={onInputChanged}
                    sx={{ width: '50%' }}
                    placeholder="Paste JSON object here"
                /> */}
            <div>
                <Button
                    sx={{
                        paddingTop: '13px',
                    }}
                    variant="contained"
                    onClick={() => onPasteButtonClicked()}
                    startIcon={<ContentPasteGoRoundedIcon />}
                >
                    Paste JSON
                </Button>
                <span
                    style={{
                        marginTop: '15px',
                        marginLeft: '15px',
                        display: 'inline-block',
                    }}
                >
                    {isValidJson === true && <CheckRounded sx={{ color: 'green' }} />}
                </span>
            </div>
            {isValidJson === false && <Alert severity="error"> Invalid JSON object </Alert>}
            <Alert severity="info">
                Copy the prompt above or open the link with the prompt in the AI chatbot.
                Paste the result JSON object here.
            </Alert>

            {/* <Checkbox
                onChange={onReplaceTrainingPlanCheckboxChanged}
            /> Replace Current Plan */}


            {/* <Button
                sx={{ marginTop: '20px' }}
                variant="contained"
                startIcon={<AddCircle />}
                onClick={onAddTrainingPlanClicked}
                disabled={!isValidJson}

            >
                Add Training Plan
            </Button> */}

        </Box>
        <DialogActions>
            <Button
                onClick={() => {
                    onClose()
                    setJson(null)
                    setIsValidJson(null)

                }}
            >
                Cancel
            </Button>
        </DialogActions>

    </Dialog >
}

export function BuildTrainingPlanDialog({
    onBuildTrainingPlan,
    onClose,
    buildTrainigPlanDialigOpen
}) {
    const [loading, setLoading] = useState(false)
    const [isError, setError] = useState(false)

    const { openAlert } = React.useContext(AppContext)

    // const [prompDialogOpen, setPrompDialogOpen] = useState(false)
    const [trainingPlanParams, setTrainingPlanParams] = useState({
        numberOfWorkouts: 3,
        workoutLength: 60,
        level: 3,
        focusMusclesVsRest: 70,
        location: ["gym"],
        focusMuscles: [],
        adaptations: [
            'muscleSize',
        ],
        intensity: 'medium',


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

    async function onBuildTrainingPlanInternal() {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/buildTrainingPlan', {
            method: 'POST',
            body: JSON.stringify({ trainingPlanParams }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch((error) => {
                console.error(error)
                setError(true)
                setLoading(false)
            })

        if (!response) {
            setError(true)
            setLoading(false)
            return;
        }
        const { result, apiPrice } = response

        if (result) {
            onBuildTrainingPlan({ plan: result, name: `AI Plan ${new Date().toLocaleDateString()}` })

            console.log({ result });
            setLoading(false)

            openAlert(`Success (price: ${apiPrice})`)
        } else {
            setError(true)
            setLoading(false)
            openAlert(`Error: ${error}`)
        }



        // onClose()
        // setPrompDialogOpen(true)
    }

    // function onWorkoutTypeChanged(workoutType, e) {
    //     const value = e.target.checked;
    //     setWorkoutType(
    //         (prev) => {
    //             if (value) {
    //                 return [...prev, workoutType]
    //             } else {
    //                 return prev.filter((wt) => wt !== workoutType)
    //             }
    //         }
    //     )
    //     console.log({ workoutType, value });
    // }

    function onAddTrainingPlan(params) {
        // setJson(null)
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
        workoutLength: {
            type: "singleSelect",
            label: "Workout Length (Minutes)",
            default: 60,
            children: _.range(10, 91, 10).map((value) => ({ label: value, value }))
        },
        intensity: {
            type: 'singleSelect',
            label: 'Intensity',
            default: 'medium',
            children: [
                { label: "Very Low", value: 'veryLow' },
                { label: "Low", value: 'low' },
                { label: "Medium", value: 'medium' },
                { label: "High", value: 'high' },
                { label: "Very High", value: 'veryHigh' }
            ]
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
            validate: value => value.length < 4,
            type: 'multiSelect',
            label: 'Training Goals (3 Max)',
            default: [
                'muscleSize'
            ],
            options: {
                multiple: true,
            },
            children: [
                { label: 'Muscle Size (Hypertrophy)', value: 'muscleSize' },
                { label: 'Muscle Strength', value: 'muscleStrength' },
                { label: 'Power / Speed', value: 'power' },
                { label: 'Endurance', value: 'endurance' },
                { label: 'Weight Loss', value: 'weightLoss' },
                { label: 'General Health', value: 'generalHealth' },
            ],
        },
    }

    return (
        <>

            {/* <PromptDialog
                trainingPlanParams={trainingPlanParams}
                onAddTrainingPlan={onAddTrainingPlan}
                prompDialogOpen={prompDialogOpen}
                onClose={() => setPrompDialogOpen(false)}
            /> */}
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
                    Build Training Plan With AI
                </DialogTitle>

                <FormBuilder
                    formElements={formElements}
                    onChange={onFormChanged}
                />

                {
                    isError && <Alert severity="error">
                        Error building training plan with AI
                    </Alert>
                }

                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onBuildTrainingPlanInternal}
                        disabled={loading}
                    >
                        {loading && <CircularProgress size={20} />}
                        {!loading && 'Build Training Plan'}
                    </Button>
                </DialogActions>



            </Dialog >
        </>
    );




}