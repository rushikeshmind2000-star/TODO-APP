import React, { useState } from 'react';
import { Pencil, Sun, Moon, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar, Button } from '../components/common';
import { getTaskStats } from '../utils/filterUtils';
import './Profile.css';

export default function Profile() {
  const { currentUser, theme, dispatch, tasks } = useApp();
  const myStats = getTaskStats(tasks, currentUser.id);

  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    comments: true,
    deadlineReminders: true,
    projectUpdates: false,
  });

  const toggleNotif = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className="profile-page fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-6)' }}>My Profile</h1>

      <div className="profile-layout">
        {/* Profile card */}
        <div className="card profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrap">
              <Avatar name={currentUser.name} color={currentUser.color} size="xl" />
              <button className="avatar-edit-btn" title="Change avatar">
                <Pencil size={12} />
              </button>
            </div>
            <h2 className="profile-name">{currentUser.name}</h2>
            <p className="profile-role" style={{ color: currentUser.color }}>{currentUser.role}</p>
          </div>

          <div className="profile-stats">
            {[
              { label: 'Total Tasks', val: myStats.total, color: '#6366f1' },
              { label: 'Completed', val: myStats.completed, color: '#22c55e' },
              { label: 'In Progress', val: myStats.inProgress, color: '#3b82f6' },
              { label: 'Overdue', val: myStats.overdue, color: '#ef4444' },
            ].map((s) => (
              <div key={s.label} className="profile-stat">
                <span className="profile-stat-val" style={{ color: s.color }}>{s.val}</span>
                <span className="profile-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="profile-info">
            {[
              { label: 'Email', value: currentUser.email },
              { label: 'Department', value: currentUser.department },
              { label: 'Role', value: currentUser.role },
            ].map((f) => (
              <div key={f.label} className="profile-field">
                <span className="profile-field-label">{f.label}</span>
                <span className="profile-field-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings panel */}
        <div className="profile-settings">
          {/* Appearance */}
          <div className="card settings-card">
            <div className="card-header">
              <span className="section-title">Appearance</span>
            </div>
            <div className="card-body settings-body">
              {['light', 'dark', 'system'].map((t) => (
                <label key={t} className="theme-option">
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={theme === t}
                    onChange={() => dispatch({ type: 'SET_THEME', payload: t })}
                    className="theme-radio"
                  />
                  <div className="theme-option-content">
                    <div className="theme-preview theme-preview-">
                      {t === 'light' ? <Sun size={18} /> : t === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
                    </div>
                    <div>
                      <p className="theme-label">{t.charAt(0).toUpperCase() + t.slice(1)}</p>
                      <p className="theme-desc">{t === 'light' ? 'Always use light mode' : t === 'dark' ? 'Always use dark mode' : 'Follow system preference'}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card settings-card">
            <div className="card-header">
              <span className="section-title">Notification Preferences</span>
            </div>
            <div className="card-body settings-body">
              {[
                { key: 'taskAssignments', label: 'Task assignments', desc: 'When a task is assigned to you' },
                { key: 'comments', label: 'Comments', desc: 'When someone comments on your tasks' },
                { key: 'deadlineReminders', label: 'Deadline reminders', desc: '24h before task due date' },
                { key: 'projectUpdates', label: 'Project updates', desc: 'Project milestones and changes' },
              ].map((pref) => (
                <div key={pref.key} className="notif-pref">
                  <div>
                    <p className="pref-label">{pref.label}</p>
                    <p className="pref-desc">{pref.desc}</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications[pref.key]}
                      onChange={() => toggleNotif(pref.key)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
