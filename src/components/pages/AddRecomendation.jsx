import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const AddRecomendation = () => {
  const { state } = useLocation(); // Datos enviados desde FishRegistrationForm
  const [formData, setFormData] = useState(state || { edad: '', tamaño: '', peso: '' });
  const [recommendations, setRecommendations] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state) {
      calculateRecommendations(state);
    }
  }, [state]);

  const calculateRecommendations = (data) => {
    // Lógica local para calcular las recomendaciones
    const edad = parseInt(data.edad, 10) || 0;
    const tamaño = parseFloat(data.tamaño) || 0;
    const peso = parseFloat(data.peso) || 0;

    // Ejemplo de reglas básicas para generar recomendaciones
    const frecuenciaAlimentacion = edad < 12 ? '3 veces al día' : '2 veces al día';
    const cantidadAlimento = `${(peso * 0.05).toFixed(2)} g`;
    const temperatura = tamaño < 10 ? 25 : 20; // Temperatura ideal según tamaño
    const ph = tamaño < 10 ? 6.5 : 7.0; // pH recomendado

    setRecommendations({
      frecuencia_alimentacion: frecuenciaAlimentacion,
      cantidad_alimento: cantidadAlimento,
      temperatura,
      ph,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography color="textSecondary" variant="h4" gutterBottom>
        Recomendaciones
      </Typography>

      {recommendations && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography color="textSecondary" variant="subtitle1" fontWeight="bold">
            Recomendaciones Calculadas:
          </Typography>
          <Typography color="textSecondary" variant="body1">
            Frecuencia de alimentación: {recommendations.frecuencia_alimentacion}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            Cantidad de alimento: {recommendations.cantidad_alimento}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            Temperatura: {recommendations.temperatura} °C
          </Typography>
          <Typography color="textSecondary" variant="body1">pH: {recommendations.ph}</Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Button  type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Recomendaciones
        </Button>
        {success && <Alert severity="success" sx={{ mt: 2 }}>¡Recomendación guardada con éxito!</Alert>}
      </Box>
    </Container>
  );
};

export default AddRecomendation;
