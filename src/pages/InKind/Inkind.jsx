import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import api from '../../api/axios';
import { Box, CircularProgress, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './inKind.scss';

const Inkind = () => {
  const [inKindData, setInKindData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();

  // جلب كل التبرعات العينية
  const fetchInKind = async (categoryId = null) => {
    setLoading(true);
    try {
      let url = '/inKinds/getAll/for/admin';
      if (categoryId) url += `?category_id=${categoryId}`;
      const res = await api.get(url);
      const extractedData = (res.data.data || []).map(item => item.in_kind);
      setInKindData(extractedData);
    } catch (error) {
      console.error('Error fetching in-kind donations:', error);
    } finally {
      setLoading(false);
    }
  };

  // جلب فئات التبرعات العينية
  const fetchCategories = async () => {
    try {
      const res = await api.get('/category/getAll/InKind');
      const data = res.data.data || [];
      setCategories(data);
      if (data.length > 0) setActiveFilter(data[0].id); // اجعل أول فئة نشطة افتراضياً
    } catch (error) {
      console.error('Error fetching in-kind categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeFilter !== null) fetchInKind(activeFilter);
  }, [activeFilter]);

  // قبول التبرع العيني (POST)
  const handleAccept = async (id) => {
    setActionLoadingId(id);
    try {
      await api.post(`/inKinds/accept/for/admin/${id}`);
      setInKindData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error accepting in-kind donation:', error);
      alert('❌ فشل قبول التبرع');
    } finally {
      setActionLoadingId(null);
    }
  };

  // الانتقال لتفاصيل التبرع
  const handleDetails = (id) => {
    navigate(`/inKind/details/${id}`);
  };

  // إعداد أزرار الفلترة
  const filterButtons = categories.map(cat => ({
    text: cat.name,
    value: cat.id,
    color: 'primary',
    onClick: () => setActiveFilter(cat.id)
  }));

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <div className='inkind'>
      <Sidebar/>
      <div className='inkindContainer'>
        <Navbar/>

        {/* فلتر التبرعات العينية */}
        {categories.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Filter 
              buttons={filterButtons} 
              activeFilter={activeFilter} 
              spacing={2} 
            />
          </Box>
        )}

        {/* عرض التبرعات */}
        {inKindData.length === 0 ? (
          <Typography sx={{ mt: 4, textAlign: 'center' }}>
            لا توجد تبرعات عينية لعرضها
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            {inKindData.map((in_kind) => (
              <Box 
                key={in_kind.id} 
                sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography variant="h6">{in_kind.name_category_ar}</Typography>
                  <Typography variant="body2">العنوان: {in_kind.address_ar || 'غير متوفر'}</Typography>
                  <Typography variant="body2">الهاتف: {in_kind.phone || 'غير متوفر'}</Typography>
                  <Typography variant="body2">تاريخ الإنشاء: {in_kind.created_at}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAccept(in_kind.id)}
                    disabled={actionLoadingId === in_kind.id}
                  >
                    {actionLoadingId === in_kind.id ? <CircularProgress size={20} /> : 'قبول'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDetails(in_kind.id)}
                  >
                    تفاصيل
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
};

export default Inkind;
