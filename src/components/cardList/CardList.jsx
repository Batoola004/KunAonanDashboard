import React from 'react';
import Cards from '../card/Cards';
import { Grid, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CardList = ({ cardsData, onCardClick, setCardsData, showArchive = true, showActivate = true }) => {

  const handleActivateUpdate = (id) => {
    setCardsData(prev =>
      prev.map(card => card.id === id ? { ...card, isActive: true } : card)
    );
  };

  const handleArchiveUpdate = (id) => {
    setCardsData(prev =>
      prev.filter(card => card.id !== id)
    );
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Grid container spacing={2}>
        {cardsData.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Cards
              id={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              isActive={card.isActive}
              onDetailsClick={() => onCardClick(card.id)}
              onActivateSuccess={handleActivateUpdate}
              onArchiveSuccess={handleArchiveUpdate}     
              showArchive={showArchive} 
              showActivate={showActivate} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CardList.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      isActive: PropTypes.bool
    })
  ).isRequired,
  onCardClick: PropTypes.func.isRequired,
  setCardsData: PropTypes.func.isRequired,
  showArchive: PropTypes.bool,
  showActivate: PropTypes.bool
};

export default CardList;
