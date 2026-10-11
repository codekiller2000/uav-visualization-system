// ============================================================
// 无人机辅助物联网数据收集可视化系统 - 后端服务 (Express + SQLite)
// 简单实现：数据查询走真实数据库，算法计算部分仅提供预留接口（未实现）
// ============================================================
const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

const ok = (res, data) => res.json({ code: 0, data })
const fail = (res, status, message) => res.status(status).json({ code: status, message })

// ------------------------------------------------------------
// 鉴权（简单实现：不做 token，仅校验用户名密码，前端自行保存登录态）
// ------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  const user = db.prepare('SELECT id, username, role, status, created_at as createdAt FROM users WHERE username = ? AND password = ?').get(username, password)
  if (!user) return fail(res, 401, '用户名或密码错误')
  if (user.status !== 'active') return fail(res, 403, '账号已被禁用')
  ok(res, user)
})

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || username.length < 3) return fail(res, 400, '用户名长度至少3个字符')
  if (!password || password.length < 6) return fail(res, 400, '密码长度至少6个字符')
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) return fail(res, 400, '用户名已存在')
  const info = db.prepare(
    `INSERT INTO users (username, password, role, status, created_at) VALUES (?, ?, 'user', 'active', datetime('now'))`
  ).run(username, password)
  db.prepare(
    `INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3)
     VALUES (?, 1, 1, 1, 1, 1, 1)`
  ).run(info.lastInsertRowid)
  ok(res, { id: info.lastInsertRowid, username })
})

// ------------------------------------------------------------
// 场景
// ------------------------------------------------------------
app.get('/api/scenarios', (req, res) => {
  const scenarios = db.prepare('SELECT * FROM scenarios ORDER BY id').all()
  const params = db.prepare('SELECT * FROM scenario_parameters ORDER BY scenario_id, sort_order').all()
  const result = scenarios.map(s => ({
    id: s.id,
    name: s.name,
    title: s.title,
    description: s.description,
    optimizationGoal: s.optimization_goal,
    type: s.type,
    parameters: params.filter(p => p.scenario_id === s.id).map(p => ({
      name: p.name,
      label: p.label,
      type: p.type,
      default: p.type === 'number' ? Number(p.default_value) : p.default_value,
      min: p.min_value,
      max: p.max_value,
      options: p.options_json ? JSON.parse(p.options_json) : undefined,
    }))
  }))
  ok(res, result)
})

app.get('/api/scenarios/:id', (req, res) => {
  const id = Number(req.params.id)
  const s = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id)
  if (!s) return fail(res, 404, '场景不存在')
  const params = db.prepare('SELECT * FROM scenario_parameters WHERE scenario_id = ? ORDER BY sort_order').all(id)
  ok(res, {
    id: s.id,
    name: s.name,
    title: s.title,
    description: s.description,
    optimizationGoal: s.optimization_goal,
    type: s.type,
    parameters: params.map(p => ({
      name: p.name,
      label: p.label,
      type: p.type,
      default: p.type === 'number' ? Number(p.default_value) : p.default_value,
      min: p.min_value,
      max: p.max_value,
      options: p.options_json ? JSON.parse(p.options_json) : undefined,
    }))
  })
})

// ------------------------------------------------------------
// 实验提交 —— 真正的算法计算部分暂未实现，这里只落库 pending 记录，
// 并调用预留的算法接口占位函数 (见 ./algorithm.js)
// ------------------------------------------------------------
const { runAlgorithm } = require('./algorithm')

app.post('/api/experiments', (req, res) => {
  const { scenarioId, params, userId } = req.body || {}
  const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(scenarioId)
  if (!scenario) return fail(res, 400, '场景不存在')

  const configuration = Object.entries(params || {}).map(([k, v]) => `${k}=${v}`).join(', ')
  const info = db.prepare(
    `INSERT INTO experiments (scenario_id, scenario_name, configuration, description, status, created_at, user_id, params_json)
     VALUES (?, ?, ?, ?, 'running', datetime('now'), ?, ?)`
  ).run(scenarioId, scenario.name, configuration, `${scenario.title} - 用户提交实验`, userId || null, JSON.stringify(params || {}))

  // 调用算法占位接口（未实现真实算法，立即返回"未实现"信息，不阻塞实验创建）
  runAlgorithm({ scenarioId, params }).catch(() => {})

  ok(res, { id: info.lastInsertRowid, status: 'running' })
})

