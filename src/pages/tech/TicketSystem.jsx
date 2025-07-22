import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Paper, Chip, Select, MenuItem, 
  FormControl, InputLabel, Grid,
  Card, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Tabs, Tab
} from '@mui/material';
import { 
  AlertCircle, Clock, CheckCircle, Users,
  Wrench, Wifi, Plus, Eye
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { tickets, equipment } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  open: 'error',
  in_progress: 'warning',
  resolved: 'success',
};

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

const equipmentStatusColors = {
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'error',
  deployed: 'primary',
};

export default function TicketSystem() {
  const [ticketList, setTicketList] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setTicketList(tickets);
    if (user.role === 'admin') {
      setUsers([
        { id: 1, username: 'tech1', role: 'tech' },
        { id: 2, username: 'tech2', role: 'tech' },
      ]);
    }
  }, [user]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setTicketList(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handleAssigneeChange = async (ticketId, userId) => {
    setTicketList(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assignee_id: userId } : ticket
      )
    );
  };

  const openTickets = ticketList.filter(t => t.status === 'open').length;
  const inProgressTickets = ticketList.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = ticketList.filter(t => t.status === 'resolved').length;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Technical Support Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage support tickets, equipment, and customer technical issues
        </Typography>
      </Box>

      {/* Tech Support Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={openTickets.toString()}
            icon={AlertCircle}
            color="error"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={inProgressTickets.toString()}
            icon={Clock}
            color="warning"
            subtitle="Being worked on"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved Today"
            value={resolvedTickets.toString()}
            icon={CheckCircle}
            color="success"
            subtitle="Completed tickets"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Response Time"
            value="2.3h"
            icon={Clock}
            color="primary"
            subtitle="First response"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Support Tickets" />
            <Tab label="Equipment Inventory" />
            <Tab label="Network Status" />
          </Tabs>
        </Box>

        {/* Support Tickets Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Support Tickets</Typography>
              <Button variant="contained" startIcon={<Plus />}>
                Create Ticket
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Category</TableCell>
                    {user?.role === 'admin' && <TableCell>Assignee</TableCell>}
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketList.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ticket.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="open">Open</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="resolved">Resolved</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.priority} 
                          color={priorityColors[ticket.priority]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.category} 
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      {user?.role === 'admin' && (
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={ticket.assignee_id || ''}
                              onChange={(e) => handleAssigneeChange(ticket.id, e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="">Unassigned</MenuItem>
                              {users.filter(u => u.role === 'tech').map(user => (
                                <MenuItem key={user.id} value={user.id}>
                                  {user.username}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      )}
                      <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<Eye />}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setTicketDialog(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Equipment Inventory Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Equipment Inventory</Typography>
              <Button variant="contained" startIcon={<Plus />}>
                Add Equipment
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {item.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category} 
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status.replace('_', ' ')} 
                          color={equipmentStatusColors[item.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${item.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" startIcon={<Eye />}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Network Status Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Network Status Monitor
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Wifi color="#059669" />
                      <Typography variant="h6">Network Uptime</Typography>
                    </Box>
                    <Typography variant="h3" color="success.main" gutterBottom>
                      99.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 30 days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Users color="#1e40af" />
                      <Typography variant="h6">Active Connections</Typography>
                    </Box>
                    <Typography variant="h3" color="primary.main" gutterBottom>
                      1,247
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Currently online
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Ticket Details Dialog */}
      <Dialog 
        open={ticketDialog} 
        onClose={() => setTicketDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Ticket #{selectedTicket?.id} - {selectedTicket?.title}
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Customer</Typography>
                  <Typography variant="body2">{selectedTicket.customer}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Priority</Typography>
                  <Chip 
                    label={selectedTicket.priority} 
                    color={priorityColors[selectedTicket.priority]}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Description</Typography>
                  <Typography variant="body2">{selectedTicket.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Resolution Notes</Typography>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Add resolution notes..."
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketDialog(false)}>Close</Button>
          <Button variant="contained">Update Ticket</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}