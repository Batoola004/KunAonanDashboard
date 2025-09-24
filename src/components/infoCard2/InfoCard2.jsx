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
} from '@mui/material';

const BeneficiaryInfoCard = ({ data }) => {
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
            bgcolor: '#E5D2B1',
            fontSize: '2.5rem',
            margin: '0 auto'
          }}>
            {data.name?.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="h6">
            رقم الطلب: {data.id}
          </Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>

            <Typography variant="h6" color="#165e5d" sx={{ mt: 2 }}>
              المعلومات الشخصية
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>الجنس:</strong> {data.gender}</Typography>
                <Typography><strong>تاريخ الميلاد:</strong> {formatDate(data.birth_date)}</Typography>
                <Typography><strong>عدد الأفراد:</strong> {data.num_of_members}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>العنوان:</strong> {data.address}</Typography>
                <Typography><strong>الهاتف:</strong> {data.phone}</Typography>
                <Typography><strong>الحالة:</strong> {data.status}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" color="#165e5d" sx={{ mt: 3 }}>
              المعلومات التعليمية والمهنية
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>المؤهل العلمي:</strong> {data.study}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography><strong>الوظيفة:</strong> {data.job || '-'}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" color="#165e5d" sx={{ mt: 3 }}>
              التفاصيل
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Typography><strong>الفئة الرئيسية:</strong> {data.main_category}</Typography>
            <Typography><strong>الفئة الفرعية:</strong> {data.sub_category}</Typography>
            {data.notes && <Typography><strong>ملاحظات إضافية:</strong> {data.notes}</Typography>}
            <Typography variant="h6" color="#155e5d" sx={{ mt: 3 }}>
              معلومات النظام
            </Typography>
            <Divider sx={{ bgcolor: '#e0e0e0', mb: 2 }} />
            <Typography><strong>تاريخ التسجيل:</strong> {formatDateTime(data.created_at)}</Typography>
            {data.reason_of_rejection && (
              <Typography><strong>سبب الرفض:</strong> {data.reason_of_rejection}</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BeneficiaryInfoCard;
