import { AppProvider } from "@/app/AppProvider";
import { AddCustomExercise } from "@/app/components/SelectExercise";
import { useFetch } from "@/useFetch";
import { Box, Dialog, DialogTitle, DialogContent, TextField, Select, FormGroup, FormControl, MenuItem, InputLabel, Checkbox, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function SelectExercise() {
    const [selectedExercise, setSelectedExercise] = useState(null)
    console.log({ selectedExercise })
    if (selectedExercise) {
        Object.assign(selectedExercise, {
            primaryMuscle: selectedExercise.primaryMuscle || (selectedExercise.bodyPart && selectedExercise.bodyPart[0]),
            secondaryMuscles: selectedExercise.secondaryMuscles || (selectedExercise.bodyPart && (selectedExercise.bodyPart || []).slice(1)) || [],
        })
    }
    const { data: muscleGroups } = useFetch('/api/exercises/muscleGroups?a=1')
    const categories = ['Upper body', 'Lower body', 'Full body', 'Abs', 'Cardio']
    // console.log(muscleGroups)
    const onExerciseSelected = (exercise) => {
        setSelectedExercise(exercise)
    }
    const handleCategoryChange = (event) => {
        setSelectedExercise({ ...selectedExercise, category: event.target.value })
    }
    const handlePrimaryMuscleChange = (event) => {
        setSelectedExercise({ ...selectedExercise, primaryMuscle: event.target.value })
    }
    const handleSecondaryMuscleChange = (event) => {
        setSelectedExercise({ ...selectedExercise, secondaryMuscle: event.target.value })
    }
    const handleSave = () => {
        console.log({ selectedExercise })
        fetch('/api/exercises/addExercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                exercise: selectedExercise
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            setSelectedExercise(null)

        })
    }
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        setSelectedExercise({ ...selectedExercise, imageData: file })
    }

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedExercise({ ...selectedExercise, imageData: reader.result });
                }
                reader.readAsDataURL(file);
                // setSelectedExercise({ ...selectedExercise, imageData: file });
                break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener('paste', e => handlePaste(e));
        return () => {
            window.removeEventListener('paste', e => handlePaste(e));
        };
    }, [selectedExercise]);
    return <AppProvider>
        <Box>
            <AddCustomExercise
                onExerciseSelected={onExerciseSelected}
            />
            {
                selectedExercise && <Dialog open={true} onClose={() => setSelectedExercise(null)}>
                    <DialogTitle>
                        {selectedExercise.name}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                height={150}
                                width={150}
                                src={!selectedExercise.image.includes("https") ? `/images/${selectedExercise.image}` : selectedExercise.image} />
                            {/*  src={selectedExercise.imageData || selectedExercise.image} alt={selectedExercise.name} /> */}
                        </Box>

                        <FormGroup
                            sx={{
                                padding: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                        >
                            <TextField
                                label="Exercise Name"
                                value={selectedExercise.name}
                                onChange={(e) => setSelectedExercise({ ...selectedExercise, name: e.target.value })}
                            />
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedExercise.category}
                                    label="Category"
                                    onChange={handleCategoryChange}
                                >
                                    {
                                        categories.map(category => (
                                            <MenuItem value={category}>{category}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Primary Muscle</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedExercise.primaryMuscle || selectedExercise.bodyPart?.[0]}
                                    label="Primary Muscle"
                                    onChange={handlePrimaryMuscleChange}
                                    renderValue={(selected) => selected}
                                >
                                    {
                                        muscleGroups.map(muscleGroup => (
                                            <MenuItem value={muscleGroup}>
                                                <Checkbox checked={selectedExercise.primaryMuscle === muscleGroup} />
                                                {muscleGroup}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Secondary Muscle</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedExercise.secondaryMuscles}
                                    label="Secondary Muscle"
                                    onChange={handleSecondaryMuscleChange}
                                    multiple
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {
                                        muscleGroups.map(muscleGroup => (
                                            <MenuItem value={muscleGroup}>
                                                <Checkbox checked={selectedExercise.secondaryMuscles.includes(muscleGroup)} />
                                                {muscleGroup}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                </Button>

                            </FormControl>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSave}>Save</Button>
                        <Button onClick={() => setSelectedExercise(null)}>Cancel</Button>
                    </DialogActions>

                </Dialog>
            }
        </Box>
    </AppProvider>
}
