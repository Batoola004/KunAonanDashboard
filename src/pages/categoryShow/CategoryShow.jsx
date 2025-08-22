import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import api from '../../api/axios';
import './categoryShow.scss';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryShow = () => {
  const [activeFilter, setActiveFilter] = useState("Campaign"); // فلتر افتراضي
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب الفئات حسب النوع
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/category/getAll/${activeFilter}`);
        if (response.data && response.data.data) {
          const dataArray = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
          setCategories(dataArray);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error(error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    if (activeFilter) {
      fetchFiltered();
    }
  }, [activeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكاتيجوري؟")) return;
    try {
      await api.delete(`/category/delete/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error(error);
      alert("فشل حذف الكاتيجوري. حاول مرة أخرى.");
    }
  };

  // أزرار الفلاتر بدون "All"
  const filterButtons = [
    { text: "Campaign", value: "Campaign", onClick: () => setActiveFilter("Campaign"), color: "primary" },
    { text: "Sponsorship", value: "Sponsorship", onClick: () => setActiveFilter("Sponsorship"), color: "secondary" },
    { text: "HumanCase", value: "HumanCase", onClick: () => setActiveFilter("HumanCase"), color: "success" },
    { text: "InKind", value: "InKind", onClick: () => setActiveFilter("InKind"), color: "warning" }
  ];

  return (
    <div className='categoryShow'>
      <Sidebar/>
      <div className='categoryShowContainer'>
        <Navbar/>

        <Filter 
          buttons={filterButtons} 
          activeFilter={activeFilter} 
          spacing={2} 
          justify="flex-start"
        />

        <div className="categoriesContainer">
          <h2 className="pageTitle">
            Categories ({categories.length})
          </h2>

          <div className="cardsGrid">
            <AnimatePresence>
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  className="categoryCard"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  {cat.image && <img src={cat.image} alt={cat.name_category_ar || cat.name} />}
                  <div className="categoryInfo">
                    <h3>
                      {cat.name_category_ar ? cat.name_category_ar : cat.name} 
                      <span className="categoryId"> - [{cat.id}]</span>
                    </h3>
                    {cat.description && <p>{cat.description}</p>}
                    <button className="deleteButton" onClick={() => handleDelete(cat.id)}>حذف</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && categories.length === 0 && <p>لا توجد نتائج لعرضها.</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryShow;
