import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from "@mui/material";

// Función para calcular la desviación estándar de una muestra
const calculateStandardDeviation = (values) => {
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
};

// Evaluar si la desviación es alta o baja
const evaluateStandardDeviation = (stdDev, threshold) => {
  return stdDev > threshold ? "Alta" : "Baja";
};

function Desviacion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tempThreshold = 2; // Umbral para temperatura
  const phThreshold = 0.5; // Umbral para pH

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://localhost:4000/datos/getdatos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedData = response.data.map((item) => ({
          id_usuario_especie: item.id_usuario_especie,
          temperatura_agua: parseFloat(item.temperatura_agua),
          ph_agua: parseFloat(item.ph_agua),
          fecha: new Date(item.fecha).toLocaleDateString(), // Agrupar por fecha (día)
        }));

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Agrupar datos por fecha (día)
  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.fecha]) {
        acc[item.fecha] = { temperatura: [], ph: [] };
      }
      acc[item.fecha].temperatura.push(item.temperatura_agua);
      acc[item.fecha].ph.push(item.ph_agua);
      return acc;
    }, {});
  };

  const groupedData = groupByDate(data);

  // Calcular desviación estándar por cada día
  const calculateDeviations = () => {
    const deviations = [];
    for (const date in groupedData) {
      const temperatura = groupedData[date].temperatura;
      const ph = groupedData[date].ph;

      const tempStdDev = calculateStandardDeviation(temperatura);
      const phStdDev = calculateStandardDeviation(ph);

      const tempDeviation = evaluateStandardDeviation(tempStdDev, tempThreshold);
      const phDeviation = evaluateStandardDeviation(phStdDev, phThreshold);

      deviations.push({
        fecha: date,
        temperaturaStdDev: tempStdDev.toFixed(2),
        tempDeviation,
        phStdDev: phStdDev.toFixed(2),
        phDeviation,
      });
    }
    return deviations;
  };

  const deviationsData = calculateDeviations();

  if (loading) {
    return <Typography>Cargando datos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Desviación Estándar de Temperatura y pH por Día
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Desviación Estándar Temperatura (°C)</TableCell>
              <TableCell align="right">Nivel Temperatura</TableCell>
              <TableCell align="right">Desviación Estándar pH</TableCell>
              <TableCell align="right">Nivel pH</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviationsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.fecha}</TableCell>
                <TableCell align="right">{row.temperaturaStdDev}</TableCell>
                <TableCell align="right">{row.tempDeviation}</TableCell>
                <TableCell align="right">{row.phStdDev}</TableCell>
                <TableCell align="right">{row.phDeviation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {deviationsData.some((row) => row.tempDeviation === "Alta" || row.phDeviation === "Alta") && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          Atención: Se detectaron desviaciones altas en la temperatura o el pH. Revise y corrija los valores.
        </Alert>
      )}
    </Container>
  );
}

export default Desviacion;
