import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    TableSortLabel, TablePagination 
} from '@mui/material';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function HistorialAlimentador() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [registros, setRegistros] = useState([]); // Estado para datos

    // Cargar datos desde el backend
    useEffect(() => {
        const fetchData = async () => {
            try {

             

            const token = Cookies.get("token");
            const response = await axios.get('https://fishmaster.duckdns.org/alimentacion', {
                headers: {
                    Authorization: `Bearer ${token}`, // Correcto formato
                },
            });
            
                setRegistros(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchData();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'id_alimentacion'}
                                direction={orderBy === 'id_alimentacion' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'id_alimentacion')}
                            >
                                ID
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'fecha'}
                                direction={orderBy === 'fecha' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'fecha')}
                            >
                                Fecha
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'hora'}
                                direction={orderBy === 'hora' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'hora')}
                            >
                                Hora
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'cantidad_alimento'}
                                direction={orderBy === 'cantidad_alimento' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'cantidad_alimento')}
                            >
                                Cantidad de Alimento
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stableSort(registros, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((registro) => (
                            <TableRow hover key={registro.id_alimentacion}>
                                <TableCell>{registro.id_alimentacion}</TableCell>
                                <TableCell>{registro.fecha}</TableCell>
                                <TableCell>{registro.hora}</TableCell>
                                <TableCell>{registro.cantidad_alimento}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={registros.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
}

export default HistorialAlimentador;
