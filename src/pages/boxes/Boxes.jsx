import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import api from '../../api/axios';
import InboxIcon from '@mui/icons-material/Inbox';
import './boxes.scss';

const Boxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        let response = await api.get('/box/getAll');
        let data = response.data?.boxes || [];

        data = data.filter(box => box.name !== 'kafarat');

        const priorityBoxes = [
          { id: 1001, name: 'Campaigns' },
          { id: 1002, name: 'Human Cases' },
          { id: 1003, name: 'Sponsorships' }
        ];

        setBoxes([...priorityBoxes, ...data]);
      } catch (err) {
        console.error(err);
        setError('فشل جلب الصناديق');
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

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

  return (
    <div className='boxes'>
      <Sidebar />
      <div className='boxesContainer'>
        <Navbar/>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: '#155e5d' }}
          >
            الصناديق المتاحة
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center'
            }}
          >
            {boxes.map((box, index) => (
              <Paper
                key={box.id}
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
                  background: index < 3
                    ? 'linear-gradient(135deg, #E5D2B1 0%, #a38761ff 100%)'
                    : 'linear-gradient(135deg, #165e5d 0%, #2faeacff 100%)',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                  },
                  '&:active': { transform: 'scale(0.97)' }
                }}
                onClick={() => {
                  if (box.name === "Campaigns") {
                    navigate("/boxdetails", { state: { boxType: "campaign" } });
                  } else if (box.name === "Sponsorships") {
                    navigate("/boxdetails", { state: { boxType: "sponsorship" } });
                  } else if (box.name === "Human Cases") {
                    navigate("/boxdetails", { state: { boxType: "human" } });
                  } else {
                    navigate(`/boxstate/${box.id}`);
                  }
                }}
              >
                <InboxIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                  {box.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Boxes;
