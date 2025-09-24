import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Filter from "../../components/filters/Filter";
import InputBox from "../../components/inputBox/InputBox";
import Box from "@mui/material/Box";
import SendBottun from "../../components/sendBottun/SendBottun";
import ImageUploadBox from "../../components/imageBox/ImageUploadBox";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "../../api/axios";
import "./humanterian_cases_request.scss";

const AddHumanCase = () => {
  const navigate = useNavigate();
  const token = "ضع_التوكن_هنا"; // ✅ ضع التوكن الصحيح

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [caseImage, setCaseImage] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isEmergency, setIsEmergency] = useState(false); // ✅ حالة الطارئة

  // 🟢 جلب المستفيدين غير المفروزين
  const fetchBeneficiaries = async () => {
    try {
      const res = await axios.get("/beneficiaries/unsorted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBeneficiaries(res.data || []);
    } catch (err) {
      console.error("Error fetching beneficiaries:", err);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const getCategoryId = (filter) => {
    switch (filter) {
      case "patients": return 4; 
      case "students": return 5; 
      case "families": return 6; 
      case "emergency": return 0; 
      default: return "";
    }
  };

  const filterButtons = [
    { text: "مرضى", value: "patients", onClick: () => setActiveFilter("patients") },
    { text: "طالب علم", value: "students", onClick: () => setActiveFilter("students") },
    { text: "أسر متعففة", value: "families", onClick: () => setActiveFilter("families") },
    { text: "طارئة", value: "emergency", onClick: () => setActiveFilter("emergency") },
  ];

  const handleImageUpload = (imageData) => setCaseImage(imageData);

  const handleSubmit = async () => {
    if (!titleAr || !titleEn || !descAr || !descEn || !beneficiaryId || !activeFilter || !goalAmount) {
      alert("❌ يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const formData = new FormData();
    formData.append("beneficiary_id", beneficiaryId);
    formData.append("case_name_ar", titleAr);
    formData.append("case_name_en", titleEn);
    formData.append("description_ar", descAr);
    formData.append("description_en", descEn);
    formData.append("category_id", getCategoryId(activeFilter));
    formData.append("goal_amount", goalAmount);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("is_emergency", isEmergency ? 1 : 0); // ✅ إرسال حالة الطارئة
    if (caseImage) formData.append("image", caseImage);

    try {
      const res = await axios.post("/humanCase/add", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "✅ تمت إضافة الحالة الإنسانية بنجاح");
      navigate("/HumanCases");
    } catch (err) {
      console.error("❌ خطأ في الإرسال:", err);
      alert(err.response?.data?.message || "فشل العملية");
    }
  };

  return (
    <div className="caseAdd">
      <Sidebar />
      <div className="caseAddContainer">
        <Navbar />

        <Filter
          buttons={filterButtons}
          activeFilter={activeFilter}
          spacing={2}
          buttonProps={{ sx: { minWidth: "120px", fontSize: "0.875rem" } }}
        />

        <InputBox width="500px" label="اسم الحالة بالعربية" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        <InputBox width="500px" label="Case name (English)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        <InputBox width="500px" label="وصف الحالة بالعربية" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
        <InputBox width="500px" label="Case description (English)" value={descEn} onChange={(e) => setDescEn(e.target.value)} />

        <InputBox width="300px" label="المبلغ المطلوب" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />

        {/* حالة الطارئة */}
        <FormControlLabel
          control={<Checkbox checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />}
          label="طارئة"
        />

        <div className="beneficiarySelect">
          <label>المستفيد</label>
          <select value={beneficiaryId} onChange={(e) => setBeneficiaryId(e.target.value)}>
            <option value="">اختر مستفيد</option>
            {beneficiaries.map((b) => (
              <option key={b.beneficiary_id} value={b.beneficiary_id}>
                {b.name} ({b.sub_category})
              </option>
            ))}
          </select>
        </div>

        <div className="dateField">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="dateField">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <ImageUploadBox width="100%" height="300px" label="اسحب وأسقط صورة الحالة هنا" uploadLabel="اختر صورة للحالة" onImageSelected={handleImageUpload} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "4px", mt: 2 }}>
          <SendBottun onClick={handleSubmit} />
        </Box>
      </div>
    </div>
  );
};

export default AddHumanCase;
