import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ⬅️ أضفنا useNavigate
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Box, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HealingIcon from '@mui/icons-material/Healing';
import api from '../../api/axios';
import './boxdetails.scss';

const BoxDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ تعريف النافيغيت
  const { boxType } = location.state || {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!boxType) return setError("نوع الصندوق غير محدد");

      let endpoint = "";
      if (boxType === "campaign") endpoint = "/campaigns/getAll";
      else if (boxType === "sponsorship") endpoint = "/sponsorship/byCreationDate";
      else if (boxType === "human") endpoint = "/humanCase/getAll";

      try {
        const response = await api.get(endpoint);
        console.log("API response:", response.data); 
        if (!response.data || !response.data.data) {
          throw new Error("لم يتم العثور على بيانات");
        }
        setData(response.data.data);
      } catch (err) {
        console.error("Axios error:", err);
        setError("فشل جلب البيانات، تحقق من الـ API أو الـ CORS أو التوكن");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boxType]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const getTitle = (item) => {
    if (boxType === "campaign") return item.title;
    if (boxType === "sponsorship") return item.sponsorship_name;
    if (boxType === "human") return item.case_name;
    return "";
  };

  const getIcon = () => {
    if (boxType === "campaign") return <CampaignIcon sx={{ fontSize: 60, color: '#d2b48c' }} />;
    if (boxType === "sponsorship") return <VolunteerActivismIcon sx={{ fontSize: 60, color: '#155e5d' }} />;
    if (boxType === "human") return <HealingIcon sx={{ fontSize: 60, color: '#155e5d' }} />;
    return null;
  };

  const getHeader = () => {
    if (boxType === "campaign") return "الحملات";
    if (boxType === "sponsorship") return "الكفالات";
    if (boxType === "human") return "الحالات الإنسانية";
    return "";
  };

  const getCardColor = () => {
    if (boxType === "campaign") return '#155e5d';
    if (boxType === "sponsorship") return '#d2b48c';
    if (boxType === "human") return '#2c9290ff';
    return '#9e9e9e';
  };

  const handleCardClick = (item) => {
    if (boxType === "campaign") {
      navigate(`/boxCampaignStat/${item.id}`); 
    }
  };

  return (
    <div className='boxdetails'>
      <Sidebar />
      <div className='boxdetailsContainer'>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            {getHeader()}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {data.length === 0 ? (
              <Typography>لا توجد بيانات لعرضها</Typography>
            ) : (
              data.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => handleCardClick(item)} // ⬅️ أضفنا onClick
                  sx={{
                    width: 220,
                    height: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 3,
                    backgroundColor: getCardColor(),
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                    },
                    '&:active': { transform: 'scale(0.97)' }
                  }}
                >
                  {getIcon()}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {getTitle(item)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default BoxDetails;
