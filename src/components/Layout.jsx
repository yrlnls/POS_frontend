import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, CssBaseline, AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  ListItemButton, Divider, Avatar, Menu, MenuItem, IconButton,
  useMediaQuery, useTheme
} from '@mui/material';
import { LayoutDashboard as Dashboard, Users, CreditCard, Headphones, User, Settings, LogOut, Wifi, BarChart3, Wrench, Menu as MenuIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navbar on mobile scroll
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setHideNavbar(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHideNavbar(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  // Reset navbar visibility when drawer opens/closes
  useEffect(() => {
    if (mobileOpen) {
      setHideNavbar(false);
    }
  }, [mobileOpen]);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const drawer = (
    <>
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
              onClick={() => {
                if (item.tab !== undefined) {
                  navigate(item.path, { state: { tab: item.tab } });
                } else {
                  navigate(item.path);
                }
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path || (item.tab !== undefined && location.pathname === item.path)}
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
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          transform: { 
            xs: hideNavbar ? 'translateY(-100%)' : 'translateY(0)',
            md: 'translateY(0)'
          },
          transition: 'transform 0.3s ease-in-out',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
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
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: 0,
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#f8fafc',
              borderRight: '1px solid #e2e8f0',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#f8fafc',
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          marginTop: { xs: hideNavbar ? '0' : '64px', md: '64px' },
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 64px)',
          transition: 'margin-top 0.3s ease-in-out',
          paddingTop: { xs: hideNavbar ? '80px' : '16px', sm: '24px' },
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