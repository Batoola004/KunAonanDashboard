import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CardList from '../../components/cardList/CardList'; 
import api from '../../api/axios'; 
import './guarnteesShow.scss';
import Filter from '../../components/filters/Filter';

const GuarnteesShow = () => {
  const navigate = useNavigate();
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all"); 

  // دالة جلب الكفالات
  const fetchSponsorships = async (categoryId) => {
    setLoading(true);
    try {
      let response;

      if (categoryId === "all") {
        response = await api.get('/sponsorship/byCreationDate');
      } else {
        response = await api.get(`/sponsorship/category/${categoryId}`);
      }

      if (response.data && response.data.data) {
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          title: item.sponsorship_name,
          description: item.description || "لا يوجد وصف متاح.",
          imageUrl: item.image.startsWith("http") 
            ? item.image 
            : `http://localhost:8000/${item.image}`, 
          buttonText: "عرض التفاصيل",
          onButtonClick: () => navigate(`/guarntees/${item.id}`),
        }));
        setSponsorships(formattedData);
      } else {
        setSponsorships([]);
      }
    } catch (error) {
      console.error("خطأ أثناء جلب الكفالات:", error);
      setSponsorships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships(activeCategory);
  }, [activeCategory]);

  // أزرار الفلترة
  const filterButtons = [
    {
      text: "الكل",
      value: "all",
      onClick: () => setActiveCategory("all"),
      color: "info"
    },
    {
      text: "كفالات الأيتام",
      value: 10,
      onClick: () => setActiveCategory(10),
      color: "primary"
    },
    {
      text: "كفالات الأسر",
      value: 11,
      onClick: () => setActiveCategory(11),
      color: "secondary"
    },
    {
      text: "كفالات تعليمية",
      value: 12,
      onClick: () => setActiveCategory(12),
      color: "success"
    }
  ];

  return (
    <div className='guarnteesShow'>
      <Sidebar />
      <div className='guarnteesShowContainer'>
        <Navbar />

        <Filter 
          buttons={filterButtons} 
          activeFilter={activeCategory} 
          spacing={2} 
          justify="flex-start"
        />

        <div className='cardsContainer'>
          {loading ? (
            <p>جارٍ تحميل البيانات...</p>
          ) : sponsorships.length > 0 ? (
            <CardList cardsData={sponsorships} />
          ) : (
            <p>لا توجد كفالات متاحة حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuarnteesShow;
