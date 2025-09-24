import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, Grid } from '@mui/material';
import './currentDonations.scss';

const CurrentDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/plans/getAll/recurring/for/admin');
        setDonations(response.data.data);
      } catch (err) {
        console.error(err);
        setError('فشل في جلب بيانات التبرعات الدورية');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const cardStyles = {
    card: {
      borderRadius: '16px',
      boxShadow: 3,
      padding: '16px',
      backgroundColor: '#fffff9', // الخلفية بيضاء
  border: '2px solid #165e5d',
      transition: '0.3s',
      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
    },
    title: { fontWeight: 'bold', color: '#000000', mb: 1 },
    text: { color: '#000000', mb: 0.5 },
  };

  return (
    <div className='currentDonations'>
      <Sidebar />
      <div className='currentDonationsContainer'>
        <Navbar />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : donations.length === 0 ? (
          <Alert severity="info">لا توجد تبرعات دورية حالياً</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {donations.map((donation) => (
              <Grid item xs={12} sm={6} md={4} key={donation.id}>
                <Card sx={cardStyles.card}>
                  <CardContent>
                    <Typography variant="h6" sx={cardStyles.title}>
                      {donation.user.name}
                    </Typography>
                    <Typography sx={cardStyles.text}>رقم الهاتف: {donation.user.phone}</Typography>
                    <Typography sx={cardStyles.text}>المبلغ: {donation.amount} ريال</Typography>
                    <Typography sx={cardStyles.text}>تكرار التبرع: {donation.recurrence}</Typography>
                    <Typography sx={cardStyles.text}>
                      الحالة: {donation.is_activated ? 'مفعل' : 'غير مفعل'}
                    </Typography>
                    <Typography sx={cardStyles.text}>تاريخ البداية: {donation.start_date}</Typography>
                    <Typography sx={cardStyles.text}>تاريخ النهاية: {donation.end_date}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default CurrentDonations;
