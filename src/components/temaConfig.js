import { createTheme } from "@mui/material";


const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff', // Ensures a white background
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif',
    },
   
  },
});

export default theme;
