import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Box, CircularProgress, Alert, Typography, Grid, Paper } from '@mui/material';
import api from '../../api/axios';
import { useParams } from 'react-router-dom';
import './volunteer_details.scss';

const VolunteerDetails = () => {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteer = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/volunteers/${id}`);
        setVolunteer(res.data.data);
      } catch (err) {
        console.error(err);
        setError("فشل جلب بيانات المتطوع");
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={80} thickness={5} sx={{ color: '#155e5d' }} />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
  );

  if (!volunteer) return null;

  return (
    <div className='volunteer_details'>
      <Sidebar />
      <div className="volunteer_detailsContainer">
        <Navbar />

        {/* معلومات المتطوع */}
        <Box sx={{ mt: 3, mb: 5, p: 3, backgroundColor: '#e0f7f5', borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="#155e5d" gutterBottom>
            {volunteer.volunteer_name}
          </Typography>
          <Typography variant="h6" color="#555">
            أنواع التطوع: {volunteer.volunteering_types.map(t => t.type_name).join(', ')}
          </Typography>
        </Box>

        {/* الحملات المرتبطة */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#155e5d' }}>الحملات المرتبطة</Typography>
          {volunteer.campaigns.length === 0 ? (
            <Alert severity="info">لا توجد حملات مرتبطة بهذا المتطوع</Alert>
          ) : (
            <Grid container spacing={4}>
              {volunteer.campaigns.map(c => (
                <Grid item xs={12} sm={6} md={4} key={c.campaign_id}>
                  <Paper elevation={8} sx={{
                    p: 3,
                    borderRadius: 4,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: '#f0f9f9',
                    color: '#155e5d',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {c.campaign_title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      التاريخ: {c.campaign_date}
                    </Typography>
                    <Typography variant="body1">
                      الفئة: {c.category?.name || '-'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: '#333' }}>
                      {/* هنا يمكن إضافة وصف مختصر للحملة إذا أردت */}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </div>
    </div>
  );
};

export default VolunteerDetails;
