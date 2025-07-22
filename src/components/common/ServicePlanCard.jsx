import { Card, CardContent, Typography, Box, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Check, Wifi, Users, Shield, Headphones } from 'lucide-react';

const planFeatures = {
  basic: [
    { icon: Wifi, text: 'Up to 50 Mbps' },
    { icon: Users, text: '5 Connected Devices' },
    { icon: Shield, text: 'Basic Security' },
    { icon: Headphones, text: 'Email Support' },
  ],
  premium: [
    { icon: Wifi, text: 'Up to 200 Mbps' },
    { icon: Users, text: '15 Connected Devices' },
    { icon: Shield, text: 'Advanced Security' },
    { icon: Headphones, text: '24/7 Phone Support' },
  ],
  enterprise: [
    { icon: Wifi, text: 'Up to 1 Gbps' },
    { icon: Users, text: 'Unlimited Devices' },
    { icon: Shield, text: 'Enterprise Security' },
    { icon: Headphones, text: 'Dedicated Account Manager' },
  ],
};

export default function ServicePlanCard({ plan, onSelect, selected = false }) {
  const features = planFeatures[plan.type] || [];
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        border: selected ? 2 : 0,
        borderColor: selected ? 'primary.main' : 'transparent',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
      onClick={() => onSelect?.(plan)}
    >
      {plan.popular && (
        <Chip
          label="Most Popular"
          color="secondary"
          size="small"
          sx={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            {plan.name}
          </Typography>
          <Typography variant="h3" component="div" sx={{ mb: 1 }}>
            ${plan.price}
            <Typography variant="body2" component="span" color="text.secondary">
              /month
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.description}
          </Typography>
        </Box>

        <List dense sx={{ mb: 3 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <feature.icon size={16} color="#059669" />
              </ListItemIcon>
              <ListItemText 
                primary={feature.text}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant={selected ? "contained" : "outlined"}
          fullWidth
          size="large"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(plan);
          }}
        >
          {selected ? 'Selected' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
}