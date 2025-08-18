import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import './guarnteesArchive.scss'
const GuarnteesArchive = () => {
  return (
    <div className='guarnteesArchive'>
        <Sidebar/>
        <div className='guarnteesArchiveContainer'>
          <Navbar />
          <Filter/>
        </div>
    </div>
  )
}

export default GuarnteesArchive