import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

function RiskAnalysis() {
  const [data, setData] = useState([]); // Datos de la API
  const [riskAnalysis, setRiskAnalysis] = useState([]); // Análisis de riesgo reducido
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("https://fishmaster.duckdns.org/datos/getdatos", {
          headers: {
            Authorization: `Bearer ${token}`, // Autorización con token
          },
        });

        const formattedData = response.data.map((item) => ({
          id_usuario_especie: item.id_usuario_especie,
          temperatura_agua: parseFloat(item.temperatura_agua),
          ph_agua: parseFloat(item.ph_agua),
          fecha: new Date(item.fecha), // Convertir a objeto Date para filtrar por tiempo
        }));

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del backend");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter((item, index) => {
        // Filtrar para incluir solo un dato cada 1 hora
        const oneHourInMs = 1 * 60 * 60 * 1000;
        if (index === 0) return true; // Incluir siempre el primer dato
        const prevItem = data[index - 1];
        return item.fecha - prevItem.fecha >= oneHourInMs;
      });

      const analyzeRisk = filteredData.map((item) => {
        const { temperatura_agua, ph_agua, id_usuario_especie } = item;

        // Análisis de riesgo basado en pH
        let phRisk = "Óptimo";
        if (ph_agua < 5.5 || ph_agua > 8.5) phRisk = "Letal";
        else if ((ph_agua >= 5.5 && ph_agua < 6.5) || (ph_agua > 8.0 && ph_agua <= 8.5)) phRisk = "Estrés";

        // Análisis de riesgo basado en temperatura
        let tempRisk = "Óptimo";
        if (temperatura_agua < 18 || temperatura_agua > 32) tempRisk = "Letal";
        else if ((temperatura_agua >= 18 && temperatura_agua < 22) || (temperatura_agua > 28 && temperatura_agua <= 32)) tempRisk = "Estrés";

        // Determinar riesgo combinado
        let combinedRisk = "Bajo";
        if (phRisk === "Letal" || tempRisk === "Letal") combinedRisk = "Alto";
        else if (phRisk === "Estrés" || tempRisk === "Estrés") combinedRisk = "Moderado";

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
      <Typography variant="h5" color="textSecondary" gutterBottom>
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
