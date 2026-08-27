import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  ClipboardList, Clock, CheckCircle, AlertCircle,
  UserCheck, GitCommit, RefreshCw, CheckSquare, Bell, Target,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Button, StatusBadge, PriorityBadge, Avatar, ProgressBar } from '../components/common';
import Modal from '../components/common/Modal';
import TaskForm from '../components/task/TaskForm';
import { getTaskStats } from '../utils/filterUtils';
import { formatShortDate, getDayOfMonth, getMonthName, formatTimeAgo } from '../utils/dateUtils';
import './Dashboard.css';

const DONUT_COLORS = ['#64748b', '#3b82f6', '#a855f7', '#22c55e', '#ef4444'];

// Lucide icon components for stat cards (no emojis)
const STAT_CONFIGS = [
  {
    key: 'total',
    title: 'Total Tasks',
    Icon: ClipboardList,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    change: '+12%',
    changeUp: true,
    changeLabel: 'from last week',
  },
  {
    key: 'inProgress',
    title: 'In Progress',
    Icon: Clock,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    change: '+5%',
    changeUp: true,
    changeLabel: 'from last week',
  },
  {
    key: 'completed',
    title: 'Completed',
    Icon: CheckCircle,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    change: '+20%',
    changeUp: true,
    changeLabel: 'from last week',
  },
  {
    key: 'overdue',
    title: 'Overdue',
    Icon: AlertCircle,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    change: '-2%',
    changeUp: false,
    changeLabel: 'from last week',
  },
];

// Activity type icon map — Lucide components
const ACTIVITY_ICONS = {
  task_assigned: <UserCheck size={14} />,
  comment: <MoreHorizontal size={14} />,
  status_changed: <RefreshCw size={14} />,
  task_completed: <CheckSquare size={14} />,
  deadline_reminder: <Clock size={14} />,
  project_milestone: <Target size={14} />,
};

function StatCard({ config, value }) {
  const { Icon } = config;
  return (
    <div className="stat-card fade-in">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: config.iconBg, color: config.iconColor }}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
        <div>
          <p className="stat-title">{config.title}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
      <div className="stat-change">
        {config.changeUp
          ? <ArrowUpRight size={14} color="#22c55e" />
          : <ArrowDownRight size={14} color="#ef4444" />}
        <span className={config.changeUp ? 'change-up' : 'change-down'}>{config.change}</span>
        <span className="change-label">{config.changeLabel}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser, tasks, projects, members, notifications } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const stats = getTaskStats(tasks, currentUser.id);

  const myTasks = tasks
    .filter((t) => t.assigneeId === currentUser.id)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const donutData = [
    { name: 'To Do',       value: getTaskStats(tasks).todo },
    { name: 'In Progress', value: getTaskStats(tasks).inProgress },
    { name: 'In Review',   value: getTaskStats(tasks).inReview },
    { name: 'Completed',   value: getTaskStats(tasks).completed },
    { name: 'Blocked',     value: getTaskStats(tasks).blocked },
  ].filter((d) => d.value > 0);

  const recentActivity = notifications.slice(0, 5);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const getMember = (id) => members.find((m) => m.id === id);

  return (
    <div className="dashboard-page fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">{greeting}, {currentUser.name}</h1>
          <p className="dashboard-sub">Here's what's happening with your work today.</p>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-date">
            {new Date().toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        {STAT_CONFIGS.map((cfg) => (
          <StatCard key={cfg.key} config={cfg} value={stats[cfg.key]} />
        ))}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left */}
        <div className="dashboard-left">
          <div className="card">
            <div className="card-header">
              <span className="section-title">My Tasks</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setCreateOpen(true)}
                >
                  Create Task
                </Button>
                <button className="icon-btn-ghost">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="task-tabs">
              {['All', 'To Do', 'In Progress', 'In Review', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  className={`task-tab ${tab === 'All' ? 'active' : ''}`}
                  onClick={() => navigate('/tasks')}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Task table */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}>
                        <td>
                          <div className="task-name-cell">
                            <input
                              type="checkbox"
                              className="task-checkbox"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="task-title-text">{task.title}</span>
                          </div>
                        </td>
                        <td><span className="project-name">{project?.name}</span></td>
                        <td><PriorityBadge priority={task.priority} /></td>
                        <td>
                          <span className={`due-date-text ${getDueDateStatus(task.dueDate) === 'overdue' ? 'overdue-text' : ''}`}>
                            {formatShortDate(task.dueDate)}
                          </span>
                        </td>
                        <td><StatusBadge status={task.status} /></td>
                        <td>
                          <button
                            className="icon-btn-ghost"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="view-all-row">
              <button className="view-all-btn" onClick={() => navigate('/tasks')}>
                View all tasks →
              </button>
            </div>
          </div>

          {/* Bottom row */}
          <div className="dashboard-bottom-row">
            {/* Project Progress */}
            <div className="card project-progress-card">
              <div className="card-header">
                <span className="section-title">Project Progress</span>
                <button className="view-all-btn" onClick={() => navigate('/projects')}>
                  View all
                </button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className="project-progress-row"
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-progress-info">
                      {/* Color-coded initials instead of emoji */}
                      <div
                        className="project-color-icon"
                        style={{ background: proj.color + '22', color: proj.color }}
                      >
                        {proj.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="project-name-text">{proj.name}</p>
                        <p className="project-tasks-count">{proj.totalTasks} tasks</p>
                      </div>
                    </div>
                    <div className="project-progress-bar-wrap">
                      <ProgressBar value={proj.progress} color={proj.color} height={6} />
                      <span className="project-progress-pct">{proj.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart */}
            <div className="card donut-card">
              <div className="card-header">
                <span className="section-title">Tasks by Status</span>
              </div>
              <div className="donut-body">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} tasks`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-legend">
                  {donutData.map((d, i) => (
                    <div key={d.name} className="donut-legend-item">
                      <span className="donut-legend-dot" style={{ background: DONUT_COLORS[i] }} />
                      <span className="donut-legend-label">{d.name}</span>
                      <span className="donut-legend-value">
                        {d.value} ({Math.round((d.value / tasks.length) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="dashboard-right">
          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="card-header">
              <span className="section-title">Upcoming Deadlines</span>
              <button className="view-all-btn" onClick={() => navigate('/calendar')}>
                View all
              </button>
            </div>
            <div className="deadline-list">
              {upcoming.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                return (
                  <div
                    key={task.id}
                    className="deadline-item"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="deadline-date">
                      <span className="deadline-day">{getDayOfMonth(task.dueDate)}</span>
                      <span className="deadline-month">{getMonthName(task.dueDate)}</span>
                    </div>
                    <div className="deadline-info">
                      <p className="deadline-title">{task.title}</p>
                      <p className="deadline-project">{project?.name}</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <span className="section-title">Recent Activity</span>
              <button className="view-all-btn" onClick={() => navigate('/notifications')}>
                View all
              </button>
            </div>
            <div className="activity-list">
              {recentActivity.map((notif) => {
                const user = notif.userId ? getMember(notif.userId) : null;
                return (
                  <div key={notif.id} className="activity-item">
                    {user ? (
                      <Avatar name={user.name} color={user.color} size="sm" />
                    ) : (
                      <div className="activity-icon-box">
                        {ACTIVITY_ICONS[notif.type] || <Bell size={14} />}
                      </div>
                    )}
                    <div className="activity-content">
                      <p className="activity-message">{notif.message}</p>
                      <p className="activity-time">{formatTimeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm onClose={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}

function getDueDateStatus(dateStr) {
  if (!dateStr) return 'normal';
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (d < now) return 'overdue';
  return 'normal';
}
