import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

function TemperatureWaterLevelGraph() {
  const [scatterData, setScatterData] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener todos los datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fishmaster.duckdns.org/datos/getdatos'); // Llamada al backend
        // Asumimos que la respuesta contiene todos los datos de la tabla
        const formattedData = response.data.map((item) => ({
          temperature: item.temperatura_agua, // Ajustar según las columnas de tu tabla
          waterLevel: item.nivel_agua,
        }));
        setScatterData(formattedData);
      } catch (err) {
        setError('Error al cargar los datos del backend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Cargando datos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ marginTop: '60px', padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Relación entre Temperatura y Nivel de Agua
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="temperature" name="Temperatura" unit="°C" />
          <YAxis dataKey="waterLevel" name="Nivel de Agua" unit="m" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Datos" data={scatterData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default TemperatureWaterLevelGraph;
