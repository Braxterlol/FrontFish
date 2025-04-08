import React, { useState, useEffect, useRef } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import {
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Popover,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WaterIcon from '@mui/icons-material/Water';

const DonutChart = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState('');
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    pH: 7.0,
    waterLevel: 'Desconocido',
  });
  const sensorDataRef = useRef(sensorData);

  const config = {
    Temperatura: { ideal: 22, range: 5 },
    PH: { ideal: 7.6, range: 0.5 },
    'Nivel de agua': { ideal: 'Suficiente', range: 0 },
  };

  const getColor = (value, type) => {
    if (type === 'Nivel de agua') {
      return value === 'Suficiente' ? '#4caf50' : '#f44336';
    }
    const { ideal, range } = config[type];
    if (value === ideal) return '#4caf50';
    if (value >= ideal - range && value <= ideal + range) return '#d1d117';
    return '#f44336';
  };

  const textItems = ['Temperatura', 'PH', 'Nivel de agua'];
  const icons = {
    Temperatura: <ThermostatIcon />,
    PH: <WaterDropIcon />,
    'Nivel de agua': <WaterIcon />,
  };

  const handlePopoverOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(`Valor Ideal: ${config[type].ideal}`);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const isDataValid = (data) => {
    if (
      typeof data.temperature !== 'number' || isNaN(data.temperature) || data.temperature <= 0 ||
      typeof data.pH !== 'number' || isNaN(data.pH) || data.pH <= 0 ||
      (data.waterLevel !== 'Suficiente' && data.waterLevel !== 'Falta Agua')
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    sensorDataRef.current = sensorData; // Actualizar el valor de referencia cada vez que cambie sensorData
  }, [sensorData]);

  useEffect(() => {
    const saveDataInterval = setInterval(() => {
      const saveSensorData = async () => {
        try {
          const token = Cookies.get("token");
          const currentData = sensorDataRef.current;
          if (!isDataValid(currentData)) {
            console.warn("Datos incompletos o inválidos, no se envía la solicitud.");
            return;
          }

         const dataToSave = {
  id_usuario_especie: 1,
  temperatura: parseFloat(currentData.temperature),
  ph: parseFloat(currentData.pH),
  nivel: currentData.waterLevel === 'Suficiente' ? 1 : 0,
  cantidad_peces: 10, // valor numérico explícito
};


          console.log("Datos que se van a guardar:", dataToSave);
          const response = await axios.post(
            'http://localhost:4000/datos/createdatos',
            dataToSave,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('Respuesta del servidor:', response.data);
        } catch (error) {
          console.error('Error al guardar los datos:', error.response?.data || error.message);
        }
      };

      saveSensorData();
    }, 9000); // 9 segundos

    return () => clearInterval(saveDataInterval); // Limpiar el intervalo al desmontar
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido:', data);

        if (data.event === 'rabbitmq_message') {
          const messageParts = data.data.split(', Mensaje: ');
          const queue = messageParts[0].split(': ')[1]; // Extraer "Cola"
          const message = messageParts[1]; // Extraer "Mensaje"
          
          setSensorData((prevData) => {
            const updatedData = { ...prevData };
            
            if (queue === 'temperature_data') {
              try {
                // Intentar analizar el mensaje como JSON válido primero
                const parsedMessage = JSON.parse(message.replace(/'/g, '"'));
                if (parsedMessage && typeof parsedMessage.temperature === 'number') {
                  updatedData.temperature = parsedMessage.temperature;
                } else {
                  // Si no es un objeto con temperatura, intentar extraer directamente
                  const temperatureMatch = message.match(/temperature': (\d+\.\d+)/);
                  if (temperatureMatch && temperatureMatch[1]) {
                    updatedData.temperature = parseFloat(temperatureMatch[1]);
                  }
                }
              } catch (parseError) {
                console.error("Error al procesar el mensaje de temperatura:", parseError);
                // Intentar extraer el valor de temperatura con regex como fallback
                const temperatureMatch = message.match(/temperature': (\d+\.\d+)/);
                if (temperatureMatch && temperatureMatch[1]) {
                  updatedData.temperature = parseFloat(temperatureMatch[1]);
                }
              }
            } else if (queue === 'datos') {
              if (message.includes('CIRCUITO ABIERTO')) {
                updatedData.waterLevel = 'Falta Agua';
              } else if (message.includes('CIRCUITO CERRADO')) {
                updatedData.waterLevel = 'Suficiente';
              }
            }
            
            return updatedData;
          });
        }
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('Conexión WebSocket cerrada:', event.reason || 'Sin razón proporcionada');
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error.message || error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Box sx={{ textAlign: 'center', my: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary">
          Significado de colores
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <span style={{ color: '#4caf50' }}>🟢</span> Ideal &nbsp;
          <span style={{ color: '#d1d117' }}>🟡</span> Aceptable &nbsp;
          <span style={{ color: '#f44336' }}>🔴</span> Riesgo
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
        {textItems.map((item, index) => (
          <Card key={index} sx={{ width: 300 }}>
            <CardContent>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <IconButton
                  onMouseEnter={(event) => handlePopoverOpen(event, item)}
                  onMouseLeave={handlePopoverClose}
                  aria-label="show ideal value"
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>

              <Popover
                id={`popover-${item}`}
                sx={{ pointerEvents: 'none' }}
                open={open && popoverContent === `Valor Ideal: ${config[item].ideal}`}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Box sx={{ p: 2, width: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    {popoverContent}
                  </Typography>
                </Box>
              </Popover>

              <Box
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={140}
                  thickness={5}
                  sx={{
                    color: getColor(
                      item === 'Temperatura'
                        ? sensorData.temperature
                        : item === 'PH'
                        ? sensorData.pH
                        : sensorData.waterLevel,
                      item
                    ),
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
                  }}
                />
                <Box position="absolute" display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="h5" color="textPrimary">
                    {item === 'Temperatura'
                      ? sensorData.temperature.toFixed(2)
                      : item === 'PH'
                      ? sensorData.pH.toFixed(2)
                      : sensorData.waterLevel}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                {icons[item]}
                <Typography variant="h6" align="center" color="textSecondary" sx={{ ml: 1 }}>
                  {item}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DonutChart;