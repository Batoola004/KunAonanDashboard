import React, { useEffect, useState } from 'react';
import './volunteer.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import InfoBox from '../../components/infoBox/InfoBox';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await api.get("/volunteers");
        const data = response.data.data || [];

        const formattedVolunteers = data.map(v => ({
          id: v.volunteer_id,
          name: v.volunteer_name,
          volunteering_types: v.volunteering_types.map(t => t.type_name).join(', '),
        }));

        setVolunteers(formattedVolunteers);
      } catch (err) {
        console.error(err);
        setError("فشل جلب المتطوعين");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // دالة عند الضغط على زر التفاصيل
  const handleDetailsClick = (volunteerId) => {
    navigate(`/volunteerDetails/${volunteerId}`);
  };

  return (
    <div className="volunteer">
      <Sidebar />
      <div className="volunteerContainer">
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
              title="قائمة المتطوعين المفروزين"
              data={volunteers}
              showDetailsButton={true}  
              onDetailsClick={handleDetailsClick} // تمرير الدالة للزر
              columns={[
                { key: 'name', label: 'اسم المتطوع' },
                { key: 'volunteering_types', label: 'أنواع التطوع' },
              ]}
              colors={{
                headerBg: '#165e5d',
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

export default Volunteer;
