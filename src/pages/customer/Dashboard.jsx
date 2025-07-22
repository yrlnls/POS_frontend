import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Tabs, Tab,
  LinearProgress, Alert
} from '@mui/material';
import { 
  Wifi, DollarSign, Calendar, AlertCircle,
  CreditCard, Download, Upload, Clock,
  Plus, Eye, MessageSquare
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
// Commented out API imports for testing with mock data
// import { customersAPI, transactionsAPI, ticketsAPI } from '../../services/api';
import { customers, transactions, tickets } from '../../data/mockData';

function CustomerDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
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
    // Commented out fetching code for testing with mock data
    /*
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [customerResponse, transactionsResponse, ticketsResponse] = await Promise.all([
            customersAPI.getById(user.id),
            transactionsAPI.getByCustomer(user.id),
            ticketsAPI.getByCustomer(user.id)
          ]);
          
          setCustomerData(customerResponse.data);
          setBillingHistory(transactionsResponse.data);
          setSupportTickets(ticketsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        // Fallback to empty data
        setCustomerData({
          plan: 'Basic Internet',
          status: 'active',
          monthlyBill: 29.99,
          nextBilling: new Date().toISOString().split('T')[0],
          dataUsage: 0,
          downloadSpeed: 50,
          uploadSpeed: 10,
        });
        setBillingHistory([]);
        setSupportTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    */

    // Using mock data for testing
    if (user?.id) {
      const mockCustomer = customers.find(c => c.id === user.id) || {};
      const mockTransactions = transactions.filter(t => t.customerId === user.id);
      const mockTickets = tickets.filter(t => t.customerId === user.id);

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
  }, [user?.id]);
  const handleTicketSubmit = async () => {
    // Commented out API call for testing with mock data
    /*
    try {
      const ticketData = {
        ...newTicket,
        customerId: user.id,
        customer: user.username
      };
      const response = await ticketsAPI.create(ticketData);
      setSupportTickets(prev => [...prev, response.data]);
      setTicketDialog(false);
      setNewTicket({ title: '', description: '', priority: 'medium' });
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Handle error (show notification, etc.)
    }
    */
    // Mock ticket creation for testing
    const newMockTicket = {
      id: supportTickets.length + 1,
      title: newTicket.title,
      customer: user.username,
      customerId: user.id,
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Plan"
            value={customerData.plan}
            icon={Wifi}
            color="primary"
            subtitle={`$${customerData.monthlyBill}/month`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Account Status"
            value={customerData.status}
            icon={AlertCircle}
            color="success"
            subtitle="Service active"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Download Speed"
            value={`${customerData.downloadSpeed} Mbps`}
            icon={Download}
            color="secondary"
            subtitle="Current speed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
          <Typography variant="h5" gutterBottom>
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
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Billing History" />
            <Tab label="Support Tickets" />
            <Tab label="Account Settings" />
          </Tabs>
        </Box>

        {/* Billing History Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Billing History</Typography>
              <Button variant="outlined" startIcon={<Download />}>
                Download Statement
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
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
                      <TableCell>{bill.description}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${bill.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={bill.status}
                          color={getStatusColor(bill.status)}
                          size="small"
                        />
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

        {/* Support Tickets Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Support Tickets</Typography>
              <Button 
                variant="contained" 
                startIcon={<Plus />}
                onClick={() => setTicketDialog(true)}
              >
                Create Ticket
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket #</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Created</TableCell>
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
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          color={ticket.priority === 'high' ? 'error' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(ticket.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" startIcon={<MessageSquare />}>
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

        {/* Account Settings Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Account Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
