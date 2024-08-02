// theme.js
import { createTheme } from '@mui/material/styles';

const colors = {
    listHeaderBackground: '#d4ddff', // Indigo 100 for a light header background
    listHeaderText: '#1A237E',      // Indigo 900 for strong, dark header text
    listHeaderSecondaryText: '#5C6BC0', // Indigo 400 for secondary text
    workoutBackground: '#E8EAF6',   // Indigo 50 for a very light workout background
    exerciseBackground: 'white',  // Indigo 200 for exercises
    exerciseBackgroundSelected: '#7986CB', // Indigo 300 for selected exercises
    header: '#111e68',              // Indigo 500 for a vibrant header
    footer: 'white',              // Indigo 800 for a bold footer
    footerText: '#111e68',          // Indigo 500 for footer text
};


const colors2 = {
    listHeaderBackground: '#e3f2fd', // Light blue background for headers
    listHeaderText: '#0d47a1',      // Dark blue for header text
    listHeaderSecondaryText: '#5c6bc0', // Light grey-blue for secondary text
    workoutBackground: '#ffffff',   // White background for workouts
    exerciseBackground: '#f5f5f5',  // Light grey for exercise items
    exerciseBackgroundSelected: '#c8e6c9', // Light green for selected items
    header: '#1e88e5',              // Vibrant blue for the header
    footer: 'white',              // Dark grey for the footer
    footerText: 'gray',          // White text for the footer
};


const theme = createTheme({
    colors: {
        listHeaderBackground: '#a8cbe1',
        listHeaderText: '#FFFFFF',
        listHeaderSecondaryText: '#FFFFFF',
        workoutBackground: '#e4e4e4',
        exerciseBackground: '#FAFAFA',
        exerciseBackgroundSelected: '#96ddff',
        header: '#1976d2',
        footer: 'white',
    },
    palette: {
        primary: {
            main: '#1976d2', // Customize the primary color
        },
        secondary: {
            main: '#dc004e', // Customize the secondary color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4, // Example of customizing component styles
                },
            },
        },

    },
});

const theme2 = createTheme({
    colors: colors2,
    palette: {
        primary: {
            main: '#1e88e5', // Vibrant blue for primary actions
        },
        secondary: {
            main: '#ff4081', // Soft pink for secondary actions
        },
        background: {
            default: '#f5f5f5', // Light grey background
        },
        text: {
            primary: '#333333', // Dark grey text
            secondary: '#757575', // Lighter grey text
        },
        // action: {
        //     active: '#ff4081', // Secondary color for active states
        // },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    color: colors2.footerText,
                },
            },
        }
    },
});

export default theme2;

