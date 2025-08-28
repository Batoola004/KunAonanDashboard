import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './beneficiaryDetails.scss';
import api from '../../api/axios';
import { CircularProgress, Box, Alert, Card, CardContent, Typography } from '@mui/material';

const BeneficiaryDetails = () => {
  const { id } = useParams(); // ناخد الايدي من الرابط
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب التفاصيل
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
            <Typography variant="h5" gutterBottom>
              المستفيد: {beneficiary.full_name}
            </Typography>

            <div className="activitiesGrid">
              {beneficiary.activities.map((activity, index) => (
                <Card key={index} className="activityCard">
                  <img
                    src={`http://localhost:8000/storage/${activity.image}`}
                    alt={activity.title}
                    className="activityImage"
                  />
                  <CardContent>
                    <Typography variant="h6">{activity.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      النوع: {activity.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      التصنيف: {activity.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      التاريخ: {activity.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Alert severity="warning">لم يتم العثور على بيانات المستفيد</Alert>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDetails;
