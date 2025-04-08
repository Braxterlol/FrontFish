import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { erf } from "mathjs";  // Importamos la función erf de mathjs

// Función para calcular la CDF de la distribución normal
const normalCDF = (x, mean, stdDev) => {
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
};

function RiskAnalysis() {
  const [data, setData] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const phMean = 7; // Media del pH
  const phStdDev = 0.5; // Desviación estándar del pH
  const tempMean = 25; // Media de la temperatura
  const tempStdDev = 3; // Desviación estándar de la temperatura

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
          fecha: new Date(item.fecha),
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

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter((item, index) => {
        const oneHourInMs = 1 * 60 * 60 * 1000;
        if (index === 0) return true;
        const prevItem = data[index - 1];
        return item.fecha - prevItem.fecha >= oneHourInMs;
      });

      const analyzeRisk = filteredData.map((item) => {
        const { temperatura_agua, ph_agua, id_usuario_especie } = item;

        // Calcular probabilidades de desastre para pH usando la distribución normal
        const phProbability = normalCDF(ph_agua, phMean, phStdDev); // Probabilidad de que el pH esté dentro de un rango crítico

        // Calcular probabilidades de desastre para temperatura usando la distribución normal
        const tempProbability = normalCDF(temperatura_agua, tempMean, tempStdDev); // Probabilidad de que la temperatura esté fuera del rango seguro

        let phRisk = "Óptimo";
        let tempRisk = "Óptimo";

        if (phProbability < 0.05) phRisk = "Letal"; // Si la probabilidad de pH fuera del rango seguro es baja (menos de 5%)
        if (tempProbability < 0.05) tempRisk = "Letal"; // Lo mismo para la temperatura

        let combinedRisk = "Bajo";
        if (phRisk === "Letal" || tempRisk === "Letal") combinedRisk = "Alto";

        return {
          id_usuario_especie,
          temperatura_agua,
          ph_agua,
          phRisk,
          tempRisk,
          combinedRisk,
        };
      });

      setRiskAnalysis(analyzeRisk);
    }
  }, [data]);

  if (loading) {
    return <Typography>Cargando datos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Análisis de Riesgo por Estanque (Muestras Cada 1 Hora)
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Estanque (ID Usuario Especie)</TableCell>
              <TableCell align="right">Temperatura (°C)</TableCell>
              <TableCell align="right">pH</TableCell>
              <TableCell align="right">Riesgo pH</TableCell>
              <TableCell align="right">Riesgo Temperatura</TableCell>
              <TableCell align="right">Riesgo Combinado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riskAnalysis.map((row) => (
              <TableRow key={row.id_usuario_especie}>
                <TableCell>{row.id_usuario_especie}</TableCell>
                <TableCell align="right">{row.temperatura_agua}</TableCell>
                <TableCell align="right">{row.ph_agua}</TableCell>
                <TableCell align="right">{row.phRisk}</TableCell>
                <TableCell align="right">{row.tempRisk}</TableCell>
                <TableCell align="right">{row.combinedRisk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default RiskAnalysis;
