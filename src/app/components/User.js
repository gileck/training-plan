import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import {Person as PersonIcon} from '@mui/icons-material';
import { Divider } from '@mui/material';
import { AppContext } from '../AppContext';
import { TrainingPlansList } from './TrainingPlans';
import { useExercisesAPI } from '../exercisesAPI';
export function User() {
    const { createTrainingPlanActions } = useExercisesAPI()
    const { params: { username } } = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        Promise.all([
            fetch('/api/userData?username=' + username).then(res => res.json()),
            fetch('/api/trainingPlans?username=' + username).then(res => res.json())
        ])
            .then(([{ user }, { plans }]) => {
                setData({
                    user,
                    trainingPlans: plans
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            })
    }, [])
    if (loading) return <></>

    if (error) return <div>Error: {error.message}</div>
    return (
        <div>
            <h1>{data.user.name}</h1>
            <TrainingPlansList
                trainingPlans={data.trainingPlans}
                currentTrainingPlan={null}
                createTrainingPlanActions={createTrainingPlanActions}
                trainingPlansOpen={() => { }}
                onTrainingPlanMenuOpenClicked={() => { }}
                toggleTrainingPlan={() => { }}
                selectTrainingPlanClicked={() => { }}
            />
        </div>
    )
}

