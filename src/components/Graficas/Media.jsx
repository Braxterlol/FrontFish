import React, { useEffect, useState } from 'react';
import { Button, Typography, Grid, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

// Componente para calcular la media geométrica del crecimiento
const PrediccionCrecimiento = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prediccion, setPrediccion] = useState(null);
  
  // Obtener los datos del servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fishmaster.duckdns.org/datos/getdatos');
        setDatos(response.data); // Establece los datos en el estado
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para calcular la media geométrica
  const calcularMediaGeometrica = (valores) => {
    const producto = valores.reduce((acc, valor) => acc * valor, 1);
    const mediaGeometrica = Math.pow(producto, 1 / valores.length);
    return mediaGeometrica;
  };

  // Función para predecir el crecimiento a una semana
  const predecirCrecimiento = () => {
    if (datos.length === 0) {
      return;
    }

    const pesos = datos.map(dato => dato.cantidad_peces * dato.temperatura); // Ejemplo de cálculo
    const mediaCrecimiento = calcularMediaGeometrica(pesos);

    setPrediccion(mediaCrecimiento);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Predicción de Crecimiento de Peces (Semana)
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={predecirCrecimiento}>
              Calcular Crecimiento
            </Button>
          </Grid>
          
          {prediccion !== null && (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary">
                Predicción del Crecimiento: {prediccion.toFixed(2)} unidades de crecimiento
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default PrediccionCrecimiento;
