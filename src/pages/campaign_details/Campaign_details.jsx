import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import EditDataBox from '../../components/editableDataBox/EditDataBox';
import PeopleButton from '../../components/peopleButton/PeopleButton';
import InfoBox from '../../components/infoBox/InfoBox';
import './campaign_details.scss';
import { Box, CircularProgress, Alert, Snackbar, Alert as MuiAlert } from '@mui/material';
import api from '../../api/axios';

const Campaign_details = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [tableTitle, setTableTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // جلب بيانات الحملة
  const fetchCampaignDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/campaigns/${id}`); 
      if (response.data?.data) {
        const apiData = response.data.data;
        setCampaign({
          id: apiData.id,
          title_en: apiData.title_en,
          title_ar: apiData.title_ar,
          description_en: apiData.description_en,
          description_ar: apiData.description_ar,
          target_amount: parseFloat(apiData.goal_amount),
          collected_amount: parseFloat(apiData.collected_amount),
          status: apiData.status,
          image: apiData.image 
                  ? `http://localhost:8000/storage/${apiData.image}` 
                  : 'https://via.placeholder.com/300',
          progress: Math.round(
            (parseFloat(apiData.collected_amount) / parseFloat(apiData.goal_amount)) * 100
          ),
          start_date: apiData.start_date,
          end_date: apiData.end_date,
        });
      } else {
        setError('⚠️ لم يتم العثور على بيانات الحملة');
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('فشل تحميل تفاصيل الحملة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (type === activeTable) {
      setActiveTable(null);
      return;
    }

    if (!id) return;
    setActiveTable(type);
    setTableLoading(true);
    setTableRows([]);
    setTableTitle('');

    try {
      let response;
      if (type === 'beneficiaries') {
        response = await api.get(`/campaigns/${id}/getBeneficiaries`);
      } else if (type === 'volunteers') {
        response = await api.get(`/campaigns/${id}/getVolunteers`);
      } else if (type === 'donators') {
        response = await api.get(`/campaigns/${id}/getDonators`);
      }

      let data = response.data?.data || [];

      // تجاهل مفتاح pivot عند المتطوعين
      if (type === 'volunteers') {
        data = data.map(({ pivot, ...rest }) => rest);
      }

      setTableRows(data);

      const titleMap = {
        beneficiaries: 'المستفيدون',
        volunteers: 'المتطوعون',
        donators: 'المتبرعون',
      };
      setTableTitle(titleMap[type]);
    } catch (err) {
      console.error('Error fetching table data:', err);
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  };

  // تحديث بيانات الحملة
  const handleUpdateCampaign = async (updatedData) => {
    if (campaign?.status === 'archived') {
      setError('❌ لا يمكن تعديل حملة مؤرشفة');
      return;
    }

    try {
      const formData = new FormData();
      if (updatedData.title_en) formData.append('title_en', updatedData.title_en);
      if (updatedData.title_ar) formData.append('title_ar', updatedData.title_ar);
      if (updatedData.description_en) formData.append('description_en', updatedData.description_en);
      if (updatedData.description_ar) formData.append('description_ar', updatedData.description_ar);
      if (updatedData.image) formData.append('image', updatedData.image); // ملف جديد

      const response = await api.put(`/campaigns/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.status === 200) {
        const apiData = response.data.data;
        setCampaign({
          id: apiData.id,
          title_en: apiData.title_en,
          title_ar: apiData.title_ar,
          description_en: apiData.description_en,
          description_ar: apiData.description_ar,
          target_amount: parseFloat(apiData.goal_amount),
          collected_amount: parseFloat(apiData.collected_amount),
          status: apiData.status,
          image: apiData.image 
                  ? `http://localhost:8000/storage/${apiData.image}` 
                  : 'https://via.placeholder.com/300',
          progress: Math.round(
            (parseFloat(apiData.collected_amount) / parseFloat(apiData.goal_amount)) * 100
          ),
          start_date: apiData.start_date,
          end_date: apiData.end_date,
        });
        setSuccessMsg('تم تحديث الحملة بنجاح ✅');
      }
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError('فشل تحديث الحملة ❌');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!campaign) return <Box sx={{ p: 3 }}><Alert severity="warning">لم يتم العثور على الحملة</Alert></Box>;

  return (
    <div className='campaign_details'>
      <Sidebar />
      <div className="campaign_detailsContainer">
        <Navbar />

        <EditDataBox campaign={campaign} onUpdate={handleUpdateCampaign} disableEdit={campaign?.status === 'archived'} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
          <PeopleButton 
            label="المستفيدون" 
            count={activeTable === 'beneficiaries' ? tableRows.length : 0} 
            onClick={() => handleButtonClick('beneficiaries')} 
            active={activeTable === 'beneficiaries'} 
          />
          <PeopleButton 
            label="المتطوعون" 
            count={activeTable === 'volunteers' ? tableRows.length : 0} 
            onClick={() => handleButtonClick('volunteers')} 
            active={activeTable === 'volunteers'} 
          />
          <PeopleButton 
            label="المتبرعون" 
            count={activeTable === 'donators' ? tableRows.length : 0} 
            onClick={() => handleButtonClick('donators')} 
            active={activeTable === 'donators'} 
          />
        </Box>

        {activeTable && (
          <Box sx={{ mt: 3 }}>
            {tableLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            ) : tableRows.length === 0 ? (
              <Alert severity="info">لا توجد بيانات لعرضها</Alert>
            ) : (
              <InfoBox 
                data={tableRows} 
                title={tableTitle} 
                showDetailsButton={false} 
              />
            )}
          </Box>
        )}
      </div>

      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')}>
        <MuiAlert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Campaign_details;
