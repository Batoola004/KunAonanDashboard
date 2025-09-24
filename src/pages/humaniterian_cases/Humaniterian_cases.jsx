import React, { useState, useEffect } from 'react';
import "./humaniterian_cases.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import HumanCasesList from '../../components/cardList/HumanCasesList';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';

const HumanCasesPage = () => {
  const [cardsData, setCardsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🟢 جلب الحالات حسب الفلتر
  const fetchCases = async (filter = 'all') => {
    let url = '/humanCase/getAll';

    if (filter === 'emergency') {
      url = '/humanCase/emergency';
    } else if (filter === 'archived') {
      url = '/humanCase/archivedHumanCases';
    } else if (typeof filter === 'number') {
      url = `/humanCase/category/${filter}`;
    }

    try {
      const res = await api.get(url);
      const data = res.data?.data || [];

      if (!data.length && res.status === 200) {
        setCardsData([]);
        setError('لا توجد حالات لعرضها 🔹');
        return;
      }

      const formattedData = data.map(item => ({
        id: item.human_case_id || item.id,
        title: item.case_name || item.title,
        description: item.description,
        imageUrl: item.image
          ? `http://localhost:8000/storage/${item.image}`
          : 'https://via.placeholder.com/300',
        isActive: item.status_label === 'فعالة' || item.status === 'active',
        statusLabel: item.status_label || item.status,
        isEmergency: item.is_emergency === 1,
        goalAmount: item.goal_amount,
        collectedAmount: item.collected_amount,
        categoryId: item.category_id,
        campaignId: item.campaign_id,
      }));

      setCardsData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('فشل تحميل الحالات الإنسانية ❌');
    }
  };

  useEffect(() => {
    fetchCases('all');
  }, []);

  // 🟢 أزرار الفلترة
  const filterButtons = [
    { text: "All", value: "all" },
    { text: "مرضى", value: 4 },
    { text: "طالب علم", value: 5 },
    { text: "أسر متعففة", value: 6 },
    { text: "حالات طارئة", value: "emergency" },
  ];

  const handleFilterClick = (value) => {
    setActiveFilter(value);
    fetchCases(value);
  };

  // 🟢 فتح تفاصيل الحالة
  const handleCardClick = (id) => {
    navigate(`/HumanCaseDetails/${id}`);
  };

  // 🟢 تفعيل الحالة
  const handleActivate = async (id, isEmergency = false) => {
    if (isEmergency) {
      alert('لا يمكن تفعيل الحالة الطارئة مباشرة ❌');
      return;
    }
    try {
      const res = await api.post(`/humanCase/activate/${id}`);
      if (res.status === 200) {
        alert(res.data.message || 'تم تفعيل الحالة بنجاح ✅');
        fetchCases(activeFilter);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'فشل تفعيل الحالة ❌');
    }
  };

  // 🟢 أرشفة الحالة
  const handleArchive = async (id, isEmergency = false) => {
    if (isEmergency) {
      alert('لا يمكن أرشفة الحالة الطارئة مباشرة ❌');
      return;
    }
    try {
      const res = await api.post(`/humanCase/archive/${id}`);
      if (res.status === 200) {
        alert(res.data.message || 'تم أرشفة الحالة الإنسانية بنجاح ✅');
        fetchCases(activeFilter);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'فشل أرشفة الحالة ❌');
    }
  };

  return (
    <div className='cases'>
      <Sidebar />
      <div className="casesContainer">
        <Navbar />

        <Filter
          buttons={filterButtons.map(btn => ({
            ...btn,
            onClick: () => handleFilterClick(btn.value)
          }))}
          activeFilter={activeFilter}
          spacing={2}
          buttonProps={{ sx: { minWidth: '120px', fontSize: '0.875rem' } }}
        />

        {error && <Box sx={{ p: 2 }}><Alert severity="error">{error}</Alert></Box>}

        <HumanCasesList
          cardsData={cardsData}
          onCardClick={handleCardClick}
          setCardsData={setCardsData}
          onActivate={handleActivate}
          onArchive={handleArchive}
          showActivate={true}
          showArchive={true}
        />
      </div>
    </div>
  );
};

export default HumanCasesPage;
