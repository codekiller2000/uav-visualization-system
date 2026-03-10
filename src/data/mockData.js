// 用户数据
export const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', status: 'active', createdAt: '2024-01-01' },
  { id: 2, username: 'user1', password: 'user123', role: 'user', status: 'active', createdAt: '2024-02-10' },
  { id: 3, username: 'researcher1', password: 'res123', role: 'user', status: 'active', createdAt: '2024-02-15' },
  { id: 4, username: 'researcher2', password: 'res456', role: 'user', status: 'disabled', createdAt: '2024-02-20' },
  { id: 5, username: 'testuser', password: 'test123', role: 'user', status: 'active', createdAt: '2024-03-01' },
]

// 用户权限配置
export const userPermissions = [
  {
    userId: 2,
    canViewResults: true,
    canConfigScenario: true,
    canModifyParams: true,
    canAccessScene1: true,
    canAccessScene2: true,
    canAccessScene3: true,
  },
  {
    userId: 3,
    canViewResults: true,
    canConfigScenario: true,
    canModifyParams: false,
    canAccessScene1: true,
    canAccessScene2: true,
    canAccessScene3: false,
  },
  {
    userId: 4,
    canViewResults: true,
    canConfigScenario: false,
    canModifyParams: false,
    canAccessScene1: true,
    canAccessScene2: false,
    canAccessScene3: false,
  },
  {
    userId: 5,
    canViewResults: true,
    canConfigScenario: true,
    canModifyParams: true,
    canAccessScene1: true,
    canAccessScene2: true,
    canAccessScene3: true,
  },
]

// 三大研究场景
export const scenarios = [
  {
    id: 1,
    name: '信息年龄优化',
    title: '基于深度强化学习的最小化信息年龄优化场景',
    description: '单个无人机与多个无线传感器网络的数据收集场景,核心优化目标为最小化传感器节点的平均信息年龄(AoI)。通过深度强化学习算法,优化无人机的飞行轨迹与数据采集策略,在能量约束下降低数据的时效性损失。',
    optimizationGoal: '最小化平均信息年龄',
    type: 'single-objective',
    parameters: [
      { name: 'sensorNum', label: '传感器节点数量', type: 'number', default: 20, min: 10, max: 100 },
      { name: 'uavNum', label: '无人机数量', type: 'number', default: 1, min: 1, max: 5 },
      { name: 'energyConstraint', label: '能量约束(J)', type: 'number', default: 10000, min: 5000, max: 50000 },
      { name: 'algorithm', label: '算法选择', type: 'select', options: ['DQN算法', '随机策略', '贪婪策略'] }
    ]
  },
  {
    id: 2,
    name: '能量效率优化',
    title: '基于多目标优化的最大化数据价值和覆盖质量场景',
    description: '不同传感器节点采集的数据具有不同的价值权重,同时考虑传感器覆盖的广度。核心优化目标为最大化采集数据的总价值与最大化覆盖的传感器数量,形成多目标优化问题,生成帕累托最优解集,供用户根据实际需求选择。',
    optimizationGoal: '最大化数据价值 & 最大化覆盖质量',
    type: 'multi-objective',
    parameters: [
      { name: 'sensorNum', label: '传感器节点数量', type: 'number', default: 30, min: 10, max: 100 },
      { name: 'uavNum', label: '无人机数量', type: 'number', default: 3, min: 1, max: 10 },
      { name: 'energyConstraint', label: '能量约束(J)', type: 'number', default: 15000, min: 5000, max: 50000 },
      { name: 'algorithm', label: '算法选择', type: 'select', options: ['NSGA-II', 'MOEA/D', '加权求和法'] }
    ]
  },
  {
    id: 3,
    name: '资源利用优化',
    title: '动态环境下最大化资源利用效率优化场景',
    description: '传感器节点的数据采集需求与网络状态随时间动态变化,无人机需实时调整访问策略。核心优化目标为最大化系统的资源利用效率,包括能量利用率与时间利用率,确保在动态环境下系统性能的稳定性。',
    optimizationGoal: '最大化资源利用效率',
    type: 'single-objective',
    parameters: [
      { name: 'sensorNum', label: '传感器节点数量', type: 'number', default: 25, min: 10, max: 100 },
      { name: 'uavNum', label: '无人机数量', type: 'number', default: 2, min: 1, max: 10 },
      { name: 'energyConstraint', label: '能量约束(J)', type: 'number', default: 12000, min: 5000, max: 50000 },
      { name: 'timeWindow', label: '时间窗口(s)', type: 'number', default: 3600, min: 1800, max: 7200 },
      { name: 'algorithm', label: '算法选择', type: 'select', options: ['动态规划算法', '启发式算法', '贪婪算法'] }
    ]
  }
]

