export const filterTasks = (tasks, filters, searchQuery) => {
  let result = [...tasks];

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.priority && filters.priority !== 'ALL') {
    result = result.filter((t) => t.priority === filters.priority);
  }

  if (filters.projectId && filters.projectId !== 'ALL') {
    result = result.filter((t) => t.projectId === filters.projectId);
  }

  if (filters.assigneeId && filters.assigneeId !== 'ALL') {
    result = result.filter((t) => t.assigneeId === filters.assigneeId);
  }

  if (filters.dueDate === 'THIS_WEEK') {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    result = result.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= now && d <= endOfWeek;
    });
  } else if (filters.dueDate === 'OVERDUE') {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    result = result.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < now;
    });
  }

  return result;
};

export const sortTasks = (tasks, sortBy = 'dueDate', direction = 'asc') => {
  return [...tasks].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'priority') {
      const order = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      valA = order[a.priority] ?? 99;
      valB = order[b.priority] ?? 99;
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getTaskStats = (tasks, userId = null) => {
  const filtered = userId ? tasks.filter((t) => t.assigneeId === userId) : tasks;
  return {
    total: filtered.length,
    inProgress: filtered.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: filtered.filter((t) => t.status === 'COMPLETED').length,
    overdue: filtered.filter((t) => {
      if (!t.dueDate || t.status === 'COMPLETED') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
    todo: filtered.filter((t) => t.status === 'TODO').length,
    inReview: filtered.filter((t) => t.status === 'IN_REVIEW').length,
    blocked: filtered.filter((t) => t.status === 'BLOCKED').length,
  };
};
