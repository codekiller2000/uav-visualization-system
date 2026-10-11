// ============================================================
// 算法计算接口占位（预留）
// 真实的无人机轨迹优化 / 深度强化学习 / 多目标进化算法尚未接入，
// 此处仅定义接口形状，供后续替换为真实实现。
// ============================================================

/**
 * 运行指定场景的优化算法（占位实现，未真正计算）
 * @param {{ scenarioId: number, params: object }} input
 * @returns {Promise<{ implemented: boolean, message: string }>}
 */
async function runAlgorithm({ scenarioId, params }) {
  // TODO: 接入真实算法实现：
  //   - scenarioId === 1: 深度强化学习最小化信息年龄 (DQN)
  //   - scenarioId === 2: 多目标优化 NSGA-II / MOEA-D
  //   - scenarioId === 3: 动态环境资源利用效率优化
  // 当前仅返回"未实现"占位结果，不进行真实计算。
  return {
    implemented: false,
    message: '算法计算模块尚未接入，当前为预留接口。',
    scenarioId,
    params,
  }
}

module.exports = { runAlgorithm }
