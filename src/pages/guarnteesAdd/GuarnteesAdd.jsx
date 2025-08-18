import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import './guarnteesAdd.scss';
import InputBox from '../../components/inputBox/InputBox';
import Box from '@mui/material/Box';
import SendBottun from '../../components/sendBottun/SendBottun';
import ImageUploadBox from '../../components/imageBox/ImageUploadBox';
import api from '../../api/axios';

const GuarnteesAdd = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyAmount: '',
    sponsoredName: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const filterButtons = [
    { text: "كفالة طالب", value: "student", color: "secondary", hoverColor: "#f3e5f5", activeTextColor: "#ffffff", onClick: () => setActiveFilter('student') },
    { text: "كفالة يتيم", value: "orphan", color: "success", hoverColor: "#e8f5e9", activeTextColor: "#ffffff", onClick: () => setActiveFilter('orphan') },
    { text: "كفالة أسرة", value: "family", color: "primary", hoverColor: "#e3f2fd", activeTextColor: "#ffffff", onClick: () => setActiveFilter('family') }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({ ...prev, image: imageData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('monthlyAmount', formData.monthlyAmount);
      data.append('sponsoredName', formData.sponsoredName);
      if (formData.image) data.append('image', formData.image);

      const response = await api.post('/sponsorship/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(response.data.message || 'تم إضافة الكفالة بنجاح');

      // إعادة تهيئة الفورم
      setFormData({
        name: '',
        description: '',
        monthlyAmount: '',
        sponsoredName: '',
        image: null
      });
    } catch (error) {
      console.error('Error submitting sponsorship:', error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء إضافة الكفالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='guarnteesAdd'>
      <Sidebar />
      <div className="guarnteesAddContainer">
        <Navbar />

        <Filter 
          buttons={filterButtons}
          activeFilter={activeFilter}
          spacing={2}
          buttonProps={{ sx: { minWidth: '120px', fontSize: '0.875rem' } }}
        />

        <div className="formSection">
          <InputBox 
            width="800px"
            label="اسم الكفالة"
            color="#ffffff"
            boxColor="#d2b48c"
            value={formData.name}
            onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}
          />
          <InputBox 
            width="800px"
            label="اسم المكفول"
            color="#ffffff"
            boxColor="#d2b48c"
            value={formData.sponsoredName}
            onChange={(e) => handleInputChange({ target: { name: 'sponsoredName', value: e.target.value } })}
          />
        </div>

        <div className="formSection">
          <InputBox 
            width="800px"
            label="وصف الكفالة"
            color="#ffffff"
            boxColor="#d1bca0"
            multiline
            minRows={4}
            value={formData.description}
            onChange={(e) => handleInputChange({ target: { name: 'description', value: e.target.value } })}
          />
        </div>

        <div className="formSection">
          <InputBox 
            width="300px"
            label="المبلغ الشهري"
            color="#ffffff"
            boxColor="#218483"
            value={formData.monthlyAmount}
            onChange={(e) => handleInputChange({ target: { name: 'monthlyAmount', value: e.target.value } })}
          />
        </div>

        <ImageUploadBox
          width="100%"
          height="300px"
          label="اسحب وأسقط صورة الكفالة هنا"
          uploadLabel="اختر صورة للكفالة"
          boxColor="#f8f9fa"
          onImageSelected={handleImageUpload}
          sx={{ mb: 4 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px', mt: 2 }}>
          <SendBottun onClick={handleSubmit} disabled={loading} />
        </Box>
      </div>
    </div>
  );
};

export default GuarnteesAdd;
