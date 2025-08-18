import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const Datatable = ({ title, rows }) => {
  if (!rows || rows.length === 0) return null;

  // إنشاء الأعمدة تلقائياً من مفاتيح الصف الأول
  const columns = Object.keys(rows[0]).map((key) => {
    // إذا كانت هناك حاجة لإضافة زر أو تخصيص، يمكن تعديل هنا
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
    <div className='datatable' style={{ height: 400 }}>
      <h3>{title}</h3>
      <DataGrid
        rows={rows}
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
    </div>
  );
};

export default Datatable;
