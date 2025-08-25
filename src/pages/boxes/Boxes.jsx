import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './boxes.scss';

const Boxes = () => {
  return (
    <div className='boxes'>
      <Sidebar />
      <div className='boxesContainer'>
        <Navbar />
        {/* هنا ما في فلترة بعد الآن */}
      </div>
    </div>
  );
};

export default Boxes;
