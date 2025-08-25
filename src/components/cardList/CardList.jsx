import React from 'react';
import Cards from '../card/Cards';
import { Grid, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const CardList = ({ cardsData, onCardClick, setCardsData, showArchive = true, showActivate = true }) => {

  const handleActivateUpdate = (id) => {
    if (!id) return;
    setCardsData(prev =>
      prev.map(card => card.id === id ? { ...card, isActive: true } : card)
    );
  };

  const handleArchiveUpdate = (id) => {
    if (!id) return;
    setCardsData(prev =>
      prev.filter(card => card.id !== id)
    );
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Grid container spacing={2}>
        {cardsData && cardsData.length > 0 ? (
          cardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={card.id || index}>
              <Cards
                id={card.id}
                title={card.title}
                imageUrl={card.imageUrl}
                isActive={card.isActive}
                onDetailsClick={() => onCardClick && onCardClick(card.id)}
                onActivateSuccess={handleActivateUpdate}
                onArchiveSuccess={handleArchiveUpdate}     
                showArchive={showArchive} 
                showActivate={showActivate} 
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ margin: "20px auto", textAlign: "center", width: "100%" }}>
            لا يوجد بيانات حالياً
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

CardList.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      isActive: PropTypes.bool
    })
  ),
  onCardClick: PropTypes.func,
  setCardsData: PropTypes.func.isRequired,
  showArchive: PropTypes.bool,
  showActivate: PropTypes.bool
};

export default CardList;
