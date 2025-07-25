import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { MoreVertical, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

const statusColors = {
  active: 'success',
  inactive: 'default',
  suspended: 'warning',
  cancelled: 'error',
};

export default function CustomerCard({ customer, onEdit, onView, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    switch (action) {
      case 'view':
        onView?.(customer);
        break;
      case 'edit':
        onEdit?.(customer);
        break;
      case 'delete':
        onDelete?.(customer);
        break;
    }
  };

  return (
    <Card sx={{ cursor: 'pointer' }} onClick={() => onView?.(customer)}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <User size={isMobile ? 20 : 24} />
            </Box>
            <Box>
              <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
                {customer.name}
              </Typography>
              <Chip
                label={customer.status}
                color={statusColors[customer.status]}
                size="small"
              />
            </Box>
          </Box>
          <IconButton 
            onClick={handleMenuOpen} 
            size="small"
            sx={{ mt: isMobile ? 1 : 0, alignSelf: isMobile ? 'flex-end' : 'auto' }}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.5 : 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone size={isMobile ? 14 : 16} color="#64748b" />
            <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
              {customer.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Mail size={isMobile ? 14 : 16} color="#64748b" />
            <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
              {customer.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapPin size={isMobile ? 14 : 16} color="#64748b" />
            <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
              {customer.address}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={isMobile ? 14 : 16} color="#64748b" />
            <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
              Joined {new Date(customer.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction('view')}>View Details</MenuItem>
          <MenuItem onClick={() => handleAction('edit')}>Edit Customer</MenuItem>
          <MenuItem onClick={() => handleAction('delete')}>Delete Customer</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}