import { Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import _ from 'lodash'
import { AppContext } from "../AppContext";
import { useFetch } from "@/useFetch";
import Link from 'next/link';

function calculateRecoveryScore(volumes) {
    // Normalize volumes to a 0-1 scale
    // const maxVolume = Math.max(...volumes);
    const maxVolume = 30
    const normalizedVolumes = volumes.map(v => v / maxVolume);

    // console.log({ normalizedVolumes });

    // Assign weights (more recent days have higher weights)
    // const weights = [0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0];

    const weights = Array.from({ length: volumes.length }, (_, index) => (index + 1) / volumes.length);

    // Calculate weighted average of normalized volumes
    const weightsTotal = weights.reduce((acc, weight) => acc + weight, 0);
    const valuesTotal = normalizedVolumes.reduce((acc, volume, index) => {
        return acc + volume * weights[index];
    }, 0)
    const weightedAverage = valuesTotal / weightsTotal;
    // console.log({ weightedAverage, valuesTotal, weightsTotal });
    // Invert the score (higher score means better recovery)
    const recoveryScore = (1 - weightedAverage) * 100;

    return Number(recoveryScore.toFixed(2))
}

// Example usage
// const volumes = [0, 0, 5475, 3880, 3155, 7464, 89];
// const recoveryScore = calculateRecoveryScore(volumes);
// console.log(`Recovery Score: ${recoveryScore}`);


export function RecoveryStatus() {
    const { setRoute } = useContext(AppContext);

    const { data, loading: isLoading, error } = useFetch('/api/activity/activity')
    const activity = data?.activity || []


    const calcVolume = ({ numberOfReps, weight }) => {
        return 1
        return Number(numberOfReps) * (weight ? Number(weight) : 1)
    }

    const currentDate = new Date().getDate()
    const range = _.range(currentDate - 7, currentDate + 1)

    const activityPerDay = _.groupBy(activity, item => new Date(item.date).getDate())
    // console.log({ activityPerDay });

    const totalVolumePerDay = _(range)
        .map((day) => {
            const items = activityPerDay[day] || []
            const totalVolume = items.reduce((acc, item) => acc + (item.numberOfSetsDone * calcVolume(item.exercise)), 0)
            return totalVolume
        })
        .value()

    // const totalVolumePerDayTest = [10000, 0];
    // console.log({ totalVolumePerDay });
    const recoveryScore = calculateRecoveryScore(totalVolumePerDay);
    // console.log({ recoveryScore });






    const colorsPerRecovery = [
        'red',
        '#ff7300',
        '#0093ba',
        'green'
    ]

    const getColorFromRecovery = (value) => {
        if (value < 25) {
            return colorsPerRecovery[0]
        } else if (value < 50) {
            return colorsPerRecovery[1]
        } else if (value < 75) {
            return colorsPerRecovery[2]
        } else {
            return colorsPerRecovery[3]
        }
    }

    const color = getColorFromRecovery(recoveryScore)

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box sx={{
                position: 'relative',
                display: 'inline-flex',
                marginRight: '20px'
            }}
                onClick={handleClickOpen}
            >
                <CircularProgress
                    sx={{
                        color: isLoading ? 'lightgray' : color,
                        border: '1px solid',
                        borderRadius: '50%',
                        borderColor: 'white'
                    }}

                    variant={isLoading ? 'indeterminate' : 'determinate'}
                    value={isLoading ? 0 : recoveryScore}
                    size={60}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        color={color}
                        sx={{
                            fontSize: '20px',
                        }}
                    >{isLoading ? '' : Math.round(recoveryScore)}</Typography>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Recovery Status</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px'
                    }}>
                        <CircularProgress
                            sx={{
                                color: isLoading ? 'lightgray' : color,
                                border: '1px solid',
                                borderRadius: '50%',
                                borderColor: 'white'
                            }}
                            variant={isLoading ? 'indeterminate' : 'determinate'}
                            value={isLoading ? 0 : recoveryScore}
                            size={100}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant="caption"
                                component="div"
                                color={color}
                                sx={{
                                    fontSize: '30px',
                                }}
                            >{isLoading ? '' : Math.round(recoveryScore)}</Typography>
                        </Box>
                    </Box>
                    <DialogContentText>
                        <b>Your recovery score is: {isLoading ? '' : Math.round(recoveryScore)}</b>
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            fontSize: '14px'
                        }}
                    >
                        The recovery score is a measure of your recent activity levels, normalized and weighted to give an indication of your recovery status. A higher score indicates better recovery.
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            fontSize: '14px'
                        }}
                    >
                        <ul>
                            <li>Below 25: Take a rest day or engage in light activity.</li>
                            <li>Between 25 and 50: Engage in moderate activity.</li>
                            <li>Between 50 and 75: You can perform regular workouts.</li>
                            <li>Above 75: You are well-recovered and can engage in intense workouts.</li>
                            <li>100: You are fully recovered.</li>
                        </ul>

                        To see your recent activity, click on the <a href="#" onClick={() => setRoute('activity')}>Activity</a> Page.
                        To see your progress, click on the <a href="#" onClick={() => setRoute('progress')}>Progress</a> Page.



                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}