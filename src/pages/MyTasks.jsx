import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, X, MoreHorizontal, ChevronUp, ChevronDown, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, StatusBadge, PriorityBadge, Avatar, EmptyState, Select } from '../components/common';
import Modal from '../components/common/Modal';
import TaskForm from '../components/task/TaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { filterTasks } from '../utils/filterUtils';
import { formatShortDate, getDueDateStatus } from '../utils/dateUtils';
import './MyTasks.css';

const STATUS_TABS = [
  { value: 'ALL', label: 'All' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BLOCKED', label: 'Blocked' },
];

export default function MyTasks() {
  const { tasks, projects, members, currentUser, deleteTask } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ priority: 'ALL', projectId: 'ALL', assigneeId: 'ALL', dueDate: 'ALL' });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');

  // Apply filters
  const combined = filterTasks(tasks, { ...filters, status: activeTab }, search);
  const sorted = [...combined].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return sortDir === 'asc' ? order[a.priority] - order[b.priority] : order[b.priority] - order[a.priority];
    }
    const va = a[sortBy] || '';
    const vb = b[sortBy] || '';
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const hasActiveFilters = Object.values(filters).some((v) => v !== 'ALL');

  const clearFilters = () => {
    setFilters({ priority: 'ALL', projectId: 'ALL', assigneeId: 'ALL', dueDate: 'ALL' });
    setSearch('');
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => (
    sortBy === col ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null
  );

  const getMember = (id) => members.find((m) => m.id === id);
  const getProject = (id) => projects.find((p) => p.id === id);

  return (
    <div className="my-tasks-page fade-in">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">{sorted.length} tasks found</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
          Create Task
        </Button>
      </div>

      {/* Search + Filter bar */}
      <div className="task-toolbar">
        <div className="search-field">
          <Search size={15} className="search-field-icon" />
          <input
            className="search-field-input"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          size="sm"
          icon={<Filter size={14} />}
          onClick={() => setShowFilters((v) => !v)}
        >
          Filters {hasActiveFilters && `(active)`}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="filter-panel slide-in-up">
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </Select>

          <Select
            label="Project"
            value={filters.projectId}
            onChange={(e) => setFilters((f) => ({ ...f, projectId: e.target.value }))}
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>

          <Select
            label="Assignee"
            value={filters.assigneeId}
            onChange={(e) => setFilters((f) => ({ ...f, assigneeId: e.target.value }))}
          >
            <option value="ALL">All Members</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>

          <Select
            label="Due Date"
            value={filters.dueDate}
            onChange={(e) => setFilters((f) => ({ ...f, dueDate: e.target.value }))}
          >
            <option value="ALL">Any Date</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="OVERDUE">Overdue</option>
          </Select>
        </div>
      )}

      {/* Status tabs */}
      <div className="tasks-card card">
        <div className="status-tabs-row">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`status-tab ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className="status-tab-count">
                {filterTasks(tasks, { status: tab.value }, '').length}
              </span>
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={32} color="var(--text-muted)" />}
            title="No tasks found"
            description="No tasks match your current filters."
            action={<Button variant="primary" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>Create Task</Button>}
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="sortable-th" onClick={() => handleSort('title')}>
                    Task <SortIcon col="title" />
                  </th>
                  <th>Project</th>
                  <th className="sortable-th" onClick={() => handleSort('priority')}>
                    Priority <SortIcon col="priority" />
                  </th>
                  <th className="sortable-th" onClick={() => handleSort('dueDate')}>
                    Due Date <SortIcon col="dueDate" />
                  </th>
                  <th>Assignee</th>
                  <th className="sortable-th" onClick={() => handleSort('status')}>
                    Status <SortIcon col="status" />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((task) => {
                  const project = getProject(task.projectId);
                  const assignee = getMember(task.assigneeId);
                  const dueSt = getDueDateStatus(task.dueDate);
                  return (
                    <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}>
                      <td>
                        <div>
                          <p className="task-row-title">{task.title}</p>
                          <p className="task-row-id">{task.id}</p>
                        </div>
                      </td>
                      <td>
                        <div className="project-cell">
                          <span
                            className="project-dot"
                            style={{ background: project?.color || '#6366f1' }}
                          />
                          <span>{project?.name || '—'}</span>
                        </div>
                      </td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      <td>
                        <span className={`due-chip ${dueSt === 'overdue' ? 'due-overdue' : dueSt === 'today' ? 'due-today' : ''}`}>
                          {formatShortDate(task.dueDate)}
                        </span>
                      </td>
                      <td>
                        {assignee && (
                          <div className="assignee-cell">
                            <Avatar name={assignee.name} color={assignee.color} size="sm" />
                            <span>{assignee.name}</span>
                          </div>
                        )}
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button
                            className="icon-btn-ghost"
                            title="Delete"
                            onClick={() => setDeleteTarget(task)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="lg">
        <TaskForm onClose={() => setCreateOpen(false)} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTask(deleteTarget.id)}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
