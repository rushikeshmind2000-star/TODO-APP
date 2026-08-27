import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, GitCommit, RefreshCw, CheckSquare, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, ProgressBar, Avatar, StatusBadge, PriorityBadge } from '../components/common';
import Modal from '../components/common/Modal';
import TaskForm from '../components/task/TaskForm';
import KanbanBoard from '../components/task/KanbanBoard';
import { formatDate } from '../utils/dateUtils';
import { getTaskStats } from '../utils/filterUtils';
import './ProjectDetails.css';

const TABS = ['Overview', 'Board', 'Members', 'Activity'];

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, members } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [createOpen, setCreateOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ fontSize: '3rem' }}>📁</p>
        <h2>Project not found</h2>
        <Button variant="primary" onClick={() => navigate('/projects')} style={{ marginTop: 16 }}>Back to Projects</Button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const stats = getTaskStats(projectTasks);
  const projectMembers = members.filter((m) => project.memberIds?.includes(m.id));

  return (
    <div className="project-details-page fade-in">
      <button className="back-btn" onClick={() => navigate('/projects')}>
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Header */}
      <div className="proj-detail-header">
        <div className="proj-detail-left">
          <div
            className="proj-detail-icon"
            style={{ background: project.color + '18', color: project.color }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="proj-detail-name">{project.name}</h1>
            <p className="proj-detail-desc">{project.description}</p>
          </div>
        </div>
        <Button variant="primary" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="proj-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`proj-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="proj-overview fade-in">
          <div className="proj-stats-grid">
            {[
              { label: 'Total Tasks', value: stats.total, color: '#6366f1' },
              { label: 'Completed', value: stats.completed, color: '#22c55e' },
              { label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
              { label: 'Overdue', value: stats.overdue, color: '#ef4444' },
            ].map((s) => (
              <div key={s.label} className="proj-stat-card card">
                <p className="proj-stat-label">{s.label}</p>
                <p className="proj-stat-value" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="card proj-progress-section">
            <div className="card-header">
              <span className="section-title">Overall Progress</span>
              <span style={{ fontWeight: 700, color: project.color }}>{project.progress}%</span>
            </div>
            <div className="card-body">
              <ProgressBar value={project.progress} color={project.color} height={10} />

              <div className="proj-status-breakdown">
                {[
                  { label: 'To Do', count: stats.todo, color: '#64748b' },
                  { label: 'In Progress', count: stats.inProgress, color: '#3b82f6' },
                  { label: 'In Review', count: stats.inReview, color: '#a855f7' },
                  { label: 'Completed', count: stats.completed, color: '#22c55e' },
                  { label: 'Blocked', count: stats.blocked, color: '#ef4444' },
                ].map((s) => (
                  <div key={s.label} className="proj-status-row">
                    <span className="proj-status-dot" style={{ background: s.color }} />
                    <span className="proj-status-label">{s.label}</span>
                    <div className="proj-status-bar-wrap">
                      <div className="proj-status-bar">
                        <div
                          className="proj-status-bar-fill"
                          style={{
                            width: stats.total ? `${(s.count / stats.total) * 100}%` : '0%',
                            background: s.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="proj-status-count">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent tasks */}
          <div className="card">
            <div className="card-header">
              <span className="section-title">Recent Tasks</span>
              <button className="proj-tab active" onClick={() => setActiveTab('Board')}>View Board</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.slice(0, 5).map((t) => {
                    const assignee = members.find((m) => m.id === t.assigneeId);
                    return (
                      <tr key={t.id} onClick={() => navigate(`/tasks/${t.id}`)} style={{ cursor: 'pointer' }}>
                        <td><span style={{ fontWeight: 500 }}>{t.title}</span></td>
                        <td><PriorityBadge priority={t.priority} /></td>
                        <td><StatusBadge status={t.status} /></td>
                        <td>
                          {assignee && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Avatar name={assignee.name} color={assignee.color} size="sm" />
                              <span style={{ fontSize: '0.8rem' }}>{assignee.name}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {formatDate(t.dueDate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Board */}
      {activeTab === 'Board' && (
        <div className="fade-in">
          <KanbanBoard tasks={projectTasks} />
        </div>
      )}

      {/* Members */}
      {activeTab === 'Members' && (
        <div className="proj-members-grid fade-in">
          {projectMembers.map((m) => {
            const memberTasks = projectTasks.filter((t) => t.assigneeId === m.id);
            const memberStats = getTaskStats(memberTasks);
            return (
              <div key={m.id} className="member-card card">
                <div className="member-card-top">
                  <Avatar name={m.name} color={m.color} size="lg" />
                  <div>
                    <p className="member-name">{m.name}</p>
                    <p className="member-role">{m.role}</p>
                  </div>
                </div>
                <div className="member-stats">
                  <div className="member-stat">
                    <span className="member-stat-val">{memberStats.total}</span>
                    <span className="member-stat-label">Assigned</span>
                  </div>
                  <div className="member-stat">
                    <span className="member-stat-val" style={{ color: '#22c55e' }}>{memberStats.completed}</span>
                    <span className="member-stat-label">Completed</span>
                  </div>
                  <div className="member-stat">
                    <span className="member-stat-val" style={{ color: '#3b82f6' }}>{memberStats.inProgress}</span>
                    <span className="member-stat-label">In Progress</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity */}
      {activeTab === 'Activity' && (
        <div className="card proj-activity fade-in">
          <div className="card-body">
            {projectTasks
              .flatMap((t) =>
                (t.activity || []).map((a) => ({ ...a, taskTitle: t.title, taskId: t.id }))
              )
              .slice(0, 20)
              .map((ev, i) => {
                const user = members.find((m) => m.id === ev.userId);
                const ActivityIcon = {
                  created: GitCommit,
                  assigned: UserCheck,
                  status_changed: RefreshCw,
                  priority_changed: CheckSquare,
                }[ev.type] || GitCommit;
                return (
                  <div key={i} className="proj-activity-item">
                    {user ? (
                      <Avatar name={user.name} color={user.color} size="sm" />
                    ) : (
                      <div className="activity-icon-wrap">
                        <ActivityIcon size={14} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {user?.name || 'System'}
                        </strong>
                        {' · '}{ev.detail}{' on '}
                        <span
                          style={{ color: 'var(--brand-primary)', cursor: 'pointer' }}
                          onClick={() => navigate(`/tasks/${ev.taskId}`)}
                        >
                          {ev.taskTitle}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Task to Project" size="lg">
        <TaskForm onClose={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}
