import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './beneficiaryDetails.scss'

const BeneficiaryDetails = () => {
  return (
    <div className='beneficiaryDetails'>
        <Sidebar/>
        <div className='beneficiaryDetailsContainer'>
            <Navbar/>

        </div>
        
        
    </div>
  )
}

export default BeneficiaryDetails