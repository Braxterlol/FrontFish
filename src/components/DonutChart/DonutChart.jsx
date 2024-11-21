import React, { useState, useEffect } from 'react';
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

  const saveSensorData = async (temperature, pH) => {
    try {
      const storedIdEspecie = localStorage.getItem('IdEspecie');
      const response = await fetch('https://fishmaster.duckdns.org/recomendaciones/createrecomedation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_especie: storedIdEspecie,
          frecuencia_alimentacion: '30',
          cantidad_alimento: '200g',
          temperatura_agua: temperature.toFixed(2),
          ph_agua: pH.toFixed(2),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
      } else {
        console.error('Error al guardar los datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://3.233.63.214:8080'); // Cambia la URL según tu servidor WebSocket

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === 'rabbitmq_message') {
          const messageParts = data.data.split(', Mensaje: ');
          const queue = messageParts[0].split(': ')[1];
          const message = messageParts[1];

          setSensorData((prevData) => {
            const updatedData = { ...prevData };

            if (queue === 'temperature_data') {
              const temperature = parseFloat(message);
              updatedData.temperature = temperature;

              saveSensorData(temperature, prevData.pH);
            } else if (queue === 'datos') {
              if (message.startsWith('pH')) {
                const pH = parseFloat(message.split('|')[0].split(': ')[1]);
                updatedData.pH = pH;

                saveSensorData(prevData.temperature, pH);
              } else if (message.includes('CIRCUITO CERRADO')) {
                updatedData.waterLevel = 'Falta Agua';
              } else if (message.includes('CIRCUITO ABIERTO')) {
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

  const getNormalizedValue = (value, type) => {
    if (type === 'Nivel de agua') return value === 'Suficiente' ? 100 : 0;
    const { ideal, range } = config[type];
    const min = ideal - range;
    const max = ideal + range;
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  };

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
                  value={getNormalizedValue(
                    item === 'Temperatura'
                      ? sensorData.temperature
                      : item === 'PH'
                      ? sensorData.pH
                      : sensorData.waterLevel,
                    item
                  )}
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
