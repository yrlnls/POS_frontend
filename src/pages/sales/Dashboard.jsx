import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tabs, Tab
} from '@mui/material';
import { 
  Users, DollarSign, TrendingUp, Plus, Search, 
  Eye, Edit, CreditCard, UserPlus 
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import ServicePlanCard from '../../components/common/ServicePlanCard';
import CustomerCard from '../../components/common/CustomerCard';
const USE_MOCK_DATA = true;

// Commented out API imports for testing with mock data
import { dashboardAPI, customersAPI, servicePlansAPI, transactionsAPI } from '../../services/api';
import { customers as mockCustomers, servicePlans as mockServicePlans, transactions as mockTransactions, dashboardStats } from '../../data/mockData';

export default function SalesDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [servicePlans, setServicePlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [customerDialog, setCustomerDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: '',
  });

  useEffect(() => {
    // Commented out fetching code for testing with mock data
    /*
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersResponse, plansResponse, transactionsResponse, statsResponse] = await Promise.all([
          customersAPI.getAll(),
          servicePlansAPI.getAll(),
          transactionsAPI.getAll(),
          dashboardAPI.getStats()
        ]);
        
        setCustomers(customersResponse.data);
        setServicePlans(plansResponse.data);
        setTransactions(transactionsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Fallback to empty arrays
        setCustomers([]);
        setServicePlans([]);
        setTransactions([]);
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    */

    // Using mock data for testing
    setCustomers(mockCustomers);
    setServicePlans(mockServicePlans);
    setTransactions(mockTransactions);
    setStats(dashboardStats);
    setLoading(false);
  }, []);

  // Added to ensure service plans, transactions, and customers are displayed properly
  // The existing code already maps these in the UI, so no changes needed there


  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerSubmit = async () => {
    try {
      // This would normally call the API, but for testing we just add locally
      const newId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      const newCust = { id: newId, ...newCustomer };
      setCustomers(prev => [...prev, newCust]);
      setCustomerDialog(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '', plan: '' });
    } catch (error) {
      console.error('Error creating customer:', error);
      // Handle error (show notification, etc.)
    }
  };

  const getTransactionStatusColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      failed: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Sales Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage customers, process sales, and track performance
        </Typography>
      </Box>

      {/* Sales Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={customers.length?.toString() || '0'}
            icon={Users}
            color="primary"
            subtitle="Active subscribers"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Sales"
            value={`$${stats.monthlySales?.toLocaleString() || '0'}`}
            icon={DollarSign}
            color="success"
            trend={stats.salesGrowthRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Customers"
            value={stats.newCustomersThisMonth?.toString() || '0'}
            icon={UserPlus}
            color="secondary"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate || 0}%`}
            icon={TrendingUp}
            color="primary"
            trend={stats.conversionTrend}
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Customers" />
            <Tab label="Service Plans" />
            <Tab label="Transactions" />
          </Tabs>
        </Box>

        {/* Customers Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <TextField
                placeholder="Search customers..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={20} style={{ marginRight: 8, color: '#64748b' }} />,
                }}
                sx={{ minWidth: 300 }}
              />
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setCustomerDialog(true)}
              >
                Add Customer
              </Button>
            </Box>

            <Grid container spacing={3}>
              {filteredCustomers.map((customer) => (
                <Grid item xs={12} md={6} lg={4} key={customer.id}>
                  <CustomerCard
                    customer={customer}
                    onView={(customer) => console.log('View customer:', customer)}
                    onEdit={(customer) => console.log('Edit customer:', customer)}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {/* Service Plans Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Available Service Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose the perfect plan for your customers
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {servicePlans.map((plan) => (
                <Grid item xs={12} md={6} lg={4} key={plan.id}>
                  <ServicePlanCard
                    plan={plan}
                    selected={selectedPlan?.id === plan.id}
                    onSelect={setSelectedPlan}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {/* Transactions Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recent Transactions
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {transaction.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${transaction.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={getTransactionStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.method.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <Eye size={16} />
                        </IconButton>
                        <IconButton size="small">
                          <CreditCard size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={customerDialog} onClose={() => setCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
            <TextField
              label="Address"
              multiline
              rows={2}
              fullWidth
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Service Plan</InputLabel>
              <Select
                value={newCustomer.plan}
                onChange={(e) => setNewCustomer({ ...newCustomer, plan: e.target.value })}
              >
                {servicePlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.name}>
                    {plan.name} - ${plan.price}/month
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCustomerSubmit}>
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
