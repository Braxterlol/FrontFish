import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import axios from 'axios';


const AddRecomendation = () => {
  const [formData, setFormData] = useState({
    edad: '',
    tamaño: '',
    peso: '',
  });
  const [recommendations, setRecommendations] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateRecommendations = async () => {
    try {
      const response = await axios.post('https://fishmaster.duckdns.org/calcular_recomendaciones', formData);
      setRecommendations(response.data);
      setError(null);
    } catch (err) {
      setRecommendations(null);
      setError('Error al calcular las recomendaciones.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí se enviaría el formulario al backend si se desea guardar
      console.log('Datos enviados:', recommendations || formData);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setError('Error al guardar la recomendación.');
    }
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Agregar Recomendación
      </Typography>
  
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Tamaño"
          name="tamaño"
          value={formData.tamaño}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Peso"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button variant="contained" color="primary" onClick={calculateRecommendations} sx={{ mt: 2 }}>
          Calcular Recomendaciones
        </Button>
      </Box>
  
      {recommendations && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#ffffff', // Fondo blanco
            color: '#000', // Letras negras
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra suave
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Recomendaciones Calculadas:
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#000', fontWeight: 'bold', marginBottom: '8px' }} // Asegura que sea negro y claro
          >
            Frecuencia de alimentación: {recommendations.frecuencia_alimentacion}
          </Typography>
          <Typography variant="body1" sx={{ color: '#000', marginBottom: '8px' }}>
            Cantidad de alimento: {recommendations.cantidad_alimento}
          </Typography>
          <Typography variant="body1" sx={{ color: '#000', marginBottom: '8px' }}>
            Temperatura: {recommendations.temperatura} °C
          </Typography>
          <Typography variant="body1" sx={{ color: '#000', marginBottom: '8px' }}>
            pH: {recommendations.ph}
          </Typography>
        </Box>
      )}
  
      <Box component="form" onSubmit={handleSubmit}>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Recomendación
        </Button>
        {success && <Alert severity="success" sx={{ mt: 2 }}>¡Recomendación guardada con éxito!</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};  

export default AddRecomendation;
