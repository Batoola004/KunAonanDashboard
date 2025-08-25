import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Box, Typography } from '@mui/material';

const Datatable = ({ title, rows }) => {
  const [searchText, setSearchText] = useState('');

  const filteredRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    if (!searchText) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [rows, searchText]);

  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]).map((key) => {
    if (key === 'actions') {
      return {
        field: key,
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => console.log('تفاصيل السطر:', params.row)}
            sx={{
              backgroundColor: '#155e5d',
              color: 'white',
              '&:hover': { backgroundColor: '#388E3C' },
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              textTransform: 'none',
              padding: '6px 12px',
            }}
          >
            Details
          </Button>
        ),
      };
    }

    return {
      field: key,
      headerName: key.replace(/_/g, ' ').toUpperCase(),
      flex: 1,
      headerClassName: 'header-bold',
      valueGetter: (params) => params.row[key] ?? '',
    };
  });

  return (
    <Box className='datatable' sx={{ height: 500, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      <TextField
        placeholder="ابحث..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        hideFooter
        disableRowSelectionOnClick
        sx={{
          '& .header-bold': { fontWeight: 'bold' },
          '& .MuiDataGrid-row': {
            backgroundColor: '#f8f9fa',
            '&:nth-of-type(even)': { backgroundColor: '#d1bca0ff' },
            '&:nth-of-type(odd)': { backgroundColor: '#dfd4c5ff' },
            '&:hover': { backgroundColor: '#d2b48c' },
          },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #ced4da', color: '#495057' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#343a40', color: 'white' },
        }}
      />
    </Box>
  );
};

export default Datatable;
