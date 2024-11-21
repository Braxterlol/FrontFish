// App.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PHChangeGraph from '../Graficas/Phgrafica';
import DeviationBoxPlot from '../Graficas/DeviationBoxPlot';
import CriticalValuesPie from '../Graficas/CriticalValuesPie';

function Graficas() {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
      <Box sx={{ marginTop: 100 }}>
        <PHChangeGraph />
      </Box>
      <DeviationBoxPlot />
  
    </Container>
  );
}

export default Graficas;
