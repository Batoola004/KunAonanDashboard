import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CardList from '../../components/cardList/CardList'; 
import './guarnteesShow.scss';

const GuarnteesShow = () => {
  const navigate = useNavigate();

  // بيانات الكفالات
  const sponsorshipsData = [
    {
      id: 1,
      title: "كفالة اليتيم ياسر محمد",
      description: "كفالة شهرية بقيمة 500 دولار لمدة 12 شهر. تم دفع 6 أشهر حتى الآن.",
      imageUrl: "../../../assets/orphan1.jpg",
      buttonText: "عرض التفاصيل",
      onButtonClick: () => navigate('/guarntees/1') 
    },
    {
      id: 2,
      title: "كفالة اليتيمة سارة خالد",
      description: "كفالة شهرية بقيمة 700 دولار لمدة 6 أشهر. تم اكتمال الكفالة بنجاح.",
      imageUrl: "../../../assets/orphan2.jpg",
      buttonText: "عرض التفاصيل",
      onButtonClick: () => navigate('/guarntees/2')
    },
    {
      id: 3,
      title: "كفالة اليتيمة فاطمة عمر",
      description: "كفالة شهرية بقيمة 400 دولار لمدة 24 شهر. تم دفع 20 شهر حتى الآن.",
      imageUrl: "../../../assets/orphan3.jpg",
      buttonText: "عرض التفاصيل",
      onButtonClick: () => navigate('/guarntees/3')
    }
  ];

  return (
    <div className='guarnteesShow'>
      <Sidebar/>
      <div className='guarnteesShowContainer'>
        <Navbar/>
        <div className='cardsContainer'>
          <CardList cardsData={sponsorshipsData} />
        </div>
      </div>
    </div>
  );
};

export default GuarnteesShow;