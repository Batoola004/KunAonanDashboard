import React, { useEffect, useState } from 'react';
import './donators.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import InfoBox from '../../components/infoBox/InfoBox';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';

const Donors = () => {
  const [donations, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await api.get("/transaction/AllDonors");
        setDonors(response.data.donors || []);
      } catch (err) {
        console.error(err);
        setError("فشل جلب المتبرعين ");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div className="donors">
      <Sidebar />
      <div className="donorsContainer">
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
              title="قائمة المتبرعين وكل نشاطاتهم"
              data={donations}
              showDetailsButton={false}  
              colors={{
                headerBg: '#155e5d',
                headerText: '#ffffff',
                rowBg: '#fffffa',
                evenRowBg: '#fffff9',
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

export default Donors;
