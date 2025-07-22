import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ title, value, icon: Icon, color = 'primary', trend, subtitle }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: `${color}.light`,
                color: 'white',
              }}
            >
              <Icon size={24} />
            </Box>
          )}
        </Box>
        {trend && (
          <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}