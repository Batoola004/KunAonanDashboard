import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import InfoBox from '../../components/infoBox/InfoBox';
import api from '../../api/axios';
import { CircularProgress, Box } from '@mui/material';
import './Volunteer_request.scss';

const VolunteerRequest = () => {
  const [activeFilter, setActiveFilter] = useState('pending'); 
  const [volunteersData, setVolunteersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();

  const filterButtons = [
    { text: "قيد الانتظار", value: "pending", api: '/volunteer_request/getFilterByStatus?status=pending', color: "primary" },
    { text: "مقبول", value: "accepted", api: '/volunteer_request/getFilterByStatus?status=accepted', color: "success" },
    { text: "مرفوض", value: "rejected", api: '/volunteer_request/getFilterByStatus?status=rejected', color: "danger" },
    { text: "غير مقروء", value: "unread", api: '/volunteer_request/getUnreadRequests', color: "warning" },
  ];

  const fetchVolunteers = async (filterValue) => {
    setLoading(true);
    try {
      const active = filterButtons.find(f => f.value === filterValue);
      if (!active) return;
      const response = await api.get(active.api);
      setVolunteersData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers(activeFilter);
  }, [activeFilter]);

  const handleUpdateStatus = async (id, status) => {
    let reason = '';
    if(status === 'rejected') {
      reason = prompt("ادخل سبب الرفض:");
      if(!reason) return;
    }

    setActionLoadingId(id);
    try {
      await api.put(`/volunteer_request/updateStatus/${id}`, {
        status,
        reason_of_rejection: reason
      });
      
      setVolunteersData(prev => prev.map(v => v.id === id ? {...v, status, reason_of_rejection: reason} : v));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ فشل تحديث الحالة');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="volunteer_request">
      <Sidebar />
      <div className="volunteer_requestContainer">
        <Navbar />
        <Filter 
          buttons={filterButtons.map(f => ({
            text: f.text,
            value: f.value,
            color: f.color,
            onClick: () => setActiveFilter(f.value)
          }))} 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <InfoBox 
  data={volunteersData} 
  title={`طلبات المتطوعين ${filterButtons.find(f => f.value === activeFilter)?.text || ''}`}
  detailsButtonText={activeFilter === "accepted" || activeFilter === "rejected" ? null : "عرض التفاصيل"}
  idField="id"
  onDetailsClick={(row) => {
    if (activeFilter !== "accepted" && activeFilter !== "rejected") {
      navigate(`/volunteer-request/${row.id}`);
    }
  }}
  actionButtons={(row) => (
    <div className="action-buttons">
      {row.status !== 'accepted' && (
        <button disabled={actionLoadingId === row.id} onClick={() => handleUpdateStatus(row.id, 'accepted')}>
          {actionLoadingId === row.id ? <CircularProgress size={20} /> : 'قبول'}
        </button>
      )}
      {row.status !== 'rejected' && (
        <button disabled={actionLoadingId === row.id} onClick={() => handleUpdateStatus(row.id, 'rejected')}>
          {actionLoadingId === row.id ? <CircularProgress size={20} /> : 'رفض'}
        </button>
      )}
    </div>
  )}
/>

        )}
      </div>
    </div>
  );
};

export default VolunteerRequest;