// 实验记录数据（所有用户共享可见的实验列表，参考截图）
export const experiments = [
  {
    id: 1,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: '系统架构设计',
    description: '单无人车与多无人机辅助数据收集的信息年龄最小化问题',
    status: 'completed',
    createdAt: '2024-03-01 09:00:00',
    userId: 2,
    // 弹窗查看时的图片（用在线占位图模拟学术图表）
    resultImages: [
      'https://placehold.co/380x260/e8f4fd/1565c0?text=Fig.1+AoI+vs+Sensor+Number',
      'https://placehold.co/380x260/e8f5e9/2e7d32?text=Fig.2+Energy+Consumption'
    ]
  },
  {
    id: 2,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: '仿真参数列表',
    description: '单无人车与多无人机辅助数据收集的信息年龄最小化问题',
    status: 'completed',
    createdAt: '2024-03-02 10:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/fff3e0/e65100?text=Fig.3+Simulation+Params',
    ]
  },
  {
    id: 3,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'UAV=3, MUV=1',
    description: '不同算法下的平均AoI和最大任务时间与传感器数量的关系',
    status: 'completed',
    createdAt: '2024-03-03 11:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/fce4ec/c62828?text=Fig.4+Avg+AoI+vs+SN',
      'https://placehold.co/380x260/f3e5f5/6a1b9a?text=Fig.5+Max+Task+Time'
    ]
  },
  {
    id: 4,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, MUV=1',
    description: '不同无人机数量下的平均AoI和最大任务时间',
    status: 'completed',
    createdAt: '2024-03-04 09:30:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e8f4fd/0d47a1?text=Fig.6+UAV+Count+vs+AoI',
    ]
  },
  {
    id: 5,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, MUV=1',
    description: '不同无人机数量下的无人车行进时长',
    status: 'completed',
    createdAt: '2024-03-05 14:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e8f5e9/1b5e20?text=Fig.7+MUV+Travel+Time',
    ]
  },
  {
    id: 6,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, UAV=3',
    description: '无人车存在与否时的平均AoI和最大任务时间',
    status: 'completed',
    createdAt: '2024-03-06 10:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/fff8e1/f57f17?text=Fig.8+MUV+Impact',
    ]
  },
  {
    id: 7,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, UAV=3, MUV=1',
    description: '不同无人机速度和无人机速度对平均AoI和最大任务时间的影响',
    status: 'completed',
    createdAt: '2024-03-07 09:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e3f2fd/1565c0?text=Fig.9+Speed+vs+AoI',
      'https://placehold.co/380x260/f1f8e9/33691e?text=Fig.10+Speed+vs+Task+Time'
    ]
  },
  {
    id: 8,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, UAV=3, MUV=1',
    description: '不同无人机最大电池容量和能量阈值对最大任务时间的影响',
    status: 'completed',
    createdAt: '2024-03-08 10:30:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/fce4ec/880e4f?text=Fig.11+Battery+vs+AoI',
      'https://placehold.co/380x260/ede7f6/4527a0?text=Fig.12+Battery+vs+Task+Time'
    ]
  },
  {
    id: 9,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, MUV=1',
    description: '不同无人机数量下的最大任务时间与数据量的关系',
    status: 'completed',
    createdAt: '2024-03-09 11:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e0f2f1/004d40?text=Fig.13+Data+Volume',
    ]
  },
  {
    id: 10,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=300, UAV=3, MUV=1',
    description: '能量权重参数对平均AoI和最大任务时间的影响',
    status: 'completed',
    createdAt: '2024-03-10 09:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e8eaf6/283593?text=Fig.14+Energy+Weight',
    ]
  },
  // 场景二：能量效率优化（多目标）
  {
    id: 11,
    scenarioId: 2,
    scenarioName: '能量效率优化',
    configuration: 'SN=50, UAV=3',
    description: '多目标优化帕累托前沿解集对比实验',
    status: 'completed',
    createdAt: '2024-03-11 10:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e8f4fd/1565c0?text=Pareto+Front+SN%3D50',
    ]
  },
  {
    id: 12,
    scenarioId: 2,
    scenarioName: '能量效率优化',
    configuration: 'SN=100, UAV=5',
    description: '不同传感器密度下的价值-覆盖权衡分析',
    status: 'completed',
    createdAt: '2024-03-12 14:00:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/fce4ec/c62828?text=Value-Coverage+Tradeoff',
    ]
  },
  // 场景三：资源利用优化
  {
    id: 13,
    scenarioId: 3,
    scenarioName: '资源利用优化',
    configuration: 'SN=25, UAV=2, T=3600s',
    description: '动态环境下资源利用效率对比基准算法',
    status: 'completed',
    createdAt: '2024-03-13 09:30:00',
    userId: 2,
    resultImages: [
      'https://placehold.co/380x260/e8f5e9/1b5e20?text=Resource+Efficiency',
      'https://placehold.co/380x260/fff3e0/e65100?text=Energy+Utilization'
    ]
  },
  {
    id: 14,
    scenarioId: 3,
    scenarioName: '资源利用优化',
    configuration: 'SN=50, UAV=4, T=7200s',
    description: '时间窗口长度对系统资源利用效率的影响',
    status: 'running',
    createdAt: '2024-03-14 10:00:00',
    userId: 2,
    resultImages: []
  },
]

