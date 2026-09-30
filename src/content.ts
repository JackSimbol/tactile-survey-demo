export type EvidenceKind = 'consensus' | 'synthesis' | 'vision'

export interface SlideMeta {
  id: string
  short: string
  kicker: string
  title: string
  subtitle: string
  evidenceKind: EvidenceKind
  evidenceLabel: string
  sources: string[]
  locations: string[]
  note: string
}

export const slides: SlideMeta[] = [
  {
    id: 'cover', short: '封面', kicker: 'COMPREHENSIVE EXAMINATION / 00',
    title: '面向具身交互的触觉感知：从传感、理解到闭环交互',
    subtitle: '综述汇报 · 2026 年 9 月 30 日',
    evidenceKind: 'synthesis', evidenceLabel: '综述汇报', sources: [],
    locations: ['file/cover.tex：论文题名、作者、导师与学院信息'],
    note: '封面信息依据论文模板中的定稿信息。',
  },
  {
    id: 'value',
    short: '动机',
    kicker: 'WHY TOUCH / 01',
    title: '交互真正发生在接触界面',
    subtitle: '',
    evidenceKind: 'consensus',
    evidenceLabel: '触觉的第一性原理',
    sources: [
      'johansson2009tactilecontrol',
      'calandra2018more',
      'taylor2022gelslim',
      'prescott2011activetouch',
      'lepora2013active',
    ],
    locations: ['file/introduction.tex：触觉不可替代性的核心论断', 'file/introduction.tex：三条第一性命题'],
    note: '右侧动画是概念示意，不对应特定传感器的定量实验。',
  },
  {
    id: 'uniqueness',
    short: '特性',
    kicker: 'WHY TOUCH / 02',
    title: '触觉不是另一种图像',
    subtitle: '',
    evidenceKind: 'consensus',
    evidenceLabel: '触觉技术的独特性',
    sources: [
      'prescott2011activetouch',
      'lepora2013active',
      'johansson2009tactilecontrol',
      'calandra2018more',
    ],
    locations: ['file/introduction.tex：触觉的定义与第二条第一性命题', 'file/introduction.tex：触觉的信息结构与迁移限制'],
    note: '视觉与触觉的比较旨在揭示观测生成机制和数据结构差异，并不表示两种模态相互排斥；具身系统需要二者互补。',
  },
  {
    id: 'outline',
    short: '纲要',
    kicker: 'ROADMAP / 01',
    title: '从具身任务视角看触觉感知技术',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '结构纲要',
    sources: ['tactile2010review', 'prescott2011activetouch', 'higuera2024sparsh'],
    locations: ['本次汇报结构：绪论、感知技术版图、系统链路与未来展望'],
    note: '本页是汇报导航，不新增综述结论；后续三条主线分别对应技术分类、系统整合和未来路线。',
  },
  {
    id: 'tactile-content',
    short: '内容',
    kicker: 'SENSING LANDSCAPE / 01',
    title: '触觉不只测“力”，而是读取交互状态',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '触觉感知对象与内容',
    sources: ['tactile2010review', 'KAPPASSOV2015195', 'prescott2011activetouch'],
    locations: ['file/background/summary.tex：触觉感知的系统性定义与内容范围', 'file/background/processing.tex：触觉信号的物理观测量分类'],
    note: '本页依据原文 2.1 将具身触觉拆为八类：机械、顺应性、微振动与纹理、热觉、界面状态、接触化学、保护性触觉与本体触觉。',
  },
  {
    id: 'map',
    short: '范式',
    kicker: 'SENSING LANDSCAPE / 02',
    title: '触觉范式：换能、编码与具身能力',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '触觉的采集与触觉传感器',
    sources: [
      'gelsight',
      'piezoresistive_finger2024',
      'niu2025cap_morphology',
      'tang2025piezoelectric_review',
      'magnetic_review2025',
      'noor2024tribo_review',
      'taunyazov2020neutouch',
      'funk2024evetaceventbasedopticaltactile',
    ],
    locations: ['file/background/collection.tex：双轴分类矩阵与七类范式', 'file/background/summary.tex：任务约束下的系统权衡'],
    note: '事件触觉强调输出与编码方式，与按换能机理命名的类别不完全处于同一抽象层级。',
  },
  {
    id: 'pipeline',
    short: '链路',
    kicker: 'FROM CONTACT TO ACTION / 01',
    title: '触觉信息如何高效转化为决策资源？',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '触觉数据处理与理解',
    sources: [
      'tactile2010review',
      'KAPPASSOV2015195',
      'taunyazov2020neutouch',
      'gelsight',
      'ma2019denseforce',
      'higuera2024sparsh',
    ],
    locations: ['file/background/processing.tex：八阶段处理链与部署维度', 'file/background/summary.tex：前端—中段—后端的核心问题'],
    note: '故障按钮用于解释错误传播关系，并非数值仿真。',
  },
  {
    id: 'fusion',
    short: '融合',
    kicker: 'FROM CONTACT TO ACTION / 02',
    title: '触觉不是附加输入，而是行动接口',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '触觉与下游技术融合',
    sources: ['ma2019denseforce', 'hogan2020tactile', 'huang2025tactilevla', 'bi2025vlatouch', 'higuera2026vtwm', 'ma2026tacpac'],
    locations: ['file/application/integration.tex：触觉与控制器、策略网络和世界模型的接口', 'file/background/processing.tex：第八阶段多模态融合与策略网络消费'],
    note: '本页将融合方式归纳为三种接口与三层计算，不把任何单一模型视为唯一实现。',
  },
  {
    id: 'task-value',
    short: '价值',
    kicker: 'FROM CONTACT TO ACTION / 03',
    title: '触觉是具身控制快速闭环的核心',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '具身任务中的触觉价值',
    sources: ['calandra2018more', 'taylor2022gelslim', 'bauza2023tac2pose', 'lepora2013active', 'hogan2020tactile', 'costanzo2023visualhaptic'],
    locations: ['file/application/applications.tex：触觉应用价值的归纳', 'file/application/integration.tex：观测—动作—再观测闭环'],
    note: '本页按触觉在任务闭环中的功能组织应用，不按传感器类型或具体论文罗列。',
  },
  {
    id: 'challenge',
    short: '挑战',
    kicker: 'FROM CONTACT TO ACTION / 04',
    title: '真正的瓶颈，是整体链路达不到任务需求',
    subtitle: '',
    evidenceKind: 'synthesis',
    evidenceLabel: '触觉在具身场景中的挑战',
    sources: ['Tactile23Trends', 'higuera2024sparsh', 'zhang2025unitachand', 'yuan2026ftp1', 'tacto2022', 'taxim2022'],
    locations: ['file/application/applications.tex：具身任务应用与评价', 'file/application/integration.tex：融合接口与泛化问题', 'file/conclusion.tex：现有系统的共性瓶颈'],
    note: '本页将第三章各任务中反复出现的失效因素归纳为五个系统断点，不是新增的传感器分类。',
  },
  {
    id: 'future',
    short: '未来',
    kicker: 'Future Directions / 01',
    title: '从触觉传感器，到具身触觉神经系统',
    subtitle: '',
    evidenceKind: 'vision',
    evidenceLabel: '未来方向',
    sources: [
      'higuera2024sparsh',
      'feng2025anytouch',
      'zhang2025unitachand',
      'higuera2026vtwm',
      'ma2026tacpac',
      'prescott2011activetouch',
      'huisman2017socialtouch',
    ],
    locations: ['file/future/introduction.tex：分布式神经系统总体构想', 'file/future/roadmap.tex：未来触觉系统总体技术路线'],
    note: '该图表达研究路线与功能接口，不表示生物神经系统的结构复刻。',
  },
  {
    id: 'future-capability',
    short: '身体',
    kicker: 'FUTURE DIRECTIONS / 02',
    title: '超出人类感知，也让感知成为身体本身',
    subtitle: '',
    evidenceKind: 'vision',
    evidenceLabel: '超人类与可变形触觉',
    sources: ['gelsight', 'hu2024largearea_magskin', 'funk2024evetaceventbasedopticaltactile', 'liu2022tactileolfactory', 'li2026supertac', 'zhao2023gelsightsvelte', 'jiang2024stretchable', 'zhang2025softpalm'],
    locations: ['file/future/superhuman_tactile.tex：超人类任务相关触觉感知', 'file/future/deformable_body.tex：可变形触觉身体与泛在部署'],
    note: '本页把“扩大可观测物理量”和“让传感器长期成为身体”作为两条互补技术路线，而非追求单一器件包办全部能力。',
  },
  {
    id: 'future-edge',
    short: '端侧',
    kicker: 'FUTURE DIRECTIONS / 03',
    title: '在物理现实变化之前，完成感知与反射',
    subtitle: '',
    evidenceKind: 'vision',
    evidenceLabel: '端侧感知与反射',
    sources: ['johansson2009tactilecontrol', 'taylor2022gelslim', 'taunyazov2020neutouch', 'hong2025mechanoreceptors', 'li2026spinalinterneuron', 'li2026atvla', 'zheng2026omnivta', 'ma2026tacpac'],
    locations: ['file/future/edge_reflex.tex：端侧处理的必要性、传感—计算一体化、快慢双通路与分层数据通路'],
    note: '实时性应报告从材料响应到执行器产生有效力变化的端到端最坏延迟，而不是仅报告传感器帧率或模型推理时间。',
  },
  {
    id: 'future-brain', short: '表征', kicker: 'FUTURE DIRECTIONS / 04',
    title: '让触觉成为通用的物理语言',
    subtitle: '',
    evidenceKind: 'synthesis', evidenceLabel: '触觉表征与世界模型',
    sources: ['higuera2024sparsh', 'feng2025anytouch', 'zhang2025unitachand', 'yuan2026ftp1', 'higuera2026vtwm', 'zhang2026contactworld', 'zheng2026omnivta', 'ma2026tacpac', 'ye2026dreamtacvla'],
    locations: ['file/future/representation_world_model.tex：统一触觉表征与跨本体迁移', 'file/future/representation_world_model.tex：触觉世界模型、预测—执行闭环与评价路线'],
    note: '本页按统一表征、触觉世界模型、预测—执行—校正三层组织原文 4.5。',
  },
  {
    id: 'future-dynamic', short: '动态', kicker: 'FUTURE DIRECTIONS / 05',
    title: '将行动建模成触觉的条件',
    subtitle: '',
    evidenceKind: 'synthesis', evidenceLabel: '动态与主动触觉',
    sources: ['johansson2009tactilecontrol', 'taylor2022gelslim', 'bauza2023tac2pose', 'koolani2025opto_tactile', 'taunyazov2020neutouch', 'funk2024evetaceventbasedopticaltactile', 'prescott2011activetouch', 'lepora2013active', 'lepora2021pose', 'hogan2020tactile', 'zhang2026unitacvla'],
    locations: ['file/future/dynamic_active.tex：动态触觉、事件编码与时空接触状态', 'file/future/dynamic_active.tex：主动探索、信息增益与感知—操作一体化'],
    note: '本页把动态触觉与主动触觉组织为同一个持续更新的感知—行动闭环。',
  },
  {
    id: 'future-social', short: '人机', kicker: 'FUTURE DIRECTIONS / 06',
    title: '让触觉成为人与具身智能体的双向语言',
    subtitle: '',
    evidenceKind: 'synthesis', evidenceLabel: '双向人机触觉交互',
    sources: ['yohanan2012affectivetouch', 'silveratawil2015socialtouch', 'huisman2017socialtouch', 'block2019robothugs', 'block2022huggiebot2', 'costanzo2021handover', 'sundaram2019glove', 'willemse2017robotarousal', 'singuaroli2026neuromorphic', 'zhang2025unitachand'],
    locations: ['file/future/human_robot_interaction.tex：社会触觉、协作意图、主动接触与双向触觉通信', 'file/future/human_robot_interaction.tex：个体差异、伦理隐私与人机触觉评价体系'],
    note: '本页按 4.7.1—4.7.4、4.7.5、4.7.6—4.7.7 三个层次组织原文，不将社会语义简化为单一压力模式。',
  },
  {
    id: 'summary', short: '小结', kicker: 'CONCLUSION / 01',
    title: '从“能感知”走向“能在环境和身体中可靠地行动”',
    subtitle: '本综述形成的主要认识、当前证据与方法边界，以及触觉走向通用具身基础能力的核心判断。',
    evidenceKind: 'synthesis', evidenceLabel: '总结与展望',
    sources: ['file/conclusion.tex'],
    locations: ['file/conclusion.tex：本文形成的主要认识、研究局限、展望'],
    note: '本页不重复汇报全文内容，而是把 5.2、5.3、5.4 压缩为“认识—边界—论断”的收束页。',
  },
  {
    id: 'qa', short: 'Q&A', kicker: 'DISCUSSION / 01',
    title: 'Q&A', subtitle: '感谢聆听，欢迎交流。',
    evidenceKind: 'synthesis', evidenceLabel: '讨论与答疑', sources: [],
    locations: ['汇报结束页'], note: '用于 10 分钟提问与讨论。',
  }
]

