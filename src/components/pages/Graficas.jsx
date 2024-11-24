// App.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PHChangeGraph from '../Graficas/Phgrafica';
import DeviationBoxPlot from '../Graficas/DeviationBoxPlot';
import CriticalValuesPie from '../Graficas/CriticalValuesPie';
import RiskAnalysis from '../Graficas/RiskAnalysis'; 

function Graficas() {
  return (
    <Container sx={{ marginTop: '89rem' }}>
     
      <Box sx={{ marginTop:100 }}>
      <Typography color="textSecondary" variant="h4" align="center" gutterBottom>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
        <PHChangeGraph />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <DeviationBoxPlot />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <CriticalValuesPie />
      </Box>
      <Box sx={{ marginTop: 10, marginBottom:30}}>
        {/* Agregamos el componente de análisis de riesgo */}
        <RiskAnalysis />
      </Box>
    </Container>
  );
}

export default Graficas;
