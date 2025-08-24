import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import InfoBox from '../../components/infoBox/InfoBox';
import api from '../../api/axios';
import './beneficiaryRequest.scss';

const BeneficiaryRequest = () => {
  const [activeFilter, setActiveFilter] = useState('pending'); 
  const [beneficiariesData, setBeneficiariesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterCounts, setFilterCounts] = useState({});
  const navigate = useNavigate();

  const filterButtons = [
    { text: "قيد الانتظار", value: "pending", apiEndpoint: '/beneficiary_request/getFilterByStatus', apiParams: { status: 'pending' }, color: "primary", hoverColor: "#e3f2fd", activeTextColor: "#ffffff" },
    { text: "مقبول", value: "accepted", apiEndpoint: '/beneficiary_request/getFilterByStatus', apiParams: { status: 'accepted' }, color: "success", hoverColor: "#e8f5e9", activeTextColor: "#ffffff" },
    { text: "مرفوض", value: "rejected", apiEndpoint: '/beneficiary_request/getFilterByStatus', apiParams: { status: 'rejected' }, color: "danger", hoverColor: "#ffebee", activeTextColor: "#ffffff" },
    { text: "غير مقروء", value: "unread", apiEndpoint: '/beneficiary_request/getUnreadRequests', apiParams: {}, color: "warning", hoverColor: "#fff3e0", activeTextColor: "#ffffff" },
  ];

  const fetchBeneficiaries = async (filterValue) => {
    setLoading(true);
    try {
      const active = filterButtons.find(f => f.value === filterValue);
      if (!active) return;

      const response = await api.get(active.apiEndpoint, { params: active.apiParams });
      setBeneficiariesData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterCounts = async () => {
    try {
      const promises = filterButtons.map(f => 
        api.get(f.apiEndpoint, { params: f.apiParams })
          .then(res => ({ [f.value]: res.data.data.length || 0 }))
          .catch(() => ({ [f.value]: 0 }))
      );
      const results = await Promise.all(promises);
      const counts = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setFilterCounts(counts);
    } catch (error) {
      console.error('Error fetching filter counts:', error);
    }
  };

  useEffect(() => {
    fetchBeneficiaries(activeFilter);
    fetchFilterCounts();
  }, [activeFilter]);

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      let reason = null;
      if (status === 'rejected') {
        reason = prompt("ادخل سبب الرفض:");
        if (reason === null) {
          setActionLoading(false);
          return;
        }
      }

      await api.put(`/beneficiary_request/updateStatus/${id}`, {
        status,
        reason_of_rejection: reason
      });

      setBeneficiariesData(prev => prev.map(v => v.id === id ? { ...v, status, reason_of_rejection: reason } : v));
      fetchFilterCounts();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="beneficiaryRequest">
      <Sidebar />
      <div className="beneficiaryRequestContainer">
        <Navbar />

        <Filter 
          buttons={filterButtons.map(f => ({
            text: `${f.text} (${filterCounts[f.value] || 0})`,
            value: f.value,
            color: f.color,
            hoverColor: f.hoverColor,
            activeTextColor: f.activeTextColor,
            onClick: () => setActiveFilter(f.value)
          }))} 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <InfoBox 
            data={beneficiariesData} 
            title={`طلبات الاستفادة ${filterButtons.find(f => f.value === activeFilter)?.text || ''}`}
            detailsButtonText="عرض التفاصيل"
            onDetailsClick={(row) => navigate(`/beneficiaryRequestDetails/${row.id}`)} // التعديل هنا
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

export default BeneficiaryRequest;
