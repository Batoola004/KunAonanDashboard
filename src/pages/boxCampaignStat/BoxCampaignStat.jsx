import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Box, Typography, CircularProgress, Alert, Paper, Grid } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import api from '../../api/axios';
import './boxCampaignStat.scss';

// Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BoxCampaignStat = () => {
  const { id } = useParams(); 
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        const response = await api.get(`/money/campaigns/${id}/stats`); 
        setCampaignData(response.data);
      } catch (err) {
        console.error(err);
        setError('فشل جلب بيانات الحملة');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignStats();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const pieData = [
    { name: 'الرصيد الحالي', value: campaignData.current_balance },
    { name: 'إجمالي التبرعات', value: campaignData.total_donations },
    { name: 'إجمالي الصرفيات', value: campaignData.total_exchanges },
  ];

  const COLORS = ['#2faeac', '#d2b48c', '#ec407a'];

  return (
    <div className="boxCampaignStat">
      <Sidebar />
      <div className="boxCampaignStatContainer">
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#155e5d',
              textAlign: 'center',
            }}
          >
            {campaignData.name}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background:
                    'linear-gradient(135deg, #2faeac 0%, #155e5d 100%)',
                  color: '#fff',
                }}
              >
                <InboxIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">الرصيد الحالي</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {campaignData.current_balance}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background:
                    'linear-gradient(135deg, #d2b48c 0%, #a2835a 100%)',
                  color: '#000',
                }}
              >
                <InboxIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">إجمالي التبرعات</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {campaignData.total_donations}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background:
                    'linear-gradient(135deg, #f06292 0%, #ec407a 100%)',
                  color: '#fff',
                }}
              >
                <InboxIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">إجمالي الصرفيات</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {campaignData.total_exchanges}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default BoxCampaignStat;
