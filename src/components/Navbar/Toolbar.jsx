import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../assets/logo1.png';

export default function CustomToolbar({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          minHeight: 64,
          height: 64,
          marginBottom: 2,
          
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: 'none',
        }}
      >
        <Toolbar
        justifyContent= 'space-between'
          sx={{
            minHeight: 64,
            display: 'flex',
            
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2,
              boxShadow:'none'
             }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              height: '100%', // Ajusta la altura relativa
              width: 'auto', // Mantiene la proporción
              maxHeight: 48, // Ajusta el tamaño máximo
              marginRight: 2,
              boxShadow: 'none',
            }}
          />

          <Typography variant="h6"  sx={{ flexGrow: 1 }}>
            FishMaster
          </Typography>

          
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
        
        </Toolbar>
      </AppBar>

      <Toolbar />
    </Box>
  );
}
