import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Box, Typography, CircularProgress, Alert, Paper, Grid, TextField, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import api from '../../api/axios';
import './boxstat.scss';

// Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BoxStat = () => {
  const { id } = useParams();
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const fetchBoxData = async () => {
      try {
        const response = await api.get(`/money/boxes/${id}/stats`);
        setBoxData(response.data);
      } catch (err) {
        console.error(err);
        setError('فشل جلب بيانات الصندوق');
      } finally {
        setLoading(false);
      }
    };
    fetchBoxData();
  }, [id]);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال مبلغ صالح');
      return;
    }

    let currentBalance = boxData.current_balance ?? 0;
    if (amount > currentBalance) {
      alert('المبلغ المدخل أكبر من الرصيد الحالي');
      return;
    }

    try {
      const payload = {
        box_id: boxData.box_id,
        campaign_id: null,
        amount: amount
      };
      const response = await api.post('/transaction/spend', payload);
      console.log('صرف ناجح:', response.data);

      setBoxData((prev) => ({
        ...prev,
        current_balance: (prev.current_balance ?? 0) - amount,
        total_exchanges: (prev.total_exchanges ?? 0) + amount
      }));

      setWithdrawAmount('');
      alert('تم صرف المبلغ بنجاح!');
    } catch (err) {
      console.error('فشل الصرف:', err);
      alert('فشل الصرف، حاول مرة أخرى');
    }
  };

  if (loading)
    return (
      <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p:3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const pieData = [
    { name: 'رصيد الصندوق الحالي', value: boxData.current_balance },
    { name: 'إجمالي التبرعات', value: boxData.total_donations },
    { name: 'إجمالي الصرفيات', value: boxData.total_exchanges },
  ];

  const COLORS = ['#2faeac', '#d2b48c', '#ec407a'];

  return (
    <div className='boxStat'>
      <Sidebar />
      <div className='boxStatContainer'>
        <Navbar />
        <Box sx={{ p:3 }}>
          <Typography variant="h4" sx={{ mb:4, fontWeight:'bold', color:'#155e5d', textAlign:'center' }}>
            {boxData.name}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {/* بطاقات البيانات */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={6} sx={{
                p:3, textAlign:'center', borderRadius:3,
                background: 'linear-gradient(135deg, #2faeac 0%, #155e5d 100%)',
                color:'#fff',
                '&:hover': { transform:'translateY(-5px)', boxShadow:'0 8px 16px rgba(0,0,0,0.25)' },
                transition:'all 0.3s ease'
              }}>
                <InboxIcon sx={{ fontSize:40, mb:1 }} />
                <Typography variant="h6">رصيد الصندوق الحالي</Typography>
                <Typography variant="h5" sx={{ fontWeight:'bold', mt:1 }}>{boxData.current_balance}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={6} sx={{
                p:3, textAlign:'center', borderRadius:3,
                background: 'linear-gradient(135deg, #d2b48c 0%, #a2835a 100%)',
                color:'#000',
                '&:hover': { transform:'translateY(-5px)', boxShadow:'0 8px 16px rgba(0,0,0,0.25)' },
                transition:'all 0.3s ease'
              }}>
                <InboxIcon sx={{ fontSize:40, mb:1 }} />
                <Typography variant="h6">إجمالي التبرعات</Typography>
                <Typography variant="h5" sx={{ fontWeight:'bold', mt:1 }}>{boxData.total_donations}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={6} sx={{
                p:3, textAlign:'center', borderRadius:3,
                background: 'linear-gradient(135deg, #f06292 0%, #ec407a 100%)',
                color:'#fff',
                '&:hover': { transform:'translateY(-5px)', boxShadow:'0 8px 16px rgba(0,0,0,0.25)' },
                transition:'all 0.3s ease'
              }}>
                <InboxIcon sx={{ fontSize:40, mb:1 }} />
                <Typography variant="h6">إجمالي الصرفيات</Typography>
                <Typography variant="h5" sx={{ fontWeight:'bold', mt:1 }}>{boxData.total_exchanges}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* مربع الإدخال وزر الصرف */}
          <Box
            sx={{
              mt: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <TextField
              //label="أدخل مبلغ الصرف"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              sx={{ width: { xs: '100%', sm: 200 } }}
            />
            <Button
              variant="contained"
              onClick={handleWithdraw}
              sx={{
                backgroundColor: '#2faeac', 
                color: '#fff',               
                '&:hover': {
                  backgroundColor: '#155e5d'  
                }
              }}
            >
              صرف
            </Button>
            
          </Box>

          <Box sx={{ mt:6, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

        </Box>
      </div>
    </div>
  );
};

export default BoxStat;
