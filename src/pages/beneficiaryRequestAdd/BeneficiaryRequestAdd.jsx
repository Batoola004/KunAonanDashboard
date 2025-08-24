import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import './beneficiaryRequestAdd.scss';

const BeneficiaryRequestAdd = () => {
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    gender: 'Male',
    birth_date: '',
    marital_status: 'Single',
    num_of_members: '',
    study: '',
    has_job: false,
    job: '',
    housing_type: '',
    has_fixed_income: false,
    fixed_income: '',
    address: '',
    phone: '',
    main_category: '',
    sub_category: '',
    notes: '',
    details: [
      { field_name: 'Current academic level', field_value: '' },
      { field_name: 'University name', field_value: '' },
      { field_name: 'Last certificate', field_value: '' }
    ]
  });

  const [subCategories, setSubCategories] = useState([]); // 🔹 لتخزين الفئات الفرعية

  // دالة تحديث أي input
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue
    }));

    // إذا غيرنا الفئة الرئيسية → جيب الفئات الفرعية
    if (name === 'main_category') {
      try {
        const response = await api.get(`/category/getAll/${value}`);
        setSubCategories(response.data.data); // ✅ حفظ الفئات الفرعية
        setFormData((prev) => ({ ...prev, sub_category: '' })); // إعادة ضبط الفئة الفرعية
      } catch (err) {
        console.error('خطأ في جلب الفئات الفرعية:', err);
        setSubCategories([]);
      }
    }
  };

  const handleDetailsChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // نسخ البيانات
    const dataToSend = { ...formData };

    // تأكيد أن تاريخ الميلاد محفوظ بصيغة yyyy-mm-dd
    if (dataToSend.birth_date) {
      const date = new Date(dataToSend.birth_date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      dataToSend.birth_date = `${yyyy}-${mm}-${dd}`;
    }

    await api.post('/beneficiary_request/add', dataToSend);
    alert('✅ تم إضافة طلب الاستفادة بنجاح');
  } catch (error) {
    console.error('خطأ عند إضافة الطلب:', error);
    alert('❌ فشل في إضافة الطلب');
  }
};


  return (
    <div className="beneficiaryRequestAdd">
      <Sidebar />
      <div className="beneficiaryRequestAddContainer">
        <Navbar />
        <div className="formWrapper">
          <h2>إضافة طلب استفادة</h2>
          <form className="beneficiaryForm" onSubmit={handleSubmit}>
            
            {/* بيانات شخصية */}
            <div className="formGroup">
              <label>الاسم الكامل</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>اسم الأب</label>
              <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>اسم الأم</label>
              <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>الجنس</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">ذكر</option>
                <option value="Female">أنثى</option>
              </select>
            </div>

            <div className="formGroup">
              <label>تاريخ الميلاد</label>
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>الحالة الاجتماعية</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange}>
                <option value="Single">أعزب</option>
                <option value="Married">متزوج</option>
                <option value="Divorced">مطلق</option>
              </select>
            </div>

            <div className="formGroup">
              <label>عدد أفراد الأسرة</label>
              <input type="number" name="num_of_members" value={formData.num_of_members} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>المؤهل الدراسي</label>
              <input type="text" name="study" value={formData.study} onChange={handleChange} />
            </div>

            <div className="formGroup checkbox">
              <label>
                <input type="checkbox" name="has_job" checked={formData.has_job} onChange={handleChange} />
                لديه عمل
              </label>
            </div>

            {formData.has_job && (
              <div className="formGroup">
                <label>العمل</label>
                <input type="text" name="job" value={formData.job} onChange={handleChange} />
              </div>
            )}

            <div className="formGroup">
              <label>نوع السكن</label>
              <input type="text" name="housing_type" value={formData.housing_type} onChange={handleChange} />
            </div>

            <div className="formGroup checkbox">
              <label>
                <input type="checkbox" name="has_fixed_income" checked={formData.has_fixed_income} onChange={handleChange} />
                لديه دخل ثابت
              </label>
            </div>

            {formData.has_fixed_income && (
              <div className="formGroup">
                <label>الدخل الثابت</label>
                <input type="text" name="fixed_income" value={formData.fixed_income} onChange={handleChange} />
              </div>
            )}

            <div className="formGroup">
              <label>العنوان</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>الهاتف</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            {/* 🔹 الفئة الرئيسية */}
            <div className="formGroup">
              <label>الفئة الرئيسية</label>
              <select name="main_category" value={formData.main_category} onChange={handleChange} required>
                <option value="">-- اختر الفئة --</option>
                <option value="Campaign">Campaign</option>
                <option value="Sponsorship">Sponsorship</option>
                <option value="HumanCase">HumanCase</option>
                <option value="InKind">InKind</option>
              </select>
            </div>

            {/* 🔹 الفئة الفرعية (من API) */}
            <div className="formGroup">
              <label>الفئة الفرعية</label>
              <select 
                name="sub_category" 
                value={formData.sub_category} 
                onChange={handleChange} 
                disabled={!subCategories.length}
                required
              >
                <option value="">-- اختر الفئة الفرعية --</option>
                {subCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>ملاحظات</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
            </div>

            {/* تفاصيل إضافية */}
            <h3>تفاصيل إضافية</h3>
            {formData.details.map((detail, index) => (
              <div key={index} className="formGroup">
                <label>{detail.field_name}</label>
                <input
                  type="text"
                  value={detail.field_value}
                  onChange={(e) => handleDetailsChange(index, 'field_value', e.target.value)}
                />
              </div>
            ))}

            <button type="submit" className="submitBtn">إضافة الطلب</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryRequestAdd;
