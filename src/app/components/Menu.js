import React from 'react';
import { ListItem, Button, Alert, Drawer, IconButton, List, Paper, Snackbar, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from "@mui/material";
import { Assistant, Home, People, Timeline, TrendingUp } from '@mui/icons-material'; // Add TrendingUp import

export const Menu = ({ menuOpen, toggleDrawer, onRouteChanged }) => {
    const menuItems = [{
        text: 'Home',
        Icon: <Home />,
        route: '',
    },
    {
        text: 'Users',
        Icon: <People />,
        route: 'users',
    }, {
        text: 'Ask AI',
        Icon: <Assistant />,
        route: 'askAI',
    },
    {
        text: 'Activity',
        Icon: <Timeline />, // Update Icon to Timeline
        route: 'activity',
    },
    {
        text: 'Progress',
        Icon: <TrendingUp />, // Update Icon to TrendingUp
        route: 'progress',
    },
        // {
        //     text: 'Personal Coach AI',
        //     Icon: <Assistant />,
        //     route: 'coachAI'
        // }
    ]

    return (
        <div>
            <React.Fragment>
                <Drawer
                    anchor={'left'}
                    open={menuOpen}
                    onClose={() => toggleDrawer()}
                >
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={() => toggleDrawer()}
                        onKeyDown={() => toggleDrawer()}
                    >
                        <List>
                            {menuItems.map(({ text, Icon, route }) => (
                                <ListItem key={text} disablePadding onClick={() => onRouteChanged(route)}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {Icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                    </Box>
                </Drawer>
            </React.Fragment>
        </div>
    )
}
