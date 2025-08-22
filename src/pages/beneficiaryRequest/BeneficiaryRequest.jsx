import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Filter from '../../components/filters/Filter';
import './beneficiaryRequest.scss'

const BeneficiaryRequest = () => {
  return (
    <div className='beneficiaryRequest'>
      <Sidebar/>
      <div className='beneficiaryRequestContainer'>
        <Navbar/>
        <Filter/>

      </div>
        
    </div>
  )
}

export default BeneficiaryRequest