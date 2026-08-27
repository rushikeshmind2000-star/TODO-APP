import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, GripVertical, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, Avatar } from '../common';
import { formatShortDate, getDueDateStatus } from '../../utils/dateUtils';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: '#64748b' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#3b82f6' },
  { id: 'IN_REVIEW', label: 'In Review', color: '#a855f7' },
  { id: 'COMPLETED', label: 'Completed', color: '#22c55e' },
  { id: 'BLOCKED', label: 'Blocked', color: '#ef4444' },
];

export default function KanbanBoard({ tasks }) {
  const { members, updateTaskStatus } = useApp();
  const navigate = useNavigate();
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const getMember = (id) => members.find((m) => m.id === id);

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (task) => setDraggedTask(task);
  const handleDragOver = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };
  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== colId) {
      updateTaskStatus(draggedTask.id, colId);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.id);
        return (
          <div
            key={col.id}
            className={`kanban-col ${dragOverColumn === col.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragLeave={() => setDragOverColumn(null)}
          >
            {/* Column Header */}
            <div className="kanban-col-header">
              <div className="kanban-col-title">
                <span className="kanban-col-dot" style={{ background: col.color }} />
                <span>{col.label}</span>
                <span className="kanban-col-count">{colTasks.length}</span>
              </div>
              <button className="kanban-col-menu">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Cards */}
            <div className="kanban-cards">
              {colTasks.map((task) => {
                const assignee = getMember(task.assigneeId);
                const dueSt = getDueDateStatus(task.dueDate);
                return (
                  <div
                    key={task.id}
                    className={`kanban-card ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={() => { setDraggedTask(null); setDragOverColumn(null); }}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="kanban-card-header">
                      <span className="kanban-task-id">{task.id}</span>
                      <button className="kanban-card-menu" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>

                    <p className="kanban-card-title">{task.title}</p>

                    <div className="kanban-card-tags">
                      {(task.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="task-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="kanban-card-footer">
                      <PriorityBadge priority={task.priority} />
                      <div className="kanban-card-meta">
                        {assignee && (
                          <Avatar name={assignee.name} color={assignee.color} size="sm" />
                        )}
                        {task.dueDate && (
                          <span className={`kanban-due ${dueSt === 'overdue' ? 'overdue' : dueSt === 'today' ? 'today' : ''}`}>
                            <Calendar size={10} style={{ marginRight: 4, display: 'inline' }} />
                            {formatShortDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="kanban-empty">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
