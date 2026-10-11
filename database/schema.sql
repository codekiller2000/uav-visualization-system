-- ============================================================
-- 无人机辅助物联网数据收集可视化系统 - 数据库结构与初始数据
-- 由 scripts/generate-schema.mjs 自动生成, 可直接用 sqlite3 导入:
--   sqlite3 uav.db < database/schema.sql
-- ============================================================

PRAGMA foreign_keys = OFF;

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

-- users
INSERT INTO users (id, username, password, role, status, created_at) VALUES (1, 'admin', 'admin123', 'admin', 'active', '2026-01-01');
INSERT INTO users (id, username, password, role, status, created_at) VALUES (2, 'user1', 'user123', 'user', 'active', '2026-02-10');
INSERT INTO users (id, username, password, role, status, created_at) VALUES (3, 'researcher1', 'res123', 'user', 'active', '2026-02-15');
INSERT INTO users (id, username, password, role, status, created_at) VALUES (4, 'researcher2', 'res456', 'user', 'disabled', '2026-02-20');
INSERT INTO users (id, username, password, role, status, created_at) VALUES (5, 'testuser', 'test123', 'user', 'active', '2026-03-01');

-- user_permissions
INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3) VALUES (2, 1, 1, 1, 1, 1, 1);
INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3) VALUES (3, 1, 1, 0, 1, 1, 0);
INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3) VALUES (4, 1, 0, 0, 1, 0, 0);
INSERT INTO user_permissions (user_id, can_view_results, can_config_scenario, can_modify_params, can_access_scene1, can_access_scene2, can_access_scene3) VALUES (5, 1, 1, 1, 1, 1, 1);

-- scenarios & scenario_parameters
INSERT INTO scenarios (id, name, title, description, optimization_goal, type) VALUES (1, '信息年龄优化', '基于深度强化学习的最小化信息年龄优化场景', '单个无人机与多个无线传感器网络的数据收集场景,核心优化目标为最小化传感器节点的平均信息年龄(AoI)。通过深度强化学习算法,优化无人机的飞行轨迹与数据采集策略,在能量约束下降低数据的时效性损失。', '最小化平均信息年龄', 'single-objective');
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (1, 'sensorNum', '传感器节点数量', 'number', 20, 10, 100, NULL, 0);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (1, 'uavNum', '无人机数量', 'number', 1, 1, 5, NULL, 1);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (1, 'energyConstraint', '能量约束(J)', 'number', 10000, 5000, 50000, NULL, 2);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (1, 'algorithm', '算法选择', 'select', NULL, NULL, NULL, '["DQN算法","随机策略","贪婪策略"]', 3);
INSERT INTO scenarios (id, name, title, description, optimization_goal, type) VALUES (2, '能量效率优化', '基于多目标优化的最大化数据价值和覆盖质量场景', '不同传感器节点采集的数据具有不同的价值权重,同时考虑传感器覆盖的广度。核心优化目标为最大化采集数据的总价值与最大化覆盖的传感器数量,形成多目标优化问题,生成帕累托最优解集,供用户根据实际需求选择。', '最大化数据价值 & 最大化覆盖质量', 'multi-objective');
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (2, 'sensorNum', '传感器节点数量', 'number', 30, 10, 100, NULL, 0);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (2, 'uavNum', '无人机数量', 'number', 3, 1, 10, NULL, 1);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (2, 'energyConstraint', '能量约束(J)', 'number', 15000, 5000, 50000, NULL, 2);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (2, 'algorithm', '算法选择', 'select', NULL, NULL, NULL, '["NSGA-II","MOEA/D","加权求和法"]', 3);
INSERT INTO scenarios (id, name, title, description, optimization_goal, type) VALUES (3, '资源利用优化', '动态环境下最大化资源利用效率优化场景', '传感器节点的数据采集需求与网络状态随时间动态变化,无人机需实时调整访问策略。核心优化目标为最大化系统的资源利用效率,包括能量利用率与时间利用率,确保在动态环境下系统性能的稳定性。', '最大化资源利用效率', 'single-objective');
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (3, 'sensorNum', '传感器节点数量', 'number', 25, 10, 100, NULL, 0);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (3, 'uavNum', '无人机数量', 'number', 2, 1, 10, NULL, 1);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (3, 'energyConstraint', '能量约束(J)', 'number', 12000, 5000, 50000, NULL, 2);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (3, 'timeWindow', '时间窗口(s)', 'number', 3600, 1800, 7200, NULL, 3);
INSERT INTO scenario_parameters (scenario_id, name, label, type, default_value, min_value, max_value, options_json, sort_order) VALUES (3, 'algorithm', '算法选择', 'select', NULL, NULL, NULL, '["动态规划算法","启发式算法","贪婪算法"]', 4);

