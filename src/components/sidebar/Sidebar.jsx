import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  AddBox as AddBoxIcon,
  Settings as SettingsIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  DateRange as DateRangeIcon,
  Accessible as AccessibleIcon,
  Archive as ArchiveIcon,
  Diversity1 as Diversity1Icon,
  Inventory as InventoryIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Person as PersonIcon,
  AddModerator as AddModeratorIcon,
  PermIdentity as PermIdentityIcon,
  Wallet as WalletIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
   Apps as AppsIcon  
} from '@mui/icons-material';
import './sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    campaigns: false,
    donationTypesShow: false,
    donationTypes: false,
    guarantees: false,
    volunteers: false,
    beneficiaries: false,
    funds: false,
    users: false,
    recharge: false,
    messages: false,
    reports: false
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className='sidebar'>
      <div className='top'>
        <div className="logo">Kun Aonan</div>
      </div>
      <hr/>
      <div className='bottom'>
        <ul>
          {/* MAIN SECTION */}
          <p className="title">MAIN</p>
          <li onClick={() => handleNavigation('/home')}>
            <DashboardIcon className='icon'/>
            <span>DashBoard</span>
          </li>

          {/* CAMPAIGNS SECTION */}
          <div className="section-header" onClick={() => toggleSection('campaigns')}>
            <div className="title-wrapper">
              <p className="title">CAMPAIGNS</p>
              {expandedSections.campaigns ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.campaigns && (
            <>
              <li onClick={() => handleNavigation('/campaign')}>
                <MenuIcon className='icon'/>
                <span>Show Campaigns</span>
              </li>
              <li onClick={() => handleNavigation('/campaign_add')}>
                <AddBoxIcon className='icon'/>
                <span>Add Campaign</span>
              </li>
              <li onClick={() => handleNavigation('/campaign_archive')}>
                <ArchiveIcon className='icon'/>
                <span>Archive</span>
              </li>
            </>
          )}

          {/* DONATION TYPES SHOW */}
          <div className="section-header" onClick={() => toggleSection('human')}>
            <div className="title-wrapper">
              <p className="title"> Humaterian Cases </p>
              {expandedSections.human ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.human && (
            <>
              <li onClick={() => handleNavigation('/HumanCases/')}>
                <MenuIcon className='icon'/>
                <span>Show</span>
              </li>
              <li onClick={() => handleNavigation('/AddHumanCases/')}>
                <MenuIcon className='icon'/>
                <span> Add</span>
              </li>
            </>
          )}

          {/* GUARANTEES */}
          <div className="section-header" onClick={() => toggleSection('guarantees')}>
            <div className="title-wrapper">
              <p className="title">GUARANTEES</p>
              {expandedSections.guarantees ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.guarantees && (
            <>
              <li onClick={() => handleNavigation('/guarnteesShow')}>
                <MenuIcon className='icon'/>
                <span>Show Guarantees</span>
              </li>
              <li onClick={() => handleNavigation('/guarnteesAdd')}>
                <AddBoxIcon className='icon'/>
                <span>Add Guarantee</span>
              </li>
              <li onClick={() => handleNavigation('/guarnteesArchive')}>
                <ArchiveIcon className='icon'/>
                <span>Archive</span>
              </li>
            </>
          )}

          {/* VOLUNTEERS */}
          <div className="section-header" onClick={() => toggleSection('volunteers')}>
            <div className="title-wrapper">
              <p className="title">VOLUNTEERS</p>
              {expandedSections.volunteers ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.volunteers && (
            <>
              <li onClick={() => handleNavigation('/volunteer')}>
                <MenuIcon className='icon'/>
                <span>Show Volunteers</span>
              </li>
              <li onClick={() => handleNavigation('/volunteer_request')}>
                <MarkEmailUnreadIcon className='icon'/>
                <span>Volunteer Requests</span>
              </li>
              <li onClick={() => handleNavigation('/volunteer-request/add')}>
                <AddBoxIcon className='icon'/>
                <span>Add Volunteer Requests</span>
              </li>
            </>
          )}

          {/* BENEFICIARIES */}
          <div className="section-header" onClick={() => toggleSection('beneficiaries')}>
            <div className="title-wrapper">
              <p className="title">BENEFICIARIES</p>
              {expandedSections.beneficiaries ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.beneficiaries && (
            <>
              <li onClick={() => handleNavigation('/beneficiaries')}>
                <MenuIcon className='icon'/>
                <span>Show Beneficiaries</span>
              </li>
              <li onClick={() => handleNavigation('/beneficiaryRequest')}>
                <MarkEmailUnreadIcon className='icon'/>
                <span>Benefit requests</span>
              </li>
              <li onClick={() => handleNavigation('/beneficiary-request/add')}>
                <AddBoxIcon className='icon'/>
                <span>Add Benefit request</span>
              </li>
            </>
          )}

          {/* FUNDS */}
          <div className="section-header" onClick={() => toggleSection('funds')}>
            <div className="title-wrapper">
              <p className="title">FUNDS</p>
              {expandedSections.funds ? 
                <ExpandLessIcon className="expand-icon" /> : 
                <ExpandMoreIcon className="expand-icon" />}
            </div>
          </div>
          {expandedSections.funds && (
            <>
            <li onClick={() => handleNavigation('/donators')}>
                <HealthAndSafetyIcon className='icon'/>
                <span>All Donators</span>
              </li>
              <li onClick={() => handleNavigation('/exchanges')}>
                <HealthAndSafetyIcon className='icon'/>
                <span>Exchages</span>
              </li>
              <li onClick={() => handleNavigation('/donations')}>
                <PersonIcon className='icon'/>
                <span>Donations</span>
              </li>
              <li onClick={() => handleNavigation('/boxes')}>
                <AddModeratorIcon className='icon'/>
                <span>Boxes</span>
              </li>
              <li onClick={() => handleNavigation('/currentDonations')}>
                <AddModeratorIcon className='icon'/>
                <span>Recurring Donations</span>
              </li>
            </>
          )}

          {/*recharge card */}
