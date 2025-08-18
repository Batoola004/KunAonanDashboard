import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import InfoBox from '../../components/infoBox/InfoBox';
import api from '../../api/axios';
import './Volunteer_request.scss';

const VolunteerRequest = () => {
  const [activeFilter, setActiveFilter] = useState('pending'); 
  const [volunteersData, setVolunteersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Loading لتحديث الحالة
  const navigate = useNavigate();

  const filterButtons = [
    { text: "قيد الانتظار", value: "pending", api: 'http://127.0.0.1:8000/api/volunteer_request/getFilterByStatus?status=pending', color: "primary", hoverColor: "#e3f2fd", activeTextColor: "#ffffff", onClick: () => setActiveFilter('pending') },
    { text: "مقبول", value: "accepted", api: 'http://127.0.0.1:8000/api/volunteer_request/getFilterByStatus?status=accepted', color: "success", hoverColor: "#e8f5e9", activeTextColor: "#ffffff", onClick: () => setActiveFilter('accepted') },
    { text: "مرفوض", value: "rejected", api: 'http://127.0.0.1:8000/api/volunteer_request/getFilterByStatus?status=rejected', color: "danger", hoverColor: "#ffebee", activeTextColor: "#ffffff", onClick: () => setActiveFilter('rejected') },
    { text: "غير مقروء", value: "unread", api: 'http://127.0.0.1:8000/api/volunteer_request/getUnreadRequests', color: "warning", hoverColor: "#fff3e0", activeTextColor: "#ffffff", onClick: () => setActiveFilter('unread') },
  ];

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      try {
        const active = filterButtons.find(f => f.value === activeFilter);
        if (!active) return;
        const response = await api.get(active.api);
        setVolunteersData(response.data.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, [activeFilter]);

  // دالة تحديث الحالة
  const handleUpdateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      let reason = null;
      if(status === 'rejected') {
        reason = prompt("ادخل سبب الرفض:");
        if(reason === null) {
          setActionLoading(false);
          return; // إذا ضغط المستخدم إلغاء
        }
      }
      await api.put(`http://127.0.0.1:8000/api/volunteer_request/updateStatus/${id}`, {
        status,
        reason_of_rejection: reason
      });
      // تحديث البيانات مباشرة في الصفحة
      setVolunteersData(prev => prev.map(v => v.id === id ? {...v, status, reason_of_rejection: reason} : v));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
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
            hoverColor: f.hoverColor,
            activeTextColor: f.activeTextColor,
            onClick: f.onClick
          }))} 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <InfoBox 
            data={volunteersData} 
            title={`طلبات المتطوعين ${filterButtons.find(f => f.value === activeFilter)?.text || ''}`}
            detailsButtonText="عرض التفاصيل"
            onDetailsClick={(row) => navigate(`/volunteer-request/${row.id}`)}
            actionButtons={(row) => (
              <div className="action-buttons">
                {row.status !== 'accepted' && (
                  <button disabled={actionLoading} onClick={() => handleUpdateStatus(row.id, 'accepted')}>قبول</button>
                )}
                {row.status !== 'rejected' && (
                  <button disabled={actionLoading} onClick={() => handleUpdateStatus(row.id, 'rejected')}>رفض</button>
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
