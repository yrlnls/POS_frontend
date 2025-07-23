import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Paper, Chip, Select, MenuItem, 
  FormControl, InputLabel, Grid,
  Card, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Tabs, Tab, useMediaQuery, useTheme
} from '@mui/material';
import { 
  AlertCircle, Clock, CheckCircle, Users,
  Wrench, Wifi, Plus, Eye
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
// Commented out API imports as per mock data usage
// import { ticketsAPI, equipmentAPI, dashboardAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { tickets as mockTickets, equipment as mockEquipment, dashboardStats as mockStats, customers as mockUsers } from '../../data/mockData';
import { useLocation } from 'react-router-dom';

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
  // Initialize state with mock data
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tickets, setTickets] = useState(mockTickets);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [stats, setStats] = useState(mockStats);
  const [users, setUsers] = useState(mockUsers.filter(u => u.status === 'active')); // Assuming active users as mock users
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Set tab from navigation state
    if (location.state?.tab !== undefined) {
      setTabValue(location.state.tab);
    }
  }, [location.state]);

  // Commented out API fetching useEffect
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsResponse, equipmentResponse, statsResponse] = await Promise.all([
          ticketsAPI.getAll(),
          equipmentAPI.getAll(),
          dashboardAPI.getTicketStats()
        ]);
        
        setTickets(ticketsResponse.data);
        setEquipment(equipmentResponse.data);
        setStats(statsResponse.data);
        
        if (user.role === 'admin') {
          const usersResponse = await usersAPI.getAll();
          setUsers(usersResponse.data.filter(u => u.role === 'tech'));
        }
      } catch (error) {
        console.error('Error fetching tech data:', error);
        // Fallback to empty arrays
        setTickets([]);
        setEquipment([]);
        setStats({});
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);
  */

  const handleStatusChange = async (ticketId, newStatus) => {
    // Since we are using mock data, just update state locally
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handleAssigneeChange = async (ticketId, userId) => {
    // Since we are using mock data, just update state locally
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assignee_id: userId } : ticket
      )
    );
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
          Technical Support Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage support tickets, equipment, and customer technical issues
        </Typography>
      </Box>

      {/* Tech Support Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={openTickets.toString()}
            icon={AlertCircle}
            color="error"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={inProgressTickets.toString()}
            icon={Clock}
            color="warning"
            subtitle="Being worked on"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Resolved Today"
            value={resolvedTickets.toString()}
            icon={CheckCircle}
            color="success"
            subtitle="Completed tickets"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
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
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Support Tickets" />
            <Tab label="Equipment Inventory" />
            <Tab label="Network Status" />
          </Tabs>
        </Box>

        {/* Support Tickets Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant={isMobile ? "h6" : "h5"}>Support Tickets</Typography>
              <Button 
                variant="contained" 
                startIcon={!isMobile && <Plus />}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Create" : "Create Ticket"}
              </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    {!isMobile && <TableCell>Customer</TableCell>}
                    <TableCell>Status</TableCell>
                    {!isMobile && <TableCell>Priority</TableCell>}
                    {!isMobile && <TableCell>Category</TableCell>}
                    {user?.role === 'admin' && <TableCell>Assignee</TableCell>}
                    {!isMobile && <TableCell>Created</TableCell>}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.description}
                          </Typography>
                          {isMobile && (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {ticket.customer} • {ticket.priority} • {ticket.category}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      {!isMobile && <TableCell>{ticket.customer}</TableCell>}
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
                      {!isMobile && <TableCell>
                        <Chip 
                          label={ticket.priority} 
                          color={priorityColors[ticket.priority]}
                          size="small"
                        />
                      </TableCell>}
                      {!isMobile && <TableCell>
                        <Chip 
                          label={ticket.category} 
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>}
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
                      {!isMobile && <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>}
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={!isMobile && <Eye />}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setTicketDialog(true);
                          }}
                        >
                          {isMobile ? "View" : "View"}
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
              <Typography variant={isMobile ? "h6" : "h5"}>Equipment Inventory</Typography>
              <Button 
                variant="contained" 
                startIcon={!isMobile && <Plus />}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Add" : "Add Equipment"}
              </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    {!isMobile && <TableCell>Model</TableCell>}
                    {!isMobile && <TableCell>Serial Number</TableCell>}
                    {!isMobile && <TableCell>Category</TableCell>}
                    <TableCell>Status</TableCell>
                    {!isMobile && <TableCell>Quantity</TableCell>}
                    {!isMobile && <TableCell>Price</TableCell>}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.name}
                          </Typography>
                          {isMobile && (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {item.model} • {item.category} • Qty: {item.quantity} • ${item.price}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      {!isMobile && <TableCell>{item.model}</TableCell>}
                      {!isMobile && <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {item.serialNumber}
                        </Typography>
                      </TableCell>}
                      {!isMobile && <TableCell>
                        <Chip 
                          label={item.category} 
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>}
                      <TableCell>
                        <Chip 
                          label={item.status.replace('_', ' ')} 
                          color={equipmentStatusColors[item.status]}
                          size="small"
                        />
                      </TableCell>
                      {!isMobile && <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.quantity}
                        </Typography>
                      </TableCell>}
                      {!isMobile && <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${item.price}
                        </Typography>
                      </TableCell>}
                      <TableCell align="right">
                        <Button size="small" startIcon={!isMobile && <Eye />}>
                          {isMobile ? "View" : "View"}
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
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Network Status Monitor
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Wifi color="#059669" />
                      <Typography variant="h6">Network Uptime</Typography>
                    </Box>
                    <Typography variant="h3" color="success.main" gutterBottom>
                      {stats.networkUptime}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 30 days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Users color="#1e40af" />
                      <Typography variant="h6">Active Connections</Typography>
                    </Box>
                    <Typography variant="h3" color="primary.main" gutterBottom>
                      {stats.totalCustomers}
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
