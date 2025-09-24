import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './benefciaries.scss';
import InfoBox from '../../components/infoBox/InfoBox';  
import api from '../../api/axios';
import { CircularProgress, Box } from '@mui/material';

const Benefciaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('sorted');
  const navigate = useNavigate(); 

  const fetchBeneficiaries = async (filter = 'sorted') => {
    try {
      setLoading(true);

      let endpoint = '/beneficiary/getSorted';
      if (filter === 'priority') {
        endpoint = '/beneficiary_request/getBeneficiariesByPriority'; 
      }

      const response = await api.get(endpoint);
      setBeneficiaries(response.data.data || []);
      console.log("Beneficiaries data:", response.data.data); 
    } catch (error) {
      console.error('فشل في جلب بيانات المستفيدين:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries(activeFilter);
  }, [activeFilter]);

  const handleDetailsClick = (beneficiaryId) => {
    navigate(`/beneficiaryDetails/${beneficiaryId}`);
  };

  return (
    <div className='volunteer'>
      <Sidebar />
      <div className="volunteerContainer">
        <Navbar />

        {loading ? (
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}
          >
            <CircularProgress color="primary" size={50} /> 
          </Box>
        ) : (
          <InfoBox
            data={beneficiaries}
            title={activeFilter === 'sorted' ? "المستفيدين المفروزين" : "المستفيدين حسب الأولوية"}
            detailsButtonText="تفاصيل"
            onDetailsClick={handleDetailsClick}
            idField="beneficiary_id"  // ✅ المفتاح الصحيح لكل صف
          />
        )}
      </div>
    </div>
  );
};

export default Benefciaries;