// 单目标实验结果数据
export const singleObjectiveResults = {
  1: {
    experimentId: 1,
    scenarioType: 'single-objective',
    results: [
      { algorithm: 'DQN算法', sensorNum: 20, avgAoI: 125.3, totalEnergy: 8500, flightTime: 1200 },
      { algorithm: '随机策略', sensorNum: 20, avgAoI: 245.6, totalEnergy: 8200, flightTime: 1150 },
      { algorithm: '贪婪策略', sensorNum: 20, avgAoI: 178.9, totalEnergy: 8800, flightTime: 1250 }
    ]
  },
  3: {
    experimentId: 3,
    scenarioType: 'single-objective',
    results: [
      { algorithm: 'DQN算法 (UAV=1)', sensorNum: 300, avgAoI: 198.4, totalEnergy: 12800, flightTime: 1900 },
      { algorithm: 'DQN算法 (UAV=2)', sensorNum: 300, avgAoI: 152.1, totalEnergy: 13500, flightTime: 2100 },
      { algorithm: 'DQN算法 (UAV=3)', sensorNum: 300, avgAoI: 118.7, totalEnergy: 14200, flightTime: 2400 },
      { algorithm: '随机策略 (UAV=3)', sensorNum: 300, avgAoI: 287.3, totalEnergy: 13900, flightTime: 2350 },
      { algorithm: '贪婪策略 (UAV=3)', sensorNum: 300, avgAoI: 206.5, totalEnergy: 14500, flightTime: 2480 },
    ]
  },
  4: {
    experimentId: 4,
    scenarioType: 'single-objective',
    results: [
      { algorithm: 'DQN算法 (UAV=1)', sensorNum: 300, avgAoI: 312.5, totalEnergy: 10200, flightTime: 1600 },
      { algorithm: 'DQN算法 (UAV=2)', sensorNum: 300, avgAoI: 198.3, totalEnergy: 12500, flightTime: 2100 },
      { algorithm: 'DQN算法 (UAV=3)', sensorNum: 300, avgAoI: 156.7, totalEnergy: 14200, flightTime: 2400 },
      { algorithm: 'DQN算法 (UAV=5)', sensorNum: 300, avgAoI: 112.4, totalEnergy: 18500, flightTime: 2800 },
    ]
  },
  13: {
    experimentId: 13,
    scenarioType: 'single-objective',
    results: [
      { algorithm: '动态规划算法', sensorNum: 25, avgAoI: 0, resourceEfficiency: 87.4, totalEnergy: 10800, flightTime: 3200 },
      { algorithm: '启发式算法', sensorNum: 25, avgAoI: 0, resourceEfficiency: 79.2, totalEnergy: 10200, flightTime: 3100 },
      { algorithm: '贪婪算法', sensorNum: 25, avgAoI: 0, resourceEfficiency: 65.8, totalEnergy: 9800, flightTime: 2900 },
    ]
  },
}

