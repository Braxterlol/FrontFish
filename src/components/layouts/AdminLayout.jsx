// AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, Box } from '@mui/material';
import theme from '../temaConfig'; // Tema con la fuente configurada
import Navbar from '../Navbar/Navbar'; // Usa tu Navbar aquí

const AdminLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', backgroundColor: 'background.default', minHeight: '100vh', width: '100vw' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, paddingTop: '64px' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
