import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import VolunteerInfoCard from '../../components/infoCard/InfoCard';
import './volunteerRequestDetails.scss';

const VolunteerRequestDetails = () => {
  const { id } = useParams(); 
  const [volunteer, setVolunteer] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReasonAr, setRejectReasonAr] = useState('');
  const [rejectReasonEn, setRejectReasonEn] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      try {
        const response = await api.get(`/volunteer_request/getDetails/${id}`);
        setVolunteer(response.data.data);
      } catch (error) {
        console.error('حدث خطأ عند جلب البيانات:', error);
      }
    };

    fetchVolunteerDetails();
  }, [id]);

  const updateStatus = async (status) => {
    setLoading(true);
    try {
      let payload = { status };

      if (status === 'rejected') {
        payload = {
          status: 'rejected',
          reason_ar: rejectReasonAr,
          reason_en: rejectReasonEn
        };
      }

      await api.post(`/volunteer_request/updateStatus/${id}`, payload);

      if (status === 'accepted') {
        alert('تم قبول الطلب ✅');
      } else if (status === 'rejected') {
        alert('تم رفض الطلب ❌');
      }

      navigate('/volunteer_request');
    } catch (error) {
      console.error('خطأ أثناء تحديث الحالة:', error);
      alert('فشل في تحديث الحالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='volunteerRequestDetails'>
      <Sidebar />
      <div className='volunteerRequestDetailsContainer'>
        <Navbar />
        <VolunteerInfoCard data={volunteer} />

        {/* أزرار القبول والرفض */}
        <div className="actions">
          <button 
            className="acceptBtn" 
            onClick={() => updateStatus('accepted')}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "قبول"}
          </button>

          <button 
            className="rejectBtn" 
            onClick={() => setShowRejectReason(!showRejectReason)}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "رفض"}
          </button>
        </div>

        {/* مربعات إدخال سبب الرفض بالعربية والإنجليزية */}
        {showRejectReason && (
          <div className="rejectReasonContainer">
            <textarea
              placeholder="سبب الرفض بالعربية"
              value={rejectReasonAr}
              onChange={(e) => setRejectReasonAr(e.target.value)}
              disabled={loading}
            />
            <textarea
              placeholder="Reason for rejection in English"
              value={rejectReasonEn}
              onChange={(e) => setRejectReasonEn(e.target.value)}
              disabled={loading}
            />
            <button 
              className="submitRejectBtn"
              onClick={() => updateStatus('rejected')}
              disabled={loading || !rejectReasonAr.trim() || !rejectReasonEn.trim()}
            >
              {loading ? <span className="spinner"></span> : "تأكيد الرفض"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerRequestDetails;
