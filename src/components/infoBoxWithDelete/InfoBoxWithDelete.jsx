import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Checkbox
} from '@mui/material';

const InfoBoxWithDelete = ({ 
  data = [],
  title = 'قائمة البيانات',
  showTitle = true,
  titleVariant = 'h5',
  colors = {
    headerBg: '#155e5d',
    headerText: '#ffffff',
    rowBg: '#d1bca0ff',
    evenRowBg: '#d2b48c',
    textColor: '#000000',
    buttonBg: '#e53935',
    buttonHover: '#b71c1c',
    buttonText: '#ffffff',
    paperBg: '#ffffff',
    titleColor: '#155e5d'
  },
  onDelete
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const columns = data.length > 0 
    ? Object.keys(data[0]).filter(k => k !== 'id').map(key => ({
        field: key,
        headerName: key.replace(/_/g, ' ')
      })) 
    : [];

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) setSelectedIds([]);
    else setSelectedIds(data.map(row => row.id));
  };

  const handleDeleteClick = () => {
    if (onDelete && selectedIds.length > 0) {
      onDelete(selectedIds); // تمرير مصفوفة IDs فقط
      setSelectedIds([]);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'rgba(0,0,0,0.05)', width: '100%' }}>
      {showTitle && (
        <Typography 
          variant={titleVariant} 
          gutterBottom 
          sx={{ mb: 3, fontWeight: 'bold', color: colors.titleColor }}
        >
          {title}
        </Typography>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ backgroundColor: colors.paperBg, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead sx={{ 
            backgroundColor: colors.headerBg,
            '& .MuiTableCell-root': { color: colors.headerText, fontWeight: 'bold', whiteSpace: 'nowrap' }
          }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === data.length && data.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                  onChange={handleSelectAll}
                  sx={{ color: colors.headerText }}
                />
              </TableCell>
              {columns.map((column) => <TableCell key={column.field}>{column.headerName}</TableCell>)}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={row.id || index}
                sx={{ backgroundColor: index % 2 === 0 ? colors.rowBg : colors.evenRowBg,
                      '& .MuiTableCell-root': { color: colors.textColor, whiteSpace: 'nowrap' } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={`${row.id || index}-${column.field}`}>
                    {row[column.field] !== undefined ? row[column.field] : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedIds.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained"
            size="small"
            onClick={handleDeleteClick}
            sx={{
              backgroundColor: colors.buttonBg,
              color: colors.buttonText,
              '&:hover': { backgroundColor: colors.buttonHover },
              fontWeight: 'bold',
            }}
          >
            حذف {selectedIds.length}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InfoBoxWithDelete;
