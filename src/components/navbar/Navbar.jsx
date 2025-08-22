import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import Switch from '@mui/material/Switch';
import "./navbar.scss"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';


const Navbar = () => {
  const [language, setLanguage] = useState('ar'); 

  return (
    <div className='navbar'>
      <div className="navbarContainer">
        <div className="search">
          <input type="text" placeholder="search" />
          <SearchIcon className='icon' />
        </div>
        <div className="items">
          <div className="item">
            <LanguageIcon className='icon'  />
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                color: "#fff",
                borderRadius: "4px",
                minWidth: "120px",
                ".MuiSelect-icon": { color: "#fff" },
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              <MenuItem value="ar">العربية</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </div>
          <div className="item">
            <Switch style={{ color: "black" }} className='icon' />
          </div>
          <div className="item">
            <img src="/assets/person.jpg" alt="" className='profileimg' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar