import { localStorageAPI } from "./localStorageAPI";

const staticExercisesList = [
    { name: "Wide Push-ups", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Push-ups", primaryMuscle: "Triceps", secondaryMuscles: ["Chest", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Lunges", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Deadlifts", gym: true, primaryMuscle: "Back", secondaryMuscles: ["Glutes", "Hamstrings"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Bench Press", gym: true, primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Pull-ups", primaryMuscle: "Back", secondaryMuscles: ["Biceps"], pullPush: "Pull", bodyWeight: true, category: "Upper body" },
    { name: "Sit-ups", primaryMuscle: "Core", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Mountain Climbers", primaryMuscle: "Core", secondaryMuscles: ["Shoulders"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Bicep Curls", gym: true, primaryMuscle: "Biceps", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Shoulder Press", gym: true, primaryMuscle: "Shoulders", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Shoulder Side raise", gym: true, primaryMuscle: "Shoulders", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Shoulder Front raise", gym: true, primaryMuscle: "Shoulders", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Tricep Dips", primaryMuscle: "Triceps", secondaryMuscles: [], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Jump Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Kettlebell Swings", gym: true, primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings", "Back"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Box Jumps", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings", "Calves"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Wall Sit", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes"], pullPush: null, bodyWeight: false, category: "Legs" },
    { name: "ATG Split Squats", primaryMuscle: "Quadriceps", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Legs", image: 'dumbbell_low_split_squat_(male).jpg' },
    { name: "Hip Extention", gym: true, primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Muscle Up", primaryMuscle: "Back", secondaryMuscles: ["Triceps", "Biceps"], pullPush: "Pull", bodyWeight: true, category: "Upper body" },
    { name: "Dips", primaryMuscle: "Triceps", secondaryMuscles: ["Chest", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Plank", primaryMuscle: "Core", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Core", static: true },
    { name: "Side Plank", primaryMuscle: "Core", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Core", static: true },
    { name: "Lat Pull-downs", gym: true, primaryMuscle: "Back", secondaryMuscles: ["Biceps"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Chin-ups", primaryMuscle: "Back", secondaryMuscles: ["Biceps"], pullPush: "Pull", bodyWeight: true, category: "Upper body" },
    { name: "Leg Press", gym: true, primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], pullPush: "Push", bodyWeight: false, category: "Legs", image: "lever_seated_horizontal_leg_press.jpg" },
    { name: "Single Leg Press", gym: true, primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], pullPush: "Push", bodyWeight: false, category: "Legs", image: "single_leg_press.jpg" },
    { name: "Cable Chest Fly", gym: true, primaryMuscle: "Chest", secondaryMuscles: ["Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Seated Row", gym: true, primaryMuscle: "Back", secondaryMuscles: ["Biceps"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Leg Curls", gym: true, primaryMuscle: "Hamstrings", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Leg Extensions", gym: true, primaryMuscle: "Quadriceps", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Face Pulls", gym: true, primaryMuscle: "Shoulders", secondaryMuscles: ["Back"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Calf Raises", primaryMuscle: "Calves", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Diamond Push-ups", primaryMuscle: "Triceps", secondaryMuscles: ["Chest", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Pistol Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Calves"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Handstand Push-ups", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps", "Core"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Glute Bridge", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Inverted Row", gym: true, primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Shoulders"], pullPush: "Pull", bodyWeight: true, category: "Upper body" },
    { name: "L-Sit", primaryMuscle: "Core", secondaryMuscles: ["Hip Flexors"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Archer Push-ups", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: true, category: "Upper body" },
    { name: "Single-leg Deadlift", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Core"], pullPush: "Pull", bodyWeight: true, category: "Legs" },
    { name: "Nordic Hamstring Curl", gym: true, primaryMuscle: "Hamstrings", secondaryMuscles: [], pullPush: "Pull", bodyWeight: true, category: "Legs" },
    { name: "Bulgarian split squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Single leg Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Calves"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Thrusters", gym: true, primaryMuscle: "Quadriceps", secondaryMuscles: ["Shoulders", "Glutes", "Hamstrings"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Hip Thrust", gym: true, primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Romanian Deadlift", gym: true, primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Back"], pullPush: "Pull", bodyWeight: false, category: "Legs" },
    { name: "Incline Bench Press", gym: true, primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Farmer Carry", gym: true, primaryMuscle: "Forearms", secondaryMuscles: ["Core", "Shoulders"], pullPush: null, bodyWeight: false, category: "Core" },
    { name: "Dragon Flies", primaryMuscle: "Core", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Cable biceps curls", gym: true, primaryMuscle: "Biceps", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Russian Twists", primaryMuscle: "Core", secondaryMuscles: ["Obliques"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Hammer Curls", gym: true, primaryMuscle: "Biceps", secondaryMuscles: [], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Step-ups", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Reverse Lunges", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: true, category: "Legs" },
    { name: "Flutter Kicks", primaryMuscle: "Core", secondaryMuscles: ["Hip Flexors"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Chest Press Machine", gym: true, primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Lat Pulldown Machine", gym: true, primaryMuscle: "Back", secondaryMuscles: ["Biceps"], pullPush: "Pull", bodyWeight: false, category: "Upper body" },
    { name: "Side Crunch", primaryMuscle: "Core", secondaryMuscles: ["Obliques"], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Running", primaryMuscle: "Cardio", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Cardio" },
    { name: "Crunches", primaryMuscle: "Core", secondaryMuscles: [], pullPush: null, bodyWeight: true, category: "Core" },
    { name: "Rowing Machine", gym: true, primaryMuscle: "Cardio", secondaryMuscles: [], pullPush: null, bodyWeight: false, category: "Cardio" },
    { name: "Inner Thigh Extensions", primaryMuscle: "Thighs", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Cable Kickbacks", gym: true, primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Goblet Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Front Squats", gym: true, primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Sumo Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes", "Adductors"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Cossack Squats", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hamstrings", "Glutes", "Adductors"], pullPush: "Push", bodyWeight: false, category: "Legs" },
    { name: "Dumbbell Bench Press", gym: true, primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Shoulders"], pullPush: "Push", bodyWeight: false, category: "Upper body" },
    { name: "Lateral Raises", gym: true, primaryMuscle: "Shoulders", secondaryMuscles: [], pullPush: "Push", bodyWeight: false, category: "Upper body" },
];

const { getData } = localStorageAPI()
export const getLocalExercises = () => getData("exercisesList") || []

export const exercisesList = [
    ...staticExercisesList,
    ...getLocalExercises()
]

export const getExercisesList = () => {
    const exercisesListFromLocalStorage = getLocalExercises()
    return [
        ...staticExercisesList,
        ...exercisesListFromLocalStorage
    ]
}
export const getImageUrl = (name) => {
    const item = exercisesList.find(item => item.name === name)
    if (!item?.image) {
        return null
    }
    return `/images/${item.image}`
}