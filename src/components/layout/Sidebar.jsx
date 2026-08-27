import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, FolderKanban, Users,
  Calendar, BarChart2, Bell, Settings, User, Activity,
  ChevronDown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common';
import './Sidebar.css';

const NAV_MAIN = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/tasks', icon: <CheckSquare size={18} />, label: 'My Tasks' },
  { to: '/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
  { to: '/team', icon: <Users size={18} />, label: 'Team' },
  { to: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
  { to: '/reports', icon: <BarChart2 size={18} />, label: 'Reports' },
];

const NAV_BOTTOM = [
  { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: true },
  { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
];

export default function Sidebar() {
  const { currentUser, sidebarOpen, unreadCount, dispatch } = useApp();
  const collapsed = !sidebarOpen;

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={20} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">TechPulse</span>
            <span className="sidebar-logo-sub">TaskHub</span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {NAV_MAIN.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Bottom Nav */}
      <nav className="sidebar-nav sidebar-nav-bottom">
        <ul className="sidebar-nav-list">
          {NAV_BOTTOM.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon" style={{ position: 'relative' }}>
                  {item.icon}
                  {item.badge && unreadCount > 0 && (
                    <span className="sidebar-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </span>
                {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                {!collapsed && item.badge && unreadCount > 0 && (
                  <span className="sidebar-badge-label">{unreadCount}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="sidebar-user">
        <Avatar name={currentUser?.name} color={currentUser?.color} size="sm" />
        {!collapsed && (
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{currentUser?.name}</span>
            <span className="sidebar-user-role">{currentUser?.role}</span>
          </div>
        )}
        {!collapsed && (
          <button 
            className="sidebar-logout-btn" 
            onClick={() => dispatch({ type: 'LOGOUT' })} 
            title="Logout"
            style={{ 
              marginLeft: 'auto', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <ChevronRight size={14} style={{ transform: 'scaleX(-1)' }} />
          </button>
        )}
      </div>
    </aside>
  );
}
