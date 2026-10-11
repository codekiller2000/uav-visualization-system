// 一次性脚本：从旧版前端 mock 数据生成 SQLite 建表 + 插入 SQL 文件 (database/schema.sql)
// 用法: node scripts/generate-schema.mjs
import { users, userPermissions, scenarios, experiments, singleObjectiveResults, paretoSolutions, resourceMonitorData, dbExperimentConfigs } from '../../src/data/mockData.js'
import { experimentCharts } from '../../src/data/chartData.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function esc(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 1 : 0
  return `'${String(v).replace(/'/g, "''")}'`
}

let sql = `-- ============================================================
-- 无人机辅助物联网数据收集可视化系统 - 数据库结构与初始数据
-- 由 scripts/generate-schema.mjs 自动生成, 可直接用 sqlite3 导入:
--   sqlite3 uav.db < database/schema.sql
-- ============================================================

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS user_permissions;
CREATE TABLE user_permissions (
  user_id INTEGER PRIMARY KEY,
  can_view_results INTEGER NOT NULL DEFAULT 1,
  can_config_scenario INTEGER NOT NULL DEFAULT 1,
  can_modify_params INTEGER NOT NULL DEFAULT 1,
  can_access_scene1 INTEGER NOT NULL DEFAULT 1,
  can_access_scene2 INTEGER NOT NULL DEFAULT 1,
  can_access_scene3 INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS scenarios;
CREATE TABLE scenarios (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  optimization_goal TEXT,
  type TEXT NOT NULL
);

DROP TABLE IF EXISTS scenario_parameters;
CREATE TABLE scenario_parameters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  default_value TEXT,
  min_value REAL,
  max_value REAL,
  options_json TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
);

DROP TABLE IF EXISTS experiments;
CREATE TABLE experiments (
  id INTEGER PRIMARY KEY,
  scenario_id INTEGER NOT NULL,
  scenario_name TEXT,
  configuration TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_id INTEGER,
  params_json TEXT,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS experiment_images;
CREATE TABLE experiment_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experiment_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

DROP TABLE IF EXISTS experiment_charts;
CREATE TABLE experiment_charts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experiment_id INTEGER NOT NULL,
  chart_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

DROP TABLE IF EXISTS single_objective_results;
CREATE TABLE single_objective_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experiment_id INTEGER NOT NULL,
  algorithm TEXT,
  sensor_num INTEGER,
  avg_aoi REAL,
  total_energy REAL,
  flight_time REAL,
  resource_efficiency REAL,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

DROP TABLE IF EXISTS pareto_solutions;
CREATE TABLE pareto_solutions (
  id TEXT PRIMARY KEY,
  experiment_id INTEGER NOT NULL,
  solution_num INTEGER,
  coverage_sensors INTEGER,
  data_value REAL,
  strategy TEXT,
  description TEXT,
  sensor_num INTEGER,
  uav_num INTEGER,
  energy_used REAL,
  flight_time REAL,
  avg_data_value REAL,
  visit_sequence_json TEXT,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

DROP TABLE IF EXISTS resource_monitor;
CREATE TABLE resource_monitor (
  id INTEGER PRIMARY KEY,
  metric TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  status TEXT DEFAULT 'normal',
  updated_at TEXT
);

DROP TABLE IF EXISTS db_experiment_configs;
CREATE TABLE db_experiment_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario_id INTEGER,
  scenario_name TEXT,
  sensor_num INTEGER,
  uav_num INTEGER,
  energy_constraint REAL,
  algorithm TEXT,
  created_at TEXT
);

-- ============================================================
-- 数据插入
-- ============================================================

`

// users
sql += '-- users\n'
for (const u of users) {
  sql += `INSERT INTO users (id, username, password, role, status, created_at) VALUES (${esc(u.id)}, ${esc(u.username)}, ${esc(u.password)}, ${esc(u.role)}, ${esc(u.status)}, ${esc(u.createdAt)});\n`
}

