import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography, Button } from '@mui/material';
import Cards from '../card/Cards';

const ArchiveCardList = ({ cardsData, onCardClick, setCardsData }) => {

  const handleRemoveCard = (id) => {
    setCardsData(prev => prev.filter(card => card.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Grid container spacing={2}>
        {cardsData && cardsData.length > 0 ? (
          cardsData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Cards
                id={card.id}
                title={card.title}
                imageUrl={card.imageUrl}
                isActive={card.isActive}
                onDetailsClick={() => onCardClick(card.id)}  // للتفاصيل
                onArchiveSuccess={handleRemoveCard}          // إزالة البطاقة من الأرشيف
                showArchive={false}                         // في الأرشيف لا نعرض زر الأرشفة
                showActivate={false}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ margin: "20px auto", textAlign: "center", width: "100%" }}>
            لا توجد بيانات حالياً
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

ArchiveCardList.propTypes = {
  cardsData: PropTypes.array.isRequired,
  onCardClick: PropTypes.func.isRequired,
  setCardsData: PropTypes.func.isRequired,
};

export default ArchiveCardList;
