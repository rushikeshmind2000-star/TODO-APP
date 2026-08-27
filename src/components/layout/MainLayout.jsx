import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import ToastContainer from '../common/Toast';

export default function MainLayout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
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
