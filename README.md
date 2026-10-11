# 无人机辅助物联网数据收集可视化系统

## 项目简介

基于 React + Express + SQLite 的无人机辅助物联网数据收集可视化系统，用于展示三大研究场景的仿真实验结果，特别是多目标优化问题的帕累托解集交互式选择功能。

> 当前版本已改造为真实前后端分离架构：前端通过 HTTP API 访问后端服务，后端使用 SQLite 数据库持久化数据。原 Mock 数据作为数据库初始数据保留在 `src/data/`，并通过脚本转换为 `database/schema.sql`。**真正的无人机轨迹优化 / 强化学习算法尚未接入**，`backend/algorithm.js` 中仅提供了预留接口。

## 技术架构

```
┌─────────────┐      HTTP /api      ┌──────────────┐      SQL      ┌────────────────┐
│  React 前端  │  ────────────────▶  │ Express 后端  │  ──────────▶ │ SQLite 数据库   │
│ (Vite:3000) │  ◀────────────────  │ (Node:8787)  │  ◀────────── │ backend/data/   │
└─────────────┘                     └──────────────┘               │   uav.db        │
                                            │                       └────────────────┘
                                            ▼
                                  backend/algorithm.js
                                 （算法计算接口 - 预留，未实现）
```

## 功能特性

### 三大研究场景
1. **信息年龄优化** - 基于深度强化学习的最小化信息年龄优化场景
2. **能量效率优化** - 基于多目标优化的最大化数据价值和覆盖质量场景
3. **资源利用优化** - 动态环境下最大化资源利用效率优化场景

### 核心功能模块
- **用户管理** - 注册、登录、权限控制（真实数据库存储）
- **场景配置** - 参数配置与实验提交（提交后落库，调用预留算法接口）
- **实验结果** - 单目标优化结果对比
- **帕累托决策** - 多目标优化解集展示与交互式选择
- **后台管理** - 资源监控、权限分配、实验配置 CRUD、用户管理

## 技术栈

- 前端：React 18.2 + React Router 6.20 + Vite 5.0
- 后端：Express 4 + better-sqlite3
- 数据库：SQLite（文件型，`backend/data/uav.db`，首次启动自动从 `database/schema.sql` 建库）

## 快速开始

### 安装依赖
```bash
# 前端依赖
npm install

# 后端依赖
cd backend && npm install && cd ..
```

### 同时启动前后端（推荐）
```bash
npm run dev:all
```
- 前端: http://localhost:3000
- 后端: http://localhost:8787 （Vite 已配置 `/api` 反向代理到后端）

### 分别启动
```bash
# 后端
npm run server

# 前端（另一个终端）
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 数据库说明

- 数据库文件：`backend/data/uav.db`（SQLite，首次启动时自动创建）
- 建表与初始数据 SQL 文件：[database/schema.sql](database/schema.sql)
  - 若需要重置数据库，删除 `backend/data/uav.db*` 后重启后端即可自动重建
  - 若需要重新生成 `schema.sql`（例如修改了 `src/data/mockData.js`），运行：
    ```bash
    cd backend && node scripts/generate-schema.mjs
    ```

### 主要表结构
| 表名 | 说明 |
|---|---|
| users | 用户账号 |
| user_permissions | 用户权限配置 |
| scenarios / scenario_parameters | 三大研究场景及其参数定义 |
| experiments / experiment_images / experiment_charts | 实验记录、结果图片、图表 |
| single_objective_results | 单目标优化结果 |
| pareto_solutions | 多目标优化帕累托解集 |
| resource_monitor | 后台资源监控指标 |
| db_experiment_configs | 后台「数据管理」实验配置表（CRUD 示例） |

## 算法计算接口（预留，未实现）

`backend/algorithm.js` 中的 `runAlgorithm()` 为预留接口，当前仅返回 `{ implemented: false }` 占位结果，**不会执行真实的无人机轨迹优化 / 深度强化学习 / 多目标进化算法**。提交实验后，记录会以 `running` 状态写入数据库，供后续接入真实算法实现时替换。

## 演示账号

- 管理员: `admin` / `admin123`
- 普通用户: `user1` / `user123`

## 项目结构

```
.
├── backend/                   # 后端服务
│   ├── server.js              # Express 入口，所有 REST API
│   ├── db.js                  # SQLite 连接初始化（自动建库）
│   ├── algorithm.js            # 算法计算预留接口（未实现）
│   ├── scripts/
│   │   └── generate-schema.mjs # mock 数据 → database/schema.sql 生成脚本
│   ├── data/                   # SQLite 数据文件（运行时生成，已 .gitignore）
│   └── package.json
├── database/
│   └── schema.sql              # 数据库建表 + 初始数据 SQL
├── src/
│   ├── api/
│   │   └── client.js           # 前端统一 API 封装
│   ├── components/
│   │   └── Layout.jsx
│   ├── data/                   # 原 Mock 数据（现仅用于生成 schema.sql，不再被页面直接引用）
│   │   ├── mockData.js
│   │   └── chartData.js
│   ├── pages/
│   │   ├── Login.jsx / Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ScenarioList.jsx / ScenarioDetail.jsx
│   │   ├── ExperimentList.jsx / ExperimentDetail.jsx
│   │   └── AdminPanel.jsx
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js              # 含 /api 代理配置
```

## 核心功能说明

### 帕累托解集选择
在多目标优化场景中，系统会展示帕累托最优解集列表。用户可以：
1. 浏览所有帕累托解的关键指标（覆盖数量、数据价值）
2. 查看每个解的策略倾向（广覆盖/高价值/平衡）
3. 点击"选择此方案"查看完整的解决方案详情
4. 查看无人机访问顺序、能量消耗等详细信息

## 许可证

MIT
