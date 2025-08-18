import React, { useState, useEffect } from 'react';
import "./campaign.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import CardList from '../../components/cardList/CardList';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Campaign = () => {
  const [cardsData, setCardsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const fetchCampaigns = (filter) => {
    let url = '';

    if (filter === 'all') {
      url = '/campaigns/getAll';
    } else {
      const categoryMap = {
        Health: 1,
        Build: 2,
        Education: 3
      };
      const categoryId = categoryMap[filter];
      url = `/campaigns/category/${categoryId}`;
    }

    api.get(url)
      .then(res => {
        const formattedData = res.data.data.map(campaign => ({
          id: campaign.id,
          title: campaign.title, 
          description: campaign.description,
          imageUrl: campaign.image
            ? `http://localhost:8000/storage/${campaign.image}`
            : null,
          isActive: campaign.status === 'active' 
        }));
        setCardsData(formattedData);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
      });
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
          buttonProps={{
            sx: { minWidth: '120px', fontSize: '0.875rem' }
          }}
        />
        <CardList
          cardsData={cardsData}
          onCardClick={handleCardClick}
          setCardsData={setCardsData} 
        />
      </div>
    </div>
  );
};

export default Campaign;
