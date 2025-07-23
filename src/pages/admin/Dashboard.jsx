import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab
} from '@mui/material';
import { 
  Users, DollarSign, Wifi, AlertCircle, TrendingUp, 
  Settings, MoreVertical, Plus, Edit, Trash2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { dashboardAPI, usersAPI } from '../../services/api';

const USE_MOCK_DATA = true;

// Mock data for demo mode
const mockUsers = [
  { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com', status: 'active' },
  { id: 2, username: 'sales1', role: 'sales', email: 'sales1@example.com', status: 'active' },
  { id: 3, username: 'tech1', role: 'tech', email: 'tech1@example.com', status: 'inactive' },
];

const mockStats = {
  totalCustomers: 1247,
  monthlyRevenue: 74580,
  activeServices: 1189,
  openTickets: 23,
  customerGrowthRate: 5,
  revenueGrowthRate: 3,
  serviceGrowthRate: 4,
  ticketTrend: -1,
};

const mockSalesData = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 68000 },
  { month: 'Mar', revenue: 72000 },
  { month: 'Apr', revenue: 69000 },
  { month: 'May', revenue: 75000 },
  { month: 'Jun', revenue: 78000 },
];

const mockSettings = {
  systemName: 'Demo Network System',
  maintenanceMode: false,
  maxUsers: 1000,
};

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dialog states
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    role: '',
    email: '',
    status: 'active',
  });

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [usersResponse, statsResponse, salesResponse] = await Promise.all([
            usersAPI.getAll(),
            dashboardAPI.getStats(),
            dashboardAPI.getSalesData()
          ]);
          
          setUsers(usersResponse.data);
          setStats(statsResponse.data);
          setSalesData(salesResponse.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setUsers([]);
          setStats({
            totalCustomers: 0,
            monthlyRevenue: 0,
            activeServices: 0,
            openTickets: 0
          });
          setSalesData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setUsers(mockUsers);
      setStats(mockStats);
      setSalesData(mockSalesData);
      setLoading(false);
    }
  }, []);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      sales: 'primary',
      tech: 'secondary',
      customer: 'success',
    };
    return colors[role] || 'default';
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handlers for dialogs
  const openAddUserDialog = () => {
    setAddUserDialogOpen(true);
  };

  const closeAddUserDialog = () => {
    setAddUserDialogOpen(false);
    setNewUser({ username: '', role: '', email: '', status: 'active' });
  };

  const openViewReportDialog = () => {
    setViewReportDialogOpen(true);
  };

  const closeViewReportDialog = () => {
    setViewReportDialogOpen(false);
  };

  const handleAddUserChange = (field) => (event) => {
    setNewUser({ ...newUser, [field]: event.target.value });
  };

  const handleAddUserSubmit = () => {
    // For demo, just add user locally
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const userToAdd = { id: newId, ...newUser };
    setUsers(prev => [...prev, userToAdd]);
    closeAddUserDialog();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your network service business with comprehensive analytics and controls
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Users" />
        <Tab label="Analytics" />
        <Tab label="Settings" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* User Management */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">User Management</Typography>
                <Button variant="contained" startIcon={<Plus />} onClick={openAddUserDialog}>
                  Add User
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, user)}
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Edit size={16} style={{ marginRight: 8 }} />
              Edit User
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Trash2 size={16} style={{ marginRight: 8 }} />
              Delete User
            </MenuItem>
          </Menu>

          {/* Add User Dialog */}
          <Dialog open={addUserDialogOpen} onClose={closeAddUserDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  label="Username"
                  fullWidth
                  value={newUser.username}
                  onChange={handleAddUserChange('username')}
                />
                <TextField
                  label="Role"
                  fullWidth
                  value={newUser.role}
                  onChange={handleAddUserChange('role')}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={newUser.email}
                  onChange={handleAddUserChange('email')}
                />
                <TextField
                  label="Status"
                  fullWidth
                  value={newUser.status}
                  onChange={handleAddUserChange('status')}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeAddUserDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleAddUserSubmit}>Add User</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tabValue === 1 && (
        <>
          {/* Analytics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers?.toLocaleString() || '0'}
                icon={Users}
                color="primary"
                trend={stats.customerGrowthRate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Monthly Revenue"
                value={`$${stats.monthlyRevenue?.toLocaleString() || '0'}`}
                icon={DollarSign}
                color="success"
                trend={stats.revenueGrowthRate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Services"
                value={stats.activeServices?.toLocaleString() || '0'}
                icon={Wifi}
                color="secondary"
                trend={stats.serviceGrowthRate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Open Tickets"
                value={stats.openTickets || '0'}
                icon={AlertCircle}
                color="warning"
                trend={stats.ticketTrend}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Revenue Trends</Typography>
                <Button startIcon={<TrendingUp />} variant="outlined" size="small" onClick={() => setViewReportDialogOpen(true)}>
                  View Report
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1e40af" 
                    strokeWidth={3}
                    dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* View Report Dialog */}
          <Dialog open={viewReportDialogOpen} onClose={() => setViewReportDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Revenue Report</DialogTitle>
            <DialogContent>
              <Typography>
                This is a demo revenue report. You can customize this content as needed.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewReportDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tabValue === 2 && (
        <>
          {/* Settings */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                System Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography>System Name: Demo Network System</Typography>
                <Typography>Maintenance Mode: Off</Typography>
                <Typography>Max Users: 1000</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
