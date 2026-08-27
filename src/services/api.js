// API service layer — API-ready structure.
// Replace mock implementations with real fetch calls when backend is available.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Generic fetch wrapper (ready for real backend)
async function request(method, path, body) {
  // When backend is ready, uncomment below:
  // const res = await fetch(`${BASE_URL}${path}`, {
  //   method,
  //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  //   body: body ? JSON.stringify(body) : undefined,
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();
  await delay(300); // simulate network
  return null;
}

export const TaskService = {
  getAll: () => request('GET', '/tasks'),
  getById: (id) => request('GET', `/tasks/${id}`),
  create: (task) => request('POST', '/tasks', task),
  update: (id, task) => request('PUT', `/tasks/${id}`, task),
  delete: (id) => request('DELETE', `/tasks/${id}`),
  updateStatus: (id, status) => request('PATCH', `/tasks/${id}/status`, { status }),
  addComment: (id, comment) => request('POST', `/tasks/${id}/comments`, comment),
};

export const ProjectService = {
  getAll: () => request('GET', '/projects'),
  getById: (id) => request('GET', `/projects/${id}`),
  create: (project) => request('POST', '/projects', project),
  update: (id, project) => request('PUT', `/projects/${id}`, project),
  delete: (id) => request('DELETE', `/projects/${id}`),
};

export const UserService = {
  getProfile: () => request('GET', '/users/me'),
  getAll: () => request('GET', '/users'),
  update: (id, data) => request('PUT', `/users/${id}`, data),
};

export const NotificationService = {
  getAll: () => request('GET', '/notifications'),
  markRead: (id) => request('PATCH', `/notifications/${id}/read`),
  markAllRead: () => request('PATCH', '/notifications/read-all'),
};

export const AuthService = {
  login: (credentials) => request('POST', '/auth/login', credentials),
  logout: () => request('POST', '/auth/logout'),
  refresh: () => request('POST', '/auth/refresh'),
};
