import React from 'react';
import { Box, CircularProgress, Typography, ThemeProvider } from '@mui/material';
import theme from './theme/theme';

const MyComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                position: 'relative', 
                textAlign: 'center', 
                padding: '40px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.common.purple.gradient,
            }}>
                <Box sx={{ 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <Box
                        component="img"
                        src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
                        alt="Navigation Logo"
                        sx={{
                            width: { xs: '64px', sm: '80px' },
                            height: 'auto',
                            transition: 'transform 0.2s',
                            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            ml: 2,
                            fontWeight: 800,
                            fontFamily: 'sans-serif',
                            fontSize: { xs: '2.5rem', sm: '3.5rem' },
                            color: '#ffffff',
                            textShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            '& .gradient-text': {
                                background: 'linear-gradient(to top left, #2563eb, #7c3aed)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }
                        }}
                    >
                        CC<span className="gradient-text">P</span>
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', marginY: 4 }}>
                    <CircularProgress 
                        size={80} 
                        thickness={4}
                        sx={{ 
                            color: '#fff',
                            boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.2)'
                        }} 
                    />
                </Box>

                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#fff',
                        opacity: 0.9,
                        fontWeight: 500,
                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        animation: 'pulse 2s infinite ease-in-out',
                        '@keyframes pulse': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 }
                        }
                    }}
                >
                    Loading...
                </Typography>
            </Box>
        </ThemeProvider>
    );
};

export default MyComponent;