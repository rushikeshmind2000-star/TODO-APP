export const TASK_STATUSES = {
  TODO: { label: 'To Do', color: '#64748b', bg: '#1e293b' },
  IN_PROGRESS: { label: 'In Progress', color: '#3b82f6', bg: '#1e3a5f' },
  IN_REVIEW: { label: 'In Review', color: '#a855f7', bg: '#2d1b69' },
  COMPLETED: { label: 'Completed', color: '#22c55e', bg: '#14532d' },
  BLOCKED: { label: 'Blocked', color: '#ef4444', bg: '#450a0a' },
};

export const TASK_PRIORITIES = {
  LOW: { label: 'Low', color: '#22c55e', icon: '🟢' },
  MEDIUM: { label: 'Medium', color: '#f59e0b', icon: '🟡' },
  HIGH: { label: 'High', color: '#f97316', icon: '🟠' },
  URGENT: { label: 'Urgent', color: '#ef4444', icon: '🔴' },
};

export const USER_ROLES = {
  DEVELOPER: 'Developer',
  TEAM_LEAD: 'Team Lead',
  PROJECT_MANAGER: 'Project Manager',
  DESIGNER: 'UI/UX Designer',
  QA: 'QA Engineer',
  ADMIN: 'Admin',
};

export const PROJECT_STATUSES = {
  ACTIVE: { label: 'Active', color: '#22c55e' },
  ON_HOLD: { label: 'On Hold', color: '#f59e0b' },
  COMPLETED: { label: 'Completed', color: '#3b82f6' },
  ARCHIVED: { label: 'Archived', color: '#64748b' },
};

export const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'];
