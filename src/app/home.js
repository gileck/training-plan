"use client"
import React, { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { AppTabs } from './tabs.js';
import { EditPlan } from './components/EditPlan.js';
import dynamic from 'next/dynamic'
import { TrainingPlan } from "./components/TrainingPlan.js";
import { Settings } from "./components/Settings.js";
import { Workout } from "./components/Workout.js";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Alert, Button, IconButton, Paper, Snackbar, ThemeProvider } from "@mui/material";
import { Cancel, CheckCircle, People, Settings as SettingsIcon } from '@mui/icons-material';
import { FormatListBulleted as FormatListBulletedIcon } from '@mui/icons-material';
import { FitnessCenter as FitnessCenterIcon } from '@mui/icons-material';
import { NoteAdd as NoteAddIcon } from '@mui/icons-material';
import { RunExercise } from "./components/RunExercise.js";
import { AppContext } from "./AppContext.js";
import { localStorageAPI } from "./localStorageAPI.js";
import { TrainingPlans } from "./components/TrainingPlans.js";
import { Menu } from "./components/Menu";
import ResponsiveAppBar from "./components/AppBar";
import { Users } from "./components/Users";
import { User } from "./components/User";
import { AskAI } from "./components/askAI";
import { Profile } from "./profile";
import theme from "./theme";
import { Activity } from "./components/Activity";
import { AppProvider } from "./AppProvider";
import { PersonalCoachAI } from "./components/PersonalCoachAI";



function QuestionBox() {
  const { questionBox: { setIsQuestionBoxOpen, isQuestionBoxOpen, questionBoxMessage, onQuestionBoxAnswer } } = React.useContext(AppContext)
  return <Snackbar
    open={isQuestionBoxOpen}
    onClose={() => setIsQuestionBoxOpen(false)}
  >
    <Alert
      onClose={() => setIsQuestionBoxOpen(false)}
      severity="info"
      sx={{ width: '100%' }}
      action={
        <>
          <IconButton onClick={() => onQuestionBoxAnswer(true)}>
            <CheckCircle />
          </IconButton>
          <IconButton onClick={() => onQuestionBoxAnswer(false)}>
            <Cancel />
          </IconButton>

        </>
      }
    >
      {questionBoxMessage}
    </Alert>
  </Snackbar >
}
function FloaingAlert() {
  const { isErrorAlertOpen, isAlertOpen, closeAlert, alertMessage } = React.useContext(AppContext)

  return <Snackbar
    open={isAlertOpen || isErrorAlertOpen}
    autoHideDuration={6000}
    onClose={() => closeAlert(false)}

  >
    <Alert
      onClose={() => closeAlert(false)}
      severity={isErrorAlertOpen ? 'error' : 'success'}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {alertMessage}
    </Alert>
  </Snackbar>

}
export function Home({ user }) {
  // console.log({ user });
  const [menuOpen, setMenuOpen] = React.useState(false)
  const toggleDrawer = () => {
    setMenuOpen(!menuOpen)
  }

  const routeToComp = {
    'workouts': Workout,
    'training_plan': TrainingPlan,
    'training_plans': TrainingPlans,
    'edit_plan': EditPlan,
    'settings': Settings,
    'runExercise': RunExercise,
    'users': Users,
    'user': User,
    'askAI': AskAI,
    'profile': Profile,
    'activity': Activity,
    'progress': Activity,
    'coachAI': PersonalCoachAI
  }

  const getComponent = (route) => {
    return routeToComp[route] || Workout
  }


  const Comps = [
    { label: "Workouts", route: 'workouts', icon: <FitnessCenterIcon /> },
    { label: "Training Plans", route: 'training_plans', icon: <FormatListBulletedIcon /> },
    { label: "Edit Plan", route: 'edit_plan', icon: <NoteAddIcon /> },
    { label: "Users", route: 'users', icon: <People /> },
    // { label: "Settings", route: 'settings', icon: <SettingsIcon /> },

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
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('/service-worker.js')
      // .then(reg => console.log('Service Worker registered:', reg))
      // .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);


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
      return setValue('workouts')

      // const trainingPlans = localStorageAPI().getData('trainingPlans')
      // const isTrainingPlanExist = trainingPlans && trainingPlans.length > 0
      // if (isTrainingPlanExist) {
      //   return setValue('workouts')
      // } else {
      //   return setValue('training_plans')
      // }
    }
  }, [route])

  // const CompToRender = dynamic(() => Promise.resolve(getComponent(route)), { ssr: false })
  const CompToRender = getComponent(route)



  return (<main className={styles.main}>

    <ThemeProvider theme={theme}>

      <AppProvider
        setRoute={setInernalRoute}
        params={getParams()}
        user={user}
      >
        <div>
          <ResponsiveAppBar
            toggleDrawer={toggleDrawer}
          />
          <CompToRender />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60px',
          }}>
          </div>
        </div>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Box sx={{
            minWidth: 380,
            marginBottom: '10px',
          }}>
            <BottomNavigation
              showLabels
              value={Comps.findIndex(({ route: r }) => r === route)}
              onChange={(event, newValue) => setRoute(newValue)}
              sx={{
                backgroundColor: theme.colors.footer,
                // color: 'white'
              }}
            >
              {
                Comps.map(({ label, icon }, index) => (
                  <BottomNavigationAction
                    sx={{
                      padding: '0px',
                      // color: 'white'
                    }}
                    key={index} label={label} icon={icon} />
                ))
              }
            </BottomNavigation>
          </Box>
        </Paper>
        <QuestionBox />
        <FloaingAlert />
        <Menu onRouteChanged={setInernalRoute} menuOpen={menuOpen} toggleDrawer={toggleDrawer} />
      </AppProvider>
    </ThemeProvider >
  </main >
  );
}


