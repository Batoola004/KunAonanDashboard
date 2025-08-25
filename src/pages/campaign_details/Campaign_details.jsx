import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import EditDataBox from '../../components/editableDataBox/EditDataBox';
import PeopleButton from '../../components/peopleButton/PeopleButton';
import InfoBox from '../../components/infoBoxWithDelete/InfoBoxWithDelete';
import { Box, CircularProgress, Alert, Snackbar, Alert as MuiAlert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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
  const [selectedItems, setSelectedItems] = useState([]);

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
          image: apiData.image ? `http://localhost:8000/storage/${apiData.image}` : 'https://via.placeholder.com/300',
          progress: Math.round((parseFloat(apiData.collected_amount) / parseFloat(apiData.goal_amount)) * 100),
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

  useEffect(() => { fetchCampaignDetails(); }, [id]);

  const handleButtonClick = async (type) => {
    if (type === activeTable) {
      setActiveTable(null);
      return;
    }
    setActiveTable(type);
    setTableLoading(true);
    setTableRows([]);
    setTableTitle('');
    setSelectedItems([]);

    try {
      let response;
      let data = [];

      if (type === 'beneficiaries') response = await api.get(`/campaigns/${id}/getBeneficiaries`);
      else if (type === 'volunteers') response = await api.get(`/campaigns/${id}/getVolunteers`);
      else if (type === 'donators') response = await api.get(`/campaigns/${id}/donors`);
      else if (type === 'unsortedBeneficiaries') response = await api.get(`/beneficiaries/unsorted`);
      else if (type === 'unsortedVolunteers') response = await api.get(`/volunteers/getToSort`);

      data = response.data?.data || response.data?.donors || response.data || [];
      setTableRows(data);

      const titleMap = {
        beneficiaries: 'المستفيدون',
        volunteers: 'المتطوعون',
        donators: 'المتبرعون',
        unsortedBeneficiaries: 'إضافة مستفيدين',
        unsortedVolunteers: 'إضافة متطوعين',
      };
      setTableTitle(titleMap[type]);
    } catch (err) {
      console.error('Error fetching table data:', err);
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleAddSelectedToCampaign = async () => {
    try {
      if (activeTable === 'unsortedBeneficiaries') {
        await api.post(`/campaigns/${id}/addBeneficiaries`, { beneficiary_ids: selectedItems });
      } else if (activeTable === 'unsortedVolunteers') {
        await api.post(`/campaigns/${id}/addVolunteers`, { volunteer_ids: selectedItems });
      }
      handleButtonClick(activeTable === 'unsortedBeneficiaries' ? 'beneficiaries' : 'volunteers');
      setSuccessMsg('تم الإضافة بنجاح ✅');
      setSelectedItems([]);
    } catch (err) {
      console.error('Error adding items:', err);
      setError('فشل الإضافة ❌');
    }
  };

  const handleDeleteItems = async (items) => {
    try {
      if (!items || items.length === 0) return;
      const ids = items.map(i => i.id);

      if (activeTable === 'beneficiaries') {
        await api.post(`/campaigns/${id}/deleteBeneficiaries`, { beneficiary_ids: ids });
        handleButtonClick('beneficiaries');
      } else if (activeTable === 'volunteers') {
        await api.post(`/campaigns/${id}/deleteVolunteers`, { volunteer_ids: ids });
        handleButtonClick('volunteers');
      }

      setSuccessMsg('تم الحذف بنجاح ✅');
    } catch (err) {
      console.error('Error deleting items:', err);
      setError('فشل الحذف ❌');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!campaign) return <Box sx={{ p: 3 }}><Alert severity="warning">لم يتم العثور على الحملة</Alert></Box>;

  const fields = tableRows[0] ? Object.keys(tableRows[0]).filter(key => key !== 'beneficiary_id' && key !== 'volunteer_id') : [];
  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    ...fields.map(f => ({ field: f, headerName: f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), flex: 1 })),
  ];

  const rows = tableRows.map(r => ({ id: r.beneficiary_id || r.volunteer_id || r.id, ...r }));

  return (
    <div className='campaign_details'>
      <Sidebar />
      <div className="campaign_detailsContainer">
        <Navbar />
        <EditDataBox campaign={campaign} onUpdate={() => {}} disableEdit={campaign?.status === 'archived'} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2, flexWrap: 'wrap' }}>
          <PeopleButton label="المستفيدون" count={activeTable === 'beneficiaries' ? tableRows.length : 0} onClick={() => handleButtonClick('beneficiaries')} active={activeTable === 'beneficiaries'} />
          <PeopleButton label="المتطوعون" count={activeTable === 'volunteers' ? tableRows.length : 0} onClick={() => handleButtonClick('volunteers')} active={activeTable === 'volunteers'} />
          <PeopleButton label="المتبرعون" count={activeTable === 'donators' ? tableRows.length : 0} onClick={() => handleButtonClick('donators')} active={activeTable === 'donators'} />
          <PeopleButton label="إضافة مستفيد" count={0} onClick={() => handleButtonClick('unsortedBeneficiaries')} active={activeTable === 'unsortedBeneficiaries'} sx={{ bgcolor: '#4caf50', color: 'white' }} />
          <PeopleButton label="إضافة متطوع" count={0} onClick={() => handleButtonClick('unsortedVolunteers')} active={activeTable === 'unsortedVolunteers'} sx={{ bgcolor: '#1976d2', color: 'white' }} />
        </Box>

        {activeTable && (
          <Box sx={{ mt: 3, height: 400, width: '100%' }}>
            {tableLoading ? (
              <CircularProgress />
            ) : rows.length === 0 ? (
              <Alert severity="info">لا توجد بيانات لعرضها</Alert>
            ) : (activeTable === 'unsortedBeneficiaries' || activeTable === 'unsortedVolunteers') ? (
              <Box>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  checkboxSelection
                  selectionModel={selectedItems}
                  onSelectionModelChange={(newSelection) => setSelectedItems(newSelection)}
                  sx={{
                    '& .MuiDataGrid-row:nth-of-type(odd)': { bgcolor: '#fafafa' },
                    '& .MuiDataGrid-row:hover': { bgcolor: '#f1f1f1' },
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5', fontWeight: 'bold' },
                  }}
                />
                {selectedItems.length > 0 &&
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <PeopleButton
                      label={`إضافة ${selectedItems.length} ${activeTable === 'unsortedBeneficiaries' ? 'مستفيدين' : 'متطوعين'}`}
                      count={0}
                      onClick={handleAddSelectedToCampaign}
                      active={false}
                      sx={{ bgcolor: '#4caf50', color: 'white' }}
                    />
                  </Box>
                }
              </Box>
            ) : (
              <InfoBox
                data={tableRows}
                title={tableTitle}
                showDetailsButton={true}
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
