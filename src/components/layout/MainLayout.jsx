import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import ToastContainer from '../common/Toast';

export default function MainLayout() {
  const { sidebarOpen, dispatch } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-mobile-overlay" 
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}
      <div className={`main-area ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
