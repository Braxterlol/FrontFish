import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CardActions, Divider, TextField, MenuItem, CardMedia, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/pez1-removebg-preview.png';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FishProfiles = () => {
  const [fishData, setFishData] = useState([]);
  const [selectedFishIndex, setSelectedFishIndex] = useState(null);
  const [updatedFish, setUpdatedFish] = useState({ nombre_comun: '', nombre_cientifico: '', edad: '', tamaño: '', peso: '', habitat: '' });
  const [confirmSelection, setConfirmSelection] = useState(false);

  // Fetch all species data from the backend
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const response = await fetch('https://fishmaster.duckdns.org/especies');
        const data = await response.json();
        setFishData(data);
      } catch (error) {
        console.error('Error fetching fish data:', error);
        toast.error("Error al cargar los perfiles de peces.", { position: "top-right" });
      }
    };

    fetchFishData();
  }, []);

  const handleSelectFish = (index) => {
    setSelectedFishIndex(index);
    setUpdatedFish(fishData[index]);
    setConfirmSelection(true); // Show confirmation
  };

  const handleConfirmSelection = async () => {
    const newFishData = fishData.map((fish, index) =>
      index === selectedFishIndex
        ? { ...fish, status: 'activo' }
        : { ...fish, status: 'inactivo' }
    );
    setFishData(newFishData);
    setConfirmSelection(false);
    toast.success("Perfil de pez seleccionado como activo", { position: "top-right" });
  };

  const handleCancelSelection = () => {
    setConfirmSelection(false); // Cancel selection
  };

  const handleEditFish = async () => {
    if (!updatedFish.nombre_comun || !updatedFish.nombre_cientifico || !updatedFish.edad || !updatedFish.tamaño || !updatedFish.peso || !updatedFish.habitat) {
      toast.warn("Por favor, completa todos los campos.", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch(`https://fishmaster.duckdns.org/especies/${fishData[selectedFishIndex].id_especie}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFish)
      });

      if (response.ok) {
        const updatedSpecies = await response.json();
        const newFishData = [...fishData];
        newFishData[selectedFishIndex] = updatedSpecies;
        setFishData(newFishData);
        setSelectedFishIndex(null);
        setUpdatedFish({ nombre_comun: '', nombre_cientifico: '', edad: '', tamaño: '', peso: '', habitat: '' });
        toast.success("Perfil de pez actualizado", { position: "top-right" });
      } else {
        toast.error("Error al actualizar el perfil de pez.", { position: "top-right" });
      }
    } catch (error) {
      console.error('Error editing fish:', error);
      toast.error("Error al actualizar el perfil de pez.", { position: "top-right" });
    }
  };

  const handleDeleteFish = async () => {
    try {
      const response = await fetch(`https://fishmaster.duckdns.org/especies/${fishData[selectedFishIndex].id_especie}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const newFishData = fishData.filter((_, index) => index !== selectedFishIndex);
        setFishData(newFishData);
        setSelectedFishIndex(null);
        setUpdatedFish({ nombre_comun: '', nombre_cientifico: '', edad: '', tamaño: '', peso: '', habitat: '' });
        toast.success("Perfil de pez eliminado", { position: "top-right" });
      } else {
        toast.error("Error al eliminar el perfil de pez.", { position: "top-right" });
      }
    } catch (error) {
      console.error('Error deleting fish:', error);
      toast.error("Error al eliminar el perfil de pez.", { position: "top-right" });
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography color='secondary' variant="h6" align="center" gutterBottom>
        Perfiles de Peces
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {fishData.map((fish, index) => (
          <Card  
            key={index}
            sx={{
              width: '30%',
              marginTop:'2rem',
              marginBottom: 2,
              backgroundColor: fish.status === 'activo' ? '#4caf50' : 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              borderRadius: '8px',
              boxShadow: 5,
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => handleSelectFish(index)}
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
                Estatus: {fish.status === 'activo' ? 'Activo' : 'Inactivo'}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleEditFish(); 
                }}
              >
                <EditIcon color="secondary" />
              </IconButton>
              <IconButton 
                size="small" 
                color="secondary" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteFish(); 
                }}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Edit Fish Details */}
      {selectedFishIndex !== null && !confirmSelection && (
        <Box mb={4} mt={4}>
          <Typography color="secondary" variant="h6" gutterBottom>
            Editar Perfil de Pez
          </Typography>
          <TextField
            fullWidth
            label="Nombre común"
            variant="outlined"
            value={updatedFish.nombre_comun}
            onChange={(e) => setUpdatedFish({ ...updatedFish, nombre_comun: e.target.value })}
            required
            
          />
          <TextField
            fullWidth
            label="Nombre científico"
            variant="outlined"
            value={updatedFish.nombre_cientifico}
            onChange={(e) => setUpdatedFish({ ...updatedFish, nombre_cientifico: e.target.value })}
            required
            style={{ marginTop: '1rem' }}
          />
          <TextField
            fullWidth
            label="Edad"
            variant="outlined"
            value={updatedFish.edad}
            onChange={(e) => setUpdatedFish({ ...updatedFish, edad: e.target.value })}
            required
            style={{ marginTop: '1rem' }}
          />
          <TextField
            fullWidth
            label="Tamaño"
            variant="outlined"
            value={updatedFish.tamaño}
            onChange={(e) => setUpdatedFish({ ...updatedFish, tamaño: e.target.value })}
            required
            style={{ marginTop: '1rem' }}
          />
          <TextField
            fullWidth
            label="Peso"
            variant="outlined"
            value={updatedFish.peso}
            onChange={(e) => setUpdatedFish({ ...updatedFish, peso: e.target.value })}
            required
            style={{ marginTop: '1rem' }}
          />
          <TextField
            fullWidth
            label="Habitat"
            variant="outlined"
            value={updatedFish.habitat}
            onChange={(e) => setUpdatedFish({ ...updatedFish, habitat: e.target.value })}
            required
            style={{ marginTop: '1rem' }}
          />
        </Box>
      )}

      {/* Confirmation for fish selection */}
      {confirmSelection && (
        <Box>
          <Typography variant="h6" align="center" color="secondary" gutterBottom>
            ¿Estás seguro de activar este perfil de pez?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" onClick={handleConfirmSelection}>
              Confirmar
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancelSelection}>
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      <ToastContainer />
    </Container>
  );
};

export default FishProfiles;
