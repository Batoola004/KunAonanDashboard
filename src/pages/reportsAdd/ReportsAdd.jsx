import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios';
import './reportsAdd.scss';

const ReportsAdd = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedSponsorship, setSelectedSponsorship] = useState('');

  // جلب الحملات
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns/getAll');
        if (res.data && res.data.data) {
          setCampaigns(res.data.data);
        }
      } catch (err) {
        console.error('خطأ في جلب الحملات:', err);
      }
    };
    fetchCampaigns();
  }, []);

  // جلب الكفالات
  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const res = await api.get('/sponsorship/byCreationDate');
        if (res.data && res.data.data) {
          setSponsorships(res.data.data);
        }
      } catch (err) {
        console.error('خطأ في جلب الكفالات:', err);
      }
    };
    fetchSponsorships();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || '');
  };

  const handleUpload = async () => {
    if (!file || (!selectedCampaign && !selectedSponsorship)) {
      alert('يرجى اختيار الحملة أو الكفالة ورفع الملف أولاً');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (selectedCampaign) formData.append('campaign_id', selectedCampaign);
    if (selectedSponsorship) formData.append('sponsorship_id', selectedSponsorship);

    try {
      await api.post('/reports/addReport', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('تم رفع التقرير بنجاح!');
      setFile(null);
      setFileName('');
      setSelectedCampaign('');
      setSelectedSponsorship('');
      setSearchTerm('');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع التقرير');
    }
  };

  // فلترة الحملات والكفالات
  const filteredCampaigns = campaigns.filter(
    (c) => c.title?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const filteredSponsorships = sponsorships.filter(
    (s) => s.sponsorship_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  return (
    <div className="reportsAdd">
      <Sidebar />
      <div className="reportsAddContainer">
        <Navbar />

        <div className="uploadCard">
          <h2>رفع تقرير PDF</h2>

          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {fileName && <div className="fileName">ملف مختار: {fileName}</div>}

          <input
            type="text"
            placeholder="ابحث عن الحملة أو الكفالة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />

          <select
            className="campaignSelect"
            value={selectedCampaign}
            onChange={(e) => {
              setSelectedCampaign(e.target.value);
              setSelectedSponsorship('');
            }}
          >
            <option value="">اختر الحملة (أو اترك فارغ لاختيار كفالة)</option>
            {filteredCampaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            className="campaignSelect"
            value={selectedSponsorship}
            onChange={(e) => {
              setSelectedSponsorship(e.target.value);
              setSelectedCampaign('');
            }}
          >
            <option value="">اختر الكفالة (أو اترك فارغ لاختيار حملة)</option>
            {filteredSponsorships.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sponsorship_name}
              </option>
            ))}
          </select>

          <button className="uploadBtn" onClick={handleUpload}>
            رفع التقرير
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsAdd;
