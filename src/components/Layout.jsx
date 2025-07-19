import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth()

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Capital POS System 
                    </Typography>
                    {user && (
                        <>
                            <Typography variant='subtitle1' sx={{ mr: 2 }}>
                                {user.role}: {user.username}
                            </Typography>

                            <Button
                                color='inherit'
                                onClick={logout}
                                variant='outlined'
                                size='small'
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: '100%', marginTop: '64px' //AppBar height
                    }}
            ><Outlet />
            </Box>
        </Box>
    )
}