import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertCircle size={16} />,
  info: <Info size={16} />,
};

export default function ToastContainer() {
  const { toasts, dispatch } = useApp();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} slide-in-right`}>
          <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-dismiss"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
