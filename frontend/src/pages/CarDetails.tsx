
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, ElectricCar, Speed, BatteryChargingFull, Euro } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { backendService } from '../services/backendService';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => backendService.getById(id!),
    enabled: !!id,
  });
  console.log('Car Details:', car, id);
  
  // Log car details whenever they are fetched or updated
  useEffect(() => {
    if (car) {
      console.log('Fetched Car Details:', car);
    }
  }, [car]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !car) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error ? 'Error loading car details' : car.toString()}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
        >
          Back to Grid
        </Button>
      </Box>
    );
  }

  // Move specifications inside the render section after all the checks
  const specifications = [
    { label: 'Brand', value: car.Brand, icon: <ElectricCar /> },
    { label: 'Model', value: car.Model },
    { label: 'Acceleration (0-100 km/h)', value: `${car.AccelSec} seconds`, icon: <Speed /> },
    { label: 'Top Speed', value: `${car.TopSpeed_KmH} km/h` },
    { label: 'Range', value: `${car.Range_Km} km`, icon: <BatteryChargingFull /> },
    { label: 'Efficiency', value: `${car.Efficiency_WhKm} Wh/km` },
    { label: 'Fast Charging Speed', value: `${car.FastCharge_KmH} km/h` },
    { label: 'Rapid Charge Available', value: car.RapidCharge },
    { label: 'Powertrain', value: car.PowerTrain },
    { label: 'Plug Type', value: car.PlugType },
    { label: 'Body Style', value: car.BodyStyle },
    { label: 'Segment', value: car.Segment },
    { label: 'Number of Seats', value: car.Seats.toString() },
    { label: 'Price', value: `€${car.PriceEuro.toLocaleString()}`, icon: <Euro /> },
    { label: 'Date', value: car.Date }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
        >
          Back to Grid
        </Button>
        <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
          {car.Brand} {car.Model}
        </Typography>
        <Chip 
          label={car.Segment} 
          color="primary" 
          size="medium"
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Key Stats Card */}
        <Box sx={{ width: { xs: '100%', md: '33.333%' }, p: 1.5 }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Key Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box>
                  <Typography variant="h3" component="div">
                    {car.Range_Km}
                  </Typography>
                  <Typography variant="body2">
                    km Range
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" component="div">
                    {car.AccelSec}s
                  </Typography>
                  <Typography variant="body2">
                    0-100 km/h
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" component="div">
                    €{car.PriceEuro.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Starting Price
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Detailed Specifications */}
        <Box sx={{ width: { xs: '100%', md: '66.667%' }, p: 1.5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Detailed Specifications
            </Typography>
            <Grid container spacing={2}>
              {specifications.map((spec, index) => (
                <Box key={index} sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main'
                    }
                  }}>
                    {spec.icon && (
                      <Box sx={{ color: 'primary.main', mr: 1 }}>
                        {spec.icon}
                      </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {spec.label}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {spec.value}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Technical Features */}
        <Box sx={{ width: '100%', p: 1.5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Technical Features
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              <Chip label={`${car.PowerTrain} Powertrain`} variant="outlined" />
              <Chip label={car.PlugType} variant="outlined" />
              <Chip label={car.BodyStyle} variant="outlined" />
              <Chip 
                label={car.RapidCharge === 'Yes' ? 'Rapid Charging' : 'Standard Charging'} 
                color={car.RapidCharge === 'Yes' ? 'success' : 'default'}
                variant="outlined" 
              />
              <Chip label={`${car.Seats} Seats`} variant="outlined" />
              <Chip label={`${car.Efficiency_WhKm} Wh/km Efficiency`} variant="outlined" />
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Box>
  );
};

export default CarDetails;
