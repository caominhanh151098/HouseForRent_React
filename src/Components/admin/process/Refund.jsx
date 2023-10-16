import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import OutboxIcon from '@mui/icons-material/Outbox';
import { useState } from "react";
import { useEffect } from "react";
import { IconButton, TablePagination, Toolbar, Tooltip, Typography } from "@mui/material";

function createData(id, name, calories, fat, carbs, protein) {
    return { id, name, calories, fat, carbs, protein };
}

const rows = [
    createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
];



const Refund = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [checked, setChecked] = useState({});

    const handleSelectAll = (event) => {
        const newChecked = {};
        for (const row of rows) {
            newChecked[row.id] = event.target.checked;
        }
        setChecked(newChecked);
        setSelectAll(event.target.checked);
    };

    const handleRowSelect = (event, id) => {
        const newChecked = { ...checked };
        newChecked[id] = event.target.checked;
        setChecked(newChecked);
    };


    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="h2">Refund</h2>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
                    <Tooltip title="Submit">
                        <IconButton>
                            <OutboxIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}
                                            />
                                        }
                                    />
                                </TableCell>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checked[row.id] || false}
                                                    onChange={(e) => handleRowSelect(e, row.id)}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}
                                                />
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </div>
    )
}

export default Refund;