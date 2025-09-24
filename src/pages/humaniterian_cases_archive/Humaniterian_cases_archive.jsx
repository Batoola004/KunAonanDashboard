import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import ArchiveCardList from '../../components/cardList/ArchiveCardList';
import { Button, Box, Alert, CircularProgress } from '@mui/material';
import api from '../../api/axios';
import './humaniterian_cases_archive.scss';  

const CasesArchive = () => {
  const [cardsData, setCardsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ حالة التحميل
  const navigate = useNavigate();

  const fetchArchivedCases = async () => {
    setLoading(true); // بدء التحميل
    try {
      const response = await api.get('/humanCase/archivedHumanCases'); 
      const data = response.data?.data || [];
      if (data.length === 0) {
        setCardsData([]);
        setError('لا توجد حالات مؤرشفة حالياً 🔹');
        return;
      }
      const formattedData = data.map(singleCase => ({
        id: singleCase.id,
        title: singleCase.title,
        description: singleCase.description,
        imageUrl: singleCase.image 
          ? `http://localhost:8000/storage/${singleCase.image}` 
          : 'https://via.placeholder.com/300',
        goalAmount: singleCase.goal_amount,
        collectedAmount: singleCase.collected_amount,
        isActive: singleCase.status === 'active',
        isEmergency: singleCase.is_emergency === 1
      }));
      setCardsData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching archived cases:', err);
      setError('❌ فشل تحميل الحالات المؤرشفة');
      setCardsData([]);
    } finally {
      setLoading(false); // انتهاء التحميل
    }
  };

  useEffect(() => { fetchArchivedCases(); }, []);

  const handleCardClick = (id) => {
    navigate(`/HumanCaseDetails/${id}`);
  };

  return (
    <div className='casesArchive'>
      <Sidebar />
      <div className="casesArchiveContainer">
        <Navbar />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px', alignItems: 'center', gap:2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchArchivedCases} 
            disabled={loading} // ✅ تعطيل الزر أثناء التحميل
          >
            تحديث الحالات الإنسانية
          </Button>
          {loading && <CircularProgress size={24} />} {/* ✅ مؤشر الانتظار */}
        </Box>

        {error && <Box sx={{ p: 2 }}><Alert severity="error">{error}</Alert></Box>}

        <ArchiveCardList
          cardsData={cardsData}
          onCardClick={handleCardClick}
          setCardsData={setCardsData}
        />
      </div>
    </div>
  );
};

export default CasesArchive;
