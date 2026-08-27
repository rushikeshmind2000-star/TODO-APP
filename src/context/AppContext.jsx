import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { TASKS, PROJECTS, MEMBERS, NOTIFICATIONS, CURRENT_USER } from '../constants/mockData';

const AppContext = createContext(null);

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const initialState = {
  currentUser: getSavedUser(),
  theme: localStorage.getItem('theme') || 'light',
  notifications: NOTIFICATIONS,
  tasks: TASKS,
  projects: PROJECTS,
  members: MEMBERS,
  toasts: [],
  sidebarOpen: window.innerWidth > 768,
  searchQuery: '',
  filters: {
    status: 'ALL',
    priority: 'ALL',
    projectId: 'ALL',
    assigneeId: 'ALL',
    dueDate: 'ALL',
  },
};

let toastId = 0;

function reducer(state, action) {
  switch (action.type) {
    // ── Auth ────────────────────────────────────────────────────────────────
    case 'LOGIN':
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('currentUser');
      return { ...state, currentUser: null };

    // ── Theme ───────────────────────────────────────────────────────────────
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };

    // ── Sidebar ─────────────────────────────────────────────────────────────
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    // ── Search ──────────────────────────────────────────────────────────────
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    // ── Filters ─────────────────────────────────────────────────────────────
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: { status: 'ALL', priority: 'ALL', projectId: 'ALL', assigneeId: 'ALL', dueDate: 'ALL' },
      };

    // ── Tasks ────────────────────────────────────────────────────────────────
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'UPDATE_TASK_STATUS': {
      const { taskId, status, userId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const activity = [
            ...(t.activity || []),
            {
              type: 'status_changed',
              userId,
              timestamp: new Date().toISOString(),
              detail: `${t.status} → ${status}`,
            },
          ];
          return { ...t, status, activity };
        }),
      };
    }
    case 'ADD_COMMENT': {
      const { taskId, comment } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, comments: [...(t.comments || []), comment] };
        }),
      };
    }

    // ── Projects ─────────────────────────────────────────────────────────────
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };

    // ── Notifications ─────────────────────────────────────────────────────────
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };

    // ── Toasts ────────────────────────────────────────────────────────────────
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: `TASK-${1000 + Math.floor(Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
      activity: [
        {
          type: 'created',
          userId: state.currentUser?.id,
          timestamp: new Date().toISOString(),
          detail: 'Created this task',
        },
      ],
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    showToast('Task created successfully');
    return newTask;
  }, [state.currentUser?.id, showToast]);

  const updateTask = useCallback((task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    showToast('Task updated successfully');
  }, [showToast]);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    showToast('Task deleted');
  }, [showToast]);

  const updateTaskStatus = useCallback((taskId, status) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status, userId: state.currentUser?.id } });
    showToast(`Status updated to ${status.replace('_', ' ')}`);
  }, [state.currentUser?.id, showToast]);

  const addComment = useCallback((taskId, text) => {
    const comment = {
      id: `c-${Date.now()}`,
      authorId: state.currentUser?.id,
      text,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: { taskId, comment } });
  }, [state.currentUser?.id]);

  const addProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      memberIds: [state.currentUser?.id],
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    showToast('Project created successfully');
    return newProject;
  }, [state.currentUser?.id, showToast]);

  const value = {
    ...state,
    dispatch,
    showToast,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addComment,
    addProject,
    unreadCount: state.notifications.filter((n) => !n.isRead).length,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
