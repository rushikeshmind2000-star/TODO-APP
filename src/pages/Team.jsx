import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common';
import { getTaskStats } from '../utils/filterUtils';
import './Team.css';

export default function Team() {
  const { members, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMember = selected ? members.find((m) => m.id === selected) : null;
  const memberTasks = selectedMember ? tasks.filter((t) => t.assigneeId === selectedMember.id) : [];
  const memberStats = getTaskStats(memberTasks);

  return (
    <div className="team-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">{members.length} members</p>
        </div>
      </div>

      {/* Search */}
      <div className="team-search">
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          className="team-search-input"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="team-layout">
        {/* Members table */}
        <div className="card team-table-card">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>In Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const mTasks = tasks.filter((t) => t.assigneeId === m.id);
                const mStats = getTaskStats(mTasks);
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(selected === m.id ? null : m.id)}
                    className={selected === m.id ? 'row-selected' : ''}
                  >
                    <td>
                      <div className="member-row">
                        <Avatar name={m.name} color={m.color} size="md" />
                        <div>
                          <p className="member-row-name">{m.name}</p>
                          <p className="member-row-email">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge" style={{ color: m.color, background: m.color + '15' }}>
                        {m.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{m.department}</td>
                    <td><span className="team-stat-val">{mStats.total}</span></td>
                    <td><span className="team-stat-val" style={{ color: '#22c55e' }}>{mStats.completed}</span></td>
                    <td><span className="team-stat-val" style={{ color: '#3b82f6' }}>{mStats.inProgress}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Member detail panel */}
        {selectedMember && (
          <div className="card member-detail-panel slide-in-right">
            <div className="member-detail-top">
              <Avatar name={selectedMember.name} color={selectedMember.color} size="xl" />
              <h2 className="member-detail-name">{selectedMember.name}</h2>
              <p className="member-detail-role" style={{ color: selectedMember.color }}>{selectedMember.role}</p>
              <p className="member-detail-email">{selectedMember.email}</p>
              <p className="member-detail-dept">{selectedMember.department}</p>
            </div>

            <div className="member-detail-stats">
              {[
                { label: 'Assigned', val: memberStats.total, color: '#6366f1' },
                { label: 'Completed', val: memberStats.completed, color: '#22c55e' },
                { label: 'In Progress', val: memberStats.inProgress, color: '#3b82f6' },
                { label: 'Overdue', val: memberStats.overdue, color: '#ef4444' },
              ].map((s) => (
                <div key={s.label} className="member-stat-box">
                  <span className="member-stat-num" style={{ color: s.color }}>{s.val}</span>
                  <span className="member-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="member-tasks-list">
              <p className="member-tasks-title">Assigned Tasks</p>
              {memberTasks.slice(0, 5).map((t) => (
                <div key={t.id} className="member-task-item">
                  <div className="member-task-priority" style={{ background: { URGENT: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#22c55e' }[t.priority] }} />
                  <p className="member-task-name">{t.title}</p>
                </div>
              ))}
              {memberTasks.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                  No tasks assigned
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
