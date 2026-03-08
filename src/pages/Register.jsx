import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { users } from '../data/mockData'
import './Login.css'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // 验证用户名长度
    if (username.length < 3) {
      setError('用户名长度至少3个字符')
      return
    }

    // 验证密码长度
    if (password.length < 6) {
      setError('密码长度至少6个字符')
      return
    }

    // 验证两次密码是否一致
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username)
    if (existingUser) {
      setError('用户名已存在')
      return
    }

    // 注册成功（在实际应用中应该调用API）
    setSuccess(true)
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>用户注册</h1>
          <p>创建新账号</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名(至少3个字符)"
              required
            />
          </div>
          
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码(至少6个字符)"
              required
            />
          </div>

          <div className="form-group">
            <label>确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">注册成功！正在跳转到登录页面...</div>}

          <button type="submit" className="btn-primary" disabled={success}>
            {success ? '注册成功' : '注册'}
          </button>

          <div className="login-footer">
            <span>已有账号？</span>
            <Link to="/login">立即登录</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
