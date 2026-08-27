import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Moon, Sun, Menu, X, Command } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, theme, unreadCount, dispatch, tasks, projects } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });
  };

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const taskResults = tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      .slice(0, 4)
      .map((t) => ({ type: 'task', id: t.id, label: t.title, sub: t.id, to: `/tasks/${t.id}` }));
    const projResults = projects
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({ type: 'project', id: p.id, label: p.name, sub: 'Project', to: `/projects/${p.id}` }));
    setSearchResults([...taskResults, ...projResults]);
  }, [searchQuery, tasks, projects]);

  // Click outside to close search
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 50);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className={`navbar-search ${searchOpen ? 'active' : ''}`} ref={searchRef}>
          <Search size={16} className="navbar-search-icon" />
          <input
            className="navbar-search-input"
            placeholder="Search tasks, projects, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          <div className="navbar-search-kbd">
            <span>⌘</span><span>K</span>
          </div>

          {searchOpen && searchQuery && (
            <div className="search-dropdown">
              {searchResults.length === 0 ? (
                <div className="search-no-results">No results for "{searchQuery}"</div>
              ) : (
                searchResults.map((r) => (
                  <div
                    key={r.id}
                    className="search-result-item"
                    onClick={() => {
                      navigate(r.to);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span className={`search-result-type search-type-${r.type}`}>
                      {r.type === 'task' ? '📋' : '📁'}
                    </span>
                    <div>
                      <div className="search-result-label">{r.label}</div>
                      <div className="search-result-sub">{r.sub}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button className="navbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="navbar-icon-btn navbar-notif-btn"
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="navbar-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        {/* Profile */}
        <button className="navbar-profile" onClick={() => navigate('/profile')}>
          <Avatar name={currentUser.name} color={currentUser.color} size="sm" />
          <div className="navbar-profile-info">
            <span className="navbar-profile-name">{currentUser.name}</span>
          </div>
          <ChevronDown size={14} className="navbar-profile-chevron" />
        </button>
      </div>
    </header>
  );
}
