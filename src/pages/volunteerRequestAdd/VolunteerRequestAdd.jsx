import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import './volunteerRequestAdd.scss';

const VolunteerRequestAdd = () => {
  const navigate = useNavigate();


  const [inputColor] = useState("#fffff9"); 
  const [daysTextColor] = useState("#165e5d"); 

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    birth_date: "",
    address: "",
    study_qualification: "",
    job: "",
    preferred_times: "",
    has_previous_volunteer: false,
    previous_volunteer: "",
    phone: "",
    notes: "",
    days: [],
    types: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "days") {
      setFormData((prev) => ({
        ...prev,
        days: checked
          ? [...prev.days, value]
          : prev.days.filter((d) => d !== value),
      }));
    } else if (type === "checkbox" && name === "types") {
      setFormData((prev) => ({
        ...prev,
        types: checked
          ? [...prev.types, value]
          : prev.types.filter((t) => t !== value),
      }));
    } else if (type === "checkbox" && name === "has_previous_volunteer") {
      setFormData((prev) => ({
        ...prev,
        has_previous_volunteer: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/volunteer_request/add", {
        ...formData,
        status: null,
        reason_of_rejection: null,
      });

      alert("✅ تم إرسال الطلب بنجاح");
      navigate("/volunteer_request");
    } catch (error) {
      console.error("خطأ في إرسال الطلب:", error);
      alert("❌ فشل إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteerRequestAdd">
      <Sidebar />
      <div className="volunteerRequestAddContainer">
        <Navbar />

        <form className="volunteerForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="الاسم الكامل"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{ backgroundColor: inputColor }}
          />
          
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{ backgroundColor: inputColor }}
          >
            <option value="">اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>

          {/* حقل التاريخ مع توضيح الصيغة */}
          <div className="dateField">
            <label>تاريخ الميلاد (yyyy-mm-dd)</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              style={{ backgroundColor: inputColor }}
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="العنوان"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ backgroundColor: inputColor }}
          />

          <input
            type="text"
            name="study_qualification"
            placeholder="المؤهل الدراسي"
            value={formData.study_qualification}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
          />

          <input
            type="text"
            name="job"
            placeholder="الوظيفة"
            value={formData.job}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
          />

          <input
            type="text"
            name="preferred_times"
            placeholder="الأوقات المفضلة"
            value={formData.preferred_times}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
          />

          <label>
            <input
              type="checkbox"
              name="has_previous_volunteer"
              checked={formData.has_previous_volunteer}
              onChange={handleChange}
            />
            هل لديك خبرة تطوع سابقة؟
          </label>

          {formData.has_previous_volunteer && (
            <textarea
              name="previous_volunteer"
              placeholder="اذكر خبراتك السابقة"
              value={formData.previous_volunteer}
              onChange={handleChange}
              style={{ backgroundColor: inputColor }}
            ></textarea>
          )}

          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ backgroundColor: inputColor }}
          />

          <textarea
            name="notes"
            placeholder="ملاحظات إضافية"
            value={formData.notes}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
          ></textarea>

          {/* اختيار الأيام */}
          <div className="daysContainer">
            {["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((day) => (
              <label
                key={day}
                style={{ color: daysTextColor }}
              >
                <input
                  type="checkbox"
                  name="days"
                  value={day}
                  checked={formData.days.includes(day)}
                  onChange={handleChange}
                /> {day}
              </label>
            ))}
          </div>

          {/* اختيار نوع التطوع */}
          <div className="typesContainer">
            <label><input type="checkbox" name="types" value="توعوي" checked={formData.types.includes("توعوي")} onChange={handleChange} /> توعوي</label>
            <label><input type="checkbox" name="types" value="ميداني" checked={formData.types.includes("ميداني")} onChange={handleChange} /> ميداني</label>
            <label><input type="checkbox" name="types" value="تقني" checked={formData.types.includes("تقني")} onChange={handleChange} /> تقني</label>
          </div>

          <button type="submit" disabled={loading} className="submitBtn">
            {loading ? "⏳ جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRequestAdd;
