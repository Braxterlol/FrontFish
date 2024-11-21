import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Button,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/pez1-removebg-preview.png';
import DeleteIcon from '@mui/icons-material/Delete';

const FishProfiles = () => {
  const [fishData, setFishData] = useState([]);
  const storedIdEspecie = localStorage.getItem('IdEspecie'); // Obtener el ID almacenado
  const idUsuario = localStorage.getItem('userId'); // Obtener el ID del usuario

  // Fetch all species data from the backend
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch('https://fishmaster.duckdns.org/especies', {
                headers: {
                    Authorization: `Bearer ${token}`, // Correcto formato
                },
            });
        const data = await response.json();
        setFishData(data);
      } catch (error) {
        console.error('Error fetching fish data:', error);
        toast.error('Error al cargar los perfiles de peces.', { position: 'top-right' });
      }
    };

    fetchFishData();
  }, []);

  const handleDeleteFish = async (id_especie) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este perfil de pez y sus recomendaciones?')) {
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://fishmaster.duckdns.org/especies/${id_especie}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newFishData = fishData.filter((fish) => fish.id_especie !== id_especie);
        setFishData(newFishData);
        toast.success('Perfil de pez y sus recomendaciones eliminados exitosamente', {
          position: 'top-right',
        });
      } else if (response.status === 404) {
        toast.error('El perfil de pez no fue encontrado.', { position: 'top-right' });
      } else {
        const errorData = await response.json();
        toast.info(errorData.message || 'No se puede eliminar la especie.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting fish:', error);
      toast.error('Error al eliminar el perfil de pez.', { position: 'top-right' });
    }
  };

  const handleSelectFish = async (id_especie) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch('https://fishmaster.duckdns.org/especies_user', {
        method: 'POST', // Cambiar según tu backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idUsuario,
          idEspecie: id_especie,
        }),
      });

      if (response.ok) {
        localStorage.setItem('IdEspecie', id_especie); // Actualiza el localStorage
        toast.success('Especie seleccionada exitosamente.', { position: 'top-right' });
        setFishData(
          fishData.map((fish) => ({
            ...fish,
            status: fish.id_especie === id_especie ? 'activo' : 'inactivo',
          }))
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'No se pudo seleccionar la especie.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error selecting fish:', error);
      toast.error('Error al seleccionar el perfil de pez.', { position: 'top-right' });
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography color="secondary" variant="h6" align="center" gutterBottom>
        Perfiles de Peces
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {fishData.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No hay perfiles de peces disponibles.
          </Typography>
        ) : (
          fishData.map((fish) => {
            const isActive = fish.id_especie === parseInt(storedIdEspecie, 10); // Verificar si es activo
            return (
              <Card
                key={fish.id_especie}
                sx={{
                  width: '30%',
                  marginTop: '2rem',
                  marginBottom: 2,
                  backgroundColor: isActive ? '#4caf50' : 'white', // Cambiar color si es activo
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  borderRadius: '8px',
                  boxShadow: 5,
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={Logo}
                  alt={`Imagen de ${fish.nombre_comun}`}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {fish.nombre_comun}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edad: {fish.edad} meses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tamaño: {fish.tamaño}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Peso: {fish.peso}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Habitat: {fish.habitat}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estatus: {isActive ? 'Activo (seleccionado)' : 'Inactivo'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleSelectFish(fish.id_especie)}
                  >
                    {isActive ? 'Seleccionado' : 'Seleccionar'}
                  </Button>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handleDeleteFish(fish.id_especie)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>

      <ToastContainer />
    </Container>
  );
};

export default FishProfiles;