app.get('/api/experiments', (req, res) => {
  const page = Number(req.query.page || 1)
  const pageSize = Number(req.query.pageSize || 10)
  const total = db.prepare('SELECT COUNT(*) as c FROM experiments').get().c
  const rows = db.prepare('SELECT * FROM experiments ORDER BY id LIMIT ? OFFSET ?').all(pageSize, (page - 1) * pageSize)
  const images = db.prepare('SELECT * FROM experiment_images ORDER BY sort_order').all()
  const list = rows.map(e => ({
    id: e.id,
    scenarioId: e.scenario_id,
    scenarioName: e.scenario_name,
    configuration: e.configuration,
    description: e.description,
    status: e.status,
    createdAt: e.created_at,
    userId: e.user_id,
    resultImages: images.filter(i => i.experiment_id === e.id).map(i => i.url),
  }))
  ok(res, { list, total, page, pageSize })
})

app.get('/api/experiments/:id', (req, res) => {
  const id = Number(req.params.id)
  const e = db.prepare('SELECT * FROM experiments WHERE id = ?').get(id)
  if (!e) return fail(res, 404, '实验不存在')

  const images = db.prepare('SELECT url FROM experiment_images WHERE experiment_id = ? ORDER BY sort_order').all(id).map(r => r.url)
  const charts = db.prepare('SELECT chart_url FROM experiment_charts WHERE experiment_id = ? ORDER BY sort_order').all(id).map(r => r.chart_url)

  const singleResults = db.prepare('SELECT * FROM single_objective_results WHERE experiment_id = ?').all(id).map(r => ({
    algorithm: r.algorithm,
    sensorNum: r.sensor_num,
    avgAoI: r.avg_aoi,
    totalEnergy: r.total_energy,
    flightTime: r.flight_time,
    resourceEfficiency: r.resource_efficiency,
  }))

  const paretoRows = db.prepare('SELECT * FROM pareto_solutions WHERE experiment_id = ? ORDER BY solution_num').all(id)
  const paretoSolutions = paretoRows.map(r => ({
    id: r.id,
    solutionNum: r.solution_num,
    coverageSensors: r.coverage_sensors,
    dataValue: r.data_value,
    strategy: r.strategy,
    description: r.description,
    detailConfig: {
      sensorNum: r.sensor_num,
      uavNum: r.uav_num,
      energyUsed: r.energy_used,
      flightTime: r.flight_time,
      avgDataValue: r.avg_data_value,
      visitSequence: JSON.parse(r.visit_sequence_json || '[]'),
    }
  }))

  ok(res, {
    experiment: {
      id: e.id,
      scenarioId: e.scenario_id,
      scenarioName: e.scenario_name,
      configuration: e.configuration,
      description: e.description,
      status: e.status,
      createdAt: e.created_at,
      userId: e.user_id,
      resultImages: images,
    },
    charts,
    singleObjectiveResults: singleResults.length ? { experimentId: id, scenarioType: 'single-objective', results: singleResults } : null,
    paretoSolutions: paretoSolutions.length ? { experimentId: id, scenarioType: 'multi-objective', solutions: paretoSolutions } : null,
  })
})

// ------------------------------------------------------------
// 后台管理
// ------------------------------------------------------------
app.get('/api/admin/resource-monitor', (req, res) => {
  ok(res, db.prepare('SELECT * FROM resource_monitor ORDER BY id').all().map(r => ({
    id: r.id, metric: r.metric, value: r.value, unit: r.unit, status: r.status, updatedAt: r.updated_at
  })))
})

app.post('/api/admin/resource-monitor/refresh', (req, res) => {
  const rows = db.prepare('SELECT * FROM resource_monitor').all()
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const stmt = db.prepare('UPDATE resource_monitor SET value = ?, updated_at = ? WHERE id = ?')
  const updated = rows.map(r => {
    const value = (r.unit === '%' || r.unit === 'ms')
      ? +(r.value * (0.92 + Math.random() * 0.16)).toFixed(1)
      : r.value + Math.floor(Math.random() * 3)
    stmt.run(value, now, r.id)
    return { id: r.id, metric: r.metric, value, unit: r.unit, status: r.status, updatedAt: now }
  })
  ok(res, updated)
})

