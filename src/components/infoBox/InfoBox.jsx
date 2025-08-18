import React from 'react';
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
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InfoBox = ({ 
  data = [],
  title = 'قائمة البيانات',
  showTitle = true,
  titleVariant = 'h5',
  showDetailsButton = true,
  detailsButtonText = 'details',
  colors = {
    headerBg: '#155e5d',
    headerText: '#ffffff',
    rowBg: '#d1bca0ff',
    evenRowBg: '#d2b48c',
    textColor: '#000000',
    buttonBg: '#3c8583ff',
    buttonHover: '#155e5d',
    buttonText: '#ffffff',
    paperBg: '#ffffff',
    titleColor: '#155e5d'
  },
  onDetailsClick 
}) => {
  const navigate = useNavigate();

  // توليد الأعمدة ديناميكيًا من أول عنصر في المصفوفة
  const columns = data.length > 0 ? Object.keys(data[0]).map(key => ({
    field: key,
    headerName: key.replace(/_/g, ' ')
  })) : [];

  const handleDetailsClick = (row) => {
    if (onDetailsClick) {
      onDetailsClick(row);
    } else {
      navigate(`/details`, { state: { rowData: row } });
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', width: '100%' }}>
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
            '& .MuiTableCell-root': {
              color: colors.headerText,
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
              {showDetailsButton && <TableCell>الإجراءات</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={row.id || index}
                sx={{ 
                  backgroundColor: index % 2 === 0 ? colors.rowBg : colors.evenRowBg,
                  '& .MuiTableCell-root': { color: colors.textColor, whiteSpace: 'nowrap' }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={`${row.id || index}-${column.field}`}>
                    {row[column.field] !== undefined ? row[column.field] : '-'}
                  </TableCell>
                ))}

                {showDetailsButton && (
                  <TableCell>
                    <Button 
                      variant="contained"
                      size="small"
                      onClick={() => handleDetailsClick(row)}
                      sx={{
                        backgroundColor: colors.buttonBg,
                        color: colors.buttonText,
                        '&:hover': { backgroundColor: colors.buttonHover },
                        fontWeight: 'bold',
                      }}
                    >
                      {detailsButtonText}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InfoBox;
