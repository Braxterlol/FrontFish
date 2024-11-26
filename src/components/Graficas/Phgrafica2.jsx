import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Paper, Button } from '@mui/material';
import Cookies from "js-cookie";

const TemperatureChart = () => {
  const [data, setData] = useState([]); // Todos los datos obtenidos
  const [selectedTankId, setSelectedTankId] = useState(null); // ID del estanque seleccionado
  const [tankData, setTankData] = useState([]); // Datos filtrados para el estanque seleccionado
  const [tankIds, setTankIds] = useState([]); // Lista de IDs de estanques disponibles

  useEffect(() => {
    // Hacer la solicitud a la API
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get('https://fishmaster.duckdns.org/datos/getdatos', {
          headers: {
            Authorization: `Bearer ${token}`, // Correcto formato
          },
        });

        // Agrupar datos por id_usuario_especie
        const groupedData = response.data.reduce((acc, item) => {
          const { id_usuario_especie, temperatura_agua, fecha } = item;
          if (!acc[id_usuario_especie]) acc[id_usuario_especie] = [];
          acc[id_usuario_especie].push({
            temperature: parseFloat(temperatura_agua),
            timestamp: new Date(fecha).toLocaleTimeString(), // Convertir a formato legible
          });
          return acc;
        }, {});

        setData(groupedData);
        setTankIds(Object.keys(groupedData)); // IDs de estanques disponibles
        setSelectedTankId(Object.keys(groupedData)[0]); // Seleccionar el primer estanque por defecto
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar los datos para el estanque seleccionado
    if (selectedTankId && data[selectedTankId]) {
      setTankData(data[selectedTankId]);
    }
  }, [data, selectedTankId]);

  const handlePrevious = () => {
    const currentIndex = tankIds.indexOf(selectedTankId);
    const previousIndex = (currentIndex > 0) ? currentIndex - 1 : tankIds.length - 1;
    setSelectedTankId(tankIds[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = tankIds.indexOf(selectedTankId);
    const nextIndex = (currentIndex < tankIds.length - 1) ? currentIndex + 1 : 0;
    setSelectedTankId(tankIds[nextIndex]);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Estanque ID: {selectedTankId}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" onClick={handlePrevious}>
            Estanque Anterior
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Siguiente Estanque
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={tankData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default TemperatureChart;
