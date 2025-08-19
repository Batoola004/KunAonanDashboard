import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import api from '../../api/axios';
import './categoryAdd.scss'

const CategoryAdd = () => {
  const [activeFilter, setActiveFilter] = useState("Campaign"); 
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success" or "error"

  const filterButtons = [
    { text: "Campaign", value: "Campaign", onClick: () => setActiveFilter("Campaign"), color: "primary" },
    { text: "Sponsorship", value: "Sponsorship", onClick: () => setActiveFilter("Sponsorship"), color: "secondary" },
    { text: "HumanCase", value: "HumanCase", onClick: () => setActiveFilter("HumanCase"), color: "success" },
    { text: "InKind", value: "InKind", onClick: () => setActiveFilter("InKind"), color: "warning" }
  ];

  const handleAddCategory = async () => {
    if (!nameAr || !nameEn) {
      setMessageType("error");
      setMessage("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post('/category/add', {
        main_category: activeFilter,
        name_category_ar: nameAr,
        name_category_en: nameEn
      });

      if (response.data && response.data.data) {
        setMessageType("success");
        setMessage("تمت إضافة الفئة بنجاح!");
        setNameAr("");
        setNameEn("");
      } else {
        setMessageType("error");
        setMessage("حدث خطأ أثناء الإضافة.");
      }
    } catch (error) {
      console.error("خطأ أثناء الإضافة:", error);
      setMessageType("error");
      setMessage("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='categoryAdd'>
      <Sidebar/>
      <div className='categoryAddContainer'>
        <Navbar/>

        <Filter 
          buttons={filterButtons} 
          activeFilter={activeFilter} 
          spacing={2} 
          justify="flex-start"
        />

        <div className="addCategoryForm">
          <h2>إضافة فئة جديدة</h2>

          <label>الاسم بالعربية:</label>
          <input 
            type="text" 
            value={nameAr} 
            onChange={(e) => setNameAr(e.target.value)} 
            placeholder="أدخل الاسم بالعربية"
          />

          <label>الاسم بالإنجليزية:</label>
          <input 
            type="text" 
            value={nameEn} 
            onChange={(e) => setNameEn(e.target.value)} 
            placeholder="Enter name in English"
          />

          <button onClick={handleAddCategory} disabled={loading}>
            {loading ? "جارٍ الإضافة..." : "إضافة الفئة"}
          </button>

          {message && (
            <p className={`message ${messageType === "success" ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryAdd;
