import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Avatar, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios'; 
import "./recharge.scss";

const Recharge = () => {
  const location = useLocation();
  const userData = location.state?.user; 

  const [username, setUsername] = useState(userData?.name || '');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(userData?.balance || 0);

  // تحديث الرصيد بشكل مباشر عند تغير المستخدم
  useEffect(() => {
    if (userData) {
      setUsername(userData.name);
      setBalance(userData.balance);
    }
  }, [userData]);

  const handleRecharge = async () => {
    if (!amount || !userData?.id) return;

    try {
      const res = await api.post('/transaction/recharge', {
        user_id: userData.id,
        amount: parseFloat(amount),
      });

      // تحديث الرصيد محلياً بعد نجاح العملية
      const newBalance = balance + parseFloat(amount);
      setBalance(newBalance);
      setAmount('');

      alert(`تم شحن ${amount} دولار بنجاح للمستخدم ${username}`);
    } catch (error) {
      console.error('Error during recharge:', error);
      alert('حدث خطأ أثناء الشحن، حاول مرة أخرى.');
    }
  };

  return (
    <div className='recharge'>
      <Sidebar/>
      <div className="rechargeContainer">
        <Navbar/>
        <Box sx={{ 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          justifyContent: 'center'
        }}>
          <Typography variant="h3" sx={{ 
            mb: 4, 
            color: '#155e5d', 
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', md: '2.4rem' }
          }}>
            شحن رصيد المستخدم
          </Typography>
          
          <Paper elevation={3} sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: '800px',
            borderRadius: '16px'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              p: 2,
              backgroundColor: '#f5f9f8',
              borderRadius: '12px'
            }}>
              <Avatar sx={{ 
                bgcolor: '#155e5d', 
                mr: 2,
                width: 60, 
                height: 60
              }}>
                <AccountCircleIcon sx={{ fontSize: '2rem' }}/>
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  معلومات العضو
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  الرصيد الحالي: <span style={{ color: '#155e5d', fontWeight: 'bold' }}>
                    {balance.toLocaleString()} دولار
                  </span>
                </Typography>
              </Box>
            </Box>
            
            <TextField
              fullWidth
              label="اسم المستخدم"
              variant="outlined"
              value={username}
              disabled
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ fontSize: '1.8rem' }} color="action" />
                  </InputAdornment>
                ),
                style: { fontSize: '1.1rem', padding: '12px 14px' }
              }}
              InputLabelProps={{ style: { fontSize: '1.1rem' } }}
            />
            
            <TextField
              fullWidth
              label="مبلغ الشحن (دولار)"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ fontSize: '1.8rem' }} color="action" />
                  </InputAdornment>
                ),
                style: { fontSize: '1.1rem', padding: '12px 14px' }
              }}
              InputLabelProps={{ style: { fontSize: '1.1rem' } }}
            />
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleRecharge}
              disabled={!amount}
              sx={{
                bgcolor: '#155e5d',
                '&:hover': { bgcolor: '#d2b48c' },
                py: 2,
                fontSize: '1.2rem',
                borderRadius: '12px',
                height: '56px'
              }}
            >
              شحن الرصيد
            </Button>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default Recharge;
