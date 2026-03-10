import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  users,
  userPermissions,
  resourceMonitorData,
  dbExperimentConfigs,
  experiments,
} from '../data/mockData'
import './AdminPanel.css'

// ======== 子标签：资源监控 ========
function ResourceMonitor() {
  const [data, setData] = useState(resourceMonitorData)

  const handleRefresh = () => {
    // 模拟刷新——随机轻微波动
    setData(prev => prev.map(item => ({
      ...item,
      value: item.unit === '%' || item.unit === 'ms'
        ? +(item.value * (0.92 + Math.random() * 0.16)).toFixed(1)
        : item.value + Math.floor(Math.random() * 3),
      updatedAt: new Date().toLocaleString('zh-CN')
    })))
  }

  return (
    <div className="tab-section">
      <div className="section-toolbar">
        <h2>资源监控</h2>
        <button className="btn-secondary" onClick={handleRefresh}>↻ 刷新数据</button>
      </div>
      <p className="section-desc">
        实时展示系统各类资源的当前状态与关键指标（模拟 /monitor/resources 接口数据）。
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>监控指标</th>
            <th>当前值</th>
            <th>单位</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.metric}</td>
              <td><strong>{item.value}</strong></td>
              <td>{item.unit}</td>
              <td>
                <span className="status-dot normal">● 正常</span>
              </td>
              <td>{item.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ======== 子标签：权限分配 ========
function PermissionAssign() {
  const normalUsers = users.filter(u => u.role !== 'admin')
  const [perms, setPerms] = useState(
    normalUsers.map(u => {
      const p = userPermissions.find(p => p.userId === u.id) || {}
      return {
        userId: u.id,
        username: u.username,
        canViewResults: p.canViewResults ?? true,
        canConfigScenario: p.canConfigScenario ?? true,
        canModifyParams: p.canModifyParams ?? true,
        canAccessScene1: p.canAccessScene1 ?? true,
        canAccessScene2: p.canAccessScene2 ?? true,
        canAccessScene3: p.canAccessScene3 ?? true,
      }
    })
  )
  const [saved, setSaved] = useState(false)

  const toggle = (userId, field) => {
    setPerms(prev => prev.map(p => p.userId === userId ? { ...p, [field]: !p[field] } : p))
    setSaved(false)
  }

  const handleSubmit = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const fields = [
    { key: 'canViewResults', label: '查看实验结果' },
    { key: 'canConfigScenario', label: '场景配置' },
    { key: 'canModifyParams', label: '修改仿真参数' },
    { key: 'canAccessScene1', label: '访问场景一' },
    { key: 'canAccessScene2', label: '访问场景二' },
    { key: 'canAccessScene3', label: '访问场景三' },
  ]

  return (
    <div className="tab-section">
      <div className="section-toolbar">
        <h2>权限分配</h2>
        <button className="btn-primary" onClick={handleSubmit}>提交分配</button>
      </div>
      <p className="section-desc">
        为普通用户配置可访问模块及操作权限（对应 /permission/assign 接口）。
      </p>
      {saved && <div className="alert-success">✓ 权限配置已保存</div>}
      <div className="perm-table-wrap">
        <table className="admin-table perm-table">
          <thead>
            <tr>
              <th>用户名</th>
              {fields.map(f => <th key={f.key}>{f.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {perms.map(p => (
              <tr key={p.userId}>
                <td><strong>{p.username}</strong></td>
                {fields.map(f => (
                  <td key={f.key} className="perm-cell">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={!!p[f.key]}
                        onChange={() => toggle(p.userId, f.key)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ======== 子标签：数据管理（实验配置表 CRUD）========
function DataManagement() {
  const [items, setItems] = useState(dbExperimentConfigs)
  const [searchText, setSearchText] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleDelete = (id) => {
    if (!window.confirm('确定删除该条记录？')) return
    setItems(prev => prev.filter(i => i.id !== id))
    showToast('✓ 删除成功')
  }

  const filteredItems = items.filter(i =>
    i.scenarioName.includes(searchText) || i.algorithm.includes(searchText) || String(i.id).includes(searchText)
  )

  const handleSave = (data) => {
    if (data.id) {
      setItems(prev => prev.map(i => i.id === data.id ? data : i))
      showToast('✓ 修改成功')
    } else {
      const newItem = { ...data, id: items.length + 1, createdAt: new Date().toISOString().slice(0, 10) }
      setItems(prev => [...prev, newItem])
      showToast('✓ 新增成功')
    }
    setShowAddModal(false)
    setEditItem(null)
  }

  return (
    <div className="tab-section">
      <div className="section-toolbar">
        <h2>数据管理</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="search-input"
            placeholder="搜索场景/算法/编号"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button className="btn-primary" onClick={() => { setEditItem(null); setShowAddModal(true) }}>+ 新增</button>
        </div>
      </div>
      <p className="section-desc">
        实验配置表的增删改查操作（对应 /resource/query、/resource/add、/resource/update、/resource/delete 接口）。
      </p>
      {toast && <div className="alert-success">{toast}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>场景名称</th>
            <th>传感器数</th>
            <th>无人机数</th>
            <th>能量约束(J)</th>
            <th>算法</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.scenarioName}</td>
              <td>{item.sensorNum}</td>
              <td>{item.uavNum}</td>
              <td>{item.energyConstraint}</td>
              <td>{item.algorithm}</td>
              <td>{item.createdAt}</td>
              <td>
                <button className="btn-edit" onClick={() => { setEditItem(item); setShowAddModal(true) }}>编辑</button>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredItems.length === 0 && (
        <div className="empty-hint">暂无匹配数据</div>
      )}

      {showAddModal && (
        <ConfigFormModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowAddModal(false); setEditItem(null) }}
        />
      )}
    </div>
  )
}

// 新增/编辑弹窗
function ConfigFormModal({ item, onSave, onClose }) {
  const scenarioOptions = ['信息年龄优化', '能量效率优化', '资源利用优化']
  const algorithmOptions = ['DQN算法', '随机策略', '贪婪策略', 'NSGA-II', 'MOEA/D', '动态规划算法', '启发式算法']
  const [form, setForm] = useState(item || {
    scenarioName: '信息年龄优化', sensorNum: 20, uavNum: 1, energyConstraint: 10000, algorithm: 'DQN算法'
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{item ? '编辑配置' : '新增配置'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>场景名称</label>
            <select value={form.scenarioName} onChange={e => set('scenarioName', e.target.value)}>
              {scenarioOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>传感器节点数量</label>
            <input type="number" value={form.sensorNum} onChange={e => set('sensorNum', +e.target.value)} min={10} max={500} />
          </div>
          <div className="form-group">
            <label>无人机数量</label>
            <input type="number" value={form.uavNum} onChange={e => set('uavNum', +e.target.value)} min={1} max={10} />
          </div>
          <div className="form-group">
            <label>能量约束(J)</label>
            <input type="number" value={form.energyConstraint} onChange={e => set('energyConstraint', +e.target.value)} min={5000} />
          </div>
          <div className="form-group">
            <label>算法</label>
            <select value={form.algorithm} onChange={e => set('algorithm', e.target.value)}>
              {algorithmOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)}>保存</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>取消</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ======== 子标签：用户管理 ========
function UserManagement() {
  const [userList, setUserList] = useState(users.map(u => ({ ...u })))
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const toggleStatus = (id) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id && u.role !== 'admin') {
        const next = u.status === 'active' ? 'disabled' : 'active'
        showToast(`✓ 用户 ${u.username} 已${next === 'active' ? '启用' : '禁用'}`)
        return { ...u, status: next }
      }
      return u
    }))
  }

  const handleResetPwd = (u) => {
    if (u.role === 'admin') return
    showToast(`✓ 用户 ${u.username} 密码已重置为 reset123`)
  }

  return (
    <div className="tab-section">
      <div className="section-toolbar">
        <h2>用户管理</h2>
      </div>
      <p className="section-desc">查看系统所有用户账号，可对违规账号禁用或重置密码。</p>
      {toast && <div className="alert-success">{toast}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>角色</th>
            <th>状态</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                <span className={`role-badge ${u.role}`}>
                  {u.role === 'admin' ? '管理员' : '普通用户'}
                </span>
              </td>
              <td>
                <span className={`status-dot ${u.status}`}>
                  {u.status === 'active' ? '● 正常' : '● 禁用'}
                </span>
              </td>
              <td>{u.createdAt}</td>
              <td>
                {u.role !== 'admin' && (
                  <>
                    <button
                      className={u.status === 'active' ? 'btn-delete' : 'btn-edit'}
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === 'active' ? '禁用' : '启用'}
                    </button>
                    <button className="btn-secondary-sm" onClick={() => handleResetPwd(u)}>重置密码</button>
                  </>
                )}
                {u.role === 'admin' && <span className="text-muted">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ======== 主页面 ========
const TABS = [
  { key: 'monitor', label: '📊 资源监控' },
  { key: 'permission', label: '🔐 权限分配' },
  { key: 'data', label: '🗄 数据管理' },
  { key: 'users', label: '👥 用户管理' },
]

function AdminPanel({ onLogout }) {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const [activeTab, setActiveTab] = useState('monitor')

  if (currentUser.role !== 'admin') {
    return (
      <Layout onLogout={onLogout}>
        <div className="admin-forbidden">
          <h2>⚠️ 无访问权限</h2>
          <p>后台管理功能仅限管理员使用</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>返回首页</button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="admin-panel">
        <div className="page-header">
          <h1>后台管理</h1>
          <p>系统管理与配置，仅管理员可访问</p>
        </div>

        <div className="admin-layout">
          {/* 左侧 Tab 导航 */}
          <div className="admin-sidebar">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`sidebar-tab ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 右侧内容 */}
          <div className="admin-content">
            {activeTab === 'monitor'    && <ResourceMonitor />}
            {activeTab === 'permission' && <PermissionAssign />}
            {activeTab === 'data'       && <DataManagement />}
            {activeTab === 'users'      && <UserManagement />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminPanel
