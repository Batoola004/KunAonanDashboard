import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Avatar,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const VolunteerInfoCard = ({ data }) => {
  if (!data) return <Typography>جاري تحميل البيانات...</Typography>;

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'غير محدد';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('ar-SA', options);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card sx={{ width: 800, borderRadius: 3, boxShadow: 4, bgcolor: '#ffffff' }}>
        <Box sx={{
          bgcolor: '#155e5d',
          color: 'white',
          p: 3,
          textAlign: 'center',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}>
          <Avatar sx={{
            width: 100,
            height: 100,
            mb: 2,
            bgcolor: '#d2b48c',
            fontSize: '2.5rem',
            margin: '0 auto'
          }}>
            {data.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="h6">
            رقم المتطوع: {data.id}
          </Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>

            <Typography variant="h6" color="#155e5d" sx={{ mt: 2 }}>
              المعلومات الشخصية
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>الجنس:</strong> {data.gender}</Typography>
                <Typography><strong>تاريخ الميلاد:</strong> {formatDate(data.birth_date)}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>العنوان:</strong> {data.address}</Typography>
                <Typography><strong>الهاتف:</strong> {data.phone}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" color="#155e5d" sx={{ mt: 3 }}>
              المعلومات المهنية
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>المؤهل العلمي:</strong> {data.study_qualification}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>المهنة:</strong> {data.job}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" color="#155e5d" sx={{ mt: 3 }}>
              معلومات التطوع
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography>
                  <strong>الحالة:</strong> 
                  <Chip 
                    label={data.status} 
                    sx={{ 
                      ml: 1, 
                      bgcolor: data.status === 'مقبول' ? '#4caf50' : 
                              data.status === 'مرفوض' ? '#f44336' : '#ff9800',
                      color: 'white'
                    }} 
                  />
                </Typography>
                <Typography>
                  <strong>خبرة تطوعية سابقة:</strong> 
                  {data.has_previous_volunteer ? ' نعم' : ' لا'}
                </Typography>
                {data.has_previous_volunteer && (
                  <Typography><strong>التجارب السابقة:</strong> {data.previous_volunteer}</Typography>
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>الأوقات المفضلة:</strong> {data.preferred_times}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>الأيام المتاحة:</strong></Typography>
                <List dense>
                  {data.days.map(day => (
                    <ListItem key={day.id} sx={{ py: 0 }}>
                      <ListItemText primary={`- ${day.name}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>مجالات التطوع:</strong></Typography>
                <List dense>
                  {data.types.map(type => (
                    <ListItem key={type.id} sx={{ py: 0 }}>
                      <ListItemText primary={`- ${type.name}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {data.notes && (
              <>
                <Typography variant="h6" color="#155e5d" sx={{ mt: 3 }}>
                  ملاحظات إضافية
                </Typography>
                <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
                <Typography>{data.notes}</Typography>
              </>
            )}

            {/* معلومات النظام */}
            <Typography variant="h6" color="#155e5d" sx={{ mt: 3 }}>
              معلومات النظام
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Typography><strong>تاريخ التسجيل:</strong> {formatDateTime(data.created_at)}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VolunteerInfoCard;
