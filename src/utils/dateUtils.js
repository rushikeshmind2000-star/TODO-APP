import { format, isToday, isTomorrow, isPast, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM dd');
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy \'at\' h:mm a');
  } catch {
    return dateStr;
  }
};

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return format(date, 'MMM dd');
  } catch {
    return '';
  }
};

export const getDueDateStatus = (dateStr) => {
  if (!dateStr) return 'normal';
  try {
    const date = parseISO(dateStr);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    const daysLeft = differenceInDays(date, new Date());
    if (daysLeft <= 3) return 'soon';
    return 'normal';
  } catch {
    return 'normal';
  }
};

export const formatDueDateLabel = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  } catch {
    return dateStr;
  }
};

export const getDayOfMonth = (dateStr) => {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), 'd');
  } catch {
    return null;
  }
};

export const getMonthName = (dateStr) => {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), 'MMM');
  } catch {
    return null;
  }
};