app.get('/api/admin/permissions', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id as userId, u.username, p.can_view_results as canViewResults, p.can_config_scenario as canConfigScenario,
           p.can_modify_params as canModifyParams, p.can_access_scene1 as canAccessScene1,
           p.can_access_scene2 as canAccessScene2, p.can_access_scene3 as canAccessScene3
    FROM users u LEFT JOIN user_permissions p ON p.user_id = u.id
    WHERE u.role != 'admin'
    ORDER BY u.id
  `).all()
  ok(res, rows.map(r => ({ ...r, canViewResults: !!r.canViewResults, canConfigScenario: !!r.canConfigScenario, canModifyParams: !!r.canModifyParams, canAccessScene1: !!r.canAccessScene1, canAccessScene2: !!r.canAccessScene2, canAccessScene3: !!r.canAccessScene3 })))
})

app.post('/api/admin/permissions', (req, res) => {
  const { perms } = req.body || {} // perms: [{userId, canViewResults, ...}]
  const upsert = db.prepare(`
    INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3)
    VALUES (@userId, @canViewResults, @canConfigScenario, @canModifyParams, @canAccessScene1, @canAccessScene2, @canAccessScene3)
    ON CONFLICT(user_id) DO UPDATE SET
      can_view_results=excluded.can_view_results, can_config_scenario=excluded.can_config_scenario,
      can_modify_params=excluded.can_modify_params, can_access_scene1=excluded.can_access_scene1,
      can_access_scene2=excluded.can_access_scene2, can_access_scene3=excluded.can_access_scene3
  `)
  const tx = db.transaction((list) => {
    for (const p of list) {
      upsert.run({
        userId: p.userId,
        canViewResults: p.canViewResults ? 1 : 0,
        canConfigScenario: p.canConfigScenario ? 1 : 0,
        canModifyParams: p.canModifyParams ? 1 : 0,
        canAccessScene1: p.canAccessScene1 ? 1 : 0,
        canAccessScene2: p.canAccessScene2 ? 1 : 0,
        canAccessScene3: p.canAccessScene3 ? 1 : 0,
      })
    }
  })
  tx(perms || [])
  ok(res, { saved: true })
})

app.get('/api/admin/configs', (req, res) => {
  ok(res, db.prepare('SELECT * FROM db_experiment_configs ORDER BY id').all().map(r => ({
    id: r.id, scenarioId: r.scenario_id, scenarioName: r.scenario_name, sensorNum: r.sensor_num,
    uavNum: r.uav_num, energyConstraint: r.energy_constraint, algorithm: r.algorithm, createdAt: r.created_at,
  })))
})

app.post('/api/admin/configs', (req, res) => {
  const { scenarioName, sensorNum, uavNum, energyConstraint, algorithm } = req.body || {}
  const scenarioMap = { '信息年龄优化': 1, '能量效率优化': 2, '资源利用优化': 3 }
  const info = db.prepare(
    `INSERT INTO db_experiment_configs (scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at)
     VALUES (?, ?, ?, ?, ?, ?, date('now'))`
  ).run(scenarioMap[scenarioName] || null, scenarioName, sensorNum, uavNum, energyConstraint, algorithm)
  ok(res, { id: info.lastInsertRowid })
})

app.put('/api/admin/configs/:id', (req, res) => {
  const id = Number(req.params.id)
  const { scenarioName, sensorNum, uavNum, energyConstraint, algorithm } = req.body || {}
  const scenarioMap = { '信息年龄优化': 1, '能量效率优化': 2, '资源利用优化': 3 }
  db.prepare(
    `UPDATE db_experiment_configs SET scenario_id=?, scenario_name=?, sensor_num=?, uav_num=?, energy_constraint=?, algorithm=? WHERE id=?`
  ).run(scenarioMap[scenarioName] || null, scenarioName, sensorNum, uavNum, energyConstraint, algorithm, id)
  ok(res, { id })
})

app.delete('/api/admin/configs/:id', (req, res) => {
  db.prepare('DELETE FROM db_experiment_configs WHERE id = ?').run(Number(req.params.id))
  ok(res, { deleted: true })
})

app.get('/api/admin/users', (req, res) => {
  ok(res, db.prepare('SELECT id, username, role, status, created_at as createdAt FROM users ORDER BY id').all())
})

app.patch('/api/admin/users/:id/status', (req, res) => {
  const id = Number(req.params.id)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!user) return fail(res, 404, '用户不存在')
  if (user.role === 'admin') return fail(res, 400, '不能禁用管理员')
  const next = user.status === 'active' ? 'disabled' : 'active'
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(next, id)
  ok(res, { id, status: next })
})

app.post('/api/admin/users/:id/reset-password', (req, res) => {
  const id = Number(req.params.id)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!user) return fail(res, 404, '用户不存在')
  if (user.role === 'admin') return fail(res, 400, '不能重置管理员密码')
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run('reset123', id)
  ok(res, { id, newPassword: 'reset123' })
})

// ------------------------------------------------------------
app.get('/api/health', (req, res) => ok(res, { status: 'ok' }))

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`[server] UAV 可视化系统后端已启动: http://localhost:${PORT}`)
})