export interface SensorItem {
  id: string
  name: string
  en: string
  x: number
  y: number
  strengths: string
  tradeoff: string
  principle: string
  signal: string
  metrics: string
  capability: string
  tasks: string[]
  tone: 'coral' | 'cyan' | 'violet'
}

export const sensors: SensorItem[] = [
  { id: 'resistive', name: '压阻式', en: 'RESISTIVE', x: 16, y: 30, strengths: '读出简单、低成本、易扩展为柔性阵列', tradeoff: '漂移、迟滞、温度敏感与阵列串扰', principle: '受力使导电复合材料或薄膜电阻改变，电阻变化映射为压力或形变。', signal: '机械应力 → 电阻变化 → 电压读出', metrics: '静态稳定性 · 阵列密度 · 迟滞 / 漂移', capability: '压力分布、接触面积与准静态抓取', tasks: ['static', 'spatial', 'coverage'], tone: 'cyan' },
  { id: 'capacitive', name: '电容式', en: 'CAPACITIVE', x: 38, y: 53, strengths: '低功耗、高密度阵列、静态或准静态力', tradeoff: '寄生电容、电磁干扰与大变形非线性', principle: '接触改变电极间距、介电层厚度或介电常数，形成可测电容变化。', signal: '形变 → 电容变化 → 交流激励读出', metrics: '灵敏度 · 量程 · 串扰 / 电磁抗扰', capability: '法向 / 剪切力、静态压力与高密度阵列', tasks: ['static', 'spatial', 'coverage'], tone: 'cyan' },
  { id: 'magnetic', name: '磁式', en: 'MAGNETIC', x: 59, y: 28, strengths: '多轴力、位移、曲面部署与稀疏重建', tradeoff: '外部磁场干扰与较复杂的标定', principle: '弹性体内磁体随接触形变移动，霍尔或磁阻元件读取磁通变化。', signal: '位移 / 姿态 → 磁通变化 → 多轴反演', metrics: '位移精度 · 多轴解耦 · 外场稳定性', capability: '接触位移、力方向与曲面大面积部署', tasks: ['spatial', 'coverage'], tone: 'cyan' },
  { id: 'visual', name: '视觉式', en: 'VISION-BASED', x: 29, y: 17, strengths: '高空间分辨率、接触几何与形变场', tradeoff: '体积、帧率、光学标定与封装成本', principle: '相机观察弹性体表面光影、标记点或颜色变化，再重建接触几何与力场。', signal: '形变图像 → 几何 / 光度特征 → 力场估计', metrics: '空间分辨率 · 视场 · 帧率 / 标定', capability: '接触形状、压力分布、剪切与滑移', tasks: ['static', 'dynamic', 'spatial'], tone: 'cyan' },
  { id: 'event', name: '事件式*', en: 'EVENT-DRIVEN', x: 79, y: 27, strengths: '低延迟、稀疏输出与快速变化感知', tradeoff: '纯静态接触不敏感，数据生态仍在发展', principle: '只在光强或形变变化超过阈值时输出异步事件，而非完整帧。', signal: '变化阈值 → 异步事件流 → 时序解码', metrics: '时间分辨率 · 事件延迟 · 动态范围', capability: '碰撞、振动、快速滑移与低延迟反射', tasks: ['dynamic'], tone: 'violet' },
  { id: 'piezo', name: '压电式', en: 'PIEZOELECTRIC', x: 72, y: 76, strengths: '高频动态力、振动、纹理与滑移先兆', tradeoff: '电荷衰减，难以稳定保持静态力', principle: 'PVDF、PZT 等压电材料受力极化，机械能直接转换为电荷信号。', signal: '动态应力 → 压电电荷 → 高阻抗读出', metrics: '带宽 · 动态灵敏度 · 静态保持能力', capability: '振动、纹理、敲击与滑移先兆', tasks: ['dynamic'], tone: 'coral' },
  { id: 'tribo', name: '摩擦电式', en: 'TRIBOELECTRIC', x: 90, y: 67, strengths: '自供能、轻薄柔性、动态刺激敏感', tradeoff: '高输出阻抗、环境敏感与长期稳定性', principle: '两种材料接触分离产生电荷转移，再由静电感应形成输出。', signal: '接触 / 分离 → 电荷转移 → 电压 / 电流', metrics: '自供能 · 动态响应 · 湿度稳定性', capability: '轻薄可穿戴、接触事件与动态滑动', tasks: ['dynamic', 'coverage', 'environment'], tone: 'coral' },
]

