import React from 'react';
import { ThemeProvider, Box } from '@mui/material';
import theme from '../temaConfig';

import DonutChart from '../DonutChart/DonutChart';
import Clock from '../Timer/Clock';
import Tabla from '../Tabla/Tabla';

const Inicio = () => {
  return (
    <ThemeProvider  theme={theme}>
      <Box sx={{ 
      
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.default', 
     
        paddingTop: '64px' // Ajustar para el alto del Navbar
      }}>
        
        {/* Contenedor de DonutChart y Clock */}
        <Box alignItems= 'center'
        justifyContent='center'
          sx={{ 
            display: 'flex',
            
            
            padding: 2,
            backgroundColor: 'white',
          }}
        >
          <Box   justifyContent= 'center' sx={{ flexGrow: 1,  marginTop:'70px', display: 'flex', padding: 2}}>
            <DonutChart /> {/* DonutChart al lado izquierdo */}
          </Box>
          <Box justifyContent='center' sx={{   display: 'flex',  padding: 2 }}>
           
          </Box>
        </Box>

        {/* Contenedor de la Tabla en la parte inferior */}
        <Box justifyContent= 'center'
          sx={{ 
            display: 'flex', 
            
            padding: 2,
            marginBottom:30
           
          }}
        >
        
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Inicio;
