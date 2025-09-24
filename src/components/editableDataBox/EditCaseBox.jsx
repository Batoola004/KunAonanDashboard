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
    '& fieldset': { borderColor: '#218483ff' },
    '&:hover fieldset': { borderColor: '#218483ff' },
    '&.Mui-focused fieldset': { borderColor: '#218483ff' },
  },
}));

const EditCaseBox = ({ caseData, onUpdate, disableEdit }) => {
  const BOX_COLOR = '#d1bca0ff';

  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState(caseData);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { setEditedData(caseData); }, [caseData]);

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
    setSaving(true); setError(null); setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("title_ar", editedData.title);
      formData.append("description_ar", editedData.description);
      formData.append("goal_amount", editedData.goalAmount);
      formData.append("is_emergency", editedData.isEmergency ? 1 : 0);
      if (imageFile) formData.append('image', imageFile);

      const response = await api.post(`/humanCase/update/${caseData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = response.data?.data;
      const campaign = updated?.campaign || {};

      const normalized = {
        id: updated.id,
        title: campaign.title_ar || campaign.title_en,
        description: campaign.description_ar || campaign.description_en,
        goalAmount: campaign.goal_amount,
        collectedAmount: campaign.collected_amount,
        remainingAmount: campaign.remaining_amount,
        statusLabel: campaign.status_label,
        isEmergency: updated.is_emergency === 1,
        image: campaign.image
          ? `http://localhost:8000/storage/${campaign.image}`
          : 'https://via.placeholder.com/300',
      };

      onUpdate(normalized);

      setSuccess('تم تحديث الحالة بنجاح ✅');
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'فشل تحديث الحالة ❌');
    } finally { setSaving(false); }
  };

  const handleCancel = () => { setEditedData(caseData); setImageFile(null); setEditing(false); };

  if (!caseData) return <Alert severity="warning">لا توجد بيانات</Alert>;

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb:2 }}>{success}</Alert>}

      <Paper elevation={3} sx={{ p:3, mb:3, backgroundColor: BOX_COLOR }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">تفاصيل الحالة الإنسانية</Typography>
          {!editing && !disableEdit ? (
            <IconButton onClick={() => setEditing(true)} color="primary"><EditIcon /></IconButton>
          ) : (
            !disableEdit && (
              <Box>
                <IconButton onClick={handleSave} disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : <SaveIcon color="primary" />}
                </IconButton>
                <IconButton onClick={handleCancel} disabled={saving}>
                  <CancelIcon color="error" />
                </IconButton>
              </Box>
            )
          )}
        </Box>

        {editing ? (
          <Box component="form" sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            <Box sx={{ display:'flex', gap:2 }}>
              <Avatar src={editedData.image || 'https://via.placeholder.com/150'} variant="rounded" sx={{ width:150, height:100 }} />
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ alignSelf:'center' }}>
                تغيير الصورة
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>

            <StyledTextField label="اسم الحالة" value={editedData.title || ''} onChange={handleChange('title')} fullWidth />
            <StyledTextField label="الوصف" value={editedData.description || ''} onChange={handleChange('description')} multiline rows={4} fullWidth />

            <StyledTextField label="المبلغ المطلوب ($)" value={editedData.goalAmount || 0} onChange={handleChange('goalAmount')} type="number" fullWidth />
            
            {/* حقل الطارئة للقراءة فقط */}
            <Typography sx={{ mt:2 }}>
              <strong>الحالة الطارئة:</strong> {editedData.isEmergency ? 'نعم' : 'لا'}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display:'flex', gap:3, mb:2 }}>
              <Avatar src={caseData.image || 'https://via.placeholder.com/150'} variant="rounded" sx={{ width:150, height:100 }} />
              <Box>
                <Typography><strong>الاسم:</strong> {caseData.title}</Typography>
                <Typography sx={{ mt:1 }}><strong>الوصف:</strong> {caseData.description}</Typography>
                <Typography sx={{ mt:1 }}><strong>الحالة الطارئة:</strong> {caseData.isEmergency ? 'نعم' : 'لا'}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my:2 }} />

            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Box>
                <Typography><strong>المبلغ المطلوب:</strong> {caseData.goalAmount}$</Typography>
                <Typography sx={{ mt:1 }}><strong>المبلغ المجموع:</strong> {caseData.collectedAmount}$</Typography>
                <Typography sx={{ mt:1 }}><strong>المبلغ المتبقي:</strong> {caseData.remainingAmount}$</Typography>
              </Box>
              
              <Box sx={{ width:'50%' }}>
                <Box sx={{ height:20, backgroundColor:'#e0e0e0', borderRadius:10, overflow:'hidden' }}>
                  <Box sx={{ width:`${Math.round((caseData.collectedAmount / caseData.goalAmount) * 100)}%`, height:'100%', backgroundColor:'#2196f3' }} />
                </Box>
                <Typography variant="caption" sx={{ mt:1, display:'block' }}>
                  تم جمع {Math.round((caseData.collectedAmount / caseData.goalAmount) * 100)}% من الهدف
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EditCaseBox;