export const tasks = [
  { id: 'static', label: '静态 / 准静态力', hint: '量程 · 静态保持 · 漂移与迟滞' },
  { id: 'dynamic', label: '动态 / 事件', hint: '带宽 · 响应时间 · 滑移与振动' },
  { id: 'spatial', label: '空间 / 形状', hint: '空间分辨率 · 接触位置 · 形状重建' },
  { id: 'coverage', label: '部署 / 多模态', hint: '覆盖率 · 柔性集成 · 温度与环境' },
]

export interface PipelineStage {
  n: string
  title: string
  short: string
  function: string
  risk: string
  zone: string[]
}

export const pipeline: PipelineStage[] = [
  { n: '01', title: '物理交互', short: '接触、形变、摩擦、振动', function: '把作用力、形变、摩擦和振动编码为局部位移、应变或表面图像。', risk: '结构带宽、刚度或行程不匹配，会造成不可逆的信息退化。', zone: ['sensor'] },
  { n: '02', title: '换能与读出', short: '机械响应 → 原始观测', function: '把机械响应转换为电信号、图像或事件流，并用增益、滤波和多路复用保住有效信号。', risk: '饱和、噪声、串扰或抗混叠失配，会在算法之前破坏动态范围。', zone: ['sensor', 'module'] },
  { n: '03', title: '数字化与传输', short: '采样、时间戳、打包、通信', function: '完成量化、时间戳、缓存、打包、压缩、丢包检测，并把传感器时基接入控制时钟。', risk: '采样、吞吐与通信延迟若不由闭环时限反推，快速接触会被错时或丢失。', zone: ['module', 'edge'] },
  { n: '04', title: '校准与预处理', short: '补偿、去噪、解耦、健康诊断', function: '进行零点 / 增益归一化、温漂与迟滞补偿、去噪、异常处理、多轴解耦和健康判断。', risk: '磨损、温度、重装和加载历史会让离线标定映射随时间失效。', zone: ['module', 'edge', 'host'] },
  { n: '05', title: '时空组织', short: '坐标、同步、窗口、多尺度历史', function: '将 taxel 或像素映射到身体坐标，构造时间窗口，并同步触觉、视觉、本体和动作。', risk: '同频率不等于同一物理时刻；错位会把动作后果归因给错误模态。', zone: ['edge', 'host'] },
  { n: '06', title: '触觉表征', short: '物理量、人工特征、学习表示', function: '把原始信号组织成力、压力、接触图、时频特征或供模型使用的触觉隐表示。', risk: '若抹掉身体位置、动作条件或动态演化，表示就难以迁移到真实控制。', zone: ['edge', 'host'] },
  { n: '07', title: '状态理解', short: '接触、力、滑移、材质、风险', function: '结合触觉历史、本体状态和动作，估计接触、滑移、材质、姿态、阶段与风险，并保留不确定性。', risk: '同一信号可能对应不同交互事件；单帧点估计容易误判。', zone: ['edge', 'host', 'control'] },
  { n: '08', title: '融合与策略', short: '控制器、VLA、世界模型', function: '以原始序列、编码特征或显式状态进入控制器、VLA、世界模型和主动探索策略。', risk: '视觉支配、时间尺度错配或缺少安全旁路，会让策略无法及时消费触觉。', zone: ['host', 'control'] },
]

export const zoneNames: Record<string, { name: string; desc: string }> = {
  sensor: { name: '传感器与读出端', desc: '机械响应、换能与原始信号保持' },
  module: { name: '传感模块', desc: '采样、时间戳、校准与基础预处理' },
  edge: { name: '端侧 / 边缘层', desc: '低时延组织、表征与局部状态理解' },
  host: { name: '机器人主机', desc: '跨部位、跨模态表征与全局状态理解' },
  control: { name: '策略与执行层', desc: '融合、决策、控制与安全约束' },
}
