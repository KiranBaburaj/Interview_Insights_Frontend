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
                    marginBottom: '40px',
                    background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                    padding: '16px 32px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s',
                    },
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        background: 'linear-gradient(to right, #ffffff, #f0f2f5)',
                        '&:before': {
                            transform: 'translateX(100%)',
                        }
                    },
                    '&:active': {
                        transform: 'translateY(1px)',
                    }
                }}>
                    <Box
                        component="img"
                        src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
                        alt="Navigation Logo"
                        sx={{
                            width: { xs: '48px', sm: '64px', md: '72px' },
                            height: 'auto',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                            transform: 'translateZ(0)',
                            willChange: 'transform',
                        }}
                    />
                    <Box
                        sx={{
                            ml: { xs: 2, sm: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                color: '#1a1a1a',
                                letterSpacing: '-0.02em',
                                lineHeight: 1,
                                display: 'flex',
                                alignItems: 'center',
                                '& .gradient-text': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 900,
                                    marginLeft: '2px'
                                }
                            }}
                        >
                            CC<span className="gradient-text">P</span>
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                                color: '#666',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                mt: '4px'
                            }}
                        >
                            Career Campus Pro
                        </Typography>
                    </Box>
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