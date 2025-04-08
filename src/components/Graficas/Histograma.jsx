import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Registramos los componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Histograma() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setError("No se ha encontrado el token de autenticación.");
          return;
        }

        const response = await axios.get("http://localhost:4000/especies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const especies = response.data;
        const nombresComunes = especies.map((especie) => especie.nombre_comun);

        setData(nombresComunes);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Calcular la frecuencia de cada especie
  const getSpeciesFrequency = (speciesList) => {
    const frequency = {};
    speciesList.forEach((species) => {
      frequency[species] = (frequency[species] || 0) + 1;
    });
    return frequency;
  };

  // Calcular estadísticas (media, mediana, moda)
  const calculateStatistics = (frequencies) => {
    const values = Object.values(frequencies);
    const total = values.reduce((sum, freq) => sum + freq, 0);
    const mean = total / values.length;

    const sortedValues = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    const median =
      sortedValues.length % 2 !== 0
        ? sortedValues[mid]
        : (sortedValues[mid - 1] + sortedValues[mid]) / 2;

    const mode = Object.entries(frequencies).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    )[0];

    return { mean, median, mode };
  };

  // Generar los datos para el histograma
  const generateChartData = () => {
    const speciesFrequency = getSpeciesFrequency(data);
    return {
      labels: Object.keys(speciesFrequency),
      datasets: [
        {
          label: "Cantidad de Peces",
          data: Object.values(speciesFrequency),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Obtener estadísticas
  const speciesFrequency = getSpeciesFrequency(data);
  const stats = calculateStatistics(speciesFrequency);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Histograma de Especies de Peces</h2>
      <div>
        <Bar data={generateChartData()} options={{ responsive: true }} />
      </div>
      <div style={{ marginTop: "20px", color: "black" }}>
        <h3 style={{ color: "black" }}>Estadísticas</h3>
        <p style={{ color: "black" }}><strong>Media:</strong> {stats.mean.toFixed(2)}</p>
        <p style={{ color: "black" }}><strong>Mediana:</strong> {stats.median}</p>
        <p style={{ color: "black" }}><strong>Moda:</strong> {stats.mode}</p>
      </div>
    </div>
  );
}

export default Histograma;
