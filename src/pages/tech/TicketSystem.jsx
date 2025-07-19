import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Paper, Chip, Select, MenuItem, 
  FormControl, InputLabel
} from '@mui/material'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  open: 'default',
  in_progress: 'primary',
  resolved: 'success',
//   cancelled: 'error'
};
export default function TicketSystem() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchTickets();
        if (user.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tickets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/tickets/${ticketId}`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTickets();
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    const handleAssigneeChange = async (ticketId, userId) => {
        try {
            await axios.put(`http://localhost:5000/tickets/${ticketId}`, {
                assignee_id: userId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTickets();
        } catch (error) {
            console.error('Error updating ticket assignee:', error);
        }
    };
        
  returng (
    <Container>
        <Typography variant="h4" sx={{ my: 4 }}>
            Ticket System
        </Typography>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        {user?.role === 'admin' && <TableCell>Assignee</TableCell>}
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell>{ticket.id}</TableCell>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>{ticket.customer}</TableCell>
                            <TableCell>
                                <Select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                    size='small'
                                >
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="in_progress">In Progress</MenuItem>
                                    <MenuItem value="resolved">Resolved</MenuItem>
                                    {/* <MenuItem value="cancelled">Cancelled</MenuItem> */}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={ticket.priority} 
                                    color={ticket.priority === 'high' ? 'error' : 
                                           ticket.priority === 'medium' ? 'warning' : 'success'} 
                                />
                            </TableCell>
                            {user?.role === 'admin' && (
                                <TableCell>
                                    <FormControl fullWidth size='small'>
                                        <InputLabel>Assignee</InputLabel>
                                        <Select
                                            value={ticket.assignee_id || ''}
                                            onChange={(e) => handleAssigneeChange(ticket.id, e.target.value)}
                                            label="Assignee"
                                        >
                                            <MenuItem value="">
                                               Unassigned
                                            </MenuItem>
                                            {users.filter(u => u.role === 'tech').map(user => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            )}
                            <TableCell>{new Date(ticket.created_at).toLocaleString() }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            </Container>
  )
}
