import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, CssBaseline, AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  ListItemButton, Divider, Avatar, Menu, MenuItem
} from '@mui/material';
import { 
  Dashboard, Users, CreditCard, Headphones, User,
  Settings, LogOut, Wifi, BarChart3, Wrench
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const navigationItems = {
  admin: [
    { text: 'Dashboard', icon: Dashboard, path: '/admin' },
    { text: 'Users', icon: Users, path: '/admin/users' },
    { text: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { text: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  sales: [
    { text: 'Dashboard', icon: Dashboard, path: '/sales' },
    { text: 'Customers', icon: Users, path: '/sales/customers' },
    { text: 'Transactions', icon: CreditCard, path: '/sales/transactions' },
    { text: 'Reports', icon: BarChart3, path: '/sales/reports' },
  ],
  tech: [
    { text: 'Dashboard', icon: Dashboard, path: '/tech' },
    { text: 'Tickets', icon: Headphones, path: '/tech/tickets' },
    { text: 'Equipment', icon: Wrench, path: '/tech/equipment' },
    { text: 'Network', icon: Wifi, path: '/tech/network' },
  ],
  customer: [
    { text: 'Dashboard', icon: Dashboard, path: '/customer' },
    { text: 'Account', icon: User, path: '/customer/account' },
    { text: 'Billing', icon: CreditCard, path: '/customer/billing' },
    { text: 'Support', icon: Headphones, path: '/customer/support' },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const userNavItems = user ? navigationItems[user.role] || [] : [];

  if (!user || location.pathname === '/login' || location.pathname === '/') {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px`,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Capital POS System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>
            <Button
              onClick={handleProfileMenuOpen}
              sx={{ 
                minWidth: 'auto',
                p: 0.5,
                borderRadius: '50%',
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  backgroundColor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Wifi size={24} />
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main" fontWeight={700}>
                Capital POS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Network Services
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <List sx={{ px: 2, py: 1 }}>
          {userNavItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: `calc(100% - ${drawerWidth}px)`,
          marginTop: '64px',
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <User size={16} style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <Settings size={16} style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}