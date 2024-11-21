import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper, Typography } from '@mui/material';

function PHGraph() {
  const [phData, setPHData] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get('https://fishmaster.duckdns.org/datos/getdatos', {
          headers: {
              Authorization: `Bearer ${token}`, // Correcto formato
          },
      }); // Llamada al backend

        // Procesar los datos para adaptarlos al formato esperado
        const formattedData = response.data.map((item, index) => ({
          id: `Estanque ${index + 1}`, // Identificador del estanque
          ph: item.ph_agua, // Ajustar al nombre exacto de la columna en la base de datos
        }));

        setPHData(formattedData);
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
    <Paper sx={{ marginTop: '20px', padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Niveles de pH por Estanque
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={phData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" label={{ value: 'Estanques', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="ph" name="Nivel de pH" barSize={30}>
            {phData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.ph >= 7 ? '#82ca9d' : '#ff4d4d'} // Verde si ph >= 7, rojo si < 7
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PHGraph;
