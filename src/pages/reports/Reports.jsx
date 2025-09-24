import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { FiDownload } from 'react-icons/fi';
import api from '../../api/axios';
import './reports.scss';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب التقارير
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/getAdminReports');
        if (res.data && res.data.data) setReports(res.data.data);
      } catch (err) {
        console.error('خطأ في جلب التقارير:', err);
      }
    };
    fetchReports();
  }, []);

  // جلب الحملات
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns/getAll');
        if (res.data && res.data.data) setCampaigns(res.data.data);
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
        if (res.data && res.data.data) setSponsorships(res.data.data);
      } catch (err) {
        console.error('خطأ في جلب الكفالات:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsorships();
  }, []);

  const getReportName = (report) => {
    if (report.campaign_id) {
      const campaign = campaigns.find(c => c.id === report.campaign_id);
      return campaign ? campaign.title : `حملة (${report.campaign_id})`;
    }
    if (report.sponsorship_id) {
      const sponsorship = sponsorships.find(s => s.id === report.sponsorship_id);
      return sponsorship ? sponsorship.sponsorship_name : `كفالة (${report.sponsorship_id})`;
    }
    return 'غير معروف';
  };

  return (
    <div className='reports'>
      <Sidebar />
      <div className='reportsContainer'>
        <Navbar />
        <div className="reportsContent">
          <h2>التقارير</h2>

          {loading ? (
            <p>جاري تحميل التقارير...</p>
          ) : reports.length === 0 ? (
            <p>لا توجد تقارير حالياً.</p>
          ) : (
            <table className="reportsTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>التقرير</th>
                  <th>التاريخ</th>
                  <th>الملف</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => {
                  const fileName = report.file_url.split('/').pop();
                  return (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>{getReportName(report)}</td>
                      <td>{new Date(report.created_at).toLocaleString()}</td>
                      <td>
                        <a
                          href={`http://localhost:8000/storage/app/public/reports/${fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="downloadLink"
                        >
                          <FiDownload style={{ marginRight: '5px' }} />
                          تنزيل
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
