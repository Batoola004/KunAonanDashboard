import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './rechargeUsers.scss';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const RechargeUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/user/getAll');
        const formattedUsers = res.data.users.map(user => ({
          id: user.id,
          name: user.name || 'N/A',
          phone: user.contact || 'N/A', 
          balance: user.balance ?? 0 // صفر إذا ما في قيمة
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRechargeClick = (user) => {
    if (!user) return;

    navigate('/recharge', {
      state: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          balance: user.balance
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, headerClassName: 'header-bold' },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { 
      field: 'balance', 
      headerName: 'Balance', 
      width: 120,
      renderCell: (params) => `${params.row.balance} $`  // عرض الرصيد بالدولار
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleRechargeClick(params.row)}
          sx={{
            backgroundColor: '#165e5d',
            color: 'white',
            '&:hover': { backgroundColor: '#25706fff' },
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            textTransform: 'none',
            padding: '6px 12px',
          }}
        >
          Recharge
        </Button>
      )
    }
  ];

  return (
    <div className='rechargeUsers'>
      <Sidebar />
      <div className='rechargeUsersContainer'>
        <Navbar />
        <div className='datatableContainer'>
          <div className='datatable' style={{ width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              hideFooterPagination
              hideFooterSelectedRowCount
              localeText={{ noRowsLabel: 'No data to display' }}
              sx={{
                '& .header-bold': { fontWeight: 'bold' },
                '& .MuiDataGrid-virtualScroller': { overflow: 'visible', minHeight: '500px' },
                '& .MuiDataGrid-row': {
backgroundColor: 'rgba(248, 249, 250, 0.5)', // نص شفافية
                  '&:nth-of-type(even)': { backgroundColor: '#E5D2B1' },
                  '&:nth-of-type(odd)': { backgroundColor: '#E5D2B1' },
                  '&:hover': { backgroundColor: '#d2b48c' },
                },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #ced4da', color: '#495057', textAlign: 'right' },
                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#343a40', color: 'black' },
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeUsers;