// 帕累托解集数据 (多目标优化结果)
export const paretoSolutions = {
  11: {
    experimentId: 11,
    scenarioType: 'multi-objective',
    solutions: [
      {
        id: 'sol_1',
        solutionNum: 1,
        coverageSensors: 48,
        dataValue: 720,
        strategy: '偏向广覆盖',
        description: '该方案优先保证传感器覆盖的广度，适合需要全面监控的应用场景',
        detailConfig: {
          sensorNum: 50, uavNum: 3, energyUsed: 11500, flightTime: 1700,
          visitSequence: ['UAV1: S1→S5→S10→S15→S20→S25→S30→S35', 'UAV2: S2→S6→S11→S16→S21→S26→S31→S40', 'UAV3: S3→S7→S12→S17→S22→S27→S32→S45'],
          avgDataValue: 15.0
        }
      },
      {
        id: 'sol_2',
        solutionNum: 2,
        coverageSensors: 42,
        dataValue: 1050,
        strategy: '平衡策略',
        description: '该方案在覆盖广度与数据价值之间取得较好平衡',
        detailConfig: {
          sensorNum: 50, uavNum: 3, energyUsed: 12200, flightTime: 1800,
          visitSequence: ['UAV1: S1→S4→S8→S12→S17→S22→S27', 'UAV2: S2→S5→S9→S13→S18→S23→S28', 'UAV3: S3→S6→S10→S15→S20→S25→S30'],
          avgDataValue: 25.0
        }
      },
      {
        id: 'sol_3',
        solutionNum: 3,
        coverageSensors: 35,
        dataValue: 1480,
        strategy: '平衡策略',
        description: '该方案略微倾向高价值数据采集，适合对数据质量有一定要求的场景',
        detailConfig: {
          sensorNum: 50, uavNum: 3, energyUsed: 12800, flightTime: 1880,
          visitSequence: ['UAV1: S1→S3→S7→S11→S16→S21', 'UAV2: S2→S4→S8→S13→S18→S24', 'UAV3: S5→S9→S14→S19→S25→S29'],
          avgDataValue: 42.3
        }
      },
      {
        id: 'sol_4',
        solutionNum: 4,
        coverageSensors: 28,
        dataValue: 1950,
        strategy: '偏向高价值',
        description: '该方案优先采集高价值传感器数据，适合对数据价值敏感的应用',
        detailConfig: {
          sensorNum: 50, uavNum: 3, energyUsed: 13500, flightTime: 1960,
          visitSequence: ['UAV1: S1→S2→S5→S9→S14→S20', 'UAV2: S3→S6→S10→S15→S21→S26', 'UAV3: S4→S7→S11→S16→S22→S27'],
          avgDataValue: 69.6
        }
      },
      {
        id: 'sol_5',
        solutionNum: 5,
        coverageSensors: 18,
        dataValue: 2380,
        strategy: '偏向高价值',
        description: '该方案极致追求数据价值最大化，适合高价值数据优先的关键应用',
        detailConfig: {
          sensorNum: 50, uavNum: 3, energyUsed: 14200, flightTime: 2050,
          visitSequence: ['UAV1: S1→S3→S6→S10→S15→S19', 'UAV2: S2→S4→S7→S11→S16', 'UAV3: S5→S8→S12→S17→S21'],
          avgDataValue: 132.2
        }
      }
    ]
  },
  12: {
    experimentId: 12,
    scenarioType: 'multi-objective',
    solutions: [
      {
        id: 'sol_6',
        solutionNum: 1,
        coverageSensors: 96,
        dataValue: 1850,
        strategy: '偏向广覆盖',
        description: '高密度传感器场景下最大覆盖方案',
        detailConfig: {
          sensorNum: 100, uavNum: 5, energyUsed: 22000, flightTime: 3200,
          visitSequence: ['UAV1: S1-S20', 'UAV2: S21-S40', 'UAV3: S41-S60', 'UAV4: S61-S80', 'UAV5: S81-S96'],
          avgDataValue: 19.3
        }
      },
      {
        id: 'sol_7',
        solutionNum: 2,
        coverageSensors: 75,
        dataValue: 3200,
        strategy: '平衡策略',
        description: '覆盖与价值均衡的折中方案',
        detailConfig: {
          sensorNum: 100, uavNum: 5, energyUsed: 23500, flightTime: 3400,
          visitSequence: ['UAV1: 高价值区 S1-S15', 'UAV2: 高价值区 S16-S30', 'UAV3: S31-S55', 'UAV4: S56-S75', 'UAV5: S76-S90'],
          avgDataValue: 42.7
        }
      },
      {
        id: 'sol_8',
        solutionNum: 3,
        coverageSensors: 50,
        dataValue: 4900,
        strategy: '偏向高价值',
        description: '聚焦前50%最高价值传感器的精准采集方案',
        detailConfig: {
          sensorNum: 100, uavNum: 5, energyUsed: 24800, flightTime: 3600,
          visitSequence: ['UAV1: Top-Value S1-S10', 'UAV2: Top-Value S11-S20', 'UAV3: Top-Value S21-S30', 'UAV4: Top-Value S31-S40', 'UAV5: Top-Value S41-S50'],
          avgDataValue: 98.0
        }
      }
    ]
  },
  // 原有数据保留（实验2、3 帕累托解集）
  2: {
    experimentId: 2,
    scenarioType: 'multi-objective',
    solutions: [
      {
        id: 'sol_a1', solutionNum: 1, coverageSensors: 28, dataValue: 850, strategy: '偏向广覆盖',
        description: '该方案优先保证传感器覆盖的广度，适合需要全面监控的应用场景',
        detailConfig: { sensorNum: 30, uavNum: 3, energyUsed: 12500, flightTime: 1850, visitSequence: ['UAV1: S1→S5→S9→S14→S18→S23→S28', 'UAV2: S2→S6→S10→S15→S19→S24→S29', 'UAV3: S3→S7→S11→S16→S20→S25→S30'], avgDataValue: 30.4 }
      },
      {
        id: 'sol_a2', solutionNum: 2, coverageSensors: 25, dataValue: 1250, strategy: '平衡策略',
        description: '该方案在覆盖与价值间取得平衡，适合大多数应用场景',
        detailConfig: { sensorNum: 30, uavNum: 3, energyUsed: 13200, flightTime: 1920, visitSequence: ['UAV1: S1→S4→S8→S12→S17→S22→S27', 'UAV2: S2→S5→S9→S13→S18→S23→S28', 'UAV3: S3→S6→S10→S15→S20→S25'], avgDataValue: 50.0 }
      },
      {
        id: 'sol_a3', solutionNum: 3, coverageSensors: 22, dataValue: 1680, strategy: '平衡策略',
        description: '该方案略微倾向高价值数据采集',
        detailConfig: { sensorNum: 30, uavNum: 3, energyUsed: 13800, flightTime: 1980, visitSequence: ['UAV1: S1→S3→S7→S11→S16→S21→S26', 'UAV2: S2→S4→S8→S13→S18→S24', 'UAV3: S5→S9→S14→S19→S25→S29'], avgDataValue: 76.4 }
      },
      {
        id: 'sol_a4', solutionNum: 4, coverageSensors: 18, dataValue: 2100, strategy: '偏向高价值',
        description: '该方案优先采集高价值传感器数据',
        detailConfig: { sensorNum: 30, uavNum: 3, energyUsed: 14200, flightTime: 2050, visitSequence: ['UAV1: S1→S2→S5→S9→S14→S20', 'UAV2: S3→S6→S10→S15→S21→S26', 'UAV3: S4→S7→S11→S16→S22→S27'], avgDataValue: 116.7 }
      },
      {
        id: 'sol_a5', solutionNum: 5, coverageSensors: 15, dataValue: 2450, strategy: '偏向高价值',
        description: '该方案极致追求数据价值最大化',
        detailConfig: { sensorNum: 30, uavNum: 3, energyUsed: 14500, flightTime: 2100, visitSequence: ['UAV1: S1→S3→S6→S10→S15', 'UAV2: S2→S4→S7→S11→S16', 'UAV3: S5→S8→S12→S17→S21'], avgDataValue: 163.3 }
      }
    ]
  },
}

