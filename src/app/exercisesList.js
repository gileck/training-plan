import { localStorageAPI } from "./localStorageAPI";

const images = {
    "Wide Push-ups": "wide_hand_push_up.jpg",
    "Push-ups": "clap_push_up.jpg",
    "Squats": "kettlebell_goblet_squat_mobility.jpg",
    "Lunges": "dumbbell_lunge.jpg",
    "Deadlifts": "barbell_clean_deadlift.jpg",
    "Bench Press": "bench_press.jpg",
    "Pull-ups": "archer_pull_up.jpg",
    "Sit-ups": "janda_sit_up.jpg",
    "Mountain Climbers": "mountain_climber.jpg",
    "Bicep Curls": "dumbbell_drag_bicep_curl.jpg",
    "Shoulder Press": "dumbbell_alternate_shoulder_press.jpg",
    "Shoulder Side raise": "dumbbell_lateral_raise.jpg",
    "Shoulder Front raise": "dumbbell_standing_front_raise_above_head.jpg",
    "Tricep Dips": "chest_dip.jpg",
    "Jump Squats": "double_jump_squat.jpg",
    "Kettlebell Swings": "kettlebell_swing.jpg",
    "Box Jumps": "jump_on_fit-box.jpg",
    "Wall Sit": "dumbbell_wall_squat.jpg",
    "ATG Split Squats": "split_squats.jpg",
    "Hip Extention": "cable_standing_hip_extension.jpg",
    "Muscle Up": "archer_pull_up.jpg",
    "Dips": "elbow_dips.jpg",
    "Plank": "plank_jack.jpg",
    "Side Plank": "side_plank_leg_lift.jpg",
    "Lat Pull-downs": "cable_wide-grip_lat_pulldown.jpg",
    "Chin-ups": "chin-up.jpg",
    "Leg Press": "lever_seated_leg_press.jpg",
    "Single Leg Press": "lever_horizontal_one_leg_press.jpg",
    "Cable Chest Fly": "cable_standing_fly.jpg",
    "Seated Row": "cable_low_seated_row.jpg",
    "Leg Curls": "lever_seated_leg_curl.jpg",
    "Leg Extensions": "lever_one_leg_extension.jpg",
    "Face Pulls": "cable_standing_supinated_face_pull_(with_rope).jpg",
    "Calf Raises": "standing_calf_raise.jpg",
    "Diamond Push-ups": "diamond_push_up.jpg",
    "Pistol Squats": "kettlebell_pistol_squat.jpg",
    "Handstand Push-ups": "handstand_push-up.jpg",
    "Glute Bridge": "glute_bridge_two_legs_on_floor.jpg",
    "Inverted Row": "inverted_row_with_bed_sheet.jpg",
    "L-Sit": "l-sit_on_floor.jpg",
    "Archer Push-ups": "incline_close-grip_push-up.jpg",
    "Single-leg Deadlift": "kettlebell_kickstand_one_leg_deadlift.jpg",
    "Nordic Hamstring Curl": "bodyweight_lying_legs_curl_(male).jpg",
    "Bulgarian split squats": "smith_split_squat.jpg",
    "Bulgarian split squat": "smith_split_squat.jpg",
    "Single leg Squats": "single_leg_squat.jpg",
    "Thrusters": "dumbbell_swing.jpg",
    "Hip Thrust": "barbell_staggered_stance_hip_thrust.jpg",
    "Romanian Deadlift": "barbell_romanian_deadlift.jpg",
    "Incline Bench Press": "incline_bench_press.jpg",
    "Farmer Carry": "kettlebell_farmers_carry.jpg",
    "Dragon Flies": "weighted_muscle_up.jpg",
    "Cable biceps curls": "cable_curl.jpg",
    "Bicep curls": "biceps_curl.jpg",
    "Russian Twists": "russian_twist.jpg",
    "Hammer Curls": "dumbbell_seated_alternate_shoulder.jpg",
    "Step-ups": "jump_step-up.jpg",
    "Reverse Lunges": "warming-up_in_lunge.jpg",
    "Flutter Kicks": "prisoner_half_sit-up.jpg",
    "Chest Press Machine": "lever_incline_chest_press.jpg",
    "Lat Pulldown Machine": "cable_reverse_grip_pulldown.jpg",
    "Side Crunch": "bottle_weighted_side_bend_(female).jpg",
    "Running": "stationary_bike_run.jpg",
    "Crunches": "crunch_floor.jpg",
    "Rowing Machine": "cable_seated_row_with_v_bar.jpg",
    "Inner Thigh Extensions": "lever_seated_hip_adduction.jpg",
    "Cable Kickbacks": "cable_kneeling_glute_kickback_(female).jpg",
    "Goblet Squats": "dumbbell_goblet_squat.jpg",
    "Front Squats": "smith_front_squat.jpg",
    "Sumo Squats": "sitting_sumo_right_twist_stretch.jpg",
    "Cossack Squats": "smith_split_squat.jpg",
    "Dumbbell Bench Press": "dumbbell_one_arm_bench_fly.jpg",
    "Lateral Raises": "dumbbell_partials_lateral_raise.jpg",
    "Snatch": "dumbbell_one_arm_snatch.jpg",
    "Bulgarian Split Squats": "dumbbell_bulgarian_split_squat.jpg",
    "Abs": "elbow_to_knee_side_plank_crunch.jpg",
    "Walking": "walking_on_treadmill.jpg",
    "Side kicks": "squat_side_kick.jpg",
    "Bent over & reverse fly": "suspension_reverse_fly.jpg",
    "Squat in smith": "smith_squat_to_bench.jpg",
    "Hip extensions with machine": "cable_standing_hip_extension.jpg",
    "Inner Thigh extensions in machine": "lever_seated_hip_adduction.jpg",
    "Cable kickbacks": "cable_kickback.jpg",
    "Cossack squat": "cossack_squats.jpg",
    "Single leg Hip-Thrust": "single_leg_hip_thrust_(version_2)_(female).jpg",
    "Head stand": "handstand_hold_on_wall_(female).jpg",
    "Half Burpees": "burpee.jpg",
    "Half Burpees ": "burpee.jpg",
    "Jump lunges": "bodyweight_forward_lunge_(hinge_at_hips).jpg",
    "Scapular pull ups": "rocky_pull_up_pulldown.jpg",
    "Cable Triceps Pushdowns": "cable_triceps_pushdown.jpg",
    "Back Extension": "lever_back_extension.jpg",
    "Back Extension (Roman Chair)": "lever_back_extension.jpg",
}

