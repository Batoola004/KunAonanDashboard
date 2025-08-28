import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import BeneficiaryInfoCard from '../../components/infoCard2/InfoCard2';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';
import './beneficiaryRequestDetails.scss';

const BeneficiaryRequestDetails = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [rejectReasonAr, setRejectReasonAr] = useState('');
  const [rejectReasonEn, setRejectReasonEn] = useState('');
  const [priorityAr, setPriorityAr] = useState('');
  const [priorityEn, setPriorityEn] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // جلب بيانات المستفيد
  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/beneficiary_request/getDetails/${id}`);
        setBeneficiary(response.data.data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('❌ فشل جلب بيانات المستفيد: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaryDetails();
  }, [id]);

  // ماب الأولوية عربي -> إنكليزي (lowercase)
  const priorityMap = {
    'عالية': 'high',
    'متوسطة': 'medium',
    'منخفضة': 'low',
  };

  useEffect(() => {
    if (priorityAr) {
      setPriorityEn(priorityMap[priorityAr] || '');
    } else {
      setPriorityEn('');
    }
  }, [priorityAr]);

  // تحديث الحالة (قبول / رفض)
  const updateStatus = async (status) => {
    setError('');

    if (status === 'rejected' && (!rejectReasonAr.trim() || !rejectReasonEn.trim())) {
      setError('❌ الرجاء إدخال سبب الرفض بالعربية والإنجليزية.');
      return;
    }

    if (status === 'accepted' && (!priorityAr.trim() || !priorityEn.trim())) {
      setError('❌ الرجاء اختيار أولوية.');
      return;
    }

    const payload = { status };
    if (status === 'rejected') {
      payload.reason_of_rejection_ar = rejectReasonAr;
      payload.reason_of_rejection_en = rejectReasonEn;
    }
    if (status === 'accepted') {
      payload.priority_ar = priorityAr;
      payload.priority_en = priorityEn;
    }

    setActionLoading(true);
    try {
      await api.post(`/beneficiary_request/updateStatus/${id}`, payload);
      alert(status === 'accepted' ? '✅ تم قبول الطلب' : '❌ تم رفض الطلب');
      navigate('/beneficiaryRequest');
    } catch (err) {
      console.error('Update Error:', err.response || err);
      setError('❌ فشل تحديث الحالة: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="beneficiaryRequestDetails">
      <Sidebar />
      <div className="beneficiaryRequestDetailsContainer">
        <Navbar />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : beneficiary ? (
          <BeneficiaryInfoCard data={beneficiary} />
        ) : (
          <Alert severity="warning">لم يتم العثور على بيانات المستفيد</Alert>
        )}

        {/* أزرار القبول والرفض */}
        <div
          className="actions"
          style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}
        >
          <button
            className="acceptBtn"
            onClick={() => {
              setShowPriority(prev => !prev);
              setShowRejectReason(false);
            }}
            disabled={actionLoading || loading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'قبول'}
          </button>

          <button
            className="rejectBtn"
            onClick={() => {
              setShowRejectReason(prev => !prev);
              setShowPriority(false);
            }}
            disabled={actionLoading || loading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'رفض'}
          </button>
        </div>

        {/* عند القبول: اختيار الأولوية */}
        {showPriority && (
          <div
            className="priorityContainer"
            style={{
              marginTop: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              background: '#f9f9f9',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              width: '350px',
              margin: '0 auto',
            }}
          >
            <select
              value={priorityAr}
              onChange={(e) => setPriorityAr(e.target.value)}
              disabled={actionLoading || loading}
              className="prioritySelect"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '100%',
                fontSize: '14px',
              }}
            >
              <option value="">اختر الأولوية (عربي)</option>
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>

            <input
              type="text"
              value={priorityEn}
              readOnly
              disabled
              className="priorityInput"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '100%',
                fontSize: '14px',
                background: '#eee',
                textAlign: 'center',
              }}
            />

            <button
              className="submitAcceptBtn"
              onClick={() => updateStatus('accepted')}
              disabled={actionLoading || loading || !priorityAr.trim()}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: '0.3s',
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'تأكيد القبول'}
            </button>
          </div>
        )}

        {/* عند الرفض: إدخال السبب */}
        {showRejectReason && (
          <div
            className="rejectReasonContainer"
            style={{
              marginTop: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <textarea
              placeholder="أدخل سبب الرفض بالعربية"
              value={rejectReasonAr}
              onChange={(e) => setRejectReasonAr(e.target.value)}
              disabled={actionLoading || loading}
            />
            <textarea
              placeholder="Enter rejection reason in English"
              value={rejectReasonEn}
              onChange={(e) => setRejectReasonEn(e.target.value)}
              disabled={actionLoading || loading}
            />
            <button
              className="submitRejectBtn"
              onClick={() => updateStatus('rejected')}
              disabled={actionLoading || loading || !rejectReasonAr.trim() || !rejectReasonEn.trim()}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'تأكيد الرفض'}
            </button>
          </div>
        )}

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryRequestDetails;
