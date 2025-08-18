import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  IconButton,
  CircularProgress,
  Avatar,
  Divider,
  Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Datatable from '../../components/datatable/Datatable';
import './guarnteesDetails.scss';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#d1bca0ff',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#218483ff',
    },
    '&:hover fieldset': {
      borderColor: '#218483ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#218483ff',
    },
  },
}));

const GuarnteesDetails = () => {
  const { id } = useParams();
  const [showSponsors, setShowSponsors] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const BOX_COLOR = '#d1bca0ff';

  // بيانات الكفالة حسب ال ID
  const sponsorshipData = {
    1: {
      sponsorName: 'محمد أحمد',
      orphanName: 'ياسر محمد',
      monthlyAmount: 500,
      duration: 12,
      paidAmount: 3000,
      totalAmount: 6000,
      description: 'كفالة شهرية لليتيم ياسر محمد لمساعدته في تغطية مصاريفه الدراسية والمعيشية',
      image: 'https://via.placeholder.com/300x200?text=ياسر+محمد',
      startDate: '2023-01-15',
      status: 'نشطة'
    },
    2: {
      sponsorName: 'علي حسن',
      orphanName: 'سارة خالد',
      monthlyAmount: 700,
      duration: 6,
      paidAmount: 4200,
      totalAmount: 4200,
      description: 'كفالة شهرية لليتيمة سارة خالد لمساعدتها في متطلباتها الأساسية',
      image: 'https://via.placeholder.com/300x200?text=سارة+خالد',
      startDate: '2022-11-01',
      status: 'مكتملة'
    },
    3: {
      sponsorName: 'سالم عبدالله',
      orphanName: 'فاطمة عمر',
      monthlyAmount: 400,
      duration: 24,
      paidAmount: 8000,
      totalAmount: 9600,
      description: 'كفالة شهرية لليتيمة فاطمة عمر لضمان استمرار تعليمها ورعايتها',
      image: 'https://via.placeholder.com/300x200?text=فاطمة+عمر',
      startDate: '2022-06-10',
      status: 'نشطة'
    }
  };

  // بيانات الكفلاء
  const sponsorsColumns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      headerClassName: 'header-bold',
    },
    { 
      field: 'firstName', 
      headerName: 'الاسم الأول', 
      width: 130,
    },
    { 
      field: 'lastName', 
      headerName: 'الاسم الأخير', 
      width: 130,
    },
    {
      field: 'amount',
      headerName: 'المبلغ (دولار)',
      type: 'number',
      width: 120,
    },
    {
      field: 'date',
      headerName: 'تاريخ التبرع',
      width: 120,
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button 
          variant="contained" 
          size="small"
          sx={{
            backgroundColor: '#155e5d',
            color: 'white',
            '&:hover': { backgroundColor: '#25706fff' },
            fontWeight: 'bold',
            padding: '6px 12px',
          }}
        >
          التفاصيل
        </Button>
      ),
    },
  ];

  const sponsorsRows = [
    { id: 1, firstName: 'أحمد', lastName: 'علي', amount: 1000, date: '2023-01-20' },
    { id: 2, firstName: 'سامي', lastName: 'خالد', amount: 800, date: '2023-02-15' },
    { id: 3, firstName: 'نورا', lastName: 'محمد', amount: 1200, date: '2023-03-10' }
  ];

  const [editedData, setEditedData] = useState(sponsorshipData[id] || sponsorshipData[1]);

  const handleChange = (field) => (e) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({ ...editedData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditing(false);
      alert('تم تحديث بيانات الكفالة بنجاح');
    }, 1000);
  };

  const handleCancel = () => {
    setEditedData(sponsorshipData[id] || sponsorshipData[1]);
    setEditing(false);
  };

  const toggleSponsors = () => {
    setShowSponsors(!showSponsors);
  };

  return (
    <div className='guarnteesDetails'>
      <Sidebar/>
      <div className='guarnteesDetailsContainer'>
        <Navbar/>
        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 3,
            backgroundColor: BOX_COLOR
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">تفاصيل الكفالة #{id}</Typography>
              {!editing ? (
                <IconButton onClick={() => setEditing(true)} color="primary">
                  <EditIcon />
                </IconButton>
              ) : (
                <Box>
                  <IconButton onClick={handleSave} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : <SaveIcon color="primary" />}
                  </IconButton>
                  <IconButton onClick={handleCancel} disabled={loading}>
                    <CancelIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {editing ? (
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    src={editedData.image}
                    variant="rounded"
                    sx={{ width: 150, height: 100 }}
                  />
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ alignSelf: 'center' }}
                  >
                    تغيير الصورة
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>
                
                <StyledTextField
                  label="اسم الكافل"
                  value={editedData.sponsorName}
                  onChange={handleChange('sponsorName')}
                  fullWidth
                />
                
                <StyledTextField
                  label="اسم اليتيم"
                  value={editedData.orphanName}
                  onChange={handleChange('orphanName')}
                  fullWidth
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledTextField
                    label="المبلغ الشهري (دولار)"
                    value={editedData.monthlyAmount}
                    onChange={handleChange('monthlyAmount')}
                    type="number"
                    fullWidth
                  />
                  <StyledTextField
                    label="المدة (أشهر)"
                    value={editedData.duration}
                    onChange={handleChange('duration')}
                    type="number"
                    fullWidth
                  />
                </Box>
                
                <StyledTextField
                  label="وصف الكفالة"
                  value={editedData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Avatar
                    src={editedData.image}
                    variant="rounded"
                    sx={{ width: 150, height: 100 }}
                  />
                  <Box>
                    <Typography><strong>الكافل:</strong> {editedData.sponsorName}</Typography>
                    <Typography sx={{ mt: 1 }}><strong>اليتيم:</strong> {editedData.orphanName}</Typography>
                    <Typography sx={{ mt: 1 }}><strong>حالة الكفالة:</strong> {editedData.status}</Typography>
                    <Typography sx={{ mt: 1 }}><strong>تاريخ البدء:</strong> {editedData.startDate}</Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography><strong>وصف الكفالة:</strong> {editedData.description}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography><strong>المبلغ الشهري:</strong> {editedData.monthlyAmount} دولار</Typography>
                    <Typography sx={{ mt: 1 }}><strong>المدة:</strong> {editedData.duration} أشهر</Typography>
                    <Typography sx={{ mt: 1 }}><strong>المبلغ المدفوع:</strong> {editedData.paidAmount} دولار</Typography>
                    <Typography sx={{ mt: 1 }}><strong>المبلغ الكلي:</strong> {editedData.totalAmount} دولار</Typography>
                  </Box>
                  
                  <Box sx={{ width: '60%' }}>
                    <Box sx={{ 
                      height: 20, 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: 10,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${(editedData.paidAmount / editedData.totalAmount) * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#4caf50' 
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      تم دفع {Math.round((editedData.paidAmount / editedData.totalAmount) * 100)}% من المبلغ الكلي
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                onClick={toggleSponsors}
                sx={{
                  backgroundColor: '#155e5d',
                  color: 'white',
                  '&:hover': { backgroundColor: '#25706fff' },
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  fontSize: '1rem'
                }}
              >
                {showSponsors ? 'إخفاء الكفلاء' : 'عرض الكفلاء'}
              </Button>
            </Box>

            <Collapse in={showSponsors}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  textAlign: 'center', 
                  color: '#155e5d',
                  fontWeight: 'bold'
                }}>
                  قائمة الكفلاء للمكفول: {editedData.orphanName}
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <Datatable 
                    rows={sponsorsRows} 
                    columns={sponsorsColumns}
                    sx={{
                      '& .MuiDataGrid-row': {
                        '&:nth-of-type(even)': { backgroundColor: '#d1bca0ff' },
                        '&:nth-of-type(odd)': { backgroundColor: '#dfd4c5ff' },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Collapse>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default GuarnteesDetails;