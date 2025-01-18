import React from "react";
import { ListItem, ListItemText, IconButton, Box, LinearProgress, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ArrowLeft, ArrowRight, Assistant, ViewList, ViewModule } from '@mui/icons-material';
import { RecoveryStatus } from "./RecoveryStatus";
import { colors } from './colors';

export function WorkoutHeader({
    numberOfWeeks,
    setRoute,
    selectedWeek,
    onSelectedWeekChanges,
    totalSetsThisWeek,
    thisWeekSetsTarget,
    isWeekDone,
    shouldShowRecoveryStatus,
    viewType,
    onViewTypeChange
}) {
    return (
        <ListItem
            sx={{
                backgroundColor: colors.listHeaderBackground,
                paddingBottom: '0px',
            }}
        >
            <ListItemText
                sx={{}}
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '25px' }}>
                            Workouts
                        </div>

                    </Box>
                }
                secondary={<React.Fragment>
                    <div>Week:
                        <IconButton
                            sx={{ padding: '3px', mb: '2px' }}
                            disabled={selectedWeek === 0}
                            onClick={() => onSelectedWeekChanges((selectedWeek - 1) % numberOfWeeks)}>
                            <ArrowLeft sx={{ fontSize: '15px' }} />
                        </IconButton>
                        {selectedWeek + 1}
                        <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>
                        {numberOfWeeks}
                        <IconButton
                            sx={{ padding: '3px' }}
                            disabled={selectedWeek === numberOfWeeks - 1}
                            onClick={() => onSelectedWeekChanges(selectedWeek + 1 % numberOfWeeks)}>
                            <ArrowRight sx={{ fontSize: '15px' }} />
                        </IconButton>
                    </div>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                        }}
                    >
                        <div>
                            Sets:
                            <span style={{ marginLeft: '5px', }}>{totalSetsThisWeek}</span>
                            <span style={{ marginLeft: '5px', marginRight: '5px' }}>/</span>
                            <span style={{ marginRight: '5px', }}>{thisWeekSetsTarget}</span>
                            {isWeekDone ? '✅' : ''}
                        </div>
                        <Box sx={{
                            position: 'absolute',
                            right: '20px',
                            marginBottom: '50px',
                            display: 'flex',
                        }}>
                            <Box
                                sx={{
                                    marginRight: '100px',
                                    marginTop: '10px'
                                }}
                            >

                                <ToggleButtonGroup
                                    value={viewType}
                                    exclusive
                                    onChange={(e, newValue) => newValue && onViewTypeChange(newValue)}
                                    size="small"
                                >
                                    <ToggleButton value="workouts">
                                        <ViewModule />
                                    </ToggleButton>
                                    <ToggleButton value="exercises">
                                        <ViewList />
                                    </ToggleButton>
                                </ToggleButtonGroup>

                            </Box>
                            <Box>
                                {shouldShowRecoveryStatus ? <RecoveryStatus /> : ''}
                            </Box>
                            <Box>
                                {/* <Assistant
                                    onClick={() => setRoute('askAI')}
                                    sx={{
                                        fontSize: '20px',
                                        height: '20px',
                                        color: '#7c69dc'
                                    }}
                                /> */}
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <LinearProgress
                            sx={{
                                marginTop: '10px'
                            }}
                            variant="determinate"
                            value={totalSetsThisWeek / thisWeekSetsTarget * 100}
                        />
                    </Box>
                </React.Fragment>}
            />
        </ListItem>
    );
} 