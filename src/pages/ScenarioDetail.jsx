import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { scenarios } from '../data/mockData'
import './ScenarioDetail.css'

function ScenarioDetail({ onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const scenario = scenarios.find(s => s.id === parseInt(id))
  
  const [formData, setFormData] = useState(() => {
    const initialData = {}
    scenario.parameters.forEach(param => {
      initialData[param.name] = param.default || (param.type === 'select' ? param.options[0] : '')
    })
    return initialData
  })
  
  const [submitting, setSubmitting] = useState(false)

  if (!scenario) {
    return (
      <Layout onLogout={onLogout}>
        <div>场景不存在</div>
      </Layout>
    )
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    // 模拟提交实验
    setTimeout(() => {
      alert('实验提交成功！您可以在"实验结果"页面查看实验状态。')
      setSubmitting(false)
      navigate('/experiments')
    }, 1500)
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="scenario-detail">
        <div className="detail-header">
          <button className="btn-back" onClick={() => navigate('/scenarios')}>
            ← 返回场景列表
          </button>
          <h1>{scenario.title}</h1>
          <span className={`scenario-badge ${scenario.type}`}>
            {scenario.type === 'single-objective' ? '单目标优化' : '多目标优化'}
          </span>
        </div>

        <div className="detail-content">
          <div className="info-section">
            <h2>场景描述</h2>
            <p>{scenario.description}</p>
            
            <div className="optimization-goal">
              <h3>优化目标</h3>
              <p>{scenario.optimizationGoal}</p>
            </div>
          </div>

          <div className="config-section">
            <h2>参数配置</h2>
            <form onSubmit={handleSubmit}>
              {scenario.parameters.map(param => (
                <div key={param.name} className="form-group">
                  <label>{param.label}</label>
                  
                  {param.type === 'number' && (
                    <input
                      type="number"
                      value={formData[param.name]}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      min={param.min}
                      max={param.max}
                      required
                    />
                  )}
                  
                  {param.type === 'select' && (
                    <select
                      value={formData[param.name]}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      required
                    >
                      {param.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? '提交中...' : '提交实验'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ScenarioDetail
