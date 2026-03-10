// ============================================================
// 实验结果图表 URL 生成工具（使用 quickchart.io 生成学术风格柱状图）
// ============================================================

function makeChartUrl(config) {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&w=420&h=280&bkg=white`
}

// ---------- 实验 1：系统架构 - 单无人机 vs 多无人机 平均AoI ----------
const exp1Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'm=1', data: [85, 132, 178, 224, 267], backgroundColor: '#4472C4' },
      { label: 'm=2', data: [62, 98, 135, 170, 203], backgroundColor: '#ED7D31' },
      { label: 'm=3', data: [48, 76, 105, 132, 158], backgroundColor: '#A9D18E' },
      { label: 'm=5', data: [35, 55, 75, 95, 113], backgroundColor: '#FF99CC' },
      { label: 'm=10', data: [24, 38, 52, 65, 78], backgroundColor: '#9966CC' },
    ]
  },
  options: {
    title: { display: true, text: '(a) The average AoI of SNs versus the number of SNs', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

const exp1Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'm=1', data: [520, 810, 1150, 1480, 1820], backgroundColor: '#4472C4' },
      { label: 'm=2', data: [420, 650, 920, 1185, 1450], backgroundColor: '#ED7D31' },
      { label: 'm=3', data: [340, 525, 745, 960, 1180], backgroundColor: '#A9D18E' },
      { label: 'm=5', data: [260, 400, 570, 735, 900], backgroundColor: '#FF99CC' },
      { label: 'm=10', data: [185, 285, 405, 520, 638], backgroundColor: '#9966CC' },
    ]
  },
  options: {
    title: { display: true, text: '(b) The largest mission time versus the number of SNs', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

// ---------- 实验 2：仿真参数对比 - 不同算法 AoI ----------
const exp2Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'DQN', data: [72, 115, 148, 195, 238, 281], backgroundColor: '#4472C4' },
      { label: 'Random', data: [145, 228, 312, 398, 485, 568], backgroundColor: '#ED7D31' },
      { label: 'Greedy', data: [98, 155, 206, 265, 320, 378], backgroundColor: '#A9D18E' },
      { label: 'Baseline', data: [120, 188, 252, 320, 385, 450], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(a) Average AoI vs Number of Sensors (UAV=3)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

const exp2Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'DQN', data: [310, 490, 685, 865, 1050, 1240], backgroundColor: '#4472C4' },
      { label: 'Random', data: [520, 820, 1120, 1430, 1740, 2050], backgroundColor: '#ED7D31' },
      { label: 'Greedy', data: [415, 655, 895, 1135, 1378, 1620], backgroundColor: '#A9D18E' },
      { label: 'Baseline', data: [465, 735, 1005, 1270, 1540, 1810], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(b) Largest mission time vs Number of Sensors (UAV=3)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

// ---------- 实验 3：不同算法 AoI vs 传感器数量（UAV=3, MUV=1）----------
const exp3Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'DQN-MUV', data: [58, 92, 118, 154, 188], backgroundColor: '#4472C4' },
      { label: 'DQN', data: [72, 115, 148, 195, 238], backgroundColor: '#ED7D31' },
      { label: 'Greedy-MUV', data: [78, 122, 158, 205, 252], backgroundColor: '#A9D18E' },
      { label: 'Greedy', data: [98, 155, 206, 265, 320], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(a) Avg AoI - Algorithm comparison (UAV=3, MUV=1)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

const exp3Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'DQN-MUV', data: [255, 402, 560, 720, 880], backgroundColor: '#4472C4' },
      { label: 'DQN', data: [310, 490, 685, 865, 1050], backgroundColor: '#ED7D31' },
      { label: 'Greedy-MUV', data: [330, 518, 720, 918, 1120], backgroundColor: '#A9D18E' },
      { label: 'Greedy', data: [415, 655, 895, 1135, 1378], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(b) Largest mission time - Algorithm comparison (UAV=3, MUV=1)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

// ---------- 实验 4：不同无人机数量 AoI ----------
const exp4Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'UAV=1', data: [145, 228, 312, 398, 485, 568], backgroundColor: '#4472C4' },
      { label: 'UAV=2', data: [98, 155, 206, 265, 320, 378], backgroundColor: '#ED7D31' },
      { label: 'UAV=3', data: [72, 115, 148, 195, 238, 281], backgroundColor: '#A9D18E' },
      { label: 'UAV=5', data: [52, 82, 108, 138, 168, 198], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(a) Average AoI vs UAV count (SN=300, MUV=1)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

const exp4Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'UAV=1', data: [620, 975, 1330, 1690, 2050, 2410], backgroundColor: '#4472C4' },
      { label: 'UAV=2', data: [415, 655, 895, 1135, 1378, 1620], backgroundColor: '#ED7D31' },
      { label: 'UAV=3', data: [310, 490, 685, 865, 1050, 1240], backgroundColor: '#A9D18E' },
      { label: 'UAV=5', data: [220, 348, 485, 618, 750, 882], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: '(b) Largest mission time vs UAV count (SN=300, MUV=1)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

// ---------- 实验 5：不同无人机数量下MUV行进时长 ----------
const exp5Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['UAV=1', 'UAV=2', 'UAV=3', 'UAV=5', 'UAV=8'],
    datasets: [
      { label: 'MUV travel time (s)', data: [1820, 1350, 980, 720, 540], backgroundColor: ['#4472C4', '#ED7D31', '#A9D18E', '#FF99CC', '#9966CC'] }
    ]
  },
  options: {
    title: { display: true, text: 'MUV travel time vs UAV count (SN=300)', fontSize: 12 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Number of UAVs' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'MUV travel time (s)' } }]
    },
    legend: { display: false }
  }
})

// ---------- 实验 6：无人车存在与否 AoI对比 ----------
const exp6Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'w/ MUV', data: [58, 92, 118, 154, 188], backgroundColor: '#4472C4' },
      { label: 'w/o MUV', data: [72, 115, 148, 195, 238], backgroundColor: '#ED7D31' },
    ]
  },
  options: {
    title: { display: true, text: 'Average AoI: with vs without MUV (SN=300, UAV=3)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

const exp6Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500'],
    datasets: [
      { label: 'w/ MUV', data: [255, 402, 560, 720, 880], backgroundColor: '#4472C4' },
      { label: 'w/o MUV', data: [310, 490, 685, 865, 1050], backgroundColor: '#ED7D31' },
    ]
  },
  options: {
    title: { display: true, text: 'Largest mission time: with vs without MUV (SN=300, UAV=3)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

// ---------- 实验 7：不同速度影响 ----------
const exp7Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['v=5', 'v=10', 'v=15', 'v=20', 'v=25'],
    datasets: [
      { label: 'UAV speed', data: [198, 165, 145, 128, 115], backgroundColor: '#4472C4' },
      { label: 'MUV speed', data: [175, 155, 140, 128, 118], backgroundColor: '#ED7D31' },
    ]
  },
  options: {
    title: { display: true, text: '(a) Average AoI vs speed (SN=300, UAV=3, MUV=1)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Speed (m/s)' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

const exp7Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['v=5', 'v=10', 'v=15', 'v=20', 'v=25'],
    datasets: [
      { label: 'UAV speed', data: [1250, 1050, 920, 810, 720], backgroundColor: '#4472C4' },
      { label: 'MUV speed', data: [1120, 980, 870, 775, 695], backgroundColor: '#ED7D31' },
    ]
  },
  options: {
    title: { display: true, text: '(b) Largest mission time vs speed (SN=300, UAV=3, MUV=1)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Speed (m/s)' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

// ---------- 实验 8：电池容量和能量阈值影响 ----------
const exp8Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'E_max=5000J', data: [195, 308, 425, 542, 660, 778], backgroundColor: '#4472C4' },
      { label: 'E_max=10000J', data: [158, 248, 338, 428, 518, 608], backgroundColor: '#ED7D31' },
      { label: 'E_max=15000J', data: [135, 212, 290, 368, 445, 522], backgroundColor: '#A9D18E' },
      { label: 'E_max=20000J', data: [118, 185, 253, 320, 388, 455], backgroundColor: '#FF99CC' },
      { label: 'E_max=25000J', data: [105, 165, 225, 285, 345, 405], backgroundColor: '#9966CC' },
    ]
  },
  options: {
    title: { display: true, text: '(a) Average AoI vs battery capacity (SN=300, UAV=3)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Average AoI' } }]
    },
    legend: { position: 'top', labels: { fontSize: 9 } }
  }
})

const exp8Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['100', '200', '300', '400', '500', '600'],
    datasets: [
      { label: 'E_max=5000J', data: [758, 1195, 1648, 2100, 2555, 3010], backgroundColor: '#4472C4' },
      { label: 'E_max=10000J', data: [620, 978, 1338, 1700, 2062, 2425], backgroundColor: '#ED7D31' },
      { label: 'E_max=15000J', data: [528, 832, 1140, 1448, 1758, 2068], backgroundColor: '#A9D18E' },
      { label: 'E_max=20000J', data: [465, 732, 1002, 1272, 1542, 1812], backgroundColor: '#FF99CC' },
      { label: 'E_max=25000J', data: [415, 654, 896, 1138, 1380, 1622], backgroundColor: '#9966CC' },
    ]
  },
  options: {
    title: { display: true, text: '(b) Largest mission time vs battery capacity (SN=300, UAV=3)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'The number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 9 } }
  }
})

// ---------- 实验 9：最大任务时间 vs 数据量 ----------
const exp9Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['50KB', '100KB', '200KB', '500KB', '1MB'],
    datasets: [
      { label: 'UAV=1', data: [420, 580, 780, 1050, 1380], backgroundColor: '#4472C4' },
      { label: 'UAV=2', data: [310, 430, 580, 785, 1030], backgroundColor: '#ED7D31' },
      { label: 'UAV=3', data: [248, 342, 462, 625, 820], backgroundColor: '#A9D18E' },
      { label: 'UAV=5', data: [188, 258, 348, 472, 620], backgroundColor: '#FF99CC' },
    ]
  },
  options: {
    title: { display: true, text: 'Largest mission time vs data volume (SN=300, MUV=1)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Data volume per sensor' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { position: 'top', labels: { fontSize: 10 } }
  }
})

// ---------- 实验 10：能量权重参数影响 ----------
const exp10Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['α=0.1', 'α=0.3', 'α=0.5', 'α=0.7', 'α=0.9'],
    datasets: [
      { label: 'Avg AoI', data: [195, 168, 148, 138, 135], backgroundColor: '#4472C4' },
      { label: 'Energy (×100J)', data: [88, 108, 125, 138, 148], backgroundColor: '#ED7D31' },
    ]
  },
  options: {
    title: { display: true, text: 'Effect of energy weight α (SN=300, UAV=3, MUV=1)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Energy weight α' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Value' } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

const exp10Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['α=0.1', 'α=0.3', 'α=0.5', 'α=0.7', 'α=0.9'],
    datasets: [
      { label: 'Largest mission time', data: [1380, 1180, 1020, 915, 862], backgroundColor: '#9966CC' },
    ]
  },
  options: {
    title: { display: true, text: 'Largest mission time vs energy weight α', fontSize: 12 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Energy weight α' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'The largest mission time' } }]
    },
    legend: { display: false }
  }
})

// ---------- 实验 11 & 12：多目标优化帕累托前沿 ----------
const exp11Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['Sol.1', 'Sol.2', 'Sol.3', 'Sol.4', 'Sol.5'],
    datasets: [
      { label: 'Coverage', data: [48, 42, 35, 28, 18], backgroundColor: '#4472C4', yAxisID: 'y1' },
      { label: 'Data Value', data: [720, 1050, 1480, 1950, 2380], backgroundColor: '#ED7D31', yAxisID: 'y2' },
    ]
  },
  options: {
    title: { display: true, text: 'Pareto Front: Coverage vs Data Value (SN=50, UAV=3)', fontSize: 10 },
    scales: {
      xAxes: [{}],
      yAxes: [
        { id: 'y1', position: 'left', scaleLabel: { display: true, labelString: 'Coverage Sensors' } },
        { id: 'y2', position: 'right', scaleLabel: { display: true, labelString: 'Data Value' } }
      ]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

const exp12Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['NSGA-II', 'MOEA/D', 'Weighted-Sum', 'Random'],
    datasets: [
      { label: 'Hypervolume', data: [0.82, 0.78, 0.65, 0.45], backgroundColor: ['#4472C4', '#ED7D31', '#A9D18E', '#FF99CC'] },
    ]
  },
  options: {
    title: { display: true, text: 'Algorithm comparison - Hypervolume (SN=100, UAV=5)', fontSize: 10 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Algorithm' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Hypervolume' }, ticks: { min: 0, max: 1 } }]
    },
    legend: { display: false }
  }
})

const exp12Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['Sol.1', 'Sol.2', 'Sol.3'],
    datasets: [
      { label: 'Coverage', data: [96, 75, 50], backgroundColor: '#4472C4', yAxisID: 'y1' },
      { label: 'Data Value', data: [1850, 3200, 4900], backgroundColor: '#ED7D31', yAxisID: 'y2' },
    ]
  },
  options: {
    title: { display: true, text: 'Pareto solutions: Coverage vs Value (SN=100, UAV=5)', fontSize: 10 },
    scales: {
      xAxes: [{}],
      yAxes: [
        { id: 'y1', position: 'left', scaleLabel: { display: true, labelString: 'Coverage Sensors' } },
        { id: 'y2', position: 'right', scaleLabel: { display: true, labelString: 'Data Value' } }
      ]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

// ---------- 实验 13：资源利用效率对比 ----------
const exp13Chart1 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['DRL', 'Heuristic', 'Greedy', 'Random'],
    datasets: [
      { label: 'Resource Efficiency (%)', data: [87.4, 79.2, 65.8, 48.3], backgroundColor: ['#4472C4', '#ED7D31', '#A9D18E', '#FF99CC'] },
    ]
  },
  options: {
    title: { display: true, text: 'Resource efficiency comparison (SN=25, UAV=2)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Algorithm' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Resource Efficiency (%)' }, ticks: { min: 0, max: 100 } }]
    },
    legend: { display: false }
  }
})

const exp13Chart2 = makeChartUrl({
  type: 'bar',
  data: {
    labels: ['SN=10', 'SN=15', 'SN=20', 'SN=25', 'SN=30'],
    datasets: [
      { label: 'DRL', data: [92, 90, 88, 87, 85], backgroundColor: '#4472C4' },
      { label: 'Heuristic', data: [84, 82, 80, 79, 77], backgroundColor: '#ED7D31' },
      { label: 'Greedy', data: [72, 70, 67, 66, 63], backgroundColor: '#A9D18E' },
    ]
  },
  options: {
    title: { display: true, text: 'Energy utilization vs sensor count (UAV=2)', fontSize: 11 },
    scales: {
      xAxes: [{ scaleLabel: { display: true, labelString: 'Number of sensors' } }],
      yAxes: [{ scaleLabel: { display: true, labelString: 'Energy Utilization (%)' }, ticks: { min: 50, max: 100 } }]
    },
    legend: { position: 'top', labels: { fontSize: 11 } }
  }
})

// ============================================================
// 导出所有图表URL（按实验ID索引）
// ============================================================
export const experimentCharts = {
  1:  [exp1Chart1,  exp1Chart2],
  2:  [exp2Chart1,  exp2Chart2],
  3:  [exp3Chart1,  exp3Chart2],
  4:  [exp4Chart1,  exp4Chart2],
  5:  [exp5Chart1],
  6:  [exp6Chart1,  exp6Chart2],
  7:  [exp7Chart1,  exp7Chart2],
  8:  [exp8Chart1,  exp8Chart2],
  9:  [exp9Chart1],
  10: [exp10Chart1, exp10Chart2],
  11: [exp11Chart1],
  12: [exp12Chart1, exp12Chart2],
  13: [exp13Chart1, exp13Chart2],
}
