import React from 'react';
import { Typography, Box, CircularProgress, Card, CardContent, Grid2 } from '@mui/material';

const DonutChart = () => {
  const total = 98500; // Ejemplo de valor total
  const Valor = [85, 70, 60, 90]; // Example values
  const textItems = ['Temperatura', 'PH', 'Nivel de agua'];

  return (
    <Grid2 container spacing={2} justifyContent="center">
      {Valor.map((value, index) => (
        <Grid2 item key={index}>
          <Card sx={{ maxWidth: 200, mx: 'auto', p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box
              justifyContent= 'center'
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  width: '100%',
                  
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={value}
                  size={100}
                  thickness={6}
                  sx={{
                    color: '#7b92b2',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={100}
                  thickness={6}
                  sx={{
                    position: 'absolute',
                    color: '#2f3e54', // Inner ring color
                  }}
                />
                <Box
                justifyContent= 'center'
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h5" component="div" color="textPrimary">
                    {`${(total / 1000).toFixed(1)}°`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" textAlign="center">
                {textItems[index]}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default DonutChart;