// ===================== 后台管理 Mock 数据 =====================

// 系统资源监控数据
export const resourceMonitorData = [
  { id: 1, metric: '实验任务运行数', value: 3, unit: '个', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 2, metric: '实验任务队列数', value: 1, unit: '个', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 3, metric: '数据库存储占用', value: 284.6, unit: 'MB', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 4, metric: '帕累托解集记录数', value: 48, unit: '条', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 5, metric: '实验配置记录数', value: 14, unit: '条', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 6, metric: '今日用户访问次数', value: 37, unit: '次', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 7, metric: '近7日新增实验数', value: 14, unit: '个', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 8, metric: '系统已运行时长', value: 72, unit: '小时', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 9, metric: '后端 API 平均响应时延', value: 42, unit: 'ms', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
  { id: 10, metric: '数据库连接池使用率', value: 18, unit: '%', status: 'normal', updatedAt: '2024-03-14 10:05:00' },
]

// 数据库资源管理（实验配置表）
export const dbExperimentConfigs = [
  { id: 1, scenarioId: 1, scenarioName: '信息年龄优化', sensorNum: 20, uavNum: 1, energyConstraint: 10000, algorithm: 'DQN算法', createdAt: '2024-03-01' },
  { id: 2, scenarioId: 1, scenarioName: '信息年龄优化', sensorNum: 300, uavNum: 3, energyConstraint: 15000, algorithm: 'DQN算法', createdAt: '2024-03-02' },
  { id: 3, scenarioId: 1, scenarioName: '信息年龄优化', sensorNum: 300, uavNum: 3, energyConstraint: 14000, algorithm: '随机策略', createdAt: '2024-03-03' },
  { id: 4, scenarioId: 2, scenarioName: '能量效率优化', sensorNum: 50, uavNum: 3, energyConstraint: 12000, algorithm: 'NSGA-II', createdAt: '2024-03-11' },
  { id: 5, scenarioId: 2, scenarioName: '能量效率优化', sensorNum: 100, uavNum: 5, energyConstraint: 25000, algorithm: 'NSGA-II', createdAt: '2024-03-12' },
  { id: 6, scenarioId: 3, scenarioName: '资源利用优化', sensorNum: 25, uavNum: 2, energyConstraint: 12000, algorithm: '动态规划算法', createdAt: '2024-03-13' },
]
