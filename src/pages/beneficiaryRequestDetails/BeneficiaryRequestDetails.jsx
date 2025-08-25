import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import BeneficiaryInfoCard from '../../components/infoCard2/InfoCard2';
import './beneficiaryRequestDetails.scss';

const BeneficiaryRequestDetails = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReasonAr, setRejectReasonAr] = useState('');
  const [rejectReasonEn, setRejectReasonEn] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeneficiary = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/beneficiary_request/getDetails/${id}`);
        setBeneficiary(response.data.data);
      } catch (error) {
        console.error('خطأ عند جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiary();
  }, [id]);

  const updateStatus = async (status) => {
    if (
      status === 'rejected' &&
      (!rejectReasonAr.trim() || !rejectReasonEn.trim())
    ) {
      alert('الرجاء إدخال سبب الرفض بالعربية والإنجليزية.');
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/beneficiary_request/updateStatus/${id}`, {
        status,
        ...(status === 'rejected' && {
          reason_of_rejection_ar: rejectReasonAr,
          reason_of_rejection_en: rejectReasonEn,
        }),
      });

      alert(status === 'accepted' ? 'تم قبول الطلب ✅' : 'تم رفض الطلب ❌');
      navigate('/beneficiaryRequest');
    } catch (error) {
      console.error('خطأ أثناء تحديث الحالة:', error);
      alert('فشل في تحديث الحالة');
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
          <p>جاري تحميل البيانات...</p>
        ) : (
          beneficiary && <BeneficiaryInfoCard data={beneficiary} />
        )}

        {/* أزرار القبول والرفض */}
        <div
          className="actions"
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          <button
            className="acceptBtn"
            onClick={() => updateStatus('accepted')}
            disabled={actionLoading}
          >
            {actionLoading ? 'جاري التحديث...' : 'قبول'}
          </button>

          <button
            className="rejectBtn"
            onClick={() => setShowRejectReason(!showRejectReason)}
            disabled={actionLoading}
          >
            {actionLoading ? 'جاري التحديث...' : 'رفض'}
          </button>
        </div>

        {/* مربعات إدخال أسباب الرفض */}
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
              style={{ width: '400px', height: '80px', padding: '10px' }}
              disabled={actionLoading}
            />
            <textarea
              placeholder="Enter rejection reason in English"
              value={rejectReasonEn}
              onChange={(e) => setRejectReasonEn(e.target.value)}
              style={{ width: '400px', height: '80px', padding: '10px' }}
              disabled={actionLoading}
            />
            <button
              className="submitRejectBtn"
              onClick={() => updateStatus('rejected')}
              disabled={
                actionLoading ||
                !rejectReasonAr.trim() ||
                !rejectReasonEn.trim()
              }
            >
              {actionLoading ? 'جاري التحديث...' : 'تأكيد الرفض'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryRequestDetails;
