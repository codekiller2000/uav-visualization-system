import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Layout.css'

function Layout({ children, onLogout }) {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      onLogout()
      navigate('/login')
    }
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          数据传输可视化系统
        </div>
        <div className="navbar-menu">
          <a onClick={() => navigate('/dashboard')}>首页</a>
          <a onClick={() => navigate('/scenarios')}>场景配置</a>
          <a onClick={() => navigate('/experiments')}>实验结果</a>
        </div>
        <div className="navbar-user">
          <span className="user-name">{currentUser.username}</span>
          <button className="btn-logout" onClick={handleLogout}>退出登录</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
