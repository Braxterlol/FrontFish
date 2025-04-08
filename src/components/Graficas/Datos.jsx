import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import Cookies from "js-cookie";
const DatosEstanque = () => {
  const [datos, setDatos] = useState([]);
  const [page, setPage] = useState(0); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página

  // Obtener datos del servidor
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get('http://localhost:4000/datos/getdatos', {
          headers: {
            Authorization: `Bearer ${token}`, // Correcto formato
          },
        }); // URL de tu API
        setDatos(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDatos();
  }, []);

  // Exportar datos a Excel
  const exportToExcel = () => {
    const datosConvertidos = datos.map((dato) => ({
      ...dato,
      nivel_agua: convertirNivelAgua(dato.nivel_agua), // Convertir nivel de agua antes de exportar
    }));

    const ws = XLSX.utils.json_to_sheet(datosConvertidos); // Convierte los datos a un formato de hoja de Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Estanque'); // Crea el libro y agrega la hoja
    XLSX.writeFile(wb, 'datos_estanque.xlsx'); // Descarga el archivo
  };

  // Función para convertir 0/1 en texto
  const convertirNivelAgua = (nivel) => {
    return nivel === 0 ? 'Falta Agua' : 'Suficiente';
  };

  // Manejo de la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear la página cuando se cambian las filas por página
  };

  // Datos a mostrar en la página actual
  const paginatedDatos = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2>Datos del Estanque</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={exportToExcel}
        style={{ marginBottom: 20 }}
      >
        Exportar a Excel
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Dato Estanque</TableCell> {/* Nueva columna para id_dato_estanque */}
              <TableCell>ID Usuario Especie</TableCell>
              <TableCell>Temperatura</TableCell>
              <TableCell>PH</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Cantidad de Peces</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDatos.map((dato, index) => (
              <TableRow key={index}>
                <TableCell>{dato.id_dato_estanque}</TableCell> {/* Mostrar el id_dato_estanque */}
                <TableCell>{dato.id_usuario_especie}</TableCell>
                <TableCell>{dato.temperatura_agua}</TableCell>
                <TableCell>{dato.ph_agua}</TableCell>
                <TableCell>{convertirNivelAgua(dato.nivel_agua)}</TableCell>
                <TableCell>{dato.cantidad_peces}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={datos.length} // Total de filas
        page={page} // Página actual
        onPageChange={handleChangePage} // Maneja el cambio de página
        rowsPerPage={rowsPerPage} // Filas por página
        onRowsPerPageChange={handleChangeRowsPerPage} // Maneja el cambio de número de filas por página
        rowsPerPageOptions={[5, 10, 25]} // Opciones de filas por página
      />
    </div>
  );
};

export default DatosEstanque;
