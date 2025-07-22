import { useState } from 'react';
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
import { dashboardStats, servicePlans, customers, transactions } from '../../data/mockData';

export default function SalesDashboard() {
  const [tabValue, setTabValue] = useState(0);
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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerSubmit = () => {
    console.log('Creating customer:', newCustomer);
    setCustomerDialog(false);
    setNewCustomer({ name: '', email: '', phone: '', address: '', plan: '' });
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
            value={customers.length.toString()}
            icon={Users}
            color="primary"
            subtitle="Active subscribers"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Sales"
            value="$12,450"
            icon={DollarSign}
            color="success"
            trend={18.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Customers"
            value="23"
            icon={UserPlus}
            color="secondary"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value="68%"
            icon={TrendingUp}
            color="primary"
            trend={5.4}
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