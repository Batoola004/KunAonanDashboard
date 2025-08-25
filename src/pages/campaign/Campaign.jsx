import React, { useState, useEffect } from 'react';
import "./campaign.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import CardList from '../../components/cardList/CardList';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';

const Campaign = () => {
  const [cardsData, setCardsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCampaigns = async (filter) => {
    setLoading(true);
    let url = '/campaigns/getAll'; // الافتراضي كل الحملات

    if (filter !== 'all') {
      const categoryMap = { Health: 1, Build: 2, Education: 3 };
      const categoryId = categoryMap[filter];
      url = `/campaigns/category/${categoryId}`;
    }

    try {
      const res = await api.get(url);
      const formattedData = res.data?.data?.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        imageUrl: campaign.image
          ? `/storage/app/public/campaign_images/${campaign.image}`  
          : 'https://via.placeholder.com/300',
        isActive: campaign.status === 'active'
      })) || [];
      setCardsData(formattedData);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setCardsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns('all');
  }, []);

  const filterButtons = [
    { text: "All", value: "all", onClick: () => { setActiveFilter('all'); fetchCampaigns('all'); } },
    { text: "Health", value: "Health", onClick: () => { setActiveFilter('Health'); fetchCampaigns('Health'); } },
    { text: "Build", value: "Build", onClick: () => { setActiveFilter('Build'); fetchCampaigns('Build'); } },
    { text: "Education", value: "Education", onClick: () => { setActiveFilter('Education'); fetchCampaigns('Education'); } }
  ];

  const handleCardClick = (id) => {
    navigate(`/campaign_details/${id}`);
  };

  return (
    <div className='campaign'>
      <Sidebar />
      <div className="campaignContainer">
        <Navbar />
        <Filter
          buttons={filterButtons}
          activeFilter={activeFilter}
          spacing={2}
          buttonProps={{ sx: { minWidth: '120px', fontSize: '0.875rem' } }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : cardsData.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>لا توجد حملات حالياً</Alert>
        ) : (
          <CardList
            cardsData={cardsData}
            onCardClick={handleCardClick}
            setCardsData={setCardsData}
          />
        )}
      </div>
    </div>
  );
};

export default Campaign;
