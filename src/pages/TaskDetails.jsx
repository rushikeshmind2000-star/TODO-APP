import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, MessageSquare, Clock, Tag, User, Calendar, Folder, ChevronDown, Search, UserCheck, GitCommit, RefreshCw, CheckSquare, Pin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, StatusBadge, PriorityBadge, Avatar, Skeleton } from '../components/common';
import Modal from '../components/common/Modal';
import TaskForm from '../components/task/TaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDate, formatDateTime, formatTimeAgo, getDueDateStatus } from '../utils/dateUtils';
import './TaskDetails.css';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, members, currentUser, updateTaskStatus, addComment, updateTask, deleteTask } = useApp();

  const task = tasks.find((t) => t.id === taskId);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');

  if (!task) {
    return (
      <div className="task-details-page fade-in">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h2>Task not found</h2>
          <Button variant="primary" onClick={() => navigate('/tasks')} style={{ marginTop: 16 }}>
            Back to My Tasks
          </Button>
        </div>
      </div>
    );
  }

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = members.find((m) => m.id === task.assigneeId);
  const reporter = members.find((m) => m.id === task.reporterId);
  const dueSt = getDueDateStatus(task.dueDate);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    addComment(task.id, comment.trim());
    setComment('');
  };

  const handleStatusChange = (status) => {
    updateTaskStatus(task.id, status);
    setStatusOpen(false);
  };

  return (
    <div className="task-details-page fade-in">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="task-details-layout">
        {/* Main content */}
        <div className="task-details-main">
          {/* Header */}
          <div className="card task-header-card">
            <div className="task-header-top">
              <div className="task-id-badge">{task.id}</div>
              <div className="task-header-actions">
                <Button variant="secondary" size="sm" icon={<Edit2 size={14} />} onClick={() => setEditOpen(true)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteOpen(true)}>
                  Delete
                </Button>
              </div>
            </div>

            <h1 className="task-detail-title">{task.title}</h1>

            {/* Status + Priority row */}
            <div className="task-badges-row">
              {/* Clickable status */}
              <div className="status-selector" onClick={() => setStatusOpen((v) => !v)} style={{ position: 'relative' }}>
                <StatusBadge status={task.status} />
                <ChevronDown size={12} />
                {statusOpen && (
                  <div className="status-dropdown scale-in">
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} className="status-option" onClick={(e) => { e.stopPropagation(); handleStatusChange(s); }}>
                        <StatusBadge status={s} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <PriorityBadge priority={task.priority} />
              {task.tags?.map((tag) => (
                <span key={tag} className="task-tag">{tag}</span>
              ))}
            </div>

            {/* Description */}
            {task.description && (
              <div className="task-description">
                <p>{task.description}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="detail-tabs">
              {['comments', 'activity'].map((tab) => (
                <button
                  key={tab}
                  className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'comments' ? (
                    <><MessageSquare size={14} /> Comments ({task.comments?.length || 0})</>
                  ) : (
                    <><Clock size={14} /> Activity ({task.activity?.length || 0})</>
                  )}
                </button>
              ))}
            </div>

            {/* Comments */}
            {activeTab === 'comments' && (
              <div className="comments-section">
                {(task.comments || []).length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  <div className="comment-list">
                    {task.comments.map((c) => {
                      const author = members.find((m) => m.id === c.authorId);
                      return (
                        <div key={c.id} className="comment-item">
                          <Avatar name={author?.name} color={author?.color} size="sm" />
                          <div className="comment-body">
                            <div className="comment-header">
                              <strong>{author?.name || 'Unknown'}</strong>
                              <span className="comment-time">{formatTimeAgo(c.createdAt)}</span>
                            </div>
                            <p className="comment-text">{c.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Comment input */}
                <div className="comment-input-row">
                  <Avatar name={currentUser.name} color={currentUser.color} size="sm" />
                  <div className="comment-input-wrap">
                    <textarea
                      className="comment-input"
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleCommentSubmit(); }}
                    />
                    <div className="comment-input-footer">
                      <span className="comment-hint">Ctrl+Enter to submit</span>
                      <Button variant="primary" size="sm" onClick={handleCommentSubmit} disabled={!comment.trim()}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity */}
            {activeTab === 'activity' && (
              <div className="activity-timeline">
                {(task.activity || []).slice().reverse().map((ev, i) => {
                  const user = members.find((m) => m.id === ev.userId);
                  const ActivityIcon = {
                    created: GitCommit,
                    assigned: UserCheck,
                    status_changed: RefreshCw,
                    priority_changed: CheckSquare,
                  }[ev.type] || Pin;

                  return (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot">
                        <ActivityIcon size={12} color="#fff" />
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-user">{user?.name || 'System'}</span>
                        {' · '}{ev.detail}
                        <span className="timeline-time">{formatTimeAgo(ev.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar details */}
        <div className="task-details-sidebar">
          <div className="card details-panel">
            <div className="details-panel-header">Details</div>

            <div className="detail-field">
              <div className="detail-label"><User size={13} /> Assignee</div>
              {assignee ? (
                <div className="detail-member">
                  <Avatar name={assignee.name} color={assignee.color} size="sm" />
                  <span>{assignee.name}</span>
                </div>
              ) : <span className="detail-value-muted">Unassigned</span>}
            </div>

            <div className="detail-field">
              <div className="detail-label"><User size={13} /> Reporter</div>
              {reporter ? (
                <div className="detail-member">
                  <Avatar name={reporter.name} color={reporter.color} size="sm" />
                  <span>{reporter.name}</span>
                </div>
              ) : <span className="detail-value-muted">—</span>}
            </div>

            <div className="detail-field">
              <div className="detail-label"><Folder size={13} /> Project</div>
              {project ? (
                <div
                  className="detail-project"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="detail-project-icon" style={{ background: project.color + '18', color: project.color }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{project.name.slice(0, 2).toUpperCase()}</span>
                  </span>
                  <span>{project.name}</span>
                </div>
              ) : <span className="detail-value-muted">—</span>}
            </div>

            <div className="detail-field">
              <div className="detail-label"><Calendar size={13} /> Due Date</div>
              <span className={`detail-value ${dueSt === 'overdue' ? 'overdue-text' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>

            <div className="detail-field">
              <div className="detail-label"><Calendar size={13} /> Created</div>
              <span className="detail-value">{formatDate(task.createdAt)}</span>
            </div>

            <div className="detail-field">
              <div className="detail-label"><Tag size={13} /> Tags</div>
              <div className="tag-list">
                {(task.tags || []).length === 0 ? (
                  <span className="detail-value-muted">No tags</span>
                ) : (
                  task.tags.map((tag) => (
                    <span key={tag} className="task-tag">{tag}</span>
                  ))
                )}
              </div>
            </div>

            <div className="detail-field">
              <div className="detail-label"><MessageSquare size={13} /> Comments</div>
              <span className="detail-value">{task.comments?.length || 0}</span>
            </div>
          </div>

          {/* Quick status change */}
          <div className="card details-panel">
            <div className="details-panel-header">Change Status</div>
            <div className="quick-status-list">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`quick-status-btn ${task.status === s ? 'active' : ''}`}
                  onClick={() => updateTaskStatus(task.id, s)}
                >
                  <StatusBadge status={s} />
                  {task.status === s && <span className="status-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Task" size="lg">
        <TaskForm onClose={() => setEditOpen(false)} initialTask={task} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { deleteTask(task.id); navigate('/tasks'); }}
        title="Delete Task?"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
