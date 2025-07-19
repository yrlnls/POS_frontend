import { useEffect, useState} from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import axios from 'axios'


export default function AdminDashboard() {
    const { user } = useAuth()
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setUsers(response.data)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        fetchUsers()
    }, [])
  return (
    <Container>
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="subtitle1">
                Welcome, {user.username} ({user.role})
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Container>
    
  )
}
