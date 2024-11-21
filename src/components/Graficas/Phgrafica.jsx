import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Paper, Button } from '@mui/material';
import Cookies from "js-cookie";
const TemperatureChart = () => {
  const [data, setData] = useState([]); // Todos los datos obtenidos
  const [selectedTank, setSelectedTank] = useState(0); // Índice del estanque seleccionado
  const [tankData, setTankData] = useState([]); // Datos filtrados para el estanque seleccionado

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
        const fetchedData = response.data.map((item, index) => ({
          id: index + 1, // Suponiendo que los estanques están numerados
          temperature: item.temperatura_agua, // Ajustar según el nombre exacto de la columna
        }));
        setData(fetchedData);
        setSelectedTank(0); // Seleccionar el primer estanque por defecto
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar los datos para el estanque seleccionado
    const filteredData = data.filter((_, index) => index === selectedTank);
    setTankData(filteredData);
  }, [data, selectedTank]);

  const handlePrevious = () => {
    setSelectedTank((prev) => (prev > 0 ? prev - 1 : data.length - 1));
  };

  const handleNext = () => {
    setSelectedTank((prev) => (prev < data.length - 1 ? prev + 1 : 0));
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Temperatura del Estanque {selectedTank + 1}
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
            <XAxis dataKey="id" />
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
