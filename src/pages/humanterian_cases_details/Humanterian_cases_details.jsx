// src/pages/humanterian_cases_details/HumanCaseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import EditCaseBox from '../../components/editableDataBox/EditCaseBox';
import PeopleButton from '../../components/peopleButton/PeopleButton';
import InfoBoxWithDelete from '../../components/infoBoxWithDelete/InfoBoxWithDelete';
import { Box, CircularProgress, Alert, Snackbar, Alert as MuiAlert } from '@mui/material';
import api from '../../api/axios';
import './humanCasesDetails.scss';

const HumanCaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [tableTitle, setTableTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // جلب بيانات الحالة الإنسانية
  const fetchCaseDetails = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const response = await api.get(`/humanCase/get/${id}`);
      const data = response.data?.data;
      if (response.data?.status === 200 && data) {
        setCaseData({
          id: data.id,
          title: data.title,
          description: data.description,
          categoryId: data.category_id,
          goalAmount: data.goal_amount,
          collectedAmount: data.collected_amount,
          remainingAmount: data.remaining_amount,
          statusLabel: data.status_label,
          isEmergency: data.is_emergency === 1,
          image: data.image
            ? `http://localhost:8000/storage/${data.image}`
            : 'https://via.placeholder.com/300',
        });
      } else setError('⚠️ لم يتم العثور على بيانات الحالة');
    } catch (err) {
      console.error(err);
      setError('❌ فشل تحميل تفاصيل الحالة');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCaseDetails(); }, [id]);

  // جلب بيانات الجدول حسب النوع
  const handleButtonClick = async (type) => {
    if (type === activeTable) { setActiveTable(null); return; }
    setActiveTable(type); setTableLoading(true); setTableRows([]); setTableTitle('');

    try {
      let response;
      if (type === 'beneficiaries') response = await api.get(`/humanCase/${id}/getBeneficiaries`);
      else if (type === 'volunteers') response = await api.get(`/humanCase/${id}/getVolunteers`);
      else if (type === 'donators') response = await api.get(`/humanCase/${id}/donors`);
      else if (type === 'unsortedBeneficiaries') response = await api.get(`/beneficiaries/unsorted`);
      else if (type === 'unsortedVolunteers') response = await api.get(`/volunteers/getToSort`);

      const data = response?.data?.data || response?.data?.donors || response?.data || [];
      const rowsWithId = data.map(r => ({ id: r.id, ...r }));
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
      console.error(err); setTableRows([]);
    } finally { setTableLoading(false); }
  };

  // حذف العناصر
  const handleDeleteItems = async (ids) => {
    try {
      if (!ids || ids.length === 0) return;
      if (activeTable === 'beneficiaries') await api.post(`/humanCase/${id}/deleteBeneficiaries`, { beneficiary_ids: ids });
      else if (activeTable === 'volunteers') await api.post(`/humanCase/${id}/deleteVolunteers`, { volunteer_ids: ids });
      else if (activeTable === 'donators') await api.post(`/humanCase/${id}/deleteDonors`, { donor_ids: ids });

      await handleButtonClick(activeTable);
      setSuccessMsg('تم الحذف بنجاح ✅');
    } catch (err) {
      console.error(err);
      setError('فشل الحذف ❌');
    }
  };

  // إضافة العناصر غير المفروزة
  const handleAddSelectedToCase = async (ids) => {
    try {
      if (!ids || ids.length === 0) return;
      if (activeTable === 'unsortedBeneficiaries') await api.post(`/humanCase/${id}/addBeneficiaries`, { beneficiary_ids: ids });
      else if (activeTable === 'unsortedVolunteers') await api.post(`/humanCase/${id}/addVolunteers`, { volunteer_ids: ids });

      await handleButtonClick(activeTable === 'unsortedBeneficiaries' ? 'beneficiaries' : 'volunteers');
      setSuccessMsg('تم الإضافة بنجاح ✅');
    } catch (err) {
      console.error(err);
      setError('فشل الإضافة ❌');
    }
  };

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p:3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!caseData) return <Box sx={{ p:3 }}><Alert severity="warning">لم يتم العثور على الحالة</Alert></Box>;

  return (
    <div className='caseDetailsPage'>
      <Sidebar />
      <div className="caseDetailsContainer">
        <Navbar />

        <EditCaseBox
          caseData={caseData}
          onUpdate={(updated) => setCaseData(updated)}
          disableEdit={caseData.statusLabel === 'مؤرشفة'}
        />

        {/* أزرار الجداول */}
        <Box sx={{ display:'flex', justifyContent:'space-between', mt:4, gap:2, flexWrap:'wrap' }}>
          <PeopleButton label="المستفيدون" count={activeTable==='beneficiaries'?tableRows.length:0} onClick={()=>handleButtonClick('beneficiaries')} active={activeTable==='beneficiaries'} />
          <PeopleButton label="المتطوعون" count={activeTable==='volunteers'?tableRows.length:0} onClick={()=>handleButtonClick('volunteers')} active={activeTable==='volunteers'} />
          <PeopleButton label="المتبرعون" count={activeTable==='donators'?tableRows.length:0} onClick={()=>handleButtonClick('donators')} active={activeTable==='donators'} />
          <PeopleButton label="إضافة مستفيد" count={0} onClick={()=>handleButtonClick('unsortedBeneficiaries')} active={activeTable==='unsortedBeneficiaries'} sx={{ bgcolor:'#4caf50', color:'white' }} />
          <PeopleButton label="إضافة متطوع" count={0} onClick={()=>handleButtonClick('unsortedVolunteers')} active={activeTable==='unsortedVolunteers'} sx={{ bgcolor:'#1976d2', color:'white' }} />
        </Box>

        {/* عرض الجدول */}
        {activeTable && (
          <Box sx={{ mt:3 }}>
            {tableLoading ? <CircularProgress /> :
              tableRows.length === 0 ? <Alert severity="info">لا توجد بيانات لعرضها</Alert> :
              (activeTable==='unsortedBeneficiaries' || activeTable==='unsortedVolunteers') ?
              <InfoBoxWithDelete data={tableRows} title={tableTitle} onDelete={handleAddSelectedToCase} /> :
              <InfoBoxWithDelete data={tableRows} title={tableTitle} onDelete={handleDeleteItems} />
            }
          </Box>
        )}
      </div>

      {/* Snackbar */}
      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={()=>setSuccessMsg('')}>
        <MuiAlert onClose={()=>setSuccessMsg('')} severity="success" sx={{ width:'100%' }}>{successMsg}</MuiAlert>
      </Snackbar>
    </div>
  );
};

export default HumanCaseDetails;
