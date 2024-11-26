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
        });

        // Agrupar datos por id_usuario_especie y calcular pH promedio si hay varios registros
        const groupedData = response.data.reduce((acc, item) => {
          const { id_usuario_especie, ph_agua } = item;
          if (!acc[id_usuario_especie]) acc[id_usuario_especie] = { id: `Estanque ${id_usuario_especie}`, phValues: [] };
          acc[id_usuario_especie].phValues.push(parseFloat(ph_agua));
          return acc;
        }, {});

        // Formatear datos para la gráfica (calcular promedio de pH)
        const formattedData = Object.values(groupedData).map(estanque => ({
          id: estanque.id,
          ph: (
            estanque.phValues.reduce((sum, val) => sum + val, 0) / estanque.phValues.length
          ).toFixed(2), // Promedio de pH con 2 decimales
        }));

        setPHData(formattedData);
      } catch (err) {
        setError('Error al cargar los datos del backend');
        console.error(err);
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
