import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './beneficiaryDetails.scss';
import api from '../../api/axios';
import {
  CircularProgress,
  Box,
  Alert,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from '@mui/material';

const BeneficiaryDetails = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/beneficiary/getSorted/${id}`);
        setBeneficiary(response.data.data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('❌ فشل جلب تفاصيل المستفيد: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaryDetails();
  }, [id]);

  const styles = {
    mainCard: {
      mb: 4,
      p: 3,
      borderRadius: '20px',
      boxShadow: 3,
      background: 'linear-gradient(135deg, #165e5d 0%, #89aeaeff 100%)',
    },
    title: {
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'right',
    },
    activityCard: {
      borderRadius: '16px',
      boxShadow: 3,
      transition: '0.3s',
      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 2,
 backgroundColor: '#fffff9', // الخلفية بيضاء
  border: '2px solid #165e5d',    },
    activityTitle: {
      fontWeight: 'bold',
      color: '#000000',
      mb: 1,
      textAlign: 'right',
    },
    activityText: {
      color: '#000000',
      mb: 0.5,
      textAlign: 'right',
    },
  };

  return (
    <div className="beneficiaryDetails">
      <Sidebar />
      <div className="beneficiaryDetailsContainer">
        <Navbar />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : beneficiary ? (
          <div className="detailsContent">
            {/* بطاقة رئيسية لبيانات المستفيد */}
            <Card sx={styles.mainCard}>
              <Typography variant="h5" gutterBottom sx={styles.title}>
                المستفيد: {beneficiary.full_name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'right' }}>
                عدد الأنشطة: {beneficiary.activities.length}
              </Typography>
            </Card>

            {/* شبكة الأنشطة */}
            <Grid container spacing={3}>
              {beneficiary.activities.map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={styles.activityCard}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={styles.activityTitle}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" sx={styles.activityText}>
                        النوع: {activity.type}
                      </Typography>
                      <Typography variant="body2" sx={styles.activityText}>
                        التصنيف: {activity.category}
                      </Typography>
                      <Typography variant="body2" sx={styles.activityText}>
                        التاريخ: {activity.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <Alert severity="warning">لم يتم العثور على بيانات المستفيد</Alert>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDetails;
