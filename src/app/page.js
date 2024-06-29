"use client"
import React, { useEffect } from "react";
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
import { Paper } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { RunExercise } from "./components/RunExercise";
import { AppContext } from "./AppContext";
import { localStorageAPI } from "./localStorageAPI";
import { TrainingPlans } from "./components/TrainingPlans";


function fixLocalStorage() {
  const { getData, saveData } = localStorageAPI()
  const exercises = getData('exercises')
  const workouts = getData('workouts')
  const trainingPlans = getData('trainingPlans')
  const numberOfWeeks = getData('numberOfWeeks') || 8
  console.log({
    exercises,
    workouts,
    trainingPlans,
    numberOfWeeks
  });
  if (!trainingPlans && exercises && workouts) {
    saveData('trainingPlans', [{
      exercises,
      workouts,
      name: 'Training Plan 1',
      numberOfWeeks,
    }
    ])
  }
  if (trainingPlans && trainingPlans.length > 0) {
    const updatedTraininPlans = trainingPlans.map((tp, index) => {
      if (!tp.id) {
        tp.id = `plan_${index + 1}`
      }
      return tp
    })
    saveData('trainingPlans', updatedTraininPlans)
  }
}
export default function Home() {

  fixLocalStorage()

  // const { getData } = localStorageAPI()
  // const exercises = getData('exercises')
  // const workouts = getData('workouts')

  // return <button onClick={() => {
  //   navigator.clipboard.writeText(JSON.stringify({ exercises, workouts }, null, 2))

  // }}>Copy local storage</button>




  const routeToComp = {
    'workouts': Workout,
    'training_plan': TrainingPlan,
    'training_plans': TrainingPlans,
    'edit_plan': EditPlan,
    'settings': Settings,
    'runExercise': RunExercise
  }

  const Comps = [
    { label: "Workouts", route: 'workouts', icon: <FitnessCenterIcon /> },
    { label: "Training Plans", route: 'training_plans', icon: <FormatListBulletedIcon /> },
    { label: "Edit Plan", route: 'edit_plan', icon: <NoteAddIcon /> },
    { label: "Settings", route: 'settings', icon: <SettingsIcon /> },
  ]
  const [route, setValue] = React.useState('workouts');

  function setInernalRoute(route, params) {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    url.search = '';
    url.searchParams.set("route", route);

    if (params) {
      for (const key in params) {
        url.searchParams.set(key, params[key]);
      }
    }

    history.pushState({}, '', url.toString());
    setValue(route);
  }

  function setRoute(newValue) {
    const route = Comps[newValue].route;
    setInernalRoute(route)
  }

  function getParams() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    const params = {};
    for (const key of url.searchParams.keys()) {
      params[key] = url.searchParams.get(key);
    }
    return params;
  }


  useEffect(() => {
    window.addEventListener('popstate', function (event) {
      const url = new URL(window.location)
      const routeParam = url.searchParams.get("route")
      if (routeParam) {
        setValue(routeParam);
      }
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    const routeParam = url.searchParams.get("route");
    if (routeParam) {
      return setValue(routeParam);
    } else {
      const isTrainingPlanExist = localStorageAPI().getData('trainingPlans').length > 0
      if (isTrainingPlanExist) {
        return setValue('workouts')
      } else {
        return setValue('training_plans')
      }
    }
  }, [route])

  const CompToRender = dynamic(() => Promise.resolve(routeToComp[route]), { ssr: false })




  return (
    <main className={styles.main}>
      <div>
        <AppContext.Provider value={{
          setRoute: setInernalRoute,
          params: getParams()
        }}>
          <CompToRender
          />
        </AppContext.Provider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60px',
        }}>
        </div>
      </div>


      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>

        <Box sx={{ minWidth: 380 }}>
          <BottomNavigation
            showLabels
            value={Comps.findIndex(({ route: r }) => r === route)}
            onChange={(event, newValue) => setRoute(newValue)}
          >
            {
              Comps.map(({ label, icon }, index) => (
                <BottomNavigationAction key={index} label={label} icon={icon} />
              ))
            }
          </BottomNavigation>
        </Box>


      </Paper>

    </main>
  );
}
