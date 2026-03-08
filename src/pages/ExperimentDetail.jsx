import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { experiments, singleObjectiveResults, paretoSolutions } from '../data/mockData'
import './ExperimentDetail.css'

function ExperimentDetail({ onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const experiment = experiments.find(exp => exp.id === parseInt(id))
  const [selectedSolution, setSelectedSolution] = useState(null)

  if (!experiment) {
    return (
      <Layout onLogout={onLogout}>
        <div>实验不存在</div>
      </Layout>
    )
  }

  // 判断实验类型
  const isSingleObjective = singleObjectiveResults[experiment.id] !== undefined
  const isMultiObjective = paretoSolutions[experiment.id] !== undefined

  const renderSingleObjectiveResults = () => {
    const results = singleObjectiveResults[experiment.id]
    if (!results) return null

    return (
      <div className="results-section">
        <h2>实验结果对比</h2>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>算法名称</th>
                <th>传感器数量</th>
                <th>平均信息年龄</th>
                <th>总能耗(J)</th>
                <th>飞行时间(s)</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((result, index) => (
                <tr key={index} className={index === 0 ? 'best-result' : ''}>
                  <td>{result.algorithm}</td>
                  <td>{result.sensorNum}</td>
                  <td>{result.avgAoI}</td>
                  <td>{result.totalEnergy}</td>
                  <td>{result.flightTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="result-note">
          <strong>说明：</strong>高亮行为本文算法结果，其他行为基准算法结果
        </div>
      </div>
    )
  }

  const renderParetoSolutions = () => {
    const data = paretoSolutions[experiment.id]
    if (!data) return null

    return (
      <div className="pareto-section">
        <h2>帕累托最优解集列表</h2>
        <p className="pareto-intro">
          以下为多目标优化生成的帕累托最优解集，每个方案在覆盖与价值间有不同的权衡。
          请根据实际需求选择最适合的方案。
        </p>

        <div className="pareto-table-container">
          <table className="pareto-table">
            <thead>
              <tr>
                <th>解编号</th>
                <th>覆盖传感器数量</th>
                <th>采集数据总价值</th>
                <th>策略倾向</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.solutions.map((solution) => (
                <tr 
                  key={solution.id}
                  className={selectedSolution?.id === solution.id ? 'selected-row' : ''}
                >
                  <td>{solution.solutionNum}</td>
                  <td>{solution.coverageSensors}</td>
                  <td>{solution.dataValue}</td>
                  <td>
                    <span className={`strategy-badge ${solution.strategy}`}>
                      {solution.strategy}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-select"
                      onClick={() => setSelectedSolution(solution)}
                    >
                      选择此方案
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSolution && (
          <div className="solution-detail">
            <h3>选中方案详情 - 方案 {selectedSolution.solutionNum}</h3>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label>策略说明</label>
                <p>{selectedSolution.description}</p>
              </div>

              <div className="detail-item">
                <label>覆盖传感器数量</label>
                <p>{selectedSolution.coverageSensors} 个</p>
              </div>

              <div className="detail-item">
                <label>采集数据总价值</label>
                <p>{selectedSolution.dataValue}</p>
              </div>

              <div className="detail-item">
                <label>平均数据价值</label>
                <p>{selectedSolution.detailConfig.avgDataValue}</p>
              </div>

              <div className="detail-item">
                <label>能量消耗</label>
                <p>{selectedSolution.detailConfig.energyUsed} J</p>
              </div>

              <div className="detail-item">
                <label>飞行时间</label>
                <p>{selectedSolution.detailConfig.flightTime} 秒</p>
              </div>
            </div>

            <div className="visit-sequence">
              <h4>无人机访问顺序</h4>
              <ul>
                {selectedSolution.detailConfig.visitSequence.map((seq, index) => (
                  <li key={index}>{seq}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="experiment-detail">
        <div className="detail-header">
          <button className="btn-back" onClick={() => navigate('/experiments')}>
            ← 返回实验列表
          </button>
          <h1>实验详情</h1>
        </div>

        <div className="experiment-info">
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">实验编号：</span>
              <span>{experiment.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">场景名称：</span>
              <span>{experiment.scenarioName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">实验配置：</span>
              <span>{experiment.configuration}</span>
            </div>
            <div className="info-row">
              <span className="info-label">实验描述：</span>
              <span>{experiment.description}</span>
            </div>
            <div className="info-row">
              <span className="info-label">创建时间：</span>
              <span>{experiment.createdAt}</span>
            </div>
          </div>
        </div>

        {isSingleObjective && renderSingleObjectiveResults()}
        {isMultiObjective && renderParetoSolutions()}
      </div>
    </Layout>
  )
}

export default ExperimentDetail
