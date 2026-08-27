import React from 'react';
import './common.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children && <span>{children}</span>}
          {iconRight && <span className="btn-icon btn-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export function Avatar({ name, color, size = 'md', src }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const sizes = { sm: 28, md: 36, lg: 44, xl: 64 };
  const px = sizes[size] || 36;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar avatar-${size}`}
        style={{ width: px, height: px, borderRadius: '50%' }}
      />
    );
  }

  return (
    <div
      className={`avatar avatar-${size}`}
      style={{
        width: px,
        height: px,
        background: color || '#6366f1',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px * 0.36,
        fontWeight: 600,
        color: '#fff',
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      {initials}
    </div>
  );
}

export function Badge({ children, variant = 'default', size = 'md', dot = false }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    TODO: { label: 'To Do', cls: 'status-todo' },
    IN_PROGRESS: { label: 'In Progress', cls: 'status-inprogress' },
    IN_REVIEW: { label: 'In Review', cls: 'status-inreview' },
    COMPLETED: { label: 'Completed', cls: 'status-completed' },
    BLOCKED: { label: 'Blocked', cls: 'status-blocked' },
  };
  const info = map[status] || { label: status, cls: 'status-todo' };
  return <span className={`status-badge ${info.cls}`}>{info.label}</span>;
}

export function PriorityBadge({ priority }) {
  const map = {
    LOW: { label: 'LOW', cls: 'priority-low' },
    MEDIUM: { label: 'MEDIUM', cls: 'priority-medium' },
    HIGH: { label: 'HIGH', cls: 'priority-high' },
    URGENT: { label: 'URGENT', cls: 'priority-urgent' },
  };
  const info = map[priority] || { label: priority, cls: 'priority-medium' };
  return <span className={`priority-badge ${info.cls}`}>{info.label}</span>;
}

export function ProgressBar({ value = 0, height = 6, color }) {
  return (
    <div className="progress-track" style={{ height }}>
      <div
        className="progress-fill"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color || 'var(--brand-primary)',
          height: '100%',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

export function Loader({ size = 24, color }) {
  return (
    <div
      className="loader"
      style={{
        width: size,
        height: size,
        borderColor: `${color || 'var(--brand-primary)'} transparent transparent transparent`,
      }}
    />
  );
}

export function Skeleton({ width, height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width: width || '100%', height, borderRadius: 6, ...style }}
    />
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ color: '#ef4444' }}>
        <AlertTriangle size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function Input({
  label,
  error,
  icon,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className={`input-wrapper ${icon ? 'has-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input className={`form-input ${error ? 'input-error' : ''} ${inputClassName}`} {...props} />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <textarea className={`form-textarea ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <select className={`form-select ${error ? 'input-error' : ''}`} {...props}>
        {children}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
