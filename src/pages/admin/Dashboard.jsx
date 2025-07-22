import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, IconButton, Menu, MenuItem
} from '@mui/material';
import { 
  Users, DollarSign, Wifi, AlertCircle, TrendingUp, 
  Settings, MoreVertical, Plus, Edit, Trash2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { dashboardAPI, usersAPI } from '../../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
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
        // Fallback to empty data
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

      {/* Key Metrics */}
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

      {/* Revenue Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Revenue Trends</Typography>
                <Button startIcon={<TrendingUp />} variant="outlined" size="small">
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
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" startIcon={<Plus />} fullWidth>
                  Add New User
                </Button>
                <Button variant="outlined" startIcon={<Settings />} fullWidth>
                  System Settings
                </Button>
                <Button variant="outlined" startIcon={<Wifi />} fullWidth>
                  Network Status
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Management */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">User Management</Typography>
            <Button variant="contained" startIcon={<Plus />}>
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
    </Container>
  );
}