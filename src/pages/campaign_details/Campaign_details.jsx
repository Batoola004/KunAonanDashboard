import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import EditDataBox from '../../components/editableDataBox/EditDataBox';
import PeopleButton from '../../components/peopleButton/PeopleButton';
import InfoBoxWithDelete from '../../components/infoBoxWithDelete/InfoBoxWithDelete';
import InfoBox from '../../components/infoBox/InfoBox';
import { Box, CircularProgress, Alert, Snackbar, Alert as MuiAlert } from '@mui/material';
import api from '../../api/axios';
import './campaign_details.scss';

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

  const fetchCampaignDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/campaigns/${id}`);
      const apiData = response.data?.data;
      if (apiData) {
        setCampaign(apiData);
      } else setError('⚠️ لم يتم العثور على بيانات الحملة');
    } catch (err) {
      console.error(err);
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
    setActiveTable(type);
    setTableLoading(true);
    setTableRows([]);
    setTableTitle('');

    try {
      let response, data = [];
      if (type === 'beneficiaries') response = await api.get(`/campaigns/${id}/getBeneficiaries`);
      else if (type === 'volunteers') response = await api.get(`/campaigns/${id}/getVolunteers`);
      else if (type === 'donators') response = await api.get(`/campaigns/${id}/donors`);
      else if (type === 'unsortedBeneficiaries') response = await api.get(`/beneficiaries/unsorted`);
      else if (type === 'unsortedVolunteers') response = await api.get(`/volunteers/getToSort`);

      data = response.data?.data || response.data?.donors || response.data || [];

      const rowsWithId = data.map(r => ({
        id: r.id || r.donation_id || r.beneficiary_id,
        ...r
      }));

      setTableRows(rowsWithId);

      const titleMap = {
        beneficiaries: 'المستفيدون',
        volunteers: 'المتطوعون',
        donators: 'المتبرعون',
        unsortedBeneficiaries: 'إضافة مستفيدين',
        unsortedVolunteers: 'إضافة متطوعين'
      };
      setTableTitle(titleMap[type] || '');
    } catch (err) {
      console.error(err);
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleDeleteItems = async (ids) => {
    try {
      if (!ids || ids.length === 0) return;

      if (activeTable === 'beneficiaries') {
        await api.post(`/campaigns/${id}/deleteBeneficiaries`, { beneficiary_ids: ids });
      } else if (activeTable === 'volunteers') {
        await api.post(`/campaigns/${id}/deleteVolunteers`, { volunteer_ids: ids });
      }

      await handleButtonClick(activeTable);
      setSuccessMsg('تم الحذف بنجاح ✅');
    } catch (err) {
      console.error(err);
      setError('فشل الحذف ❌');
    }
  };

  const handleAddSelectedToCampaign = async (ids) => {
    try {
      if (!ids || ids.length === 0) return;
      if (activeTable === 'unsortedBeneficiaries')
        await api.post(`/campaigns/${id}/addBeneficiaries`, { beneficiary_ids: ids });
      else if (activeTable === 'unsortedVolunteers')
        await api.post(`/campaigns/${id}/addVolunteers`, { volunteer_ids: ids });

      await handleButtonClick(activeTable === 'unsortedBeneficiaries' ? 'beneficiaries' : 'volunteers');
      setSuccessMsg('تم الإضافة بنجاح ✅');
    } catch (err) {
      console.error(err);
      setError('فشل الإضافة ❌');
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

        {/* ✅ ديناميكي: EditDataBox بياخد إندبوينتات */}
        <EditDataBox
          endpointGet={`/campaigns/${id}`}
          endpointUpdate={`/campaigns/${id}/update`}
          title="تفاصيل الحملة"
          disableEdit={campaign?.status === 'archived'}
          fields={[
            { name: "title_ar", label: "اسم الحملة (عربي)", type: "text" },
            { name: "title_en", label: "اسم الحملة (انكليزي)", type: "text" },
            { name: "description_ar", label: "الوصف (عربي)", type: "textarea" },
            { name: "description_en", label: "الوصف (انكليزي)", type: "textarea" },
            { name: "goal_amount", label: "المبلغ المطلوب ($)", type: "number" },
            { name: "start_date", label: "تاريخ البدء", type: "date" },
            { name: "end_date", label: "تاريخ الانتهاء", type: "date" },
            { name: "status", label: "الحالة", type: "select", options: [
              { value: "active", label: "فعّالة" },
              { value: "inactive", label: "غير فعّالة" },
              { value: "archived", label: "مؤرشفة" }
            ] }
          ]}
        />

        {/* أزرار الأشخاص */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2, flexWrap: 'wrap' }}>
          <PeopleButton label="المستفيدون" count={activeTable === 'beneficiaries' ? tableRows.length : 0} onClick={() => handleButtonClick('beneficiaries')} active={activeTable === 'beneficiaries'} />
          <PeopleButton label="المتطوعون" count={activeTable === 'volunteers' ? tableRows.length : 0} onClick={() => handleButtonClick('volunteers')} active={activeTable === 'volunteers'} />
          <PeopleButton label="المتبرعون" count={activeTable === 'donators' ? tableRows.length : 0} onClick={() => handleButtonClick('donators')} active={activeTable === 'donators'} />
          <PeopleButton label="إضافة مستفيد" count={0} onClick={() => handleButtonClick('unsortedBeneficiaries')} active={activeTable === 'unsortedBeneficiaries'} sx={{ bgcolor: '#4caf50', color: 'white' }} />
          <PeopleButton label="إضافة متطوع" count={0} onClick={() => handleButtonClick('unsortedVolunteers')} active={activeTable === 'unsortedVolunteers'} sx={{ bgcolor: '#1976d2', color: 'white' }} />
        </Box>

        {/* عرض الجداول */}
        {activeTable && (
          <Box sx={{ mt: 3 }}>
            {tableLoading ? (
              <CircularProgress />
            ) : tableRows.length === 0 ? (
              <Alert severity="info">لا توجد بيانات لعرضها</Alert>
            ) : activeTable === 'donators' ? (
              <InfoBox
                data={tableRows}
                title="المتبرعون"
                showDetailsButton={false}
              />
            ) : (activeTable === 'unsortedBeneficiaries' || activeTable === 'unsortedVolunteers') ? (
              <InfoBoxWithDelete
                data={tableRows}
                title={activeTable === 'unsortedBeneficiaries' ? 'إضافة مستفيدين' : 'إضافة متطوعين'}
                onDelete={handleAddSelectedToCampaign}
              />
            ) : (
              <InfoBoxWithDelete
                data={tableRows}
                title={activeTable === 'beneficiaries' ? 'المستفيدون' : 'المتطوعون'}
                onDelete={handleDeleteItems}
              />
            )}
          </Box>
        )}
      </div>

      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')}>
        <MuiAlert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>{successMsg}</MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Campaign_details;