export const getStaticImageUrl = (name) => {
    const item = images[name]
    if (item) {
        return `/images/${item}`
    }
    return `images/${name.toLowerCase().replace(/ /g, '_')}.jpg`
}

const staticExercisesList = [{
    "name": "Wide Push-ups",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "wide_hand_push_up.jpg"
},
{
    "name": "Push-ups",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "clap_push_up.jpg"
},
{
    "name": "Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "kettlebell_goblet_squat_mobility.jpg"
},
{
    "name": "Lunges",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_lunge.jpg"
},
{
    "name": "Deadlifts",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_clean_deadlift.jpg"
},
{
    "name": "Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "bench_press.jpg"
},
{
    "name": "Pull-ups",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "archer_pull_up.jpg"
},
{
    "name": "Sit-ups",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "janda_sit_up.jpg"
},
{
    "name": "Mountain Climbers",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Shoulders"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "mountain_climber.jpg"
},
{
    "name": "Bicep Curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_drag_bicep_curl.jpg"
},
{
    "name": "Shoulder Press",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_alternate_shoulder_press.jpg"
},
{
    "name": "Shoulder Side raise",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_lateral_raise.jpg"
},
{
    "name": "Shoulder Front raise",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_standing_front_raise_above_head.jpg"
},
{
    "name": "Tricep Dips",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "chest_dip.jpg"
},
{
    "name": "Jump Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "double_jump_squat.jpg"
},
{
    "name": "Kettlebell Swings",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "kettlebell_swing.jpg"
},
{
    "name": "Box Jumps",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "jump_on_fit-box.jpg"
},
{
    "name": "Wall Sit",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes"
    ],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_wall_squat.jpg"
},
{
    "name": "ATG Split Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "split_squats.jpg"
},
{
    "name": "Hip Extention",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "cable_standing_hip_extension.jpg"
},
{
    "name": "Muscle Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Triceps",
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "archer_pull_up.jpg"
},
{
    "name": "Dips",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "elbow_dips.jpg"
},
{
    "name": "Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "static": true,
    "image": "plank_jack.jpg"
},
{
    "name": "Side Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "static": true,
    "image": "side_plank_leg_lift.jpg"
},
{
    "name": "Lat Pull-downs",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_wide-grip_lat_pulldown.jpg"
},
{
    "name": "Chin-ups",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "chin-up.jpg"
},
{
    "name": "Leg Press",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_leg_press.jpg"
},
{
    "name": "Single Leg Press",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_horizontal_one_leg_press.jpg"
},
{
    "name": "Cable Chest Fly",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_standing_fly.jpg"
},
{
    "name": "Seated Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_low_seated_row.jpg"
},
{
    "name": "Leg Curls",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_leg_curl.jpg"
},
{
    "name": "Leg Extensions",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_one_leg_extension.jpg"
},
{
    "name": "Face Pulls",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_standing_supinated_face_pull_(with_rope).jpg"
},
{
    "name": "Calf Raises",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "standing_calf_raise.jpg"
},
{
    "name": "Diamond Push-ups",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "diamond_push_up.jpg"
},
{
    "name": "Pistol Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "kettlebell_pistol_squat.jpg"
},
{
    "name": "Handstand Push-ups",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
        "Triceps",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "handstand_push-up.jpg"
},
{
    "name": "Glute Bridge",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "glute_bridge_two_legs_on_floor.jpg"
},
{
    "name": "Inverted Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps",
        "Shoulders"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "inverted_row_with_bed_sheet.jpg"
},
{
    "name": "L-Sit",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Hip Flexors"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "l-sit_on_floor.jpg"
},
{
    "name": "Archer Push-ups",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "incline_close-grip_push-up.jpg"
},
{
    "name": "Single-leg Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
        "Glutes",
        "Core"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Legs",
    "image": "kettlebell_kickstand_one_leg_deadlift.jpg"
},
{
    "name": "Nordic Hamstring Curl",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Legs",
    "image": "bodyweight_lying_legs_curl_(male).jpg"
},
{
    "name": "Bulgarian split squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "smith_split_squat.jpg"
},
{
    "name": "Single leg Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "single_leg_squat.jpg"
},
{
    "name": "Thrusters",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Shoulders",
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_swing.jpg"
},
{
    "name": "Hip Thrust",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_staggered_stance_hip_thrust.jpg"
},
{
    "name": "Romanian Deadlift",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
        "Glutes",
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_romanian_deadlift.jpg"
},
{
    "name": "Incline Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "incline_bench_press.jpg"
},
{
    "name": "Farmer Carry",
    "gym": true,
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [
        "Core",
        "Shoulders"
    ],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Core",
    "image": "kettlebell_farmers_carry.jpg"
},
{
    "name": "Dragon Flies",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "weighted_muscle_up.jpg"
},
{
    "name": "Cable biceps curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_curl.jpg"
},
{
    "name": "Russian Twists",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Obliques"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "russian_twist.jpg"
},
{
    "name": "Hammer Curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_seated_alternate_shoulder.jpg"
},
{
    "name": "Step-ups",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "jump_step-up.jpg"
},
{
    "name": "Reverse Lunges",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "warming-up_in_lunge.jpg"
},
{
    "name": "Flutter Kicks",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Hip Flexors"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "prisoner_half_sit-up.jpg"
},
{
    "name": "Chest Press Machine",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "lever_incline_chest_press.jpg"
},
{
    "name": "Lat Pulldown Machine",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_reverse_grip_pulldown.jpg"
},
{
    "name": "Side Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Obliques"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "bottle_weighted_side_bend_(female).jpg"
},
{
    "name": "Running",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Cardio",
    "image": "stationary_bike_run.jpg"
},
{
    "name": "Crunches",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "crunch_floor.jpg"
},
{
    "name": "Rowing Machine",
    "gym": true,
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Cardio",
    "image": "cable_seated_row_with_v_bar.jpg"
},
{
    "name": "Inner Thigh Extensions",
    "primaryMuscle": "Thighs",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_hip_adduction.jpg"
},
{
    "name": "Cable Kickbacks",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "cable_kneeling_glute_kickback_(female).jpg"
},
{
    "name": "Goblet Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_goblet_squat.jpg"
},
{
    "name": "Front Squats",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "smith_front_squat.jpg"
},
{
    "name": "Sumo Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes",
        "Adductors"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "sitting_sumo_right_twist_stretch.jpg"
},
{
    "name": "Cossack Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes",
        "Adductors"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "smith_split_squat.jpg"
},
{
    "name": "Dumbbell Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_one_arm_bench_fly.jpg"
},
{
    "name": "Lateral Raises",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_partials_lateral_raise.jpg"
},
{
    "name": "Cable Triceps Pushdowns",
    "gym": true,
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_triceps_pushdown.jpg"
},
{
    "name": "Back Extension",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "lever_back_extension.jpg"
},
{
    "name": "Bent Over Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body"
}
]

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