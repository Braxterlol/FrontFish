import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Logo from '../../assets/pez1-removebg-preview.png';
import axios from 'axios';

const FishRegistrationForm = () => {
  const [nombreComun, setNombreComun] = useState('');
  const [customNombreComun, setCustomNombreComun] = useState('');
  const [nombreCientifico, setNombreCientifico] = useState('');
  const [edad, setEdad] = useState('');
  const [tamano, setTamano] = useState('');
  const [peso, setPeso] = useState('');
  const [habitat, setHabitat] = useState('');
  const [customHabitat, setCustomHabitat] = useState('');
  const [fishData, setFishData] = useState([]);

  const fishOptions = ['Tilapia', 'Trucha', 'Salmon', 'Pez gato', 'Otro'];
  const habitatOptions = ['Río', 'Lago', 'Acuario', 'Océano', 'Otro'];

  const navigate = useNavigate(); // Inicializar navigate

  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get('https://fishmaster.duckdns.org/especies', {
          headers: {
            Authorization: `Bearer ${token}`, // Correcto formato
          },
        });
        setFishData(response.data);
      } catch (error) {
        toast.error('Error al cargar los registros de especies.', { position: 'top-right' });
      }
    };
    fetchFishData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombreComun ||
      (nombreComun === 'Otro' && !customNombreComun) ||
      !nombreCientifico ||
      !edad ||
      !tamano ||
      !peso ||
      !habitat ||
      (habitat === 'Otro' && !customHabitat)
    ) {
      toast.warn('Por favor, completa todos los campos.', {
        position: 'top-center',
      });
      return;
    }

    const finalNombreComun = nombreComun === 'Otro' ? customNombreComun : nombreComun;
    const finalHabitat = habitat === 'Otro' ? customHabitat : habitat;

    const newFish = {
      nombre_comun: finalNombreComun,
      nombre_cientifico: nombreCientifico,
      edad,
      tamaño: tamano,
      peso,
      habitat: finalHabitat,
    };

    try {
      const token = Cookies.get("token");

      // Registrar la especie
      const response = await axios.post(
        'https://fishmaster.duckdns.org/especies',
        newFish,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correcto formato
          },
        }
      );
      const idEspecie = response.data.especie.id;

      const idUsuario = localStorage.getItem('userId');
      localStorage.setItem('IdEspecie', idEspecie);

      // Asignar especie al usuario
      await axios.post(
        'https://fishmaster.duckdns.org/especies_user',
        { idUsuario, idEspecie }, // Datos como cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correcto formato
          },
        }
      );

      toast.success('Registro o actualización de especie exitosa', {
        position: 'top-right',
        autoClose: 4000,
      });

      setFishData([...fishData, newFish]);

      // Resetear los campos
      setNombreComun('');
      setCustomNombreComun('');
      setNombreCientifico('');
      setEdad('');
      setTamano('');
      setPeso('');
      setHabitat('');
      setCustomHabitat('');

      // Redirigir al usuario
      navigate('/Recomendacion');
    } catch (error) {
      toast.error('Error al registrar la especie o asignarla al usuario.', {
        position: 'top-right',
      });
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const validateText = (text) => /^[a-zA-Z\s]*$/.test(text);
  const validateNumber = (num) => /^\d*$/.test(num);

  return (
    <Container display="flex" justifyContent="center" alignItems="center" maxWidth="sm" style={{ marginTop: '15rem' }}>
      <Box
        border={2}
        borderColor="grey.300"
        borderRadius={2}
        p={4}
        style={{ position: 'relative', paddingTop: '4rem' }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            marginTop: '-50px',
            width: '100%',
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              width: '170px',
              height: '170px',
              backgroundColor: '#2d80b9',
              borderRadius: '50%',
              marginTop: '-90px',
            }}
          >
            <img src={Logo} alt="Fish Hatchery Logo" width="160" />
          </Box>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          Registro de Especies
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              select
              fullWidth
              label="Nombre común"
              variant="outlined"
              value={nombreComun}
              onChange={(e) => setNombreComun(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            >
              {fishOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {nombreComun === 'Otro' && (
            <Box mb={2}>
              <TextField
                fullWidth
                label="Especifica el nombre común"
                variant="outlined"
                value={customNombreComun}
                onChange={(e) => validateText(e.target.value) && setCustomNombreComun(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                    },
                    '&:hover fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'black', // Cambiar color del texto a negro
                  },
                  '& .MuiInputLabel-root': {
                    color: '#7a7c7e', // Cambiar color del label a negro
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                  },
                }}
              />
            </Box>
          )}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Nombre científico"
              variant="outlined"
              value={nombreCientifico}
              onChange={(e) => validateText(e.target.value) && setNombreCientifico(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Edad (meses)"
              variant="outlined"
              type="number"
              value={edad}
              onChange={(e) => validateNumber(e.target.value) && setEdad(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Tamaño (cm)"
              variant="outlined"
              type="number"
              value={tamano}
              onChange={(e) => validateNumber(e.target.value) && setTamano(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Peso (gramos)"
              variant="outlined"
              type="number"
              value={peso}
              onChange={(e) => validateNumber(e.target.value) && setPeso(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              fullWidth
              label="Hábitat"
              variant="outlined"
              value={habitat}
              onChange={(e) => setHabitat(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                  },
                  '&:hover fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black', // Cambiar color del texto a negro
                },
                '& .MuiInputLabel-root': {
                  color: '#7a7c7e', // Cambiar color del label a negro
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                },
              }}
            >
              {habitatOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {habitat === 'Otro' && (
            <Box mb={2}>
              <TextField
                fullWidth
                label="Especifica el hábitat"
                variant="outlined"
                value={customHabitat}
                onChange={(e) => validateText(e.target.value) && setCustomHabitat(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el color del borde a negro
                    },
                    '&:hover fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde al pasar el cursor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7a7c7e', // Cambiar el borde cuando el campo está enfocado
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'black', // Cambiar color del texto a negro
                  },
                  '& .MuiInputLabel-root': {
                    color: '#7a7c7e', // Cambiar color del label a negro
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#7a7c7e', // Asegurar que el label enfocado también sea negro
                  },
                }}
              />
            </Box>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrar
          </Button>
        </form>

        <ToastContainer />
      </Box>
    </Container>
  );
};

export default FishRegistrationForm;
