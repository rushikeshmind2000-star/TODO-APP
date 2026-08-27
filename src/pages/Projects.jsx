import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, ProgressBar, EmptyState } from '../components/common';
import Modal from '../components/common/Modal';
import { Input, Textarea } from '../components/common';
import './Projects.css';

const PROJECT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4'];

export default function Projects() {
  const { projects, tasks, addProject } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: PROJECT_COLORS[0], dueDate: '' });

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectTaskCount = (projId) => ({
    total: tasks.filter((t) => t.projectId === projId).length,
    completed: tasks.filter((t) => t.projectId === projId && t.status === 'COMPLETED').length,
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addProject({ ...form });
    setCreateOpen(false);
    setForm({ name: '', description: '', color: PROJECT_COLORS[0], dueDate: '' });
  };



  return (
    <div className="projects-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{filtered.length} projects</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="projects-search">
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          className="projects-search-input"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📁" title="No projects found" description="Create your first project to get started." />
      ) : (
        <div className="projects-grid">
          {filtered.map((proj) => {
            const counts = getProjectTaskCount(proj.id);
            return (
              <div
                key={proj.id}
                className="project-card card"
                onClick={() => navigate(`/projects/${proj.id}`)}
              >
                <div className="project-card-header">
                  <div 
                    className="project-icon" 
                    style={{ background: proj.color + '18', color: proj.color }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {proj.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className={`project-status-dot ${proj.status === 'ACTIVE' ? 'dot-active' : 'dot-hold'}`} />
                </div>

                <h3 className="project-card-name">{proj.name}</h3>
                <p className="project-card-desc">{proj.description}</p>

                <div className="project-card-progress">
                  <div className="project-progress-header">
                    <span>Progress</span>
                    <span style={{ color: proj.color, fontWeight: 700 }}>{proj.progress}%</span>
                  </div>
                  <ProgressBar value={proj.progress} color={proj.color} height={6} />
                </div>

                <div className="project-card-footer">
                  <div className="project-card-stat">
                    <span className="stat-number">{counts.total}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="project-card-stat">
                    <span className="stat-number">{counts.completed}</span>
                    <span className="stat-label">Done</span>
                  </div>
                  <div className="project-card-stat">
                    <span className="stat-number">{proj.memberIds?.length || 0}</span>
                    <span className="stat-label">Members</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Project"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create Project</Button>
          </>
        }
      >
        <form className="project-form">
          <Input
            label="Project Name *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. TechPulse CRM"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the project..."
          />
          <div className="form-field">
            <label className="form-label">Brand Color</label>
            <div className="color-picker">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          />
        </form>
      </Modal>
    </div>
  );
}
