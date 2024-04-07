"use client"
import React from "react";
import styles from "./page.module.css";
import { AppTabs } from './tabs.js';
import { EditPlan } from './components/EditPlan.js';
import dynamic from 'next/dynamic'
import { TrainingPlan } from "./components/TrainingPlan";
import { Settings } from "./components/Settings";
import { Workout } from "./components/Workout";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Paper} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
export default function Home() {


    const [value, setValue] = React.useState(2);
    console.log({value})

    const Comps = [
        { label: "Workout", Comp: Workout, icon: <FitnessCenterIcon /> },
        { label: "Training Plan", Comp: TrainingPlan , icon: <FormatListBulletedIcon />  },
        { label: "Edit Plan", Comp: EditPlan, icon: <NoteAddIcon />  },
        { label: "Settings", Comp: Settings , icon: <SettingsIcon />  },
    ]

    const CompToRender = dynamic(() => Promise.resolve(Comps[value].Comp), { ssr: false })

  return (
    <main className={styles.main}>
        <div>
            <CompToRender />
        </div>


        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <SimpleBottomNavigation
                onChange={(event, newValue) => setValue(newValue)}
                Comps={Comps}
                value={value}
            />
        </Paper>

    </main>
  );
}

 function SimpleBottomNavigation({ Comps, onChange, value }) {

    return (
        <Box sx={{ minWidth: 380 }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={onChange}
            >
                {
                    Comps.map(({ label, icon }, index) => (
                        <BottomNavigationAction label={label} icon={icon || <SettingsIcon/> } />
                    ))
                }
            </BottomNavigation>
        </Box>
    );
}