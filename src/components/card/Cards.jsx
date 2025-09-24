import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import api from '../../api/axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#155e5d',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#fff',
    }
  },
});

const Cards = ({ 
  id,
  imageUrl,
  icon, // 👈 صار في دعم للأيقونة
  imageHeight = 180,
  title,
  showActions = true,
  onDetailsClick,
  isActive = false,
  onArchiveSuccess,
  onActivateSuccess,
  showArchive = true,
  showActivate = true
}) => {

  const handleArchive = async () => {
    if (!id) return;
    try {
      const response = await api.post(`/campaigns/archive/${id}`);
      if (response.status === 200) {
        alert("Campaign archived successfully!");
        onArchiveSuccess && onArchiveSuccess(id);
      }
    } catch (error) {
      console.error("Error archiving campaign:", error);
      alert("Failed to archive campaign.");
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    try {
      const response = await api.post(`/campaigns/activate/${id}`);
      if (response.status === 200) {
        alert("Campaign activated successfully!");
        onActivateSuccess && onActivateSuccess(id); 
      }
    } catch (error) {
      console.error("Error activating campaign:", error);
      alert("Failed to activate campaign.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
     <Card sx={{ 
  width: 300,
  minHeight: 400, 
  backgroundColor: '#fffffe', // الخلفية بيضاء
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  border: '2px solid #165E5D', // الحواف بلون معيّن (مثلاً نفس التان)
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
  }
}}>
        {icon ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: imageHeight, 
            backgroundColor: '#fff' 
          }}>
            {icon}
          </div>
        ) : (
          imageUrl && (
            <CardMedia
              component="img"
              height={imageHeight}
              image={imageUrl}
              alt={title || "No Title"}
              sx={{
                objectFit: 'cover',
                width: '100%',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            />
          )
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {title || "بدون عنوان"}
          </Typography>
        </CardContent>

        {showActions && (
          <CardActions sx={{ padding: '16px', justifyContent: 'flex-end' }}>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => id && onDetailsClick && onDetailsClick(id)}
              sx={{ fontWeight: 'bold' }}
              disabled={!id}
            >
              Details
            </Button>
            {showActivate && (
              <Button
                size="medium"
                variant="contained"
                color="success"
                onClick={handleActivate}
                sx={{ fontWeight: 'bold' }}
                disabled={isActive || !id}
              >
                Activate
              </Button>
            )}
            {showArchive && (
              <Button
                size="medium"
                variant="contained"
                color="error"
                onClick={handleArchive}
                sx={{ fontWeight: 'bold' }}
                disabled={!id}
              >
                Archive
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </ThemeProvider>
  );
};

Cards.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  icon: PropTypes.node, // 👈 أيقونة React node
  imageHeight: PropTypes.number,
  showActions: PropTypes.bool,
  onDetailsClick: PropTypes.func,
  isActive: PropTypes.bool,
  onActivateSuccess: PropTypes.func,
  onArchiveSuccess: PropTypes.func,
  showArchive: PropTypes.bool,
  showActivate: PropTypes.bool
};

export default Cards;
