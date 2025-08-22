import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import './guarnteesDetails.scss';

const GuarnteesDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [sponsorship, setSponsorship] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلب تفاصيل الكفالة حسب id
  const fetchSponsorshipDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/sponsorship/get/${id}`);
      if (response.data && response.data.data) {
        const data = response.data.data;
        setSponsorship({
          id: data.id,
          title: data.title,
          description: data.description || "لا يوجد وصف متاح.",
          imageUrl: data.image,
          categoryId: data.category_id,
          status: data.status,
          goal_amount: parseFloat(data.goal_amount),
          collected_amount: parseFloat(data.collected_amount),
          creationDate: data.created_at,
          beneficiary: data.beneficiary || null,
        });
      } else {
        setSponsorship(null);
      }
    } catch (error) {
      console.error('خطأ أثناء جلب تفاصيل الكفالة:', error);
      setSponsorship(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorshipDetails();
  }, [id]);

  if (loading) return <p>جارٍ تحميل البيانات...</p>;
  if (!sponsorship) return <p>لا توجد تفاصيل متاحة لهذه الكفالة.</p>;

  const progressPercent = sponsorship.goal_amount > 0 
    ? Math.min((sponsorship.collected_amount / sponsorship.goal_amount) * 100, 100) 
    : 0;

  return (
    <div className="guarnteesDetails">
      <Sidebar />
      <div className="guarnteesDetailsContainer">
        <Navbar />
        <h2>
          SponsorShip Details
        </h2>
        <div className="detailsCard">
          <h2>{sponsorship.title}</h2>

          {sponsorship.imageUrl && (
            <img className="detailsImage" src={sponsorship.imageUrl} alt={sponsorship.title} />
          )}

          <p className="description"><strong>الوصف:</strong> {sponsorship.description}</p>

          <div className="infoGrid">
            <p><strong>الحالة:</strong> {sponsorship.status === "active" ? "نشط" : "غير نشط"}</p>
            <p><strong>التصنيف:</strong> {sponsorship.categoryId}</p>
            {sponsorship.creationDate && (
              <p><strong>تاريخ الإنشاء:</strong> {new Date(sponsorship.creationDate).toLocaleDateString()}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progressContainer">
            <div className="progressLabel">
              <span>تم جمع: {sponsorship.collected_amount} $</span>
              <span>الهدف: {sponsorship.goal_amount} $</span>
            </div>
            <div className="progressBar">
              <div 
                className="progressFill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Beneficiary Info */}
          {sponsorship.beneficiary && (
            <div className="beneficiaryCard">
              <h3>معلومات المستفيد</h3>
              <p><strong>رقم المستفيد:</strong> {sponsorship.beneficiary.id}</p>
              <p><strong>الأولوية:</strong> {sponsorship.beneficiary.priority_ar}</p>
              <p><strong>تاريخ الإضافة:</strong> {new Date(sponsorship.beneficiary.created_at).toLocaleDateString()}</p>
            </div>
          )}

          <button 
            className="backButton" 
            onClick={() => navigate('/guarnteesShow')}
          >
            العودة للكفالات
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuarnteesDetails;
