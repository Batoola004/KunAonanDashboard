import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const SelectableInfoBox = ({ data, selectedItems, setSelectedItems }) => {
  if (!data || data.length === 0) return <Box>لا توجد بيانات لعرضها</Box>;

  const fields = Object.keys(data[0]).filter(
    (key) => key !== 'beneficiary_id' && key !== 'volunteer_id'
  );

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    ...fields.map((field) => ({
      field,
      headerName: field
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()), 
      flex: 1,
      minWidth: 120,
    })),
  ];

  const rows = data.map((row) => ({
    id: row.beneficiary_id || row.volunteer_id,
    ...row,
  }));

  // منطق autoHeight أو scroll
  const useAutoHeight = rows.length <= 10;

  return (
    <Box sx={{ width: '100%', height: useAutoHeight ? 'auto' : 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        selectionModel={selectedItems}
        onSelectionModelChange={(newSelection) => setSelectedItems(newSelection)}
        hideFooterPagination
        autoHeight={useAutoHeight}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-row:nth-of-type(odd)': { bgcolor: '#d2b48c' },
          '& .MuiDataGrid-row:hover': { bgcolor: '#f1f1f1' },
          borderRadius: 10,
          border: '1px solid #ddd',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f5f5f5',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
};

export default SelectableInfoBox;
