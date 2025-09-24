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
    primary: { main: '#155e5d', contrastText: '#fff' },
    success: { main: '#4caf50', contrastText: '#fff' },
    error: { main: '#f44336', contrastText: '#fff' },
  },
});

const HumanCaseCard = ({
  id,
  title,
  imageUrl,
  imageHeight = 180,
  isActive = false,
  isEmergency = false,
  statusLabel,
  showActions = true,
  onDetailsClick,
  onActivateSuccess,
  onArchiveSuccess,
  showActivate = true,
  showArchive = true
}) => {

  const fallbackImage = "/assets/person.jpg";

  const handleActivate = async () => {
    if (!id) return;
    try {
      const res = await api.post(`/humanCase/activate/${id}`);
      alert(res.data.message || 'تم تفعيل الحالة بنجاح ✅');
      onActivateSuccess && onActivateSuccess(id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ فشل تفعيل الحالة');
    }
  };

  const handleArchive = async () => {
    if (!id) return;

    if (isEmergency) {
      alert('❌ لا يمكن أرشفة الحالة الطارئة مباشرة');
      return;
    }

    if (['مؤرشفة', 'مكتملة'].includes(statusLabel?.toLowerCase())) {
      alert('❌ لا يمكن أرشفة حالة إنسانية مؤرشفة أو مكتملة');
      return;
    }

    try {
      const res = await api.post(`/humanCase/archive/${id}`);
      alert(res.data.message || 'تم أرشفة الحالة بنجاح ✅');
      onArchiveSuccess && onArchiveSuccess(id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ فشل أرشفة الحالة');
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
        <CardMedia
          component="img"
          height={imageHeight}
          image={imageUrl || fallbackImage}
          alt={title || "بدون عنوان"}
          sx={{ objectFit: 'cover', width: '100%', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {title || "بدون عنوان"}
          </Typography>
          {statusLabel && (
            <Typography variant="body2" color={isActive ? "success.main" : "text.secondary"}>
              الحالة: {statusLabel}
            </Typography>
          )}
        </CardContent>
        {showActions && (
          <CardActions sx={{ padding: '16px', justifyContent: 'flex-end' }}>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => onDetailsClick && onDetailsClick(id)}
              sx={{ fontWeight: 'bold' }}
              disabled={!id}
            >
              التفاصيل
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
                تفعيل
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
                أرشفة
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </ThemeProvider>
  );
};

HumanCaseCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  imageHeight: PropTypes.number,
  isActive: PropTypes.bool,
  isEmergency: PropTypes.bool,
  statusLabel: PropTypes.string,
  showActions: PropTypes.bool,
  onDetailsClick: PropTypes.func,
  onActivateSuccess: PropTypes.func,
  onArchiveSuccess: PropTypes.func,
  showActivate: PropTypes.bool,
  showArchive: PropTypes.bool,
};

export default HumanCaseCard;
