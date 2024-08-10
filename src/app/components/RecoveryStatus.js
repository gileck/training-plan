import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import _ from 'lodash'
import { AppContext } from "../AppContext";

function calculateRecoveryScore(volumes) {
    // Normalize volumes to a 0-1 scale
    // const maxVolume = Math.max(...volumes);
    const maxVolume = 10000
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

    const [activity, setActivity] = useState(null);
    useEffect(() => {
        fetch('/api/activity/activity')
            .then(res => res.json())
            .then(data => {
                console.log({ data });
                setActivity(data.activity)
            })
            .catch((e) => {
                console.error('Error fetching data', e.message)
            })
    }, [])

    if (!activity) {
        return null
    }

    const calcVolume = ({ numberOfReps, weight }) => {
        return Number(numberOfReps) * (weight ? Number(weight) : 1)
    }

    const currentDate = new Date().getDate()
    const range = _.range(currentDate - 7, currentDate)

    const activityPerDay = _.groupBy(activity, item => new Date(item.date).getDate())

    const totalVolumePerDay = _(range)
        .map((day) => {
            const items = activityPerDay[day] || []
            const totalVolume = items.reduce((acc, item) => acc + (item.numberOfSetsDone * calcVolume(item.exercise)), 0)
            return totalVolume
        })
        .value()

    // const totalVolumePerDayTest = [10000, 0];
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

    return <Box sx={{
        position: 'relative',
        display: 'inline-flex',
        marginRight: '20px'

    }}
        onClick={() => setRoute('activity')}
    >
        <CircularProgress
            sx={{
                color: color,
                border: '1px solid',
                borderRadius: '50%',
                borderColor: 'white'

            }}

            variant="determinate" value={recoveryScore}
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
            >{`${Math.round(recoveryScore)}`}</Typography>
        </Box>
    </Box>

}