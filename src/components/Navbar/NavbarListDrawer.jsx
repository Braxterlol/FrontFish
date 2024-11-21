import React from 'react';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

export default function NavbarListDrawer({ open }) {
  const drawerWidth = open ? 240 : 80; // 240 cuando está expandido, 60 cuando está colapsado

  const items = [
    { icon: <HomeIcon />, text: 'Inicio', path: '/Home' },
    { icon: <EqualizerIcon />, text: 'Estadísticas', path: '/Graficas' },
    { icon: <InventoryIcon />, text: 'Registro', path: '/Registro' },
    { icon: <LocalPhoneIcon />, text: 'Perfiles', path: '/Perfiles' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflow: 'hidden',
          marginTop: '64px',
        },
      }}
      open={open}
    >
      <Box>
        <List>
          {items.map(({ icon, text, path }, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} to={path}>
                <ListItemIcon>{icon}</ListItemIcon>
                {open && <ListItemText primary={text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
}
