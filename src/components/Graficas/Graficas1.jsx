// App.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PHChangeGraph from './Phgrafica';
import DeviationBoxPlot from './DeviationBoxPlot';
import CriticalValuesPie from './CriticalValuesPie';
import RiskAnalysis from './RiskAnalysis'; 

function Graficas() {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
      <Box sx={{ marginTop:100 }}>
        <PHChangeGraph />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <DeviationBoxPlot />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <CriticalValuesPie />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        {/* Agregamos el componente de análisis de riesgo */}
        <RiskAnalysis />
      </Box>
    </Container>
  );
}

export default Graficas;
