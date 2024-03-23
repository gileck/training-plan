"use client"
import React from "react";
import styles from "./page.module.css";
import { Card, Collapse, } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';
import { AppTabs } from './tabs.js';
import { EditPlan } from './components/EditPlan.js';
import { AddExercise } from "./components/addExercise";
import { Add } from "@mui/icons-material";
import dynamic from 'next/dynamic'
import { TrainingPlan } from "./components/TrainingPlan";
import _ from 'lodash'
import { localStorageAPI } from "./localStorageAPI";

const { getData, saveData, removeData } = localStorageAPI();

export default function Home() {
  const ClientTabs = dynamic(() => Promise.resolve(AppTabs), { ssr: false })

  return (
    <main className={styles.main}>
      <ClientTabs
        List1={<TrainingPlan />}
        List2={<EditPlan />}
      />

    </main>
  );
}

