import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CardList from '../../components/cardList/CardList';
import { Button } from '@mui/material';
import api from '../../api/axios';
import './campaignArchive.scss';

const CampaignArchive = () => {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();

  const fetchArchivedCampaigns = async () => {
    try {
      const response = await api.get('/campaigns/archivedCampaigns'); 
      if (response.data?.data) {
        const formattedData = response.data.data.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          imageUrl: campaign.image 
            ? `http://localhost:8000/storage/${campaign.image}` 
            : 'https://via.placeholder.com/300',
          isActive: campaign.status === 'active'
        }));
        setCardsData(formattedData);
      }
    } catch (err) {
      console.error('Error fetching archived campaigns:', err);
    }
  };

  useEffect(() => {
    fetchArchivedCampaigns();
  }, []);

  const handleCardClick = (id) => {
    
    navigate(`/campaign_details/${id}`);
  };

  return (
    <div className='campaignArchive'>
      <Sidebar />
      <div className="campaignArchiveContainer">
        <Navbar />

        {/* زر تحديث القائمة */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
          <Button variant="contained" color="primary" onClick={fetchArchivedCampaigns}>
            تحديث الحملات
          </Button>
        </div>

        <CardList
          cardsData={cardsData}
          onCardClick={handleCardClick}
          setCardsData={setCardsData}
          showArchive={false}
          showActivate={false}
        />
      </div>
    </div>
  );
};

export default CampaignArchive;
