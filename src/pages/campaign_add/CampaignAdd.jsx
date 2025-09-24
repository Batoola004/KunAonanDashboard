import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import "./campaignAdd.scss";
import InputBox from '../../components/inputBox/InputBox';
import Box from '@mui/material/Box';
import SendBottun from '../../components/sendBottun/SendBottun';
import ImageUploadBox from '../../components/imageBox/ImageUploadBox';
import axios from '../../api/axios';

const CampaignAdd = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [campaignImage, setCampaignImage] = useState(null);

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  const filterButtons = [
    { text: "all", value: "all", color: "primary", hoverColor: "#e3f2fd", activeTextColor: "#ffffff", onClick: () => setActiveFilter('all') },
    { text: "Health", value: "Health", color: "secondary", hoverColor: "#f3e5f5", activeTextColor: "#ffffff", onClick: () => setActiveFilter('Health') },
    { text: "Build", value: "Build", color: "success", hoverColor: "#e8f5e9", activeTextColor: "#ffffff", onClick: () => setActiveFilter('Build') },
    { text: "Education", value: "Education", color: "primary", hoverColor: "#e3f2fd", activeTextColor: "#ffffff", onClick: () => setActiveFilter('Education') }
  ];

  const getCategoryId = (filter) => {
    switch (filter) {
      case 'Health': return 1;
      case 'Build': return 2;
      case 'Education': return 3;
      default: return 0;
    }
  };

  const handleImageUpload = (imageData) => {
    console.log('تم اختيار صورة الحملة:', imageData);
    setCampaignImage(imageData); 
  };

  const handleSubmit = async () => {
    try {
      const token = '1|tyOPFRJt30czbQGp6p6k8zFSjppzbgcFHdJNgqozf3d6453f';
      console.log('جارٍ إرسال الحملة...');
      const formData = new FormData();
      formData.append('title_ar', titleAr);
      formData.append('title_en', titleEn);
      formData.append('description_ar', descAr);
      formData.append('description_en', descEn);
      formData.append('goal_amount', goalAmount);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('category_id', getCategoryId(activeFilter));
      if (campaignImage) {
        formData.append('image', campaignImage);
      }

      const response = await axios.post('/campaigns/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Campaign added:', response.data);
      alert('✅ تمت إضافة الحملة بنجاح');

      
      navigate('/campaign');

    } catch (error) {
      console.error('❌ خطأ في الإرسال:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        alert('❌ فشل في إضافة الحملة: ' + JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error('Request was made but no response:', error.request);
        alert('❌ لم يصل الرد من الخادم');
      } else {
        alert('❌ خطأ غير متوقع: ' + error.message);
      }
    }
  };

  return (
    <div className='campaignAdd'>
      <Sidebar />
      <div className="campaignAddContainer">
        <Navbar />
        <Filter 
          buttons={filterButtons}
          activeFilter={activeFilter}
          spacing={2}
          buttonProps={{ sx: { minWidth: '120px', fontSize: '0.875rem' } }}
        />

        <InputBox width="500px" label="اسم الحملة" color="#ffffff" boxColor="#E5D2B1" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        <InputBox width="500px" label="Campaign name" color="#ffffff" boxColor="#E5D2B1" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        <InputBox width="500px" label="وصف الحملة" color="#ffffff" boxColor="#E5D2B1" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
        <InputBox width="500px" label="Campaign description" color="#ffffff" boxColor="#E5D2B1" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        <InputBox width="200px" label="The requested amount" color="#ffffff" boxColor="#E5D2B1" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />

        <div className="dateField">
          <label>Start Date (yyyy-mm-dd)</label>
          <input type="date" name="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ backgroundColor: "#cccccc" }} />
        </div>

        <div className="dateField">
          <label>End Date (yyyy-mm-dd)</label>
          <input type="date" name="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ backgroundColor: "#cccccc" }} />
        </div>

        <ImageUploadBox width="100%" height="300px" label="اسحب وأسقط صورة الحملة هنا" uploadLabel="اختر صورة للحملة" boxColor="#f8f9fa" onImageSelected={handleImageUpload} sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px', mt: 2 }}>
          <SendBottun onClick={handleSubmit} />
        </Box>     
      </div>
    </div>
  );
};

export default CampaignAdd;
