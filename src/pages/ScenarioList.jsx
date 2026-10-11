import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/client'
import './ScenarioList.css'

function ScenarioList({ onLogout }) {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getScenarios().then(setScenarios).finally(() => setLoading(false))
  }, [])

  return (
    <Layout onLogout={onLogout}>
      <div className="scenario-list">
        <div className="page-header">
          <h1>场景配置</h1>
          <p>选择研究场景，配置仿真参数并提交实验</p>
        </div>

        {loading && <p>加载中...</p>}

        <div className="scenarios">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="scenario-card">
              <div className="scenario-header">
                <h2>{scenario.title}</h2>
                <span className={`scenario-badge ${scenario.type}`}>
                  {scenario.type === 'single-objective' ? '单目标优化' : '多目标优化'}
                </span>
              </div>

              <div className="scenario-content">
                <p className="scenario-description">{scenario.description}</p>

                <div className="scenario-goal">
                  <strong>优化目标：</strong>
                  <span>{scenario.optimizationGoal}</span>
                </div>
              </div>

              <button
                className="btn-configure"
                onClick={() => navigate(`/scenario/${scenario.id}`)}
              >
                配置参数并提交实验
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ScenarioList
