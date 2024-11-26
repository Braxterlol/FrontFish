import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EspeciesChart = () => {
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las especies desde el backend
  const fetchEspecies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/especies"); // Cambia por la URL de tu API
      setEspecies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las especies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecies();
  }, []);

  // Agrupar datos por nombre_comun y contar
  const especiesCount = especies.reduce((acc, especie) => {
    acc[especie.nombre_comun] = (acc[especie.nombre_comun] || 0) + 1;
    return acc;
  }, {});

  // Preparar datos para el gráfico
  const data = {
    labels: Object.keys(especiesCount), // Nombres de las especies
    datasets: [
      {
        label: "Cantidad de Peces",
        data: Object.values(especiesCount), // Cantidades por especie
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Especies",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography color="textSecondary" variant="h4" gutterBottom>
        Diagrama de Cantidad de Peces por Especie
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Bar data={data} options={options} />
      )}
    </Box>
  );
};

export default EspeciesChart;
