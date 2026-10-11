import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/client'
import './ExperimentList.css'

// 弹窗组件
function ViewModal({ exp, onClose }) {
  if (!exp) return null
  const images = exp.resultImages || []
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">查看</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="modal-field">
            <span className="modal-label">实验配置：</span>
            {exp.configuration}
          </p>
          <p className="modal-field">
            <span className="modal-label">实验描述：</span>
            {exp.description}
          </p>

          {images.length > 0 ? (
            <div className="modal-images">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`实验结果图 ${idx + 1}`}
                  className="modal-img"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <p className="modal-no-image">暂无结果图片</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ExperimentList({ onLogout }) {
  const navigate = useNavigate()
  const [viewExp, setViewExp] = useState(null)

  // 分页
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [total, setTotal] = useState(0)
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    setLoading(true)
    api.getExperiments(page, pageSize)
      .then(({ list, total }) => {
        setExperiments(list)
        setTotal(total)
      })
      .finally(() => setLoading(false))
  }, [page])

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
              {loading && (
                <tr><td colSpan={5}>加载中...</td></tr>
              )}
              {!loading && experiments.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.id}</td>
                  <td>{exp.configuration}</td>
                  <td>{exp.description}</td>
                  <td>
                    {exp.status === 'completed' ? (
                      <button
                        className="btn-view-result"
                        onClick={() => setViewExp(exp)}
                      >
                        👁 查看
                      </button>
                    ) : (
                      <span className="status-badge running">运行中</span>
                    )}
                  </td>
                  <td>
                    {exp.status === 'completed' ? (
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/experiment/${exp.id}`)}
                      >
                        详情
                      </button>
                    ) : (
                      <span className="text-muted">运行中...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="pagination">
            <span className="pagination-info">共 {total} 条</span>
            <span className="pagination-size">{pageSize}条/页</span>
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              &lt;
            </button>
            <span className="pagination-current">{page}</span>
            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              &gt;
            </button>
            <span className="pagination-goto">
              前往
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={e => {
                  const v = parseInt(e.target.value)
                  if (v >= 1 && v <= totalPages) setPage(v)
                }}
              />
              页
            </span>
          </div>
        </div>
      </div>

      {/* 查看弹窗 */}
      <ViewModal exp={viewExp} onClose={() => setViewExp(null)} />
    </Layout>
  )
}

export default ExperimentList