<div className="section-header" onClick={() => toggleSection('recharge')}>
  <div className="title-wrapper">
    <p className="title">Recharging</p>
    {expandedSections.recharge ? 
      <ExpandLessIcon className="expand-icon" /> : 
      <ExpandMoreIcon className="expand-icon" />}
  </div>
</div>
{expandedSections.recharge && (
  <>
   <li onClick={() => handleNavigation('/recargingUsers')}>
            <WalletIcon className='icon'/>
            <span>Charge User's Card</span>
          </li>
  </>
)}

          {/* MESSAGES */}
          <div className="section-header" onClick={() => toggleSection('emails')}>
  <div className="title-wrapper">
    <p className="title">Messages</p>
    {expandedSections.emails ? 
      <ExpandLessIcon className="expand-icon" /> : 
      <ExpandMoreIcon className="expand-icon" />}
  </div>
</div>
{expandedSections.emails && (

<>
          <li onClick={() => handleNavigation('/emails')}>
            <MarkEmailUnreadIcon className='icon'/>
            <span>Emails</span>
          </li>

        
</>)}

 <div className="section-header" onClick={() => toggleSection('reports')}>
  <div className="title-wrapper">
    <p className="title">Reports</p>
    {expandedSections.reports ? 
      <ExpandLessIcon className="expand-icon" /> : 
      <ExpandMoreIcon className="expand-icon" />}
  </div>
</div>
{expandedSections.reports && (

<>
  {/* REPORTS */}
          <li onClick={() => handleNavigation('/reports')}>
            <MenuIcon className='icon'/>
            <span>Reports</span>
          </li>
          <li onClick={() => handleNavigation('/reportsAdd')}>
            <AddBoxIcon className='icon'/>
            <span>Create report</span>
          </li>

        
</>)}

    <div className="section-header" onClick={() => toggleSection('categories')}>
  <div className="title-wrapper">
    <p className="title">Categories</p>
    {expandedSections.categories ? 
      <ExpandLessIcon className="expand-icon" /> : 
      <ExpandMoreIcon className="expand-icon" />}
  </div>
</div>
{expandedSections.categories && (

<>
          {/* Categories */}
          <li onClick={() => handleNavigation('/categoryShow')}>
            <AppsIcon className='icon'/>
            <span>Categories</span>
          </li>
          <li onClick={() => handleNavigation('/categoryAdd')}>
            <AddBoxIcon className='icon'/>
            <span>Add Categories</span>
          </li>
          
</>)}
       
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;