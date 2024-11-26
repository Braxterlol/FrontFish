import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PHChangeGraph from '../Graficas/Phgrafica';
import DeviationBoxPlot from '../Graficas/DeviationBoxPlot';
import CriticalValuesPie from '../Graficas/CriticalValuesPie2';
import RiskAnalysis from '../Graficas/RiskAnalysis'; 
import Histograma from '../Graficas/Histograma';  // Asegúrate de que la ruta sea correcta
import Desviacion from '../Graficas/Desviacion';  // Importa el componente Desviacion
import Tabla from '../Graficas/Datos'
import GraficaPh from '../Graficas/graficaPH'
import Crecimiento from '../Graficas/Crecimiento'
function Graficas() {
  return (
    <Container>
      <Typography sx={{ marginTop: '110rem' }} variant="h4" align="center" gutterBottom>
        Monitoreo Estadístico de Criadero de Peces
      </Typography>
      
      {/* Gráfico de Cambio de PH */}
      <Box sx={{ marginTop: 150 }}>
        <PHChangeGraph />
        <GraficaPh/>
      </Box>
      
      {/* BoxPlot de Desviación */}
      <Box sx={{ marginTop: 10 }}>
        <DeviationBoxPlot />
      </Box>

      {/* Análisis de Riesgo */}
      <Box sx={{ marginTop: 10 }}>
        <RiskAnalysis />
      </Box>
      
      {/* Histograma de Especies */}
      <Box sx={{ marginTop: 10 }}>
        <Histograma />
      </Box>

      {/* Agregamos el componente de desviación estándar */}
      <Box sx={{ marginTop: 10, marginBottom:'10rem' }}>
        <Desviacion />
        <Tabla/>
   {/* Este es el nuevo componente que muestra la desviación estándar */}
      </Box>
     
      
    </Container>
  );
}

export default Graficas;
