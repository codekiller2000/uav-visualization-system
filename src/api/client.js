// ============================================================
// 前端统一 API 封装：所有数据查询均通过后端 HTTP 接口获取
// ============================================================
const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (json.code !== 0) {
    throw new Error(json.message || '请求失败')
  }
  return json.data
}

export const api = {
  // 认证
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),

  // 场景
  getScenarios: () => request('/scenarios'),
  getScenario: (id) => request(`/scenarios/${id}`),

  // 实验
  getExperiments: (page = 1, pageSize = 10) => request(`/experiments?page=${page}&pageSize=${pageSize}`),
  getExperiment: (id) => request(`/experiments/${id}`),
  submitExperiment: (scenarioId, params, userId) =>
    request('/experiments', { method: 'POST', body: JSON.stringify({ scenarioId, params, userId }) }),

  // 后台管理
  getResourceMonitor: () => request('/admin/resource-monitor'),
  refreshResourceMonitor: () => request('/admin/resource-monitor/refresh', { method: 'POST' }),

  getPermissions: () => request('/admin/permissions'),
  savePermissions: (perms) => request('/admin/permissions', { method: 'POST', body: JSON.stringify({ perms }) }),

  getConfigs: () => request('/admin/configs'),
  addConfig: (data) => request('/admin/configs', { method: 'POST', body: JSON.stringify(data) }),
  updateConfig: (id, data) => request(`/admin/configs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteConfig: (id) => request(`/admin/configs/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/admin/users'),
  toggleUserStatus: (id) => request(`/admin/users/${id}/status`, { method: 'PATCH' }),
  resetUserPassword: (id) => request(`/admin/users/${id}/reset-password`, { method: 'POST' }),
}

export default api
