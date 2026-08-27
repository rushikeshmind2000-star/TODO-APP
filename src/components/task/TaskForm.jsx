import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Input, Textarea, Select } from '../common';
import { X } from 'lucide-react';
import './TaskForm.css';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'];

export default function TaskForm({ onClose, onSuccess, initialTask }) {
  const { projects, members, currentUser, addTask, updateTask } = useApp();
  const isEdit = !!initialTask;

  const [form, setForm] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    status: initialTask?.status || 'TODO',
    priority: initialTask?.priority || 'MEDIUM',
    projectId: initialTask?.projectId || (projects[0]?.id || ''),
    assigneeId: initialTask?.assigneeId || currentUser.id,
    dueDate: initialTask?.dueDate || '',
    tags: initialTask?.tags?.join(', ') || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.projectId) e.projectId = 'Project is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const taskData = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        reporterId: currentUser.id,
      };
      if (isEdit) {
        updateTask({ ...initialTask, ...taskData });
      } else {
        addTask(taskData);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <Input
        label="Task Title *"
        placeholder="e.g. Fix authentication issue"
        value={form.title}
        onChange={set('title')}
        error={errors.title}
      />

      <Textarea
        label="Description"
        placeholder="Describe the task in detail..."
        value={form.description}
        onChange={set('description')}
        style={{ minHeight: 100 }}
      />

      <div className="form-row">
        <Select label="Project *" value={form.projectId} onChange={set('projectId')} error={errors.projectId}>
          <option value="">Select project...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>

        <Select label="Assignee" value={form.assigneeId} onChange={set('assigneeId')}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </Select>
      </div>

      <div className="form-row">
        <Select label="Priority" value={form.priority} onChange={set('priority')}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>

        <Select label="Status" value={form.status} onChange={set('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </Select>
      </div>

      <div className="form-row">
        <Input
          label="Due Date *"
          type="date"
          value={form.dueDate}
          onChange={set('dueDate')}
          error={errors.dueDate}
        />
        <Input
          label="Tags (comma separated)"
          placeholder="react, bug, auth"
          value={form.tags}
          onChange={set('tags')}
        />
      </div>

      {/* Tags preview */}
      {form.tags && (
        <div className="tag-preview">
          {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
            <span key={tag} className="task-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="task-form-footer">
        <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit" loading={loading}>
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
