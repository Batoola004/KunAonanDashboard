import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './reports.scss'
const Reports = () => {
  return (
    <div className='reports'>
        <Sidebar/>
        <div className='reportsContainer'>
            <Navbar/>

        </div>
     
    </div>
  )
}

export default Reports