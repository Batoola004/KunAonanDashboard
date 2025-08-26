import React, { useEffect, useState } from 'react';
import './donations.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import InfoBox from '../../components/infoBox/InfoBox';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get("/transaction/AllDonations");
        setDonations(response.data.donations || []);
      } catch (err) {
        console.error(err);
        setError("فشل جلب بيانات التبرعات");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="donations">
      <Sidebar />
      <div className="donationsContainer">
        <Navbar />
        <Box sx={{ p: 3, width: '100%' }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!loading && !error && (
            <InfoBox
              title="قائمة التبرعات"
              data={donations}
              showDetailsButton={false}  
              colors={{
                headerBg: '#155e5d',
                headerText: '#ffffff',
                rowBg: '#d2b48c',
                evenRowBg: '#e7d1b4ff',
                textColor: '#000000',
                paperBg: '#ffffff',
                titleColor: '#155e5d',
              }}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Donations;
