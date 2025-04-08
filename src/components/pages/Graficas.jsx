import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PHChangeGraph from '../Graficas/Phgrafica';
import DeviationBoxPlot from '../Graficas/DeviationBoxPlot';
import RiskAnalysis from '../Graficas/RiskAnalysis'; 
import Histograma from '../Graficas/Histograma';  
import Desviacion from '../Graficas/Desviacion';  
import Tabla from '../Graficas/Datos'
import GraficaPh from '../Graficas/graficaPH'

function Graficas() {
  return (
    <Container>
      <Typography sx={{ marginTop: '140rem' }} variant="h4" align="center" gutterBottom color='black'>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
      
      
      <Box sx={{ marginTop: 120 }}>
        <PHChangeGraph />
        <GraficaPh/>
      </Box>
      
    
      <Box sx={{ marginTop: 10 }}>
        <DeviationBoxPlot />
      </Box>

     
      <Box sx={{ marginTop: 10 }}>
        <RiskAnalysis />
      </Box>
   
      <Box sx={{ marginTop: 10 }}>
        <Histograma />
      </Box>

      <Box sx={{ marginTop: 10, marginBottom:'10rem' }}>
        <Desviacion />
        <Tabla/>
      </Box>
     
      
    </Container>
  );
}

export default Graficas;
