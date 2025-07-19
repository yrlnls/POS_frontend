import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material'


export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await login(username, password)
    if (result.success) {
        navigate(`/${result.role}`)
    } else {
        setError(result.message || 'Login failed')
    }
    }
  return (
    <Container maxWidth="xs">
        <Box sx={{ mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' 
        }}>
        <Typography component="h1" variant="h5">
            POS Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
        </Box>
        </Box>
    </Container>
  
  )
}
