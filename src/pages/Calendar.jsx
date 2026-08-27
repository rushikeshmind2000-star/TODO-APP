import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PartyPopper, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PriorityBadge } from '../components/common';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO, addMonths, subMonths } from 'date-fns';
import './Calendar.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRIORITY_COLORS = { URGENT: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#22c55e' };

export default function Calendar() {
  const { tasks, projects } = useApp();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startPad = monthStart.getDay();
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (day) =>
    tasks.filter((t) => {
      if (!t.dueDate) return false;
      try { return isSameDay(parseISO(t.dueDate), day); } catch { return false; }
    });

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className="calendar-page fade-in">
      <div className="calendar-layout">
        {/* Calendar panel */}
        <div className="card calendar-card">
          {/* Header */}
          <div className="calendar-header">
            <button className="cal-nav-btn" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft size={16} />
            </button>
            <h2 className="cal-month-title">{format(currentDate, 'MMMM yyyy')}</h2>
            <button className="cal-nav-btn" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight size={16} />
            </button>
            <button className="cal-today-btn" onClick={() => { setCurrentDate(new Date()); setSelectedDay(new Date()); }}>
              Today
            </button>
          </div>

          {/* Day labels */}
          <div className="cal-weekdays">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="cal-grid">
            {/* Padding cells */}
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="cal-cell cal-cell-empty" />
            ))}

            {days.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <div
                  key={day.toString()}
                  className={`cal-cell ${isToday(day) ? 'cal-today' : ''} ${isSelected ? 'cal-selected' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="cal-day-num">{format(day, 'd')}</span>
                  <div className="cal-task-chips">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className="cal-task-chip"
                        style={{ background: PRIORITY_COLORS[t.priority] + '22', color: PRIORITY_COLORS[t.priority] }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${t.id}`); }}
                        title={t.title}
                      >
                        {t.title.slice(0, 18)}{t.title.length > 18 ? '…' : ''}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="cal-more-chip">+{dayTasks.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="calendar-side">
          {selectedDay ? (
            <div className="card cal-side-card">
              <div className="card-header">
                <div>
                  <p className="cal-side-date-label">Selected Date</p>
                  <h3 className="cal-side-date">{format(selectedDay, 'EEEE, MMMM d')}</h3>
                </div>
                <span className="cal-side-count">{selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="cal-side-tasks">
                {selectedDayTasks.length === 0 ? (
                  <div className="cal-no-tasks">
                    <PartyPopper size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <p>No tasks due on this day!</p>
                  </div>
                ) : (
                  selectedDayTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <div
                        key={task.id}
                        className="cal-task-item"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className="cal-task-priority-bar" style={{ background: PRIORITY_COLORS[task.priority] }} />
                        <div className="cal-task-info">
                          <p className="cal-task-title">{task.title}</p>
                          <p className="cal-task-project">{project?.name}</p>
                        </div>
                        <PriorityBadge priority={task.priority} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="card cal-side-card">
              <div className="cal-no-tasks" style={{ padding: '40px 20px' }}>
                <CalendarDays size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <p>Click on a day to see tasks</p>
              </div>
            </div>
          )}

          {/* Upcoming deadlines */}
          <div className="card cal-upcoming">
            <div className="card-header">
              <span className="section-title">All Upcoming Tasks</span>
            </div>
            <div className="cal-upcoming-list">
              {tasks
                .filter((t) => t.dueDate && t.status !== 'COMPLETED')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 8)
                .map((t) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  return (
                    <div
                      key={t.id}
                      className="upcoming-item"
                      onClick={() => navigate(`/tasks/${t.id}`)}
                    >
                      <div className="upcoming-dot" style={{ background: PRIORITY_COLORS[t.priority] }} />
                      <div className="upcoming-info">
                        <p className="upcoming-title">{t.title}</p>
                        <p className="upcoming-meta">{format(parseISO(t.dueDate), 'MMM d')} · {project?.name}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
