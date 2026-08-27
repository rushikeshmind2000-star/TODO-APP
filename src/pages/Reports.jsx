import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { CheckCircle2, ClipboardList, Zap, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTaskStats } from '../utils/filterUtils';
import { COMPLETION_TREND } from '../constants/mockData';
import './Reports.css';

const STATUS_COLORS = ['#64748b', '#3b82f6', '#a855f7', '#22c55e', '#ef4444'];

export default function Reports() {
  const { tasks, members } = useApp();
  const stats = getTaskStats(tasks);

  const summaryCards = [
    { label: 'Completion Rate', value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, color: '#22c55e', Icon: CheckCircle2 },
    { label: 'Total Tasks',     value: stats.total,                        color: '#6366f1', Icon: ClipboardList },
    { label: 'Active Tasks',    value: stats.inProgress + stats.inReview,  color: '#3b82f6', Icon: Zap },
    { label: 'Overdue',         value: stats.overdue,                      color: '#ef4444', Icon: AlertTriangle },
  ];

  const statusData = [
    { name: 'To Do',       value: stats.todo },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'In Review',   value: stats.inReview },
    { name: 'Completed',   value: stats.completed },
    { name: 'Blocked',     value: stats.blocked },
  ];

  const priorityData = [
    { name: 'Urgent', value: tasks.filter((t) => t.priority === 'URGENT').length, color: '#ef4444' },
    { name: 'High',   value: tasks.filter((t) => t.priority === 'HIGH').length,   color: '#f97316' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'Low',    value: tasks.filter((t) => t.priority === 'LOW').length,    color: '#22c55e' },
  ];

  const teamData = members.map((m) => {
    const mTasks = tasks.filter((t) => t.assigneeId === m.id);
    return {
      name: m.name.split(' ')[0],
      completed: getTaskStats(mTasks).completed,
      inProgress: getTaskStats(mTasks).inProgress,
      todo: getTaskStats(mTasks).todo,
    };
  });

  return (
    <div className="reports-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Performance analytics and insights</p>
        </div>
      </div>

      {/* Summary cards with Lucide icons */}
      <div className="report-summary-grid">
        {summaryCards.map((s) => (
          <div key={s.label} className="report-summary-card card">
            <div
              className="report-summary-icon-wrap"
              style={{ background: s.color + '18', color: s.color }}
            >
              <s.Icon size={22} strokeWidth={1.8} />
            </div>
            <p className="report-summary-val" style={{ color: s.color }}>{s.value}</p>
            <p className="report-summary-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="reports-grid">
        {/* Task Status Donut */}
        <div className="card report-chart-card">
          <div className="card-header">
            <span className="section-title">Task Status Distribution</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} tasks`]} />
                <Legend formatter={(v) => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar */}
        <div className="card report-chart-card">
          <div className="card-header">
            <span className="section-title">Tasks by Priority</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} tasks`]} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="card report-chart-card report-chart-wide">
          <div className="card-header">
            <span className="section-title">Completion Trend (Last 30 Days)</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={COMPLETION_TREND} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team performance */}
        <div className="card report-chart-card report-chart-wide">
          <div className="card-header">
            <span className="section-title">Team Performance</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={teamData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Legend formatter={(v) => <span style={{ fontSize: '0.78rem' }}>{v}</span>} />
                <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" radius={[4, 4, 0, 0]} name="In Progress" />
                <Bar dataKey="todo" fill="#64748b" radius={[4, 4, 0, 0]} name="To Do" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
