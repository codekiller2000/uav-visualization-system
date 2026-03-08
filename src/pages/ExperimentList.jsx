import React from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { experiments } from '../data/mockData'
import './ExperimentList.css'

function ExperimentList({ onLogout }) {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  
  // 过滤当前用户的实验
  const userExperiments = experiments.filter(exp => exp.userId === currentUser.id)

  return (
    <Layout onLogout={onLogout}>
      <div className="experiment-list">
        <div className="page-header">
          <h1>实验结果</h1>
          <p>查看实验记录与帕累托解集决策</p>
        </div>

        <div className="experiments-table-container">
          <table className="experiments-table">
            <thead>
              <tr>
                <th>实验编号</th>
                <th>实验配置</th>
                <th>实验描述</th>
                <th>实验结果</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {userExperiments.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.id}</td>
                  <td>{exp.configuration}</td>
                  <td>{exp.description}</td>
                  <td>
                    <span className={`status-badge ${exp.status}`}>
                      {exp.status === 'completed' ? '已完成' : '运行中'}
                    </span>
                  </td>
                  <td>
                    {exp.status === 'completed' ? (
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/experiment/${exp.id}`)}
                      >
                        查看
                      </button>
                    ) : (
                      <span className="text-muted">运行中...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {userExperiments.length === 0 && (
            <div className="empty-state">
              <p>暂无实验记录</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/scenarios')}
              >
                前往场景配置
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ExperimentList