sql += '\n-- user_permissions\n'
for (const p of userPermissions) {
  sql += `INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3) VALUES (${esc(p.userId)}, ${esc(p.canViewResults)}, ${esc(p.canConfigScenario)}, ${esc(p.canModifyParams)}, ${esc(p.canAccessScene1)}, ${esc(p.canAccessScene2)}, ${esc(p.canAccessScene3)});\n`
}

sql += '\n-- scenarios & scenario_parameters\n'
for (const s of scenarios) {
  sql += `INSERT INTO scenarios (id, name, title, description, optimization_goal, type) VALUES (${esc(s.id)}, ${esc(s.name)}, ${esc(s.title)}, ${esc(s.description)}, ${esc(s.optimizationGoal)}, ${esc(s.type)});\n`
  s.parameters.forEach((param, idx) => {
    sql += `INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (${esc(s.id)}, ${esc(param.name)}, ${esc(param.label)}, ${esc(param.type)}, ${esc(param.default)}, ${esc(param.min)}, ${esc(param.max)}, ${esc(param.options ? JSON.stringify(param.options) : null)}, ${esc(idx)});\n`
  })
}

sql += '\n-- experiments & experiment_images\n'
for (const e of experiments) {
  sql += `INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (${esc(e.id)}, ${esc(e.scenarioId)}, ${esc(e.scenarioName)}, ${esc(e.configuration)}, ${esc(e.description)}, ${esc(e.status)}, ${esc(e.createdAt)}, ${esc(e.userId)});\n`
  ;(e.resultImages || []).forEach((img, idx) => {
    sql += `INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (${esc(e.id)}, ${esc(img)}, ${esc(idx)});\n`
  })
}

sql += '\n-- experiment_charts\n'
for (const [expId, urls] of Object.entries(experimentCharts)) {
  urls.forEach((url, idx) => {
    sql += `INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (${esc(Number(expId))}, ${esc(url)}, ${esc(idx)});\n`
  })
}

sql += '\n-- single_objective_results\n'
for (const [expId, data] of Object.entries(singleObjectiveResults)) {
  for (const r of data.results) {
    sql += `INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (${esc(Number(expId))}, ${esc(r.algorithm)}, ${esc(r.sensorNum)}, ${esc(r.avgAoI)}, ${esc(r.totalEnergy)}, ${esc(r.flightTime)}, ${esc(r.resourceEfficiency ?? null)});\n`
  }
}

sql += '\n-- pareto_solutions\n'
for (const [expId, data] of Object.entries(paretoSolutions)) {
  for (const sol of data.solutions) {
    sql += `INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES (${esc(sol.id)}, ${esc(Number(expId))}, ${esc(sol.solutionNum)}, ${esc(sol.coverageSensors)}, ${esc(sol.dataValue)}, ${esc(sol.strategy)}, ${esc(sol.description)}, ${esc(sol.detailConfig.sensorNum)}, ${esc(sol.detailConfig.uavNum)}, ${esc(sol.detailConfig.energyUsed)}, ${esc(sol.detailConfig.flightTime)}, ${esc(sol.detailConfig.avgDataValue)}, ${esc(JSON.stringify(sol.detailConfig.visitSequence))});\n`
  }
}

sql += '\n-- resource_monitor\n'
for (const m of resourceMonitorData) {
  sql += `INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (${esc(m.id)}, ${esc(m.metric)}, ${esc(m.value)}, ${esc(m.unit)}, ${esc(m.status)}, ${esc(m.updatedAt)});\n`
}

sql += '\n-- db_experiment_configs\n'
for (const c of dbExperimentConfigs) {
  sql += `INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (${esc(c.id)}, ${esc(c.scenarioId)}, ${esc(c.scenarioName)}, ${esc(c.sensorNum)}, ${esc(c.uavNum)}, ${esc(c.energyConstraint)}, ${esc(c.algorithm)}, ${esc(c.createdAt)});\n`
}

const outPath = path.join(__dirname, '..', '..', 'database', 'schema.sql')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, sql, 'utf-8')
console.log('已生成:', outPath)
