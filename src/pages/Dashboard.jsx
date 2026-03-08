import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  return (
    <Layout onLogout={onLogout}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>欢迎使用数据传输可视化系统</h1>
          <p>无人机辅助物联网数据收集可视化平台</p>
        </div>

        <div className="dashboard-cards">
          <Link to="/scenarios" className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>场景配置</h3>
            <p>配置三大研究场景参数，提交仿真实验</p>
          </Link>

          <Link to="/experiments" className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>实验结果</h3>
            <p>查看实验结果与帕累托解集决策</p>
          </Link>

          {currentUser.role === 'admin' && (
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>用户管理</h3>
              <p>管理系统用户账号</p>
            </div>
          )}
        </div>

        <div className="system-intro">
          <h2>系统简介</h2>
          <div className="intro-content">
            <div className="intro-section">
              <h3>三大研究场景</h3>
              <ul>
                <li><strong>信息年龄优化：</strong>基于深度强化学习的最小化信息年龄优化场景</li>
                <li><strong>能量效率优化：</strong>基于多目标优化的最大化数据价值和覆盖质量场景</li>
                <li><strong>资源利用优化：</strong>动态环境下最大化资源利用效率优化场景</li>
              </ul>
            </div>

            <div className="intro-section">
              <h3>核心功能</h3>
              <ul>
                <li>场景参数配置与实验提交</li>
                <li>单目标优化结果对比分析</li>
                <li>多目标优化帕累托解集展示与选择</li>
                <li>简洁清晰的表格化数据呈现</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
