import React from 'react';
import { NavLink } from 'react-router-dom';  // Import NavLink
import './Sidebar.css';
import { assets } from '../../assets/assets.js';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="Add Icon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="List Icon" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="Order Icon" />
          <p>Order</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
