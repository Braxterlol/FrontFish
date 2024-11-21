import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CustomToolbar from './Toolbar';
import NavbarListDrawer from './NavbarListDrawer';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  // Toggle para el Drawer
  const handleMenuToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
      {/* Toolbar siempre en la parte superior */}
      <CustomToolbar onMenuClick={handleMenuToggle} />
      
      {/* Drawer debajo del Toolbar */}
      <Box>
        <NavbarListDrawer  open={open} />
      </Box>
    </Box>
  );
}
