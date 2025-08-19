import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './reportsAdd.scss'
const ReportsAdd = () => {
  return (
    <div className='reportsAdd'>
        <Sidebar/>
        <div className='reportsAddContainer'>
            <Navbar/>

        </div>
     
    </div>
  )
}

export default ReportsAdd