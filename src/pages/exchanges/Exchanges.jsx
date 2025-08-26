import React, { useEffect, useState } from 'react';
import './exchanges.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import InfoBox from '../../components/infoBox/InfoBox';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';

const Exchanges = () => {
  const [donations, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await api.get("/transaction/AllExchanges");
        setExchanges(response.data.exchanges || []);
      } catch (err) {
        console.error(err);
        setError("فشل جلب بيانات الصرف");
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  return (
    <div className="exchanges">
      <Sidebar />
      <div className="exchangesContainer">
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
              title="قائمة المصروفات"
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

export default Exchanges;
