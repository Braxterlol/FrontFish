import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Paper } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';  // Librería para formatear la fecha
import Cookies from "js-cookie";

const PHGraph = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Llamada a la API para obtener los datos
    const token = Cookies.get("token");
    axios.get('http://localhost:4000/datos/getdatos', {
      headers: {
        Authorization: `Bearer ${token}`, // Correcto formato
      },
    })// Cambia la URL según sea necesario
      .then((response) => {
        // Mapea los datos y formatea la fecha
        const phData = response.data.map(item => ({
          name: format(new Date(item.fecha), 'dd/MM/yyyy'),  // Formatea la fecha
          ph: item.ph_agua,
        }));
        setData(phData);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <Paper style={{ padding: 16, marginTop: 24 }}>
      <Typography variant="h6" gutterBottom>
        Gráfica de pH en los Estanques
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" /> {/* Ajuste de ángulo de la fecha */}
          <YAxis />
          <Tooltip />
          <br></br><br></br>
          <Legend />
          
          <Line type="monotone" dataKey="ph" stroke="#8884d8" />
          
        </LineChart >
        
      </ResponsiveContainer>
    </Paper>
  );
};

export default PHGraph;
