import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Check,
  Pin, MessageSquare, RefreshCw, CheckSquare, Clock, Target, Megaphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Avatar } from '../components/common';
import { formatTimeAgo } from '../utils/dateUtils';
import './Notifications.css';

// Lucide icons per notification type — no emojis
const TYPE_ICONS = {
  task_assigned:      Pin,
  comment:            MessageSquare,
  status_changed:     RefreshCw,
  task_completed:     CheckSquare,
  deadline_reminder:  Clock,
  project_milestone:  Target,
};

export default function Notifications() {
  const { notifications, members, dispatch, unreadCount } = useApp();
  const navigate = useNavigate();

  const today = notifications.filter((n) => {
    const d = new Date(n.createdAt);
    return d.toDateString() === new Date().toDateString();
  });

  const earlier = notifications.filter((n) => {
    const d = new Date(n.createdAt);
    return d.toDateString() !== new Date().toDateString();
  });

  const NotifItem = ({ notif }) => {
    const user = notif.userId ? members.find((m) => m.id === notif.userId) : null;
    const IconComponent = TYPE_ICONS[notif.type] || Megaphone;

    return (
      <div
        className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
        onClick={() => {
          dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
          if (notif.taskId) navigate(`/tasks/${notif.taskId}`);
          else if (notif.projectId) navigate(`/projects/${notif.projectId}`);
        }}
      >
        <div className="notif-avatar">
          {user ? (
            <Avatar name={user.name} color={user.color} size="md" />
          ) : (
            <div className="notif-icon">
              <IconComponent size={16} />
            </div>
          )}
        </div>
        <div className="notif-content">
          <p className="notif-message">{notif.message}</p>
          <p className="notif-time">{formatTimeAgo(notif.createdAt)}</p>
        </div>
        {!notif.isRead && <span className="notif-unread-dot" />}
      </div>
    );
  };

  return (
    <div className="notifications-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Check size={14} />}
            onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="notif-list-wrap">
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Bell size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>You're all caught up!</p>
          </div>
        ) : (
          <>
            {today.length > 0 && (
              <div className="notif-group">
                <h3 className="notif-group-label">Today</h3>
                <div className="card notif-card">
                  {today.map((n) => <NotifItem key={n.id} notif={n} />)}
                </div>
              </div>
            )}
            {earlier.length > 0 && (
              <div className="notif-group">
                <h3 className="notif-group-label">Earlier</h3>
                <div className="card notif-card">
                  {earlier.map((n) => <NotifItem key={n.id} notif={n} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
