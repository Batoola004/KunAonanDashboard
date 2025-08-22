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
  const [categories, setCategories] = useState([]);

  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/category/getAll/Sponsorship');
      if (response.data && response.data.data) {
        const dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        setCategories(dataArray);
      }
    } catch (error) {
      console.error("خطأ أثناء جلب الفئات:", error);
    }
  };

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
          imageUrl: item.image?.startsWith("http") 
            ? item.image 
            : `http://localhost:8000/${item.image}`,
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSponsorships(activeCategory);
  }, [activeCategory]);

  const filterButtons = [
    {
      text: "الكل",
      value: "all",
      onClick: () => setActiveCategory("all"),
      color: "info"
    },
    ...categories.map(cat => ({
      text: cat.name_category_ar || cat.name,
      value: cat.id,
      onClick: () => setActiveCategory(cat.id),
      color: "primary"
    }))
  ];

  const handleCardClick = (id) => {
    navigate(`/guarnteesDetails/${id}`);
  };

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
            <CardList 
              cardsData={sponsorships} 
              onCardClick={handleCardClick} 
              setCardsData={setSponsorships}
            />
          ) : (
            <p>لا توجد كفالات متاحة حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuarnteesShow;
