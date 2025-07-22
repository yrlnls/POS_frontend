import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TextField, Button, Typography, Container, Box, 
  Alert, Card, CardContent, Grid, Chip
} from '@mui/material';
import { Wifi, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      navigate(`/${result.role}`);
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'admin', username: 'admin', password: 'admin123', color: 'error' },
    { role: 'sales', username: 'sales1', password: 'sales123', color: 'primary' },
    { role: 'tech', username: 'tech1', password: 'tech123', color: 'secondary' },
    { role: 'customer', username: 'customer1', password: 'customer123', color: 'success' },
  ];

  const handleDemoLogin = (account) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          {/* Branding Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Wifi size={32} />
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    Capital POS
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Network Services Management
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ opacity: 0.95 }}>
                Comprehensive Point of Sale System
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                Manage customers, process transactions, handle support tickets, and monitor network services all in one powerful platform.
              </Typography>
              
              {/* Demo Accounts */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                  Demo Accounts
                </Typography>
                <Grid container spacing={1}>
                  {demoAccounts.map((account) => (
                    <Grid item xs={6} sm={3} key={account.role}>
                      <Card
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => handleDemoLogin(account)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Chip
                            label={account.role}
                            color={account.color}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                            {account.username}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Lock size={28} />
                  </Box>
                  <Typography variant="h4" gutterBottom color="primary.main" fontWeight={600}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to access your dashboard
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: <User size={20} style={{ marginRight: 8, color: '#64748b' }} />,
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#64748b' }} />,
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
                      },
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}