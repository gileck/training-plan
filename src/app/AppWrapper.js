// "use client"
// import React, { useEffect, useState } from "react";
// import styles from "../app/page.module.css";
// import { AppTabs } from './tabs.js';
// import { EditPlan } from './components/EditPlan.js';
// import dynamic from 'next/dynamic'
// import { TrainingPlan } from "./components/TrainingPlan.js";
// import { Settings } from "./components/Settings.js";
// import { Workout } from "./components/Workout.js";
// import Box from '@mui/material/Box';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import { Alert, Drawer, IconButton, List, Paper, Snackbar } from "@mui/material";
// import SettingsIcon from '@mui/icons-material/Settings';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
// import { FitnessCenter as FitnessCenterIcon } from '@mui/icons-material';
// import NoteAddIcon from '@mui/icons-material/NoteAdd';
// import { RunExercise } from "./components/RunExercise.js";
// import { AppContext } from "./AppContext.js";
// import { localStorageAPI } from "./localStorageAPI.js";
// import { TrainingPlans } from "./components/TrainingPlans.js";
// import { Menu } from "./components/Menu.js";
// import ResponsiveAppBar from "./components/AppBar.js";
// import { Users } from "./components/Users.js";
// import { User } from "./components/User.js";
// import { DataContext, DataProvider } from "./DataProvider";
// import { useRouter } from 'next/router'


// function fixLocalStorage() {
//   const { getData, saveData } = localStorageAPI()
//   const exercises = getData('exercises')
//   const workouts = getData('workouts')
//   const trainingPlans = getData('trainingPlans')
//   const numberOfWeeks = getData('numberOfWeeks') || 8
//   console.log({
//     exercises,
//     workouts,
//     trainingPlans,
//     numberOfWeeks
//   });
//   if (!trainingPlans && exercises && workouts) {
//     saveData('trainingPlans', [{
//       exercises,
//       workouts,
//       name: 'Training Plan 1',
//       numberOfWeeks,
//     }
//     ])
//   }
//   if (trainingPlans && trainingPlans.length > 0) {
//     const updatedTraininPlans = trainingPlans.map((tp, index) => {
//       if (!tp.id) {
//         tp.id = `plan_${index + 1}`
//       }
//       return tp
//     })
//     saveData('trainingPlans', updatedTraininPlans)
//   }
// }

// function useAlert() {
//   const [isAlertOpen, setIsAlertOpen] = React.useState(false)
//   const [alertMessage, setAlertMessage] = React.useState('')
//   return {
//     isAlertOpen,
//     setIsAlertOpen,
//     alertMessage,
//     setAlertMessage

//   }
// }

// function AppProvider({ children, setRoute, params }) {
//   const { user, trainingPlans } = React.useContext(DataContext)
//   const [trainingPlansState, setTrainingPlans] = useState(trainingPlans || []);


//   const alert = useAlert()
//   const contextValue = {
//     user,
//     trainingPlans: trainingPlansState,
//     setTrainingPlans,
//     params,
//     setRoute,
//     isAlertOpen: alert.isAlertOpen,
//     alertMessage: alert.alertMessage,
//     setIsAlertOpen: alert.setIsAlertOpen,
//     openAlert: message => {
//       alert.setAlertMessage(message)
//       alert.setIsAlertOpen(true)
//     }
//   }
//   return <AppContext.Provider value={contextValue}>
//     {children}
//   </AppContext.Provider>
// }


// function FloaingAlert() {
//   const { isAlertOpen, setIsAlertOpen, alertMessage } = React.useContext(AppContext)

//   console.log({ isAlertOpen });

//   return <Snackbar
//     open={isAlertOpen}
//     autoHideDuration={6000}
//     onClose={() => setIsAlertOpen(false)}

//   >
//     <Alert
//       onClose={() => setIsAlertOpen(false)}
//       severity="success"
//       variant="filled"
//       sx={{ width: '100%' }}
//     >
//       {alertMessage}
//     </Alert>
//   </Snackbar>

// }
// export function AppWrapper({ children }) {
//   const router = useRouter()

//   const [menuOpen, setMenuOpen] = React.useState(false)
//   const toggleDrawer = () => {
//     setMenuOpen(!menuOpen)
//   }


//   const Comps = [
//     { label: "Workouts", route: 'workouts', icon: <FitnessCenterIcon /> },
//     { label: "Training Plans", route: 'plans', icon: <FormatListBulletedIcon /> },
//     { label: "Edit Plan", route: 'edit_plan', icon: <NoteAddIcon /> },
//     { label: "Settings", route: 'settings', icon: <SettingsIcon /> },

//   ]
//   const [route, setValue] = React.useState('workouts');

//   function setInernalRoute(route, params) {
//     if (typeof window === 'undefined') return;
//     const url = new URL(window.location);
//     url.search = '';
//     url.searchParams.set("route", route);

//     if (params) {
//       for (const key in params) {
//         url.searchParams.set(key, params[key]);
//       }
//     }

//     history.pushState({}, '', url.toString());
//     setValue(route);
//   }

//   function setRoute(newValue) {
//     const route = Comps[newValue].route;
//     // router.push(`/${route}`)
//     setInernalRoute(route)
//   }

//   function getParams() {
//     if (typeof window === 'undefined') return;
//     const url = new URL(window.location);
//     const params = {};
//     for (const key of url.searchParams.keys()) {
//       params[key] = url.searchParams.get(key);
//     }
//     return params;
//   }


//   useEffect(() => {
//     window.addEventListener('popstate', function (event) {
//       const url = new URL(window.location)
//       const routeParam = url.searchParams.get("route")
//       if (routeParam) {
//         setValue(routeParam);
//       }
//     })
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const url = new URL(window.location);
//     const routeParam = url.searchParams.get("route");
//     if (routeParam) {
//       return setValue(routeParam);
//     } else {
//       // const trainingPlans = localStorageAPI().getData('trainingPlans')
//       // const isTrainingPlanExist = trainingPlans && trainingPlans.length > 0
//       // if (isTrainingPlanExist) {
//       //   return setValue('workouts')
//       // } else {
//       //   return setValue('training_plans')
//       // }
//     }
//   }, [route])

//   // const CompToRender = dynamic(() => Promise.resolve(routeToComp[route]), { ssr: false })




//   return (
//     <main className={styles.main}>
//       <DataProvider>
//         <AppProvider
//           setRoute={setInernalRoute}
//           params={getParams()}
//         >
//           <div>

//             <ResponsiveAppBar
//               toggleDrawer={toggleDrawer}
//             />

//             {children}


//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '60px',
//             }}>
//             </div>
//           </div>


//           <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>

//             <Box sx={{ minWidth: 380 }}>
//               <BottomNavigation
//                 showLabels
//                 value={Comps.findIndex(({ route: r }) => r === route)}
//                 onChange={(event, newValue) => setRoute(newValue)}
//               >
//                 {
//                   Comps.map(({ label, icon }, index) => (
//                     <BottomNavigationAction
//                       sx={{
//                         padding: '0px'
//                       }}
//                       key={index} label={label} icon={icon} />
//                   ))
//                 }
//               </BottomNavigation>
//             </Box>


//           </Paper>

//           <FloaingAlert />
//           <Menu onRouteChanged={setInernalRoute} menuOpen={menuOpen} toggleDrawer={toggleDrawer} />

//         </AppProvider>
//       </DataProvider>


//     </main >
//   );
// }


