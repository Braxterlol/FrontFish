import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// Función para calcular la media geométrica
const calculateGeometricMean = (values) => {
  const product = values.reduce((acc, value) => acc * value, 1);
  return Math.pow(product, 1 / values.length);
};

function Media() {
  const [data, setData] = useState([]);
  const [growthRate, setGrowthRate] = useState(0);
  const [predictions, setPredictions] = useState({ week: 0, month: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idUsuarioEspecie = 18; // Cambiar según el estanque que desees analizar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          throw new Error("Token no disponible. Por favor, autentícate.");
        }

        const response = await axios.get("https://fishmaster.duckdns.org/datos/getdatos", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });

        const filteredData = response.data.filter(
          (item) => item.id_usuario_especie === idUsuarioEspecie
        );

        const fishCounts = filteredData.map((item) => parseFloat(item.cantidad_peces));
        setData(fishCounts);

        // Calculamos la media geométrica (crecimiento poblacional)
        const geometricMean = calculateGeometricMean(fishCounts);
        setGrowthRate(geometricMean);

        // Predicción para una semana y un mes
        const lastCount = fishCounts[fishCounts.length - 1] || 0;
        const weeklyPrediction = lastCount * Math.pow(geometricMean, 7);
        const monthlyPrediction = lastCount * Math.pow(geometricMean, 30);

        setPredictions({
          week: weeklyPrediction.toFixed(2),
          month: monthlyPrediction.toFixed(2),
        });

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("No autorizado. Por favor, inicia sesión nuevamente.");
          window.location.href = "/login"; // Opcional: redirige a inicio de sesión
        } else {
          setError("Error al cargar los datos.");
        }
        console.error(err);
      }
    };

    fetchData();
  }, [idUsuarioEspecie]);

  if (loading) {
    return <Typography>Cargando datos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Crecimiento Poblacional de Peces en el Estanque {idUsuarioEspecie}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Dia</TableCell>
              <TableCell align="right">Cantidad de Peces</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((count, index) => (
              <TableRow key={index}>
                <TableCell>Día {index + 1}</TableCell>
                <TableCell align="right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Tasa de Crecimiento Poblacional (Media Geométrica): {growthRate.toFixed(2)}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Predicción de Peces en 1 Semana: {predictions.week}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Predicción de Peces en 1 Mes: {predictions.month}
      </Typography>
    </Container>
  );
}

export default Media;
