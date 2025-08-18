import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import api from '../../api/axios'; 
import './emails.scss';

const Emails = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/message/getAll'); 
      setMessages(response.data.data); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className='emails'>
      <Sidebar />
      <div className='emailsContainer'>
        <Navbar />
        <div className="emailsContent">
          <h1>الرسائل الواردة</h1>
          <button className="refreshButton" onClick={fetchMessages}>
            {loading ? 'جارٍ التحديث...' : 'تحديث'}
          </button>

          {messages.length === 0 && !loading && <p>لا توجد رسائل حالياً.</p>}

          <div className="messagesList">
            {messages.map((msg, index) => (
              <div key={index} className="messageCard">
                <p><strong>الاسم:</strong> {msg.user_name}</p>
                <p><strong>رقم الهاتف:</strong> {msg.phone}</p>
                <p><strong>الرسالة:</strong> {msg.message}</p>
                <p><strong>التاريخ:</strong> {new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emails;
