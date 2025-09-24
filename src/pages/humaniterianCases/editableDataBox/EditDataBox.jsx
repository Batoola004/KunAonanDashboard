import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, IconButton,
  CircularProgress, Avatar, Divider, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

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

const EditDataBox = () => {
  const { id } = useParams();
  const BOX_COLOR = '#d1bca0ff';

  const [editing, setEditing] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await api.get(`/campaigns/get/${id}`);
        console.log('API Response:', response.data); 

        const apiData = response.data.data || response.data; 
        setCampaignData({
          title: apiData.title || '',
          description: apiData.description || '',
          goal_amount: apiData.goal_amount || 0,
          collected_amount: apiData.collected_amount || 0,
          category_id: apiData.category_id || 1,
          start_date: apiData.start_date || '',
          end_date: apiData.end_date || '',
          image: apiData.image ? `http://localhost:8000/storage/${apiData.image}` : null,
          progress: apiData.goal_amount ? Math.round((apiData.collected_amount / apiData.goal_amount) * 100) : 0,
        });
        setEditedData({
          title: apiData.title || '',
          description: apiData.description || '',
          goal_amount: apiData.goal_amount || 0,
          category_id: apiData.category_id || 1,
          start_date: apiData.start_date || '',
          end_date: apiData.end_date || '',
          image: apiData.image ? `http://localhost:8000/storage/${apiData.image}` : null,
        });
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setError('فشل تحميل بيانات الحملة');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  const handleChange = (field) => (e) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({ ...editedData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.keys(editedData).forEach(key => {
        if (key !== 'image') formData.append(key, editedData[key]);
      });
      if (imageFile) formData.append('image', imageFile);

      const response = await api.post(`/campaigns/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedData = response.data.data || response.data;
      setCampaignData({
        ...updatedData,
        image: updatedData.image ? `http://localhost:8000/storage/${updatedData.image}` : null,
        progress: updatedData.goal_amount ? Math.round((updatedData.collected_amount / updatedData.goal_amount) * 100) : 0,
      });
      setEditedData({
        ...updatedData,
        image: updatedData.image ? `http://localhost:8000/storage/${updatedData.image}` : null,
      });

      setSuccess('تم تحديث الحملة بنجاح ✅');
      setEditing(false);
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err.response?.data?.message || 'فشل تحديث الحملة ❌');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...campaignData });
    setImageFile(null);
    setEditing(false);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (!campaignData) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">لم يتم العثور على الحملة</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: BOX_COLOR }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">معلومات الحملة</Typography>
          {!editing ? (
            <IconButton onClick={() => setEditing(true)} color="primary">
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleSave} disabled={saving}>
                {saving ? <CircularProgress size={24} /> : <SaveIcon color="primary" />}
              </IconButton>
              <IconButton onClick={handleCancel} disabled={saving}>
                <CancelIcon color="error" />
              </IconButton>
            </Box>
          )}
        </Box>

        {editing ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar 
                src={editedData.image || 'https://via.placeholder.com/150'} 
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
              label="اسم الحملة"
              value={editedData.title || ''}
              onChange={handleChange('title')}
              fullWidth
            />
            
            <StyledTextField
              label="الوصف"
              value={editedData.description || ''}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledTextField
                label="المبلغ المطلوب ($)"
                value={editedData.goal_amount || 0}
                onChange={handleChange('goal_amount')}
                type="number"
                fullWidth
              />
              
              <StyledTextField
                label="التصنيف"
                value={editedData.category_id || 1}
                onChange={handleChange('category_id')}
                select
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="1">صحية</option>
                <option value="2">بناء</option>
                <option value="3">تعليم</option>
              </StyledTextField>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledTextField
                label="تاريخ البدء"
                type="date"
                value={editedData.start_date || ''}
                onChange={handleChange('start_date')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              
              <StyledTextField
                label="تاريخ الانتهاء"
                type="date"
                value={editedData.end_date || ''}
                onChange={handleChange('end_date')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Avatar 
                src={campaignData.image || 'https://via.placeholder.com/150'} 
                variant="rounded" 
                sx={{ width: 150, height: 100 }} 
              />
              <Box>
                <Typography><strong>الاسم:</strong> {campaignData.title}</Typography>
                <Typography sx={{ mt: 1 }}><strong>التصنيف:</strong> 
                  {campaignData.category_id === 1 ? ' صحية' : 
                   campaignData.category_id === 2 ? ' بناء' : ' تعليم'}
                </Typography>
                <Typography sx={{ mt: 1 }}><strong>الوصف:</strong> {campaignData.description}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography><strong>المبلغ المطلوب:</strong> {campaignData.goal_amount} $</Typography>
                <Typography sx={{ mt: 1 }}><strong>المبلغ المجموع:</strong> {campaignData.collected_amount} $</Typography>
                <Typography sx={{ mt: 1 }}><strong>تاريخ البدء:</strong> {campaignData.start_date}</Typography>
                <Typography sx={{ mt: 1 }}><strong>تاريخ الانتهاء:</strong> {campaignData.end_date}</Typography>
              </Box>
              
              <Box sx={{ width: '50%' }}>
                <Box sx={{ 
                  height: 20, 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: 10,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${campaignData.progress}%`, 
                    height: '100%', 
                    backgroundColor: campaignData.progress >= 100 ? '#4caf50' : '#2196f3' 
                  }} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  تم جمع {campaignData.progress}% من الهدف
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EditDataBox;
