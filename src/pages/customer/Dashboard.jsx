import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Tabs, Tab,
  LinearProgress, Alert, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Wifi, DollarSign, Calendar, AlertCircle,
  CreditCard, Download, Upload, Clock,
  Plus, Eye, MessageSquare
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
// Commented out API imports for testing with mock data
// import { customersAPI, transactionsAPI, ticketsAPI } from '../../services/api';
import { customers as mockCustomers, transactions as mockTransactions, tickets as mockTickets } from '../../data/mockData';
import { useLocation } from 'react-router-dom';

const USE_MOCK_DATA = true;

function CustomerDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [customerData, setCustomerData] = useState({});
  const [billingHistory, setBillingHistory] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    // Set tab from navigation state
    if (location.state?.tab !== undefined) {
      setTabValue(location.state.tab);
    }
    
    if (!USE_MOCK_DATA) {
      // Here you would fetch real data from APIs
      // For now, just set loading false
      setLoading(false);
    } else {
      // Use mock data directly without filtering by user id
      // For demo, pick first customer as current customer
      const mockCustomer = mockCustomers[0] || {};
      setCustomerData({
        plan: mockCustomer.plan || 'Basic Internet',
        status: mockCustomer.status || 'active',
        monthlyBill: mockCustomer.monthlyBill || 29.99,
        nextBilling: new Date().toISOString().split('T')[0],
        dataUsage: 0,
        downloadSpeed: 50,
        uploadSpeed: 10,
      });
      setBillingHistory(mockTransactions);
      setSupportTickets(mockTickets);
      setLoading(false);
    }
  }, []);

  const handleTicketSubmit = () => {
    // Mock ticket creation for testing
    const newMockTicket = {
      id: supportTickets.length + 1,
      title: newTicket.title,
      customer: customerData.name || 'Customer',
      customerId: customerData.id || null,
      status: 'open',
      priority: newTicket.priority,
      assignee_id: null,
      created_at: new Date().toISOString(),
      description: newTicket.description,
      category: 'general',
    };
    setSupportTickets(prev => [...prev, newMockTicket]);
    setTicketDialog(false);
    setNewTicket({ title: '', description: '', priority: 'medium' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
          My Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Manage your internet service and account settings
        </Typography>
      </Box>

      {/* Account Status Alert */}
      {customerData.status === 'active' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your service is active and running smoothly. Next billing date: {customerData.nextBilling}
        </Alert>
      )}

      {/* Account Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Current Plan"
            value={customerData.plan}
            icon={Wifi}
            color="primary"
            subtitle={`Kes${customerData.monthlyBill}/month`}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Account Status"
            value={customerData.status}
            icon={AlertCircle}
            color="success"
            subtitle="Service active"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Download Speed"
            value={`${customerData.downloadSpeed} Mbps`}
            icon={Download}
            color="secondary"
            subtitle="Current speed"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Upload Speed"
            value={`${customerData.uploadSpeed} Mbps`}
            icon={Upload}
            color="secondary"
            subtitle="Current speed"
          />
        </Grid>
      </Grid>

      {/* Data Usage */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            Monthly Data Usage
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {customerData.dataUsage}% of unlimited
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={customerData.dataUsage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No data limits on your current plan
          </Typography>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Billing History" />
            <Tab label="Support Tickets" />
            <Tab label="Account Settings" />
          </Tabs>
        </Box>

        {/* Billing History Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant={isMobile ? "h6" : "h5"}>Billing History</Typography>
              <Button 
                variant="outlined" 
                startIcon={!isMobile && <Download />}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Download" : "Download Statement"}
              </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    {!isMobile && <TableCell>Amount</TableCell>}
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>
                        {new Date(bill.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {bill.description}
                          </Typography>
                          {isMobile && (
                            <Typography variant="body2" fontWeight={600}>
                              ${bill.amount}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      {!isMobile && <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${bill.amount}
                        </Typography>
                      </TableCell>}
                      <TableCell>
                        <Chip
                          label={bill.status}
                          color={getStatusColor(bill.status)}
                          size="small"
                        />
                      </TableCell>
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

        {/* Support Tickets Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant={isMobile ? "h6" : "h5"}>Support Tickets</Typography>
              <Button 
                variant="contained" 
                startIcon={!isMobile && <Plus />}
                onClick={() => setTicketDialog(true)}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Create" : "Create Ticket"}
              </Button>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket #</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    {!isMobile && <TableCell>Priority</TableCell>}
                    {!isMobile && <TableCell>Created</TableCell>}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {ticket.title}
                          </Typography>
                          {isMobile && (
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={ticket.priority}
                                color={ticket.priority === 'high' ? 'error' : 'default'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                      </TableCell>
                      {!isMobile && <TableCell>
                        <Chip
                          label={ticket.priority}
                          color={ticket.priority === 'high' ? 'error' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>}
                      {!isMobile && <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>}
                      <TableCell align="right">
                        <Button size="small" startIcon={!isMobile && <MessageSquare />}>
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

        {/* Account Settings Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Account Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Full Name"
                        defaultValue="John Smith"
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        label="Email"
                        defaultValue="john.smith@email.com"
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        label="Phone"
                        defaultValue="(555) 123-4567"
                        variant="outlined"
                        size="small"
                      />
                      <Button variant="contained" size="small">
                        Update Information
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Methods
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CreditCard size={20} />
                        <Typography variant="body2">
                          **** **** **** 1234
                        </Typography>
                        <Chip label="Primary" size="small" color="primary" />
                      </Box>
                      <Button variant="outlined" size="small" startIcon={<Plus />}>
                        Add Payment Method
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={ticketDialog} onClose={() => setTicketDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
            <TextField
              select
              label="Priority"
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTicketSubmit}>
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CustomerDashboard;
