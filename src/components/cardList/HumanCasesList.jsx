import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import HumanCaseCard from '../card/HumanCaseCard';

const HumanCasesList = ({
  cardsData,
  onCardClick,
  setCardsData,
  onActivate,
  onArchive,
  showActivate = true,
  showArchive = true
}) => {

  // تحديث حالة البطاقة بعد التفعيل
  const handleActivateUpdate = (id) => {
    setCardsData(prev =>
      prev.map(card => card.id === id ? { ...card, isActive: true, statusLabel: 'فعالة' } : card)
    );
  };

  // إزالة البطاقة بعد الأرشفة
  const handleArchiveUpdate = (id) => {
    setCardsData(prev => prev.filter(card => card.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '20px' }}>
      <Grid container spacing={2}>
        {cardsData && cardsData.length > 0 ? (
          cardsData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <HumanCaseCard
                id={card.id}
                title={card.title}
                imageUrl={card.imageUrl}
                isActive={card.isActive}
                isEmergency={card.isEmergency}
                statusLabel={card.statusLabel}
                showActivate={showActivate}
                showArchive={showArchive}
                onDetailsClick={() => onCardClick && onCardClick(card.id)}
                onActivateSuccess={(id) => {
                  handleActivateUpdate(id);
                  onActivate && onActivate(id, card.isEmergency);
                }}
                onArchiveSuccess={(id) => {
                  handleArchiveUpdate(id);
                  onArchive && onArchive(id, card.isEmergency);
                }}
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

HumanCasesList.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      isActive: PropTypes.bool,
      isEmergency: PropTypes.bool,
      statusLabel: PropTypes.string,
    })
  ),
  onCardClick: PropTypes.func,
  setCardsData: PropTypes.func.isRequired,
  onActivate: PropTypes.func,
  onArchive: PropTypes.func,
  showActivate: PropTypes.bool,
  showArchive: PropTypes.bool
};

export default HumanCasesList;
