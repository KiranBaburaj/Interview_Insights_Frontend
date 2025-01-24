import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c', // Darker purple
      light: '#7c43bd',
      dark: '#12005e',
    },
    secondary: {
      main: '#6a1b9a', // Deep purple
      light: '#9c4dcc',
      dark: '#38006b',
    },
    text: {
      primary: '#12005e', // Very dark purple
      secondary: '#4a148c', // Dark purple
      white: '#ffffff', // White text for dark backgrounds
    },
    background: {
      default: '#ffffff',
      paper: '#f6f2ff',
      light: '#ede7f6', // Light purple background
      medium: '#d1c4e9', // Medium purple background
    },
    common: {
      purple: {
        gradient: 'linear-gradient(45deg, #4a148c 30%, #6a1b9a 90%)',
        shadow: '0 3px 5px 2px rgba(74, 20, 140, 0.3)',
        hover: 'rgba(156, 77, 204, 0.2)',
      }
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: '#4a148c',
    },
    h6: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      color: '#6a1b9a',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#6a1b9a',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