-- experiments & experiment_images
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (1, 1, '信息年龄优化', '系统架构设计', '基于深度强化学习的最小化信息年龄优化问题', 'completed', '2026-03-01 09:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (1, '/fig2.jpg', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (2, 1, '信息年龄优化', '仿真参数列表', '基于深度强化学习的最小化信息年龄优化问题', 'completed', '2026-03-02 10:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (2, '/fig4.jpg', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (3, 1, '无人机轨迹对比', 'SN=30, UAV=3', '不同算法下的无人机轨迹和传感器数量的关系', 'completed', '2026-03-03 11:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (3, '/fig5_1.jpeg', 0);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (3, '/fig5_2.jpeg', 1);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (4, 1, '无人机轨迹对比', 'SN=60, UAV=3', '不同算法下的无人机轨迹和传感器数量的关系', 'completed', '2026-03-03 11:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (4, '/fig5_3.jpeg', 0);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (4, '/fig5_4.jpeg', 1);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (5, 1, '信息年龄优化', 'UAV=3', '不同传感器数量下的信息年龄优化', 'completed', '2026-03-05 14:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (5, '/fig6.jpg', 0);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (5, '/fig7.jpg', 1);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (6, 1, '信息年龄优化', 'SN=2000', '不同无人机数量下的信息年龄优化', 'completed', '2026-03-06 10:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (6, '/fig8.jpg', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (7, 1, '信息年龄优化', 'Emax = 15000J', '不同网络规模对所需无人机数量的影响', 'completed', '2026-03-07 09:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (7, '/fig9.jpg', 0);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (7, '/fig10.jpg', 1);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (8, 1, '信息年龄优化', 'SN=3000', '不同无人机最大电池容量对所需无人机数量的影响', 'completed', '2026-03-08 10:30:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (8, '/fig11.jpg', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (9, 2, '能量效率优化', 'SN=50, UAV=3', '多目标优化帕累托前沿解集对比实验', 'completed', '2026-03-11 10:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (9, 'https://placehold.co/380x260/e8f4fd/1565c0?text=Pareto+Front+SN%3D50', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (12, 2, '能量效率优化', 'SN=100, UAV=5', '不同传感器密度下的价值-覆盖权衡分析', 'completed', '2026-03-12 14:00:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (12, 'https://placehold.co/380x260/fce4ec/c62828?text=Value-Coverage+Tradeoff', 0);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (13, 3, '资源利用优化', 'SN=25, UAV=2, T=3600s', '动态环境下资源利用效率对比基准算法', 'completed', '2026-03-13 09:30:00', 2);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (13, 'https://placehold.co/380x260/e8f5e9/1b5e20?text=Resource+Efficiency', 0);
INSERT INTO experiment_images (experiment_id, url, sort_order) VALUES (13, 'https://placehold.co/380x260/fff3e0/e65100?text=Energy+Utilization', 1);
INSERT INTO experiments (id, scenario_id, scenario_name, configuration, description, status, created_at, user_id) VALUES (14, 3, '资源利用优化', 'SN=50, UAV=4, T=7200s', '时间窗口长度对系统资源利用效率的影响', 'running', '2026-03-14 10:00:00', 2);

-- experiment_charts
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (1, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22m%3D1%22%2C%22data%22%3A%5B85%2C132%2C178%2C224%2C267%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22m%3D2%22%2C%22data%22%3A%5B62%2C98%2C135%2C170%2C203%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22m%3D3%22%2C%22data%22%3A%5B48%2C76%2C105%2C132%2C158%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22m%3D5%22%2C%22data%22%3A%5B35%2C55%2C75%2C95%2C113%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%2C%7B%22label%22%3A%22m%3D10%22%2C%22data%22%3A%5B24%2C38%2C52%2C65%2C78%5D%2C%22backgroundColor%22%3A%22%239966CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20The%20average%20AoI%20of%20SNs%20versus%20the%20number%20of%20SNs%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (1, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22m%3D1%22%2C%22data%22%3A%5B520%2C810%2C1150%2C1480%2C1820%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22m%3D2%22%2C%22data%22%3A%5B420%2C650%2C920%2C1185%2C1450%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22m%3D3%22%2C%22data%22%3A%5B340%2C525%2C745%2C960%2C1180%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22m%3D5%22%2C%22data%22%3A%5B260%2C400%2C570%2C735%2C900%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%2C%7B%22label%22%3A%22m%3D10%22%2C%22data%22%3A%5B185%2C285%2C405%2C520%2C638%5D%2C%22backgroundColor%22%3A%22%239966CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20The%20largest%20mission%20time%20versus%20the%20number%20of%20SNs%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (2, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22DQN%22%2C%22data%22%3A%5B72%2C115%2C148%2C195%2C238%2C281%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22Random%22%2C%22data%22%3A%5B145%2C228%2C312%2C398%2C485%2C568%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22Greedy%22%2C%22data%22%3A%5B98%2C155%2C206%2C265%2C320%2C378%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22Baseline%22%2C%22data%22%3A%5B120%2C188%2C252%2C320%2C385%2C450%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20Average%20AoI%20vs%20Number%20of%20Sensors%20(UAV%3D3)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (2, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22DQN%22%2C%22data%22%3A%5B310%2C490%2C685%2C865%2C1050%2C1240%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22Random%22%2C%22data%22%3A%5B520%2C820%2C1120%2C1430%2C1740%2C2050%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22Greedy%22%2C%22data%22%3A%5B415%2C655%2C895%2C1135%2C1378%2C1620%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22Baseline%22%2C%22data%22%3A%5B465%2C735%2C1005%2C1270%2C1540%2C1810%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20Largest%20mission%20time%20vs%20Number%20of%20Sensors%20(UAV%3D3)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (3, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22DQN-MUV%22%2C%22data%22%3A%5B58%2C92%2C118%2C154%2C188%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22DQN%22%2C%22data%22%3A%5B72%2C115%2C148%2C195%2C238%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22Greedy-MUV%22%2C%22data%22%3A%5B78%2C122%2C158%2C205%2C252%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22Greedy%22%2C%22data%22%3A%5B98%2C155%2C206%2C265%2C320%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20Avg%20AoI%20-%20Algorithm%20comparison%20(UAV%3D3%2C%20MUV%3D1)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (3, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22DQN-MUV%22%2C%22data%22%3A%5B255%2C402%2C560%2C720%2C880%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22DQN%22%2C%22data%22%3A%5B310%2C490%2C685%2C865%2C1050%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22Greedy-MUV%22%2C%22data%22%3A%5B330%2C518%2C720%2C918%2C1120%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22Greedy%22%2C%22data%22%3A%5B415%2C655%2C895%2C1135%2C1378%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20Largest%20mission%20time%20-%20Algorithm%20comparison%20(UAV%3D3%2C%20MUV%3D1)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (4, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22UAV%3D1%22%2C%22data%22%3A%5B145%2C228%2C312%2C398%2C485%2C568%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22UAV%3D2%22%2C%22data%22%3A%5B98%2C155%2C206%2C265%2C320%2C378%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22UAV%3D3%22%2C%22data%22%3A%5B72%2C115%2C148%2C195%2C238%2C281%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22UAV%3D5%22%2C%22data%22%3A%5B52%2C82%2C108%2C138%2C168%2C198%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20Average%20AoI%20vs%20UAV%20count%20(SN%3D300%2C%20MUV%3D1)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (4, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22UAV%3D1%22%2C%22data%22%3A%5B620%2C975%2C1330%2C1690%2C2050%2C2410%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22UAV%3D2%22%2C%22data%22%3A%5B415%2C655%2C895%2C1135%2C1378%2C1620%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22UAV%3D3%22%2C%22data%22%3A%5B310%2C490%2C685%2C865%2C1050%2C1240%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22UAV%3D5%22%2C%22data%22%3A%5B220%2C348%2C485%2C618%2C750%2C882%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20Largest%20mission%20time%20vs%20UAV%20count%20(SN%3D300%2C%20MUV%3D1)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (5, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22UAV%3D1%22%2C%22UAV%3D2%22%2C%22UAV%3D3%22%2C%22UAV%3D5%22%2C%22UAV%3D8%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22MUV%20travel%20time%20(s)%22%2C%22data%22%3A%5B1820%2C1350%2C980%2C720%2C540%5D%2C%22backgroundColor%22%3A%5B%22%234472C4%22%2C%22%23ED7D31%22%2C%22%23A9D18E%22%2C%22%23FF99CC%22%2C%22%239966CC%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22MUV%20travel%20time%20vs%20UAV%20count%20(SN%3D300)%22%2C%22fontSize%22%3A12%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Number%20of%20UAVs%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22MUV%20travel%20time%20(s)%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22display%22%3Afalse%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (6, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22w%2F%20MUV%22%2C%22data%22%3A%5B58%2C92%2C118%2C154%2C188%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22w%2Fo%20MUV%22%2C%22data%22%3A%5B72%2C115%2C148%2C195%2C238%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Average%20AoI%3A%20with%20vs%20without%20MUV%20(SN%3D300%2C%20UAV%3D3)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (6, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22w%2F%20MUV%22%2C%22data%22%3A%5B255%2C402%2C560%2C720%2C880%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22w%2Fo%20MUV%22%2C%22data%22%3A%5B310%2C490%2C685%2C865%2C1050%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Largest%20mission%20time%3A%20with%20vs%20without%20MUV%20(SN%3D300%2C%20UAV%3D3)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (7, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22v%3D5%22%2C%22v%3D10%22%2C%22v%3D15%22%2C%22v%3D20%22%2C%22v%3D25%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22UAV%20speed%22%2C%22data%22%3A%5B198%2C165%2C145%2C128%2C115%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22MUV%20speed%22%2C%22data%22%3A%5B175%2C155%2C140%2C128%2C118%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20Average%20AoI%20vs%20speed%20(SN%3D300%2C%20UAV%3D3%2C%20MUV%3D1)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Speed%20(m%2Fs)%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (7, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22v%3D5%22%2C%22v%3D10%22%2C%22v%3D15%22%2C%22v%3D20%22%2C%22v%3D25%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22UAV%20speed%22%2C%22data%22%3A%5B1250%2C1050%2C920%2C810%2C720%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22MUV%20speed%22%2C%22data%22%3A%5B1120%2C980%2C870%2C775%2C695%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20Largest%20mission%20time%20vs%20speed%20(SN%3D300%2C%20UAV%3D3%2C%20MUV%3D1)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Speed%20(m%2Fs)%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (8, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22E_max%3D5000J%22%2C%22data%22%3A%5B195%2C308%2C425%2C542%2C660%2C778%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22E_max%3D10000J%22%2C%22data%22%3A%5B158%2C248%2C338%2C428%2C518%2C608%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22E_max%3D15000J%22%2C%22data%22%3A%5B135%2C212%2C290%2C368%2C445%2C522%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22E_max%3D20000J%22%2C%22data%22%3A%5B118%2C185%2C253%2C320%2C388%2C455%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%2C%7B%22label%22%3A%22E_max%3D25000J%22%2C%22data%22%3A%5B105%2C165%2C225%2C285%2C345%2C405%5D%2C%22backgroundColor%22%3A%22%239966CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(a)%20Average%20AoI%20vs%20battery%20capacity%20(SN%3D300%2C%20UAV%3D3)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Average%20AoI%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A9%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (8, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22100%22%2C%22200%22%2C%22300%22%2C%22400%22%2C%22500%22%2C%22600%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22E_max%3D5000J%22%2C%22data%22%3A%5B758%2C1195%2C1648%2C2100%2C2555%2C3010%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22E_max%3D10000J%22%2C%22data%22%3A%5B620%2C978%2C1338%2C1700%2C2062%2C2425%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22E_max%3D15000J%22%2C%22data%22%3A%5B528%2C832%2C1140%2C1448%2C1758%2C2068%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22E_max%3D20000J%22%2C%22data%22%3A%5B465%2C732%2C1002%2C1272%2C1542%2C1812%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%2C%7B%22label%22%3A%22E_max%3D25000J%22%2C%22data%22%3A%5B415%2C654%2C896%2C1138%2C1380%2C1622%5D%2C%22backgroundColor%22%3A%22%239966CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22(b)%20Largest%20mission%20time%20vs%20battery%20capacity%20(SN%3D300%2C%20UAV%3D3)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A9%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (9, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%2250KB%22%2C%22100KB%22%2C%22200KB%22%2C%22500KB%22%2C%221MB%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22UAV%3D1%22%2C%22data%22%3A%5B420%2C580%2C780%2C1050%2C1380%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22UAV%3D2%22%2C%22data%22%3A%5B310%2C430%2C580%2C785%2C1030%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22UAV%3D3%22%2C%22data%22%3A%5B248%2C342%2C462%2C625%2C820%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%2C%7B%22label%22%3A%22UAV%3D5%22%2C%22data%22%3A%5B188%2C258%2C348%2C472%2C620%5D%2C%22backgroundColor%22%3A%22%23FF99CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Largest%20mission%20time%20vs%20data%20volume%20(SN%3D300%2C%20MUV%3D1)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Data%20volume%20per%20sensor%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A10%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (10, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22%CE%B1%3D0.1%22%2C%22%CE%B1%3D0.3%22%2C%22%CE%B1%3D0.5%22%2C%22%CE%B1%3D0.7%22%2C%22%CE%B1%3D0.9%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Avg%20AoI%22%2C%22data%22%3A%5B195%2C168%2C148%2C138%2C135%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22Energy%20(%C3%97100J)%22%2C%22data%22%3A%5B88%2C108%2C125%2C138%2C148%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Effect%20of%20energy%20weight%20%CE%B1%20(SN%3D300%2C%20UAV%3D3%2C%20MUV%3D1)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Energy%20weight%20%CE%B1%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Value%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (10, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22%CE%B1%3D0.1%22%2C%22%CE%B1%3D0.3%22%2C%22%CE%B1%3D0.5%22%2C%22%CE%B1%3D0.7%22%2C%22%CE%B1%3D0.9%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Largest%20mission%20time%22%2C%22data%22%3A%5B1380%2C1180%2C1020%2C915%2C862%5D%2C%22backgroundColor%22%3A%22%239966CC%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Largest%20mission%20time%20vs%20energy%20weight%20%CE%B1%22%2C%22fontSize%22%3A12%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Energy%20weight%20%CE%B1%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22The%20largest%20mission%20time%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22display%22%3Afalse%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (11, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Sol.1%22%2C%22Sol.2%22%2C%22Sol.3%22%2C%22Sol.4%22%2C%22Sol.5%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Coverage%22%2C%22data%22%3A%5B48%2C42%2C35%2C28%2C18%5D%2C%22backgroundColor%22%3A%22%234472C4%22%2C%22yAxisID%22%3A%22y1%22%7D%2C%7B%22label%22%3A%22Data%20Value%22%2C%22data%22%3A%5B720%2C1050%2C1480%2C1950%2C2380%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%2C%22yAxisID%22%3A%22y2%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Pareto%20Front%3A%20Coverage%20vs%20Data%20Value%20(SN%3D50%2C%20UAV%3D3)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%7D%5D%2C%22yAxes%22%3A%5B%7B%22id%22%3A%22y1%22%2C%22position%22%3A%22left%22%2C%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Coverage%20Sensors%22%7D%7D%2C%7B%22id%22%3A%22y2%22%2C%22position%22%3A%22right%22%2C%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Data%20Value%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (12, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22NSGA-II%22%2C%22MOEA%2FD%22%2C%22Weighted-Sum%22%2C%22Random%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Hypervolume%22%2C%22data%22%3A%5B0.82%2C0.78%2C0.65%2C0.45%5D%2C%22backgroundColor%22%3A%5B%22%234472C4%22%2C%22%23ED7D31%22%2C%22%23A9D18E%22%2C%22%23FF99CC%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Algorithm%20comparison%20-%20Hypervolume%20(SN%3D100%2C%20UAV%3D5)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Algorithm%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Hypervolume%22%7D%2C%22ticks%22%3A%7B%22min%22%3A0%2C%22max%22%3A1%7D%7D%5D%7D%2C%22legend%22%3A%7B%22display%22%3Afalse%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (12, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Sol.1%22%2C%22Sol.2%22%2C%22Sol.3%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Coverage%22%2C%22data%22%3A%5B96%2C75%2C50%5D%2C%22backgroundColor%22%3A%22%234472C4%22%2C%22yAxisID%22%3A%22y1%22%7D%2C%7B%22label%22%3A%22Data%20Value%22%2C%22data%22%3A%5B1850%2C3200%2C4900%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%2C%22yAxisID%22%3A%22y2%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Pareto%20solutions%3A%20Coverage%20vs%20Value%20(SN%3D100%2C%20UAV%3D5)%22%2C%22fontSize%22%3A10%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%7D%5D%2C%22yAxes%22%3A%5B%7B%22id%22%3A%22y1%22%2C%22position%22%3A%22left%22%2C%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Coverage%20Sensors%22%7D%7D%2C%7B%22id%22%3A%22y2%22%2C%22position%22%3A%22right%22%2C%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Data%20Value%22%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (13, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22DRL%22%2C%22Heuristic%22%2C%22Greedy%22%2C%22Random%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Resource%20Efficiency%20(%25)%22%2C%22data%22%3A%5B87.4%2C79.2%2C65.8%2C48.3%5D%2C%22backgroundColor%22%3A%5B%22%234472C4%22%2C%22%23ED7D31%22%2C%22%23A9D18E%22%2C%22%23FF99CC%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Resource%20efficiency%20comparison%20(SN%3D25%2C%20UAV%3D2)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Algorithm%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Resource%20Efficiency%20(%25)%22%7D%2C%22ticks%22%3A%7B%22min%22%3A0%2C%22max%22%3A100%7D%7D%5D%7D%2C%22legend%22%3A%7B%22display%22%3Afalse%7D%7D%7D&w=420&h=280&bkg=white', 0);
INSERT INTO experiment_charts (experiment_id, chart_url, sort_order) VALUES (13, 'https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22SN%3D10%22%2C%22SN%3D15%22%2C%22SN%3D20%22%2C%22SN%3D25%22%2C%22SN%3D30%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22DRL%22%2C%22data%22%3A%5B92%2C90%2C88%2C87%2C85%5D%2C%22backgroundColor%22%3A%22%234472C4%22%7D%2C%7B%22label%22%3A%22Heuristic%22%2C%22data%22%3A%5B84%2C82%2C80%2C79%2C77%5D%2C%22backgroundColor%22%3A%22%23ED7D31%22%7D%2C%7B%22label%22%3A%22Greedy%22%2C%22data%22%3A%5B72%2C70%2C67%2C66%2C63%5D%2C%22backgroundColor%22%3A%22%23A9D18E%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Energy%20utilization%20vs%20sensor%20count%20(UAV%3D2)%22%2C%22fontSize%22%3A11%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Number%20of%20sensors%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Energy%20Utilization%20(%25)%22%7D%2C%22ticks%22%3A%7B%22min%22%3A50%2C%22max%22%3A100%7D%7D%5D%7D%2C%22legend%22%3A%7B%22position%22%3A%22top%22%2C%22labels%22%3A%7B%22fontSize%22%3A11%7D%7D%7D%7D&w=420&h=280&bkg=white', 1);

-- single_objective_results
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (1, 'DQN算法', 20, 125.3, 8500, 1200, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (1, '随机策略', 20, 245.6, 8200, 1150, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (1, '贪婪策略', 20, 178.9, 8800, 1250, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (3, 'DQN算法 (UAV=1)', 300, 198.4, 12800, 1900, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (3, 'DQN算法 (UAV=2)', 300, 152.1, 13500, 2100, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (3, 'DQN算法 (UAV=3)', 300, 118.7, 14200, 2400, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (3, '随机策略 (UAV=3)', 300, 287.3, 13900, 2350, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (3, '贪婪策略 (UAV=3)', 300, 206.5, 14500, 2480, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (4, 'DQN算法 (UAV=1)', 300, 312.5, 10200, 1600, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (4, 'DQN算法 (UAV=2)', 300, 198.3, 12500, 2100, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (4, 'DQN算法 (UAV=3)', 300, 156.7, 14200, 2400, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (4, 'DQN算法 (UAV=5)', 300, 112.4, 18500, 2800, NULL);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (13, '动态规划算法', 25, 0, 10800, 3200, 87.4);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (13, '启发式算法', 25, 0, 10200, 3100, 79.2);
INSERT INTO single_objective_results (experiment_id, algorithm, sensor_num, avg_aoi, total_energy, flight_time, resource_efficiency) VALUES (13, '贪婪算法', 25, 0, 9800, 2900, 65.8);

-- pareto_solutions
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_a1', 2, 1, 28, 850, '偏向广覆盖', '该方案优先保证传感器覆盖的广度，适合需要全面监控的应用场景', 30, 3, 12500, 1850, 30.4, '["UAV1: S1→S5→S9→S14→S18→S23→S28","UAV2: S2→S6→S10→S15→S19→S24→S29","UAV3: S3→S7→S11→S16→S20→S25→S30"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_a2', 2, 2, 25, 1250, '平衡策略', '该方案在覆盖与价值间取得平衡，适合大多数应用场景', 30, 3, 13200, 1920, 50, '["UAV1: S1→S4→S8→S12→S17→S22→S27","UAV2: S2→S5→S9→S13→S18→S23→S28","UAV3: S3→S6→S10→S15→S20→S25"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_a3', 2, 3, 22, 1680, '平衡策略', '该方案略微倾向高价值数据采集', 30, 3, 13800, 1980, 76.4, '["UAV1: S1→S3→S7→S11→S16→S21→S26","UAV2: S2→S4→S8→S13→S18→S24","UAV3: S5→S9→S14→S19→S25→S29"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_a4', 2, 4, 18, 2100, '偏向高价值', '该方案优先采集高价值传感器数据', 30, 3, 14200, 2050, 116.7, '["UAV1: S1→S2→S5→S9→S14→S20","UAV2: S3→S6→S10→S15→S21→S26","UAV3: S4→S7→S11→S16→S22→S27"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_a5', 2, 5, 15, 2450, '偏向高价值', '该方案极致追求数据价值最大化', 30, 3, 14500, 2100, 163.3, '["UAV1: S1→S3→S6→S10→S15","UAV2: S2→S4→S7→S11→S16","UAV3: S5→S8→S12→S17→S21"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_1', 11, 1, 48, 720, '偏向广覆盖', '该方案优先保证传感器覆盖的广度，适合需要全面监控的应用场景', 50, 3, 11500, 1700, 15, '["UAV1: S1→S5→S10→S15→S20→S25→S30→S35","UAV2: S2→S6→S11→S16→S21→S26→S31→S40","UAV3: S3→S7→S12→S17→S22→S27→S32→S45"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_2', 11, 2, 42, 1050, '平衡策略', '该方案在覆盖广度与数据价值之间取得较好平衡', 50, 3, 12200, 1800, 25, '["UAV1: S1→S4→S8→S12→S17→S22→S27","UAV2: S2→S5→S9→S13→S18→S23→S28","UAV3: S3→S6→S10→S15→S20→S25→S30"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_3', 11, 3, 35, 1480, '平衡策略', '该方案略微倾向高价值数据采集，适合对数据质量有一定要求的场景', 50, 3, 12800, 1880, 42.3, '["UAV1: S1→S3→S7→S11→S16→S21","UAV2: S2→S4→S8→S13→S18→S24","UAV3: S5→S9→S14→S19→S25→S29"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_4', 11, 4, 28, 1950, '偏向高价值', '该方案优先采集高价值传感器数据，适合对数据价值敏感的应用', 50, 3, 13500, 1960, 69.6, '["UAV1: S1→S2→S5→S9→S14→S20","UAV2: S3→S6→S10→S15→S21→S26","UAV3: S4→S7→S11→S16→S22→S27"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_5', 11, 5, 18, 2380, '偏向高价值', '该方案极致追求数据价值最大化，适合高价值数据优先的关键应用', 50, 3, 14200, 2050, 132.2, '["UAV1: S1→S3→S6→S10→S15→S19","UAV2: S2→S4→S7→S11→S16","UAV3: S5→S8→S12→S17→S21"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_6', 12, 1, 96, 1850, '偏向广覆盖', '高密度传感器场景下最大覆盖方案', 100, 5, 22000, 3200, 19.3, '["UAV1: S1-S20","UAV2: S21-S40","UAV3: S41-S60","UAV4: S61-S80","UAV5: S81-S96"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_7', 12, 2, 75, 3200, '平衡策略', '覆盖与价值均衡的折中方案', 100, 5, 23500, 3400, 42.7, '["UAV1: 高价值区 S1-S15","UAV2: 高价值区 S16-S30","UAV3: S31-S55","UAV4: S56-S75","UAV5: S76-S90"]');
INSERT INTO pareto_solutions (id, experiment_id, solution_num, coverage_sensors, data_value, strategy, description, sensor_num, uav_num, energy_used, flight_time, avg_data_value, visit_sequence_json) VALUES ('sol_8', 12, 3, 50, 4900, '偏向高价值', '聚焦前50%最高价值传感器的精准采集方案', 100, 5, 24800, 3600, 98, '["UAV1: Top-Value S1-S10","UAV2: Top-Value S11-S20","UAV3: Top-Value S21-S30","UAV4: Top-Value S31-S40","UAV5: Top-Value S41-S50"]');

-- resource_monitor
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (1, '实验任务运行数', 3, '个', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (2, '实验任务队列数', 1, '个', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (3, '数据库存储占用', 284.6, 'MB', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (4, '帕累托解集记录数', 48, '条', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (5, '实验配置记录数', 14, '条', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (6, '今日用户访问次数', 37, '次', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (7, '近7日新增实验数', 14, '个', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (8, '系统已运行时长', 72, '小时', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (9, '后端 API 平均响应时延', 42, 'ms', 'normal', '2026-03-14 10:05:00');
INSERT INTO resource_monitor (id, metric, value, unit, status, updated_at) VALUES (10, '数据库连接池使用率', 18, '%', 'normal', '2026-03-14 10:05:00');

-- db_experiment_configs
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (1, 1, '信息年龄优化', 20, 1, 10000, 'DQN算法', '2026-03-01');
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (2, 1, '信息年龄优化', 300, 3, 15000, 'DQN算法', '2026-03-02');
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (3, 1, '信息年龄优化', 300, 3, 14000, '随机策略', '2026-03-03');
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (4, 2, '能量效率优化', 50, 3, 12000, 'NSGA-II', '2026-03-11');
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (5, 2, '能量效率优化', 100, 5, 25000, 'NSGA-II', '2026-03-12');
INSERT INTO db_experiment_configs (id, scenario_id, scenario_name, sensor_num, uav_num, energy_constraint, algorithm, created_at) VALUES (6, 3, '资源利用优化', 25, 2, 12000, '动态规划算法', '2026-03-13');
