import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await api.login(username, password)
      localStorage.setItem('currentUser', JSON.stringify(user))
      onLogin()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>数据传输可视化系统</h1>
          <p>无人机辅助物联网数据收集</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '登录中...' : '登录'}</button>

          <div className="login-footer">
            <span>还没有账号？</span>
            <Link to="/register">立即注册</Link>
          </div>

          <div className="demo-hint">
            <p>演示账号:</p>
            <p>管理员: admin / admin123</p>
            <p>普通用户: user1 / user123</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
