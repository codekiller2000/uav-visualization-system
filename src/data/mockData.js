// 用户数据
export const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user1',
    password: 'user123',
    role: 'user'
  }
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

// 实验记录数据
export const experiments = [
  {
    id: 1,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    configuration: 'SN=20, UAV=1, E=10000J',
    description: '单个无人机与多个无线传感器网络的数据收集,最小化平均信息年龄',
    status: 'completed',
    createdAt: '2024-03-08 10:30:00',
    userId: 2
  },
  {
    id: 2,
    scenarioId: 2,
    scenarioName: '能量效率优化',
    description: '仿真参数对比实验',
    configuration: 'SN=300, UAV=3, MUV=1',
    status: 'completed',
    createdAt: '2024-03-08 11:00:00',
    userId: 2
  },
  {
    id: 3,
    scenarioId: 2,
    scenarioName: '能量效率优化',
    description: 'UAV=3, MUV=1',
    configuration: 'SN=300, UAV=3, MUV=1',
    status: 'completed',
    createdAt: '2024-03-08 12:15:00',
    userId: 2
  },
  {
    id: 4,
    scenarioId: 1,
    scenarioName: '信息年龄优化',
    description: 'SN=300, MUV=1',
    configuration: 'SN=300, UAV=2, E=15000J',
    status: 'running',
    createdAt: '2024-03-08 13:00:00',
    userId: 2
  }
]

// 单目标实验结果数据
export const singleObjectiveResults = {
  1: {
    experimentId: 1,
    scenarioType: 'single-objective',
    results: [
      {
        algorithm: 'DQN算法',
        sensorNum: 20,
        avgAoI: 125.3,
        totalEnergy: 8500,
        flightTime: 1200
      },
      {
        algorithm: '随机策略',
        sensorNum: 20,
        avgAoI: 245.6,
        totalEnergy: 8200,
        flightTime: 1150
      },
      {
        algorithm: '贪婪策略',
        sensorNum: 20,
        avgAoI: 178.9,
        totalEnergy: 8800,
        flightTime: 1250
      }
    ]
  },
  4: {
    experimentId: 4,
    scenarioType: 'single-objective',
    results: [
      {
        algorithm: 'DQN算法',
        sensorNum: 300,
        avgAoI: 156.7,
        totalEnergy: 14200,
        flightTime: 2100
      },
      {
        algorithm: '随机策略',
        sensorNum: 300,
        avgAoI: 298.5,
        totalEnergy: 13800,
        flightTime: 2050
      }
    ]
  }
}

// 帕累托解集数据 (多目标优化结果)
export const paretoSolutions = {
  2: {
    experimentId: 2,
    scenarioType: 'multi-objective',
    solutions: [
      {
        id: 'sol_1',
        solutionNum: 1,
        coverageSensors: 28,
        dataValue: 850,
        strategy: '偏向广覆盖',
        description: '该方案优先保证传感器覆盖的广度,适合需要全面监控的应用场景',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 12500,
          flightTime: 1850,
          visitSequence: ['UAV1: S1→S5→S9→S14→S18→S23→S28', 'UAV2: S2→S6→S10→S15→S19→S24→S29', 'UAV3: S3→S7→S11→S16→S20→S25→S30'],
          avgDataValue: 30.4
        }
      },
      {
        id: 'sol_2',
        solutionNum: 2,
        coverageSensors: 25,
        dataValue: 1250,
        strategy: '平衡策略',
        description: '该方案在覆盖与价值间取得平衡,适合大多数应用场景',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 13200,
          flightTime: 1920,
          visitSequence: ['UAV1: S1→S4→S8→S12→S17→S22→S27', 'UAV2: S2→S5→S9→S13→S18→S23→S28', 'UAV3: S3→S6→S10→S15→S20→S25'],
          avgDataValue: 50.0
        }
      },
      {
        id: 'sol_3',
        solutionNum: 3,
        coverageSensors: 22,
        dataValue: 1680,
        strategy: '平衡策略',
        description: '该方案略微倾向高价值数据采集,适合对数据质量有一定要求的场景',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 13800,
          flightTime: 1980,
          visitSequence: ['UAV1: S1→S3→S7→S11→S16→S21→S26', 'UAV2: S2→S4→S8→S13→S18→S24', 'UAV3: S5→S9→S14→S19→S25→S29'],
          avgDataValue: 76.4
        }
      },
      {
        id: 'sol_4',
        solutionNum: 4,
        coverageSensors: 18,
        dataValue: 2100,
        strategy: '偏向高价值',
        description: '该方案优先采集高价值传感器数据,适合对数据价值敏感的应用',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 14200,
          flightTime: 2050,
          visitSequence: ['UAV1: S1→S2→S5→S9→S14→S20', 'UAV2: S3→S6→S10→S15→S21→S26', 'UAV3: S4→S7→S11→S16→S22→S27'],
          avgDataValue: 116.7
        }
      },
      {
        id: 'sol_5',
        solutionNum: 5,
        coverageSensors: 15,
        dataValue: 2450,
        strategy: '偏向高价值',
        description: '该方案极致追求数据价值最大化,适合高价值数据优先的关键应用',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 14500,
          flightTime: 2100,
          visitSequence: ['UAV1: S1→S3→S6→S10→S15', 'UAV2: S2→S4→S7→S11→S16', 'UAV3: S5→S8→S12→S17→S21'],
          avgDataValue: 163.3
        }
      }
    ]
  },
  3: {
    experimentId: 3,
    scenarioType: 'multi-objective',
    solutions: [
      {
        id: 'sol_6',
        solutionNum: 1,
        coverageSensors: 26,
        dataValue: 920,
        strategy: '偏向广覆盖',
        description: '该方案优先保证传感器覆盖的广度',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 12800,
          flightTime: 1900,
          visitSequence: ['UAV1: S1→S5→S9→S13→S17→S21→S25', 'UAV2: S2→S6→S10→S14→S18→S22→S26', 'UAV3: S3→S7→S11→S15→S19→S23'],
          avgDataValue: 35.4
        }
      },
      {
        id: 'sol_7',
        solutionNum: 2,
        coverageSensors: 20,
        dataValue: 1850,
        strategy: '平衡策略',
        description: '该方案在覆盖与价值间取得平衡',
        detailConfig: {
          sensorNum: 30,
          uavNum: 3,
          energyUsed: 13500,
          flightTime: 1950,
          visitSequence: ['UAV1: S1→S4→S8→S12→S17→S22', 'UAV2: S2→S5→S9→S14→S19→S24', 'UAV3: S3→S6→S10→S15→S20→S25'],
          avgDataValue: 92.5
        }
      }
    ]
  }
}
