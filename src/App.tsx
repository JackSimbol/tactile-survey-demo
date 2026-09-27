import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { pipeline, sensors, slides, tasks, zoneNames } from './content'
import bibEntries from './bib_entries.json'

type BibEntry = { title?: string; author?: string; journal?: string; year?: string; volume?: string; number?: string; pages?: string; doi?: string; publisher?: string }
const bibliography = bibEntries as Record<string, BibEntry>

function formatAuthors(value: string) {
  return value.replace(/\s+and\s+/g, ', ')
}

function formatCitation(key: string) {
  const entry = bibliography[key]
  if (!entry) return null
  const parts = [formatAuthors(entry.author || ''), entry.title || ''].filter(Boolean)
  const venue = [entry.journal, entry.volume ? `${entry.volume}${entry.number ? `(${entry.number})` : ''}` : '', entry.pages ? `pp. ${entry.pages.replace(/--/g, '–')}` : '', entry.year].filter(Boolean).join(', ')
  if (venue) parts.push(venue)
  if (entry.doi) parts.push(`DOI: ${entry.doi.replace(/^https?:\/\/doi.org\//, '')}`)
  return parts.join('. ')
}

type Theme = 'lab' | 'atlas'
type IconName = 'evidence' | 'theme' | 'fullscreen' | 'help' | 'arrow' | 'close'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    evidence: <><path d="M6 3.5h9l3 3V20.5H6z"/><path d="M15 3.5v4h3M9 11h6M9 15h6"/></>,
    theme: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></>,
    fullscreen: <><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 2-2.4 2.1-2.4 4M12 18h.01"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
  }
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function EvidenceBadge({ kind, label }: { kind: string; label: string }) {
  return <span className={`evidence-badge evidence-${kind}`}><i />{label}</span>
}

function SlideFrame({ metaIndex, children }: { metaIndex: number; children: ReactNode }) {
  // The first entry is a standalone cover; the existing scene renderers keep
  // their historical zero-based indices and therefore resolve one slot later.
  const meta = slides[metaIndex + 1]
  return (
    <section className={`slide slide-${meta.id}`} aria-labelledby={`${meta.id}-title`}>
      <div className="slide-heading">
        <div className="heading-kicker"><span>{meta.kicker}</span><EvidenceBadge kind={meta.evidenceKind} label={meta.evidenceLabel} /></div>
        <h1 id={`${meta.id}-title`}>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function CoverSlide() {
  const meta = slides[0]
  return (
    <section className="slide slide-cover" aria-labelledby="cover-title">
      <div className="cover-grid" aria-hidden="true" />
      <div className="cover-orbit cover-orbit-one" aria-hidden="true" />
      <div className="cover-orbit cover-orbit-two" aria-hidden="true" />
      <div className="cover-copy">
        <div className="cover-kicker"><span>{meta.kicker}</span><i /> <b>综述汇报</b></div>
        <h1 id="cover-title">面向具身交互的<br /><em>触觉感知</em></h1>
        <p className="cover-subtitle">从传感、理解到闭环交互</p>
        <div className="cover-rule" />
        <dl className="cover-meta">
          <div><dt>汇报人</dt><dd>王星博</dd></div>
          <div><dt>指导教师</dt><dd>李文新 教授</dd></div>
          <div><dt>学院</dt><dd>计算机学院</dd></div>
          <div><dt>研究方向</dt><dd>人工智能</dd></div>
          <div><dt>汇报日期</dt><dd>2026年9月30日</dd></div>
        </dl>
      </div>
      <div className="cover-visual">
        <div className="cover-visual-label"><span>TACTILE PERCEPTION</span><b>BODY · CONTACT · ACTION</b></div>
        <img src="./assets/embodied-tactile-neural-hero-refined-v1.png" alt="脑、脊髓与手构成的具身触觉闭环示意" />
        <div className="cover-signal cover-signal-one"><i />感知</div>
        <div className="cover-signal cover-signal-two"><i />预测</div>
        <div className="cover-signal cover-signal-three"><i />行动</div>
      </div>
      <div className="cover-footer"><span>具身触觉</span><span>TACTILE PERCEPTION FOR EMBODIED INTERACTION</span><span>01 / 20</span></div>
    </section>
  )
}

function QASlide() {
  return (
    <section className="slide slide-qa" aria-labelledby="qa-title">
      <div className="qa-mark" aria-hidden="true"><i /><i /><i /></div>
      <div className="qa-copy">
        <span className="qa-kicker">DISCUSSION / 01</span>
        <h1 id="qa-title">Q&amp;A</h1>
        <p>感谢聆听，欢迎交流。</p>
        <div className="qa-rule" />
        <small>面向具身交互的触觉感知 · 2026年9月30日</small>
      </div>
      <div className="qa-footer"><span>具身触觉</span><span>讨论与答疑</span><span>20 / 20</span></div>
    </section>
  )
}

function ContactVisual({ tactile, load, speed }: { tactile: boolean; load: number; speed: number }) {
  return (
      <div className={`contact-visual ${tactile ? 'has-touch' : 'vision-only'}`}>
        <img className="contact-hero-image" src="./assets/pixverse_image_425925499782304_1790093887417.png" alt="灰色触觉手套按压陶瓷物体的接触场景" />
        <div className="contact-wash" />
      <div className="visual-readout top-left"><span>控制链路</span><strong>{tactile ? '闭环' : '开环'}</strong></div>
      <div className="visual-readout top-right"><span>NORMAL LOAD</span><strong>{load.toString().padStart(2, '0')}<small>%</small></strong></div>
      <div className="observation-panel vision-panel" aria-label="视觉观测窗">
        <div className="observation-head"><span>01 / VISUAL OBSERVATION</span><b>CAMERA</b></div>
        <div className="camera-view">
          <div className="camera-frame"><span className="camera-crosshair">＋</span><span className="occlusion-mask" /><span className="occlusion-mark">?</span><small>CONTACT SURFACE<br/>NOT OBSERVABLE</small></div>
          <div className="camera-lens-line"><i />视线被指腹截断</div>
        </div>
      </div>
      <div className="observation-panel tactile-panel" aria-label="触觉观测窗">
        <div className="observation-head"><span>02 / TACTILE OBSERVATION</span><b>{tactile ? 'LIVE' : 'STANDBY'}</b></div>
        <div className="tactile-hand-view">
          <div className="tactile-glove-photo-wrap">
            <img className="tactile-glove-photo" src="./assets/pixverse_image_426073244318957.png" alt="正视的五指触觉手套，食指指尖显示压力标记" />
          </div>
          <svg viewBox="0 0 230 210" role="img" aria-label="完整触觉手套及其食指指尖压力分布">
            <defs><linearGradient id="handSkinInset" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eef0f3"/><stop offset=".55" stopColor="#d0d4db"/><stop offset="1" stopColor="#aeb4bf"/></linearGradient><radialGradient id="touchHeatInset"><stop stopColor="#ff5f52" stopOpacity=".94"/><stop offset=".4" stopColor="#ff8274" stopOpacity=".55"/><stop offset="1" stopColor="#ff9a8f" stopOpacity="0"/></radialGradient></defs>
            <path className="glove-silhouette" d="M83 204 75 158c-2-12-7-23-14-33L32 87c-6-8-5-18 2-24 7-6 17-5 24 2l22 24-8-65C71 13 78 5 88 4c10-1 18 7 19 17l5 56 2-65c0-10 8-18 18-18s18 8 18 18l-1 65 8-55c2-10 10-16 20-15 10 2 16 11 14 21l-8 57 12-39c3-10 13-15 22-12 9 3 14 13 11 22l-20 72c-5 19-17 35-34 46l-2 30z" fill="url(#handSkinInset)" />
            <path className="glove-seams" d="M82 91c15-8 31-12 49-12 20 0 38 5 53 15M78 151c29 12 61 12 91-1M105 82l-1 65M147 81l2 67M80 105l-19 20" />
            <path className="glove-cuff" d="M83 173h88l1 31H83z" />
            <rect className="glove-index-pad" x="77" y="9" width="32" height="45" rx="16" />
            <ellipse className="touch-heat" cx="93" cy="25" rx="28" ry="24" fill="url(#touchHeatInset)" />
            <g className="touch-contours"><ellipse cx="93" cy="25" rx="9" ry="7"/><ellipse cx="93" cy="25" rx="17" ry="14"/><ellipse cx="93" cy="25" rx="25" ry="21"/></g>
            <g className="touch-taxels">{Array.from({ length: 25 }).map((_, index) => <circle key={index} cx={83 + (index % 5) * 5} cy={15 + Math.floor(index / 5) * 5} r="1.45" />)}</g>
            <path className="index-leader" d="M111 25h38" /><circle className="index-leader-dot" cx="111" cy="25" r="2.5" />
          </svg>
          <div className="touch-readout"><span>INDEX FINGERTIP</span><strong>{tactile ? `${load}%` : '—'}</strong><small>食指指尖<br/>局部压力场</small></div>
        </div>
      </div>
      {!tactile && <div className="blind-spot"><span>VISUAL OCCLUSION</span><strong>动作后果不可见</strong></div>}
    </div>
  )
}

function ValueSlide() {
  const [tactile, setTactile] = useState(true)
  const [active, setActive] = useState(0)
  const [load, setLoad] = useState(62)
  const [speed, setSpeed] = useState(44)
  const theses = [
    { n: '01', tag: 'INTERFACE', title: '接触是行动的接口', body: '动作、操作与协作的结果，最终由接触产生的力学后果决定。' },
    { n: '02', tag: 'ACTIVE SENSING', title: '触觉由动作产生', body: '按压、滑动与重新接触既是行动，也是主动获取证据的方式。' },
    { n: '03', tag: 'BODY MODEL', title: '触觉定义身体边界', body: '体表触觉与本体感觉共同区分对象、自身与接触耦合。' },
  ]
  return (
    <SlideFrame metaIndex={0}>
      <div className={`value-layout value-anchor-layout principle-${active}`}>
        <div className="value-copy value-anchor-copy">
          <div className="anchor-claim">具身智能不能只看见世界，<em>还必须感受到行动的后果。</em></div>
          <p className="anchor-lede">视觉擅长接触前的定位与规划；触觉直接观测接触界面正在发生的物理交换。</p>
          <div className="principle-heading"><span>FIRST PRINCIPLES / 01—03</span><small>点击命题，查看它如何改变感知—行动闭环</small></div>
          <div className="thesis-list">
            {theses.map((item, index) => (
              <button key={item.n} className={active === index ? 'active' : ''} onClick={() => setActive(index)}>
                <span className="thesis-number">{item.n}</span>
                <span><small className="thesis-tag">{item.tag}</small><strong>{item.title}</strong><small className="thesis-body">{item.body}</small></span>
                <i><Icon name="arrow" /></i>
              </button>
            ))}
          </div>
          <div className="anchor-proof"><span className="proof-dot" />不可替代性不在于“信息更多”，而在于信息更直接、更独特、更重要。</div>
        </div>
        <div className="value-anchor-stage">
          <div className="stage-topline"><span>CONTACT INTERFACE</span><b>{tactile ? 'CLOSED-LOOP OBSERVATION' : 'VISUAL BLIND SPOT'}</b></div>
          <div className="stage-mode">
            <div className="mode-switch" role="group" aria-label="感知视角">
              <button className={!tactile ? 'active' : ''} onClick={() => setTactile(false)}><span>视觉</span><small>远距观测</small></button>
              <button className={tactile ? 'active' : ''} onClick={() => setTactile(true)}><span>触觉</span><small>接触观测</small></button>
            </div>
          </div>
          <ContactVisual tactile={tactile} load={load} speed={speed} />
          <div className="principle-insight" aria-live="polite">
            <span>{theses[active].n} / {theses[active].tag}</span>
            <strong>{active === 0 ? '物理交换 → 成功判据' : active === 1 ? '探索动作 → 条件观测' : '外界作用 × 身体状态'}</strong>
            <small>{active === 0 ? '动作是否成功，由接触产生的力、滑移与形变决定。' : active === 1 ? '相同对象会因速度、载荷与接触历史产生不同触觉响应。' : '只有同时知道接触发生在哪里、身体如何运动，才能解释触觉。'}</small>
          </div>
          <div className="stage-bottomline"><span>接触界面</span><i /> <span>法向力 · 切向力 · 微滑移 · 形变</span><label><span>载荷</span><input aria-label="接触载荷" type="range" min="15" max="95" value={load} onChange={(e) => setLoad(Number(e.target.value))}/><output>{load}%</output></label><label><span>速度</span><input aria-label="相对速度" type="range" min="10" max="90" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}/><output>{speed}%</output></label></div>
        </div>
      </div>
    </SlideFrame>
  )
}

type TouchFactor = 'object' | 'action' | 'body' | 'history' | 'sensor'

function UniquenessSlide() {
  const [factor, setFactor] = useState<TouchFactor>('action')
  const factorData: Record<TouchFactor, { n: string; label: string; title: string; body: string; consequence: string }> = {
    object: { n: '01', label: 'OBJECT', title: '对象只给出一半条件', body: '材料、几何、温度与顺应性参与响应，但不能脱离接触方式被独立读出。', consequence: '相似形变，可能来自不同的力—刚度组合' },
    action: { n: '02', label: 'ACTION', title: '动作决定观测', body: '按压、滑动、滚动与重新接触，会主动改变载荷、速度和激励频带。', consequence: '同一材料，不同动作 → 不同触觉响应' },
    body: { n: '03', label: 'BODY', title: '观测依附身体', body: '接触位置必须与关节位姿、运动链和本体载荷共同解释。', consequence: '脱离身体坐标 → 信号失去作用位置' },
    history: { n: '04', label: 'HISTORY', title: '状态依赖历史', body: '初触、持续受力、微滑移与冲击分布在不同时间尺度。', consequence: '单帧或低频 token → 丢失接触演化' },
    sensor: { n: '05', label: 'EMBODIMENT', title: '数据依赖载体', body: '材料、结构、部署位置与传感机理共同塑造触觉数据。', consequence: '跨设备直接迁移 → 物理含义可能改变' },
  }
  const current = factorData[factor]
  return (
    <SlideFrame metaIndex={1}>
      <div className={`unique-layout factor-${factor}`}>
        <section className="unique-thesis">
          <p className="unique-lede">视觉更接近对外部场景的远距采样；触觉数据则在<strong>“身体真正碰上世界”</strong>时才被生成。</p>
          <div className="observation-equation" aria-label="触觉观测生成关系">
            <span className="equation-output">触觉观测</span><b>=</b>
            {(['object','action','body','history','sensor'] as TouchFactor[]).map((item, index) => <button key={item} className={factor === item ? 'active' : ''} onClick={() => setFactor(item)}><small>{factorData[item].label}</small><strong>{item === 'object' ? '对象' : item === 'action' ? '动作' : item === 'body' ? '身体' : item === 'history' ? '历史' : '传感器'}</strong>{index < 4 && <i>×</i>}</button>)}
          </div>
          <div className="unique-detail" aria-live="polite">
            <div className="unique-detail-head"><span>{current.n}</span><div><small>{current.label}</small><h2>{current.title}</h2></div></div>
            <p>{current.body}</p>
            <blockquote>{current.consequence}</blockquote>
          </div>
          <p className="unique-footnote"><i />触觉是由动作产生的条件观测，而不是与动作无关的对象快照。</p>
        </section>
        <section className="unique-comparison" aria-label="视觉与触觉的信息结构比较">
          <div className="unique-hero-image" role="img" aria-label="上下分区展示摄像头与触觉手套场景"><img src="./assets/pixverse_image_426064219485064.png" alt="" /></div>
          <div className="comparison-head"><span>OBSERVATION STRUCTURE</span><strong>同样是“感知”，数据是如何产生的？</strong></div>
          <div className="modality-row visual-row">
            <div className="modality-label"><span>VISION</span><h3>视觉</h3><p>远距、连续、场景中心</p></div>
            <div className="vision-world">
              <i className="vision-camera" /><span className="vision-rays" />
              <div className="vision-object"><i/><i/><i/></div>
              <small>光辐射 / 反射</small>
            </div>
            <div className="data-card"><span>常见表示</span><strong>规则像素阵列</strong><small>对象在相机坐标中的外观快照</small></div>
          </div>
          <div className="comparison-divider"><span>×不能直接迁移</span><i /></div>
          <div className="modality-row tactile-row">
            <div className="modality-label"><span>TOUCH</span><h3>触觉</h3><p>局部、间歇、身体中心</p></div>
            <div className="touch-world">
              <span className="touch-body"><i /></span><span className="touch-object"/><span className="touch-contact" />
              <small>接触 / 形变 / 热质传递</small>
            </div>
            <div className="data-card"><span>观测结构</span><strong>异构时空信号</strong><small>接触状态 × 身体位置 × 探索动作</small></div>
          </div>
          <div className="transfer-warning">
            <span>DIRECT TRANSFER?</span>
            <div><b>统一图像输入</b><i>会抹平身体拓扑</i></div>
            <div><b>低频附加 token</b><i>会错过滑移与冲击</i></div>
            <div><b>跨设备直接迁移</b><i>会混淆不同传感结构</i></div>
          </div>
      </section>
    </div>
    </SlideFrame>
  )
}

function OutlineSlide() {
  const [active, setActive] = useState(0)
  const routes = [
    { n: '01', label: '感知技术版图', en: 'SENSING LANDSCAPE', title: '先回答：触觉如何被测量？', body: '按任务需求梳理不同感知范式，看到材料、结构与编码方式之间的边界。', accent: 'cyan', next: '传感器、传感范式与性能指标' },
    { n: '02', label: '感知 → 行动', en: 'FROM CONTACT TO ACTION', title: '再回答：信号如何变成行动？', body: '沿着接触、读出、组织、理解与控制，观察触觉如何和下游技术形成系统闭环。', accent: 'coral', next: '系统链路与综合应用场景' },
    { n: '03', label: '未来展望', en: 'EMBODIED FUTURE', title: '最后回答：下一代系统长什么样？', body: '把感知、处理、理解、规划、控制统一为可计算、可交互、可演化的具身触觉神经系统。', accent: 'violet', next: '分布式闭环与技术路线' },
  ]
  const current = routes[active]
  return (
    <SlideFrame metaIndex={3}>
      <div className="outline-layout">
        <div className="outline-intro">
          <span className="outline-label">THE TALK IN THREE MOVES</span>
          <h2>从“理解触觉”<br/><em>到“用触觉行动”</em></h2>
          <p>从感知、理解到闭环交互；从器件、系统到具身智能</p>
          <div className="outline-progress"><i style={{ width: `${(active + 1) * 33.333}%` }} /></div>
          <small>当前路线 {current.n} / 03 · 点击右侧节点切换</small>
        </div>
        <div className="outline-route" aria-label="汇报核心内容框架">
          <div className="outline-line" />
          {routes.map((route, index) => <button key={route.n} className={`outline-node tone-${route.accent} ${active === index ? 'active' : ''}`} onClick={() => setActive(index)} aria-pressed={active === index}>
            <span className="outline-dot">{route.n}</span>
            <span className="outline-card"><small>{route.en}</small><strong>{route.label}</strong><b>{route.title}</b><em>{route.body}</em><i>{route.next}<span>→</span></i></span>
          </button>)}
        </div>
      </div>
    </SlideFrame>
  )
}

function TactileContentSlide() {
  type ContentKey = 'mechanics' | 'compliance' | 'vibration' | 'thermal' | 'interface' | 'chemical' | 'protection' | 'proprioception'
  const [active, setActive] = useState<ContentKey>('mechanics')
  const items: Record<ContentKey, { n: string; label: string; en: string; summary: string; signals: string; task: string }> = {
    mechanics: { n: '01', label: '机械触觉', en: 'MECHANICS', summary: '对力和接触的直接感知：接触事件、面积、形态与状态', signals: '法向 / 切向 / 力矩 / 压强 / 面积', task: '抓取稳定、接触定位、力控制' },
    compliance: { n: '02', label: '顺应性', en: 'COMPLIANCE', summary: '通过力—位移—时间关系，推断对象的软硬与变形。', signals: '刚度 / 弹性 / 塑性 / 黏弹性 / 阻尼', task: '软物体操作、食品处理、柔顺接触' },
    vibration: { n: '03', label: '微振动与纹理', en: 'VIBRATION & TEXTURE', summary: '滑动产生的高频响应揭示粗糙度、材质与初始滑移。', signals: '频谱 / 粗糙度 / 纹理 / 摩擦 / 微滑移', task: '材质辨识、滑移预警、主动探索' },
    thermal: { n: '04', label: '热觉', en: 'THERMAL', summary: '接触中的温度与热传递特性，是物体与环境的热学指纹。', signals: '温度 / 温度分布 / 热流 / 热容 / 热扩散', task: '热属性辨识、自然交互、操作安全' },
    interface: { n: '05', label: '界面状态', en: 'INTERFACE STATE', summary: '液膜、湿润、黏附和污染改变接触界面的真实条件。', signals: '湿润 / 液体 / 黏附 / 毛细 / 污染', task: '防滑抓取、液体操作、界面判断' },
    chemical: { n: '06', label: '接触化学', en: 'CONTACT CHEMISTRY', summary: '接触式或近场化学信息，扩展触觉对物质状态的判断。', signals: 'pH / 盐度 / 糖度 / 挥发物 / 腐蚀性', task: '食品、实验室、医疗与环境巡检' },
    protection: { n: '07', label: '疼痛与损伤风险', en: 'PROTECTION', summary: '把过载、冲击、超温和夹伤风险整合成不可越过的边界。', signals: '冲击 / 过载 / 超温 / 磨损 / 夹伤风险', task: '反射保护、人机安全、设备自保' },
    proprioception: { n: '08', label: '本体触觉', en: 'PROPRIOCEPTION', summary: '身体内部的位姿、运动与内力，为接触信号赋予运动条件和本体坐标。', signals: '关节角 / 速度 / 扭矩 / 腱张力 / 末端位姿', task: '身体建模、相对运动判断、精密操作' },
  }
  const current = items[active]
  return (
    <SlideFrame metaIndex={4}>
      <div className="content-layout">
        <section className="content-definition">
          <span className="content-kicker">A SYSTEMIC DEFINITION</span>
          <h2>触觉 = <em>身体—环境</em><br/>交互的可观测证据</h2>
          <p>触觉是智能体在身体表面或身体内部，通过接触、形变、热质传递及机械耦合等得到的、关于自身-环境交互状态的多模态感知。其目的不是单纯识别“摸到了什么”，而是估计：接触是否发生、发生的位置和几何关系、接触面发生的物理交换以及交互对象的状态等。</p>
          <div className="content-questions"><span><b>01</b><strong>发生了什么？</strong><small>接触 · 受力 · 变形 · 滑移</small></span><span><b>02</b><strong>对象是什么？</strong><small>软硬 · 材质 · 温度 · 界面</small></span><span><b>03</b><strong>身体能否承受？</strong><small>本体 · 疼痛 · 风险边界</small></span></div>
          <div className="content-takeaway"><i />八类感知共同回答一个问题：交互正在如何改变。</div>
        </section>
        <section className="content-map" aria-label="触觉感知内容分类">
          <div className="content-map-head"><span>WHAT CAN TOUCH TELL US?</span><small>点击节点展开</small></div>
          <div className="content-taxonomy"><div className="content-core"><span>TOUCH</span><strong>交互状态</strong><small>身体与环境的共同结果</small></div>
            {Object.entries(items).map(([key, item]) => <button key={key} className={`content-node ${active === key ? 'active' : ''}`} onClick={() => setActive(key as ContentKey)} aria-pressed={active === key}><span>{item.n}</span><strong>{item.label}</strong><small>{item.en}</small></button>)}
          </div>
          <div className="content-detail" aria-live="polite"><div><span>{current.n} / {current.en}</span><h3>{current.label}</h3></div><p>{current.summary}</p><dl><div><dt>可观测量</dt><dd>{current.signals}</dd></div><div><dt>具身用途</dt><dd>{current.task}</dd></div></dl></div>
        </section>
      </div>
    </SlideFrame>
  )
}

function SensorMapSlide() {
  const [task, setTask] = useState('static')
  const [selected, setSelected] = useState('visual')
  const [expanded, setExpanded] = useState<string | null>(null)
  const selectedSensor = sensors.find((sensor) => sensor.id === selected) ?? sensors[0]
  const taskMeta = tasks.find((item) => item.id === task) ?? tasks[0]
  return (
    <SlideFrame metaIndex={5}>
      <div className="map-toolbar">
        <span>以感知需求筛选：</span>
        {tasks.map((item) => <button key={item.id} className={task === item.id ? 'active' : ''} onClick={() => setTask(item.id)}>{item.label}</button>)}
        <p><strong>{taskMeta.label}</strong> 关注 {taskMeta.hint}</p>
      </div>
      <div className="sensor-layout">
        <div className="sensor-matrix">
          <div className="axis axis-x"><strong>编码方式</strong><div className="axis-range"><span>状态编码</span><i /><span>变化 / 事件编码</span></div></div>
          <div className="axis axis-y"><strong>换能方式</strong><div className="axis-range-y"><span>形变中介</span><i /><span>直接能量转换</span></div></div>
          <div className="quadrant q-state"><b>持续读出</b><span>静态 / 准静态</span></div>
          <div className="quadrant q-event"><b>变化触发</b><span>动态 / 瞬态</span></div>
          <div className="quadrant q-gap"><b>原理性空缺</b><span>直接换能难以持续保持静态状态</span></div>
          <div className="matrix-grid"><i/><i/><i/><i/><i/><i/><i/><i/></div>
          {sensors.map((sensor) => {
            const fits = sensor.tasks.includes(task)
            return (
              <button
                key={sensor.id}
                className={`sensor-node tone-${sensor.tone} ${fits ? 'fits' : 'muted'} ${selected === sensor.id ? 'selected' : ''}`}
                style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                onClick={() => setSelected(sensor.id)}
                aria-pressed={selected === sensor.id}
              >
                <i />
                <span>{sensor.name}</span>
                <small>{sensor.en}</small>
              </button>
            )
          })}
          <div className="fit-legend"><i />当前任务的优势区域 <span>* 编码范式，非单一换能机理</span></div>
        </div>
        <aside className={`sensor-detail tone-${selectedSensor.tone}`}>
          <div className="detail-index">{String(sensors.findIndex(s => s.id === selectedSensor.id) + 1).padStart(2, '0')} / 07</div>
          <p className="micro-label">SELECTED SENSING PARADIGM · CLICK NODE TO SWITCH</p>
          <h2>{selectedSensor.name}</h2>
          <p className="english-name">{selectedSensor.en}</p>
          <button className="principle-toggle" type="button" onClick={() => setExpanded(expanded === selectedSensor.id ? null : selectedSensor.id)} aria-expanded={expanded === selectedSensor.id}><span>{expanded === selectedSensor.id ? '收起工作原理' : '展开工作原理'}</span><b>{expanded === selectedSensor.id ? '−' : '+'}</b></button>
          {expanded === selectedSensor.id && <div className="principle-card"><div className="principle-visual"><i className={`principle-icon principle-${selectedSensor.id}`} /><span>{selectedSensor.signal}</span></div><p>{selectedSensor.principle}</p></div>}
          <div className="detail-block good"><span>擅长</span><p>{selectedSensor.strengths}</p></div>
          <div className="detail-block trade"><span>代价</span><p>{selectedSensor.tradeoff}</p></div>
          <div className="detail-metrics"><span>具身性能轴</span><p>{selectedSensor.metrics}</p><small>{selectedSensor.capability}</small></div>
          <div className="task-fit">
            <span>任务匹配</span>
            {tasks.map(item => <i key={item.id} className={selectedSensor.tasks.includes(item.id) ? 'on' : ''} title={item.label}>{item.label.slice(0,2)}</i>)}
          </div>
          <blockquote>选择传感器，本质上是任务信息需求与具身部署条件共同约束的系统设计。</blockquote>
        </aside>
      </div>
    </SlideFrame>
  )
}

type FrontierGap = 'coverage' | 'latency' | 'data' | 'transfer' | 'sim'

function FrontierSlide() {
  const [gap, setGap] = useState<FrontierGap>('coverage')
  const gaps: Record<FrontierGap, { n: string; title: string; detail: string; chain: string; metric: string }> = {
    coverage: { n: '01', title: '覆盖与分辨率难以同时满足', detail: '高分辨率、大面积覆盖、多轴测量、耐久性与低成本相互牵制。', chain: '材料 / 结构 / 封装', metric: 'SPACE × RESOLUTION' },
    latency: { n: '02', title: '端到端延迟仍无法支撑快速反射', detail: '材料响应、读出、传输、推理与执行共同决定闭环时延。', chain: '读出 / 传输 / 控制', metric: 'LATENCY → REFLEX' },
    data: { n: '03', title: '真实接触数据昂贵且难标注', detail: '力、滑移、损伤、材料参数等真值难以在同一时刻同步获得。', chain: '采集 / 标注 / 评价', metric: 'GROUND TRUTH' },
    transfer: { n: '04', title: '数据结构与身体形态高度耦合', detail: '跨设备、跨机器人迁移时，传感器结构与探索动作会改变数据语义。', chain: '本体 / 位置 / 动作', metric: 'TRANSFER ≠ COPY' },
    sim: { n: '05', title: '仿真还缺少可信的物理桥梁', detail: '视觉重建与触觉仿真之间仍缺材料参数、接触求解和传感器数字孪生。', chain: '重建 / 接触 / 传感器', metric: 'SIMULATION GAP' },
  }
  const current = gaps[gap]
  const chain: Array<{ key: FrontierGap; label: string; en: string }> = [
    { key: 'coverage', label: '覆盖 / 分辨率', en: 'COVERAGE' },
    { key: 'latency', label: '端到端时延', en: 'LATENCY' },
    { key: 'data', label: '真实数据', en: 'GROUND TRUTH' },
    { key: 'transfer', label: '跨本体迁移', en: 'TRANSFER' },
    { key: 'sim', label: '可信仿真', en: 'SIMULATION' },
  ]
  return (
    <SlideFrame metaIndex={2}>
      <div className="frontier-layout">
        <section className="frontier-demand">
          <div className="demand-label">THE WINDOW IS OPEN</div>
          <h2>具身控制算法正在进入<br/><em>接触丰富的长时程操作。</em></h2>
          <p>视觉已经可以做接触前的语义规划；真正限制下一步的，是可靠、低延迟、可迁移的物理反馈。</p>
          <div className="capability-ring" aria-label="具身触觉需要支撑的五类能力">
            <div className="capability-hero"><img src="./assets/pixverse_image_426064219485064.png" alt="触觉手套食指触碰方块" /></div>
            <div className="capability-node capability-safety"><span>安全性</span><small>不伤害 · 可保护</small></div>
            <div className="capability-node capability-stability"><span>稳定性</span><small>复现 · 可预测</small></div>
            <div className="capability-node capability-robust"><span>鲁棒性</span><small>扰动 · 变化适应</small></div>
            <div className="capability-node capability-precision"><span>精密性</span><small>微小误差 · 可控</small></div>
            <div className="capability-node capability-general"><span>泛用性</span><small>跨任务 · 跨本体</small></div>
          </div>
          <div className="frontier-principle"><i />问题不在某项指标，而在整条“机械交互 → 状态理解 → 闭环控制”链路尚未闭合。</div>
        </section>
        <section className="frontier-system">
          <div className="system-head"><span>SYSTEM COORDINATES</span><strong></strong></div>
          <div className="system-chain" aria-label="触觉处理链路">
            {chain.map((item, index) => <button className={`chain-node node-${item.key} ${gap === item.key ? 'active' : ''}`} key={item.key} onClick={() => setGap(item.key)} aria-pressed={gap === item.key}><span>0{index + 1}</span><i /><strong>{item.label}</strong><small>{item.en}</small>{index < chain.length - 1 && <b>→</b>}</button>)}
          </div>
          <div className="gap-grid">
            {(Object.keys(gaps) as FrontierGap[]).map(item => <button key={item} className={`gap-card ${gap === item ? 'active' : ''}`} onClick={() => setGap(item)}><span>{gaps[item].n}</span><div><small>{gaps[item].metric}</small><strong>{gaps[item].title}</strong><p>{gaps[item].detail}</p><em>{gaps[item].chain}</em></div></button>)}
          </div>
          <div className="gap-insight"><span>{current.n} / ACTIVE BOTTLENECK</span><strong>{current.chain}</strong><p>{current.detail}</p><i><b style={{ width: `${Number(current.n) * 18 + 10}%` }} /></i></div>
        </section>
      </div>
    </SlideFrame>
  )
}

type PipelineMode = 'flow' | 'deployment'
type Fault = 'none' | 'saturation' | 'drift' | 'sync'

function PipelineSlide() {
  const [mode, setMode] = useState<PipelineMode>('flow')
  const [active, setActive] = useState(0)
  const [fault, setFault] = useState<Fault>('none')
  const faultStage: Record<Fault, number> = { none: -1, saturation: 1, drift: 3, sync: 4 }
  const affectedFrom = faultStage[fault]
  const faultLabels: Record<Fault, string> = { none: '正常链路', saturation: '幅值饱和', drift: '基线漂移', sync: '时空错位' }
  const faultMeaning: Record<Fault, string> = { none: '不注入失效：观察信息如何逐阶段被组织并进入策略。', saturation: '强接触超过前端量程，输出被截顶；后续阶段无法恢复被丢失的峰值与动态范围。', drift: '零点、温漂或加载历史改变了基线；同一接触可能被解释成不同的力或接触状态。', sync: '触觉、视觉、本体或动作没有对齐到同一物理时刻；状态估计会把因果关系错配。' }
  return (
    <SlideFrame metaIndex={6}>
      <div className="pipeline-toolbar">
        <div className="segmented">
          <button className={mode === 'flow' ? 'active' : ''} onClick={() => setMode('flow')}>功能链</button>
          <button className={mode === 'deployment' ? 'active' : ''} onClick={() => setMode('deployment')}>部署层</button>
        </div>
        <div className="faults"><span>典型失效注入</span>{(['none','saturation','drift','sync'] as Fault[]).map(item => <button key={item} className={fault === item ? 'active' : ''} onClick={() => setFault(item)} title={faultMeaning[item]}>{faultLabels[item]}</button>)}</div>
      </div>
      {mode === 'flow' ? (
        <div className={`pipeline-flow fault-${fault}`}>
          <div className="flow-line"><i className="flow-pulse p1"/><i className="flow-pulse p2"/><i className="flow-pulse p3"/></div>
          {pipeline.map((stage, index) => (
            <button
              key={stage.n}
              className={`pipeline-stage ${active === index ? 'active' : ''} ${affectedFrom >= 0 && index >= affectedFrom ? 'affected' : ''} ${index === affectedFrom ? 'fault-origin' : ''}`}
              onClick={() => setActive(index)}
            >
              <span className="stage-number">{stage.n}</span>
              <i className="stage-node" />
              <strong>{stage.title}</strong>
              <small>{stage.short}</small>
              {index === affectedFrom && <em>{fault === 'saturation' ? 'SATURATED' : fault === 'drift' ? 'DRIFTING' : 'MISALIGNED'}</em>}
            </button>
          ))}
          <aside className="stage-insight">
            <div><span>STAGE {pipeline[active].n}</span><strong>{pipeline[active].title}</strong></div>
            <p><b className="insight-label">阶段功能</b>{pipeline[active].function}</p>
            <p className="stage-risk"><b className="insight-label">关键风险</b>{pipeline[active].risk}</p>
            <small>{fault === 'none' ? '点击任意阶段查看功能与风险；点击右上角失效注入查看错误传播轨迹' : faultMeaning[fault]}</small>
          </aside>
        </div>
      ) : (
        <div className="deployment-view">
          <div className="deployment-note"><span>正交维度</span><p>功能阶段不等于硬件位置。同一处理可以跨层部署，取决于时限、上下文、功耗和可维护性。</p></div>
          <div className="zone-table">
            {Object.entries(zoneNames).map(([key, zone]) => (
              <div className={`zone-row zone-${key}`} key={key}>
                <div className="zone-label"><strong>{zone.name}</strong><small>{zone.desc}</small></div>
                <div className="zone-track">
                  {pipeline.map((stage, index) => <button key={stage.n} className={stage.zone.includes(key) ? 'present' : ''} onClick={() => setActive(index)} title={stage.title}><span>{stage.n}</span><small>{stage.title}</small></button>)}
                </div>
              </div>
            ))}
          </div>
          <div className="deployment-principle"><span>部署原则</span><p><b>严格时限 / 不可逆处理</b>靠近传感器；<b>跨部位 / 跨模态推理</b>靠近主机；保留受控原始数据通路用于标定、诊断和模型更新。</p></div>
        </div>
      )}
    </SlideFrame>
  )
}

type FusionRole = 'observe' | 'complement' | 'feedback' | 'explore'
type FusionInterface = 'state' | 'policy' | 'dual'

function FusionSlide() {
  const [role, setRole] = useState<FusionRole>('observe')
  const [iface, setIface] = useState<FusionInterface>('state')
  const roles: Record<FusionRole, { n:string; label:string; en:string; title:string; question:string; tactile:string; downstream:string; example:string }> = {
    observe: { n:'01', label:'直接观测', en:'DIRECT OBSERVATION', title:'把动作产生的物理后果变成接触事实', question:'机器人真正接触了什么？', tactile:'接触位置、作用力、滑移、局部几何', downstream:'状态估计 · 接触定位 · 力 / 位姿控制', example:'首次接触、抓取建立和局部几何约束' },
    complement: { n:'02', label:'补充视觉', en:'VISUAL COMPLEMENT', title:'在遮挡、透明和接触后视觉退化时补足信息', question:'视觉看不到的接触状态如何被确认？', tactile:'被遮挡区域的压力、形变、接触边界与载荷', downstream:'视觉—触觉联合估计 · 失败重抓 · 局部纠错', example:'手指遮挡目标后仍判断是否抓稳' },
    feedback: { n:'03', label:'高频反馈', en:'FAST FEEDBACK', title:'沿局部短通路修正滑移、碰撞与受力误差', question:'动作还来得及修正吗？', tactile:'高频变化、冲击、微滑移、过载', downstream:'抓力调节 · 碰撞反射 · 触觉伺服', example:'物体完全滑落前增大夹持力' },
    explore: { n:'04', label:'主动探索', en:'ACTIVE TOUCH', title:'用下一次接触获取外观无法提供的物理证据', question:'下一次应该在哪里、怎样触碰？', tactile:'动作条件下的力—位移、摩擦、纹理与温度响应', downstream:'信息增益规划 · 属性认知 · 主动触觉', example:'按压、滑动或滚动区分相似外观材料' },
  }
  const interfaces: Record<FusionInterface, { n:string; label:string; en:string; title:string; input:string; output:string; note:string }> = {
    state: { n:'A', label:'显式状态接口', en:'TACTILE → STATE → CONTROLLER', title:'先估计状态，再交给控制器', input:'力 / 接触位置 / 滑移 / 局部几何', output:'阻抗控制 · 力控制 · 触觉伺服', note:'可解释、易设置安全约束；可能丢失难以手工定义的微弱模式。' },
    policy: { n:'B', label:'多模态策略接口', en:'TACTILE + VISION + PROPRIOCEPTION', title:'分别编码，再由策略联合生成动作', input:'触觉序列 + 视觉 / 语言 / 本体状态', output:'策略网络 · VLA · 动作残差', note:'保留学习空间；必须处理时间对齐与视觉特征支配。' },
    dual: { n:'C', label:'快慢双通路接口', en:'FAST REFLEX + SLOW POLICY', title:'局部反射与高层推理并行工作', input:'边缘端接触 / 滑移 / 过载 + 长时程历史', output:'端侧安全修正 + 高层任务规划', note:'满足严格时限又保留复杂推理；需要明确控制权限和回退机制。' },
  }
  const current = roles[role]
  const currentInterface = interfaces[iface]
  return (
    <SlideFrame metaIndex={7}>
      <div className="fusion-layout fusion-rebuilt">
        <section className="fusion-interfaces">
          <div className="fusion-intro"><span>FROM TOUCH TO EMBODIED TASK</span><h2>触觉在具身系统里<br/><em>承担什么作用？</em></h2><p>先看触觉在感知—决策—行动闭环中的功能位置，再看它以什么接口进入控制器或策略。</p></div>
          <div className="fusion-role-tabs" role="tablist" aria-label="触觉功能位置">
            {(Object.keys(roles) as FusionRole[]).map(key => <button key={key} className={role === key ? 'active' : ''} onClick={() => setRole(key)} aria-selected={role === key}><span>{roles[key].n}</span><strong>{roles[key].label}</strong><small>{roles[key].en}</small></button>)}
          </div>
          <div className="fusion-principle"><i/>视觉负责接触前先验，本体感觉提供身体坐标，触觉确认接触后的物理后果。</div>
        </section>
        <section className="fusion-system fusion-rebuilt-system" aria-label="触觉功能与接口框架">
          <div className="fusion-role-card">
            <div className="fusion-role-header"><span>{current.n} / {current.en}</span><strong>{current.question}</strong></div>
            <div className="fusion-canvas fusion-role-canvas">
              <div className="fusion-node fusion-vision"><span>PRE-CONTACT</span><strong>视觉 / 语言</strong><small>目标发现 · 全局定位 · 动作初始化</small></div>
              <div className="fusion-node fusion-proprio"><span>BODY STATE</span><strong>本体感觉</strong><small>自身位姿 · 运动 · 身体坐标</small></div>
              <div className="fusion-node fusion-touch"><span>CONTACT</span><strong>触觉</strong><small>{current.tactile}</small></div>
              <div className="fusion-node fusion-consumer"><span>DOWNSTREAM</span><strong>{current.downstream}</strong><small>{current.example}</small></div>
              <svg className="fusion-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M16 24C27 24 33 39 42 48M16 76C27 76 33 61 42 52M58 50H84"/><path className="fusion-return" d="M92 66C76 96 24 96 8 76"/></svg>
            </div>
          </div>
          <div className="fusion-interface-card">
            <div className="fusion-interface-heading"><span>第二层 / INTERFACE</span><strong>触觉如何被控制器或策略消费？</strong></div>
            <div className="fusion-interface-tabs" role="tablist" aria-label="触觉系统接口">{(Object.keys(interfaces) as FusionInterface[]).map(key => <button key={key} className={iface === key ? 'active' : ''} onClick={() => setIface(key)} aria-selected={iface === key}><b>{interfaces[key].n}</b><span>{interfaces[key].label}</span><small>{interfaces[key].en}</small></button>)}</div>
            <div className="fusion-interface-detail" aria-live="polite"><div><span>{currentInterface.en}</span><h3>{currentInterface.title}</h3></div><p><b>输入：</b>{currentInterface.input}</p><p><b>输出：</b>{currentInterface.output}</p><p><b>关键权衡：</b>{currentInterface.note}</p></div>
          </div>
        </section>
      </div>
    </SlideFrame>
  )
}

type ChallengeKey = 'coverage' | 'latency' | 'reliability' | 'transfer' | 'evaluation'

function ChallengeSlide() {
  const [active, setActive] = useState<ChallengeKey>('coverage')
  const items: Record<ChallengeKey, { n:string; label:string; en:string; title:string; symptom:string; cause:string; metrics:string; fix:string }> = {
    coverage: { n:'01', label:'信息覆盖', en:'COVERAGE', title:'高分辨率与大面积覆盖难以同时满足', symptom:'指尖看得很细，身体却感知不到；多点接触落在传感器空白区。', cause:'空间分辨率、覆盖率、多轴测量、柔性封装与成本相互牵制。', metrics:'覆盖率 · 接触形状误差 · 多轴解耦 · 曲面兼容性', fix:'从单点器件比较转向身体表面与任务接触分布的共同设计。' },
    latency: { n:'02', label:'时间闭环', en:'LATENCY', title:'检测到了，但来不及修正', symptom:'滑移、冲击或卡阻已经发生，策略才收到一个“过去的状态”。', cause:'采样、读出、传输、推理与执行共同决定端到端尾部延迟。', metrics:'端到端延迟 · 滑移提前量 · 反射确定性 · 模态对齐误差', fix:'以最高有效频率和最坏响应时限反推采样、计算与控制部署。' },
    reliability: { n:'03', label:'长期可靠', en:'RELIABILITY', title:'离线标定，无法覆盖真实时间', symptom:'换个温度、重装一次或循环久了，同一接触产生不同输出。', cause:'漂移、迟滞、蠕变、磨损、污染、温度和预紧力改变观测映射。', metrics:'循环寿命 · 重装恢复 · 温湿度鲁棒性 · 健康诊断', fix:'将在线校准、传感器健康状态与可维护封装纳入系统设计。' },
    transfer: { n:'04', label:'身体泛化', en:'TRANSFER', title:'换了传感器，数据的物理含义也变了', symptom:'同一数组下标在不同手、不同部位或不同动作中不再代表同一接触。', cause:'本体形态、安装位置、探索动作与加载历史共同塑造触觉数据。', metrics:'跨传感器 · 跨本体 · 跨动作 · 身体坐标一致性', fix:'保留数值、身体位置、局部方向和动作上下文，构造形态感知接口。' },
    evaluation: { n:'05', label:'评价与仿真', en:'EVALUATION', title:'识别准确，不等于任务可靠', symptom:'离线分类很高，但真实任务仍会滑落、卡阻、损伤或无法恢复。', cause:'真值昂贵且难同步；仿真缺少材料、接触和传感器数字孪生；评价偏重平均精度。', metrics:'任务成功 · 失败恢复 · 作用力峰值 · 长时程 · 仿真—真实差距', fix:'用真实闭环、罕见失败、不确定性与安全降级建立共同评价。' },
  }
  const current = items[active]
  return (
    <SlideFrame metaIndex={9}>
      <div className="challenge-layout">
        <section className="challenge-copy"><span>FIVE SYSTEM BREAKPOINTS</span><h2>触觉为什么<br/><em>难以可靠行动？</em></h2><p>问题不在单个指标，而在覆盖、时延、可靠性、泛化与评价等整体系统问题。</p><div className="challenge-list">{(Object.keys(items) as ChallengeKey[]).map(key => <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)} aria-pressed={active === key}><span>{items[key].n}</span><strong>{items[key].label}</strong><small>{items[key].en}</small><i>→</i></button>)}</div><div className="challenge-note"><i/>点击断点，查看失效表现、根因与应报告指标。</div></section>
        <section className="challenge-system" aria-label="具身触觉系统断点图"><div className="challenge-chain"><div className="chain-end">接触<br/><small>真实世界</small></div><div className="chain-line">{['感受器','传输','标定','表征','策略'].map((label,index) => <div key={label} className={`chain-link ${index <= Number(current.n)-1 ? 'lit' : ''}`}><i/><span>{label}</span></div>)}</div><div className="chain-end">行动<br/><small>物理后果</small></div></div><div className="challenge-panel"><div className="challenge-panel-head"><span>{current.n} / {current.en}</span><b>{current.label}</b></div><h3>{current.title}</h3><div className="challenge-facts"><div><span>失效表现</span><p>{current.symptom}</p></div><div><span>根因</span><p>{current.cause}</p></div><div><span>应报告指标</span><p>{current.metrics}</p></div><div><span>研究方向</span><p>{current.fix}</p></div></div></div></section>
      </div>
    </SlideFrame>
  )
}

type TaskValueKey = 'confirm' | 'correct' | 'explore'

function TaskValueSlide() {
  const [active, setActive] = useState<TaskValueKey>('confirm')
  const legacyData: Record<TaskValueKey, { n:string; label:string; en:string; title:string; body:string; tasks:{label:string; need:string; tactile:string; action:string; metric:string}[]; metrics:string; example:string }> = {
    confirm: { n:'01', label:'确认', en:'CONFIRM', title:'确认计划中的接触是否真实建立', body:'触觉把初触、抓取建立、落足和碰撞从“视觉预测”变成接触事实。', tasks:[{label:'安全交互',need:'检测轻触、碰撞位置与载荷，及时停止或退让。',tactile:'接触位置 / 法向力 / 过载事件',action:'保护性反射 · 安全避碰',metric:'碰撞定位误差 · 峰值力'},{label:'稳定抓取',need:'确认夹持是否建立，避免物体尚未抓稳就开始搬运。',tactile:'接触面积 / 压力分布 / 初始滑移',action:'建立最小抓力 · 失败再抓取',metric:'抓取成功率 · 接触检出率'},{label:'落足确认',need:'判断足端是否真实承载，而不是只相信视觉地形预测。',tactile:'足底载荷 / 接触时刻 / 摩擦状态',action:'步态切换 · 平衡恢复',metric:'落足误差 · 恢复时间'},{label:'人机接触',need:'区分意外碰撞与交接、共同承载等主动接触。',tactile:'位置 / 方向 / 持续时间 / 压力',action:'停止 · 交接 · 协作承载',metric:'交接成功率 · 舒适度'}], metrics:'接触检出率 · 碰撞定位误差 · 抓取成功率', example:'视觉被遮挡后，触觉仍能确认手指是否真正接触、物体是否被抓住。' },
    correct: { n:'02', label:'校正', en:'CORRECT', title:'校正接触后的受力、位姿与滑移误差', body:'触觉沿高相关、低时延的局部通路反馈物理后果，使动作在失败前仍可修正。', tasks:[{label:'滑移抑制',need:'在物体完全滑落前发现局部微滑移并调整夹持力。',tactile:'剪切变化 / 接触边界 / 高频振动',action:'增大抓力 · 调整姿态',metric:'滑移提前量 · 失败恢复率'},{label:'灵巧手内操作',need:'跟踪被手指遮挡的相对运动和接触模式转换。',tactile:'接触几何 / 压力中心 / 相对位移',action:'推动 · 枢转 · 手内旋转',metric:'位姿误差 · 长时程成功率'},{label:'精密装配',need:'识别插入方向、约束状态与卡阻，修正微小位姿误差。',tactile:'接触方向 / 力矩 / 阻塞变化',action:'触觉伺服 · 阻抗调节',metric:'插入成功率 · 卡阻提前量'},{label:'柔性与易碎物体',need:'在形变持续变化时控制局部压力，避免滑落或损伤。',tactile:'形变 / 压力峰值 / 滑移 / 顺应性',action:'柔顺抓取 · 轨迹修正',metric:'损伤率 · 峰值力 · 完成时间'}], metrics:'失败恢复率 · 滑移提前量 · 作用力峰值 · 完成时间', example:'插入、旋转或抓取中，触觉把卡阻、微滑移和接触偏差转化为动作修正。' },
    explore: { n:'03', label:'探索', en:'EXPLORE', title:'通过主动动作获得外观无法给出的物理证据', body:'按压、滑动、滚动和重新接触同时推进任务，并降低材料、硬度、摩擦和局部形状的不确定性。', tasks:[{label:'材料辨识',need:'区分外观相似但力学、摩擦或热学属性不同的对象。',tactile:'力—位移关系 / 摩擦 / 温度',action:'按压 · 多点接触 · 比较',metric:'属性识别率 · 跨对象泛化'},{label:'纹理与摩擦',need:'从滑动产生的高频响应推断粗糙度、方向和材质。',tactile:'振动频谱 / 纹理 / 微滑移',action:'扫描 · 滚动 · 改变速度',metric:'纹理识别 · 滑移预警'},{label:'软硬判断',need:'估计刚度、弹性、黏弹性与填充状态，决定施力边界。',tactile:'力—位移—时间历史',action:'渐进按压 · 保持 · 释放',metric:'硬度误差 · 损伤风险'},{label:'主动触碰',need:'选择下一次接触的位置、方向和载荷来降低不确定性。',tactile:'动作条件触觉响应',action:'信息增益规划 · 任务中探索',metric:'信息增益 · 探索代价'}], metrics:'信息增益 · 探索代价 · 属性识别 · 损伤风险', example:'下一次触碰的位置、方向和载荷，决定机器人能否区分相似外观下的不同物理属性。' },
  }
  const data: Record<TaskValueKey, { n:string; label:string; en:string; title:string; body:string; tasks:{label:string; need:string; tactile:string; action:string; metric:string}[]; metrics:string; example:string }> = {
    confirm: { n:'01', label:'确认', en:'CONFIRM', title:'确认接触是否真实建立，并确认身体正在承载', body:'接触建立、安全交互，以及移动与全身任务中的落足和承载确认。', tasks:[
      {label:'接触建立、碰撞检测与安全交互', need:'检测初触、意外碰撞与人机接触，把接触位置和载荷变成可执行的停止、退让或保护动作。', tactile:'接触位置 / 法向力 / 碰撞时刻 / 过载', action:'停止 · 退让 · 保护性反射', metric:'碰撞定位误差 · 峰值力 · 安全响应时间'},
      {label:'移动、足式与全身接触任务', need:'确认足端真实承载、地面摩擦与全身接触状态，避免只依赖视觉地形预测。', tactile:'足底载荷 / 接触时刻 / 摩擦状态 / 身体表面接触', action:'步态切换 · 平衡恢复 · 全身避碰', metric:'落足误差 · 恢复时间 · 接触覆盖率'},
    ], metrics:'接触检出率 · 碰撞定位误差 · 落足误差 · 安全响应时间', example:'视觉只能预测“将要接触”，触觉确认“接触已经发生”，让安全和承载成为闭环事实。' },
    correct: { n:'02', label:'校正', en:'CORRECT', title:'基于接触后的受力、位姿、滑移与形变误差完成动作修正', body:'依赖局部高相关反馈的抓取、灵巧操作、精密操作，以及柔性和易碎物体操作。', tasks:[
      {label:'稳定抓取、力调节与滑移抑制', need:'确认夹持已经建立，并在完全滑落前发现微滑移、调整夹持力。', tactile:'接触面积 / 压力分布 / 剪切变化 / 高频振动', action:'建立最小抓力 · 增大夹持力 · 重新抓取', metric:'抓取成功率 · 滑移提前量 · 失败恢复率'},
      {label:'灵巧手操作与手内物体控制', need:'跟踪被手指遮挡的相对运动、接触模式切换和指间载荷分配。', tactile:'接触几何 / 压力中心 / 相对位移 / 指间载荷', action:'推动 · 枢转 · 手内旋转 · 姿态修正', metric:'位姿误差 · 长时程成功率 · 轨迹偏差'},
      {label:'接触丰富型精密操作', need:'识别插入方向、约束状态与卡阻，利用接触偏差完成亚毫米级对准和装配。', tactile:'接触方向 / 力矩 / 阻塞变化 / 局部几何', action:'触觉伺服 · 阻抗调节 · 微小探索', metric:'插入成功率 · 卡阻提前量 · 完成时间'},
      {label:'柔性、易碎与不规则物体操作', need:'在形变和接触边界持续变化时控制局部压力，避免滑落、折损或不可逆损伤。', tactile:'形变 / 压力峰值 / 滑移 / 顺应性', action:'柔顺抓取 · 轨迹修正 · 作用力限幅', metric:'损伤率 · 峰值力 · 完成时间'},
    ], metrics:'失败恢复率 · 滑移提前量 · 位姿误差 · 作用力峰值 · 损伤率', example:'触觉不是动作结束后的评分，而是把卡阻、微滑移和受力偏差及时变成下一步修正。' },
    explore: { n:'03', label:'探索', en:'EXPLORE', title:'通过主动触觉探索获得外观无法给出的物理属性证据', body:'主动触觉探索与物体属性认知：动作条件决定观测质量，感知与行动共同降低不确定性。', tasks:[
      {label:'主动触觉探索与物体属性认知', need:'通过按压、滑动、滚动和多次重新接触，辨识材料、纹理、摩擦、硬度与局部形状。', tactile:'力—位移—时间历史 / 振动频谱 / 摩擦 / 温度', action:'选择接触位置、方向、速度和载荷 · 比较多次响应', metric:'属性识别率 · 信息增益 · 探索代价 · 损伤风险'},
    ], metrics:'信息增益 · 属性识别率 · 探索代价 · 跨对象泛化 · 损伤风险', example:'下一次触碰如何发生，会决定机器人能否区分相似外观下的不同物理属性。' },
  }
  const current = data[active]
  const [selectedTask, setSelectedTask] = useState(current.tasks[0].label)
  const task = current.tasks.find(item => item.label === selectedTask) ?? current.tasks[0]
  return (
    <SlideFrame metaIndex={8}>
      <div className="task-value-layout">
        <section className="task-value-copy"><span>TACTILE VALUE IN TASKS</span><h2>是额外信息<br/><em>更是局部、高频、快速反馈</em></h2><p>它把接触后的物理后果变成行动依据，形成“观测—动作—再观测”的具身闭环。</p><div className="value-function-tabs">{(Object.keys(data) as TaskValueKey[]).map(key => <button key={key} className={active === key ? 'active' : ''} onClick={() => { setActive(key); setSelectedTask(data[key].tasks[0].label) }} aria-pressed={active === key}><span>{data[key].n}</span><strong>{data[key].label}</strong><small>{data[key].en}</small></button>)}</div><div className="task-value-note"><i/>点击功能标签，再点击右侧任务标签展开任务细节。</div></section>
        <section className={`task-value-system task-value-${active}`} aria-label="触觉在具身任务中的价值"><div className="value-loop"><div className="loop-node loop-plan"><span>PLAN</span><strong>视觉 / 语言</strong><small>接触前先验</small></div><div className="loop-node loop-touch"><span>TOUCH</span><strong>接触观测</strong><small>力 · 形变 · 滑移 · 属性</small></div><div className="loop-node loop-action"><span>ACTION</span><strong>下一步行动</strong><small>控制 · 调整 · 探索</small></div><div className="loop-center"><b>{current.n}</b><strong>{current.label}</strong><small>{current.en}</small></div><svg viewBox="0 0 760 300" aria-hidden="true"><path d="M153 111H292M468 111H607M607 144C607 236 481 270 380 270M380 270C277 270 153 236 153 144"/><path className="active-loop" d={active === 'confirm' ? 'M292 111H468' : active === 'correct' ? 'M607 144C607 236 481 270 380 270' : 'M380 270C277 270 153 236 153 144'}/></svg></div><div className="task-value-detail"><div className="task-value-summary"><span>{current.n} / {current.en}</span><h3>{current.title}</h3><p>{current.body}</p><div className="task-cluster"><span>任务簇 · 点击展开</span>{current.tasks.map(item => <button key={item.label} className={task.label === item.label ? 'active' : ''} onClick={() => setSelectedTask(item.label)} aria-pressed={task.label === item.label}>{item.label}</button>)}</div></div><div className="task-card"><span>{task.label}</span><h4>{task.need}</h4><dl><div><dt>触觉提供</dt><dd>{task.tactile}</dd></div><div><dt>动作如何改变</dt><dd>{task.action}</dd></div><div><dt>任务级指标</dt><dd>{task.metric}</dd></div></dl></div><div className="task-metric"><span>当前功能的总体评价</span><p>{current.metrics}</p></div><blockquote>{current.example}</blockquote></div></section>
      </div>
    </SlideFrame>
  )
}

type Scenario = 'slip' | 'explore' | 'human'

function NervousSystemVisual({ scenario }: { scenario: Scenario }) {
  return (
    <div className={`nervous-system scenario-${scenario}`}>
      <svg viewBox="0 0 1000 610" role="img" aria-label="具身触觉神经系统五层架构与快慢通路概念图">
        <defs>
          <filter id="nodeGlow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--panel-strong)"/><stop offset="1" stopColor="var(--surface-lo)"/></linearGradient>
        </defs>
        <g className="system-grid">{Array.from({length: 12}).map((_,i)=><path key={`v${i}`} d={`M${40+i*84} 30v540`}/>)}{Array.from({length: 7}).map((_,i)=><path key={`h${i}`} d={`M40 ${30+i*90}h924`}/>)}</g>
        <g className="environment-object"><rect x="43" y="232" width="112" height="170" rx="16"/><path d="M68 258h62M68 282h43"/><text x="99" y="432">ENVIRONMENT</text></g>
        <g className="body-model">
          <circle cx="315" cy="126" r="46" fill="url(#bodyGrad)"/>
          <path d="M253 231c0-39 27-70 62-70s62 31 62 70v109c0 30-17 56-43 67l-19 8-19-8c-26-11-43-37-43-67z" fill="url(#bodyGrad)"/>
          <path d="m260 216-73 74 38 39 58-53M370 216l73 74-38 39-58-53M281 393l-31 122M349 393l31 122"/>
          <g className="receptors">
            {[[238,238],[210,301],[391,278],[421,305],[278,375],[351,371],[252,500],[379,500]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="7"/>)}
          </g>
          <text x="315" y="552">TACTILE BODY</text>
        </g>
        <g className="local-center node-card"><rect x="485" y="341" width="178" height="98" rx="15"/><circle cx="518" cy="375" r="12"/><text className="node-kicker" x="546" y="372">FAST LOCAL CENTER</text><text className="node-title" x="514" y="409">快速局部中枢</text></g>
        <g className="cognitive-center node-card"><rect x="710" y="86" width="230" height="158" rx="18"/><circle cx="748" cy="126" r="15"/><text className="node-kicker" x="779" y="123">COGNITIVE CENTER</text><text className="node-title" x="742" y="163">高级触觉认知</text><text className="node-small" x="742" y="193">统一表征 · 世界模型</text><text className="node-small" x="742" y="216">任务理解 · 主动感知</text></g>
        <g className="encoding node-card"><rect x="475" y="105" width="178" height="98" rx="15"/><circle cx="508" cy="139" r="12"/><text className="node-kicker" x="536" y="136">AFFERENT PATH</text><text className="node-title" x="504" y="173">传入与编码</text></g>
        <g className="output node-card"><rect x="734" y="354" width="198" height="104" rx="15"/><circle cx="769" cy="389" r="12"/><text className="node-kicker" x="797" y="386">ACTION / OUTPUT</text><text className="node-title" x="764" y="423">执行与触觉输出</text></g>
        <g className="slow-path system-path"><path d="M362 231C421 126 436 126 475 151"/><path d="M653 151C680 151 681 165 710 165"/><path d="M825 244v110"/></g>
        <g className="fast-path system-path"><path d="M377 320c49 66 67 70 108 70"/><path d="M663 390h71"/><path d="M734 424c-153 131-368 109-445 5"/></g>
        <g className="active-touch-path system-path"><path d="M742 214C638 286 516 296 387 284"/><path d="m402 267-17 17 22 8"/></g>
        <g className="human-boundary"><path d="M888 475c44 0 70 23 70 59"/><circle cx="888" cy="491" r="17"/><path d="M888 508v54m-25-32h50"/><rect x="813" y="521" width="62" height="29" rx="14"/><text x="844" y="541">CONSENT</text></g>
        <g className="pulses slow"><circle r="5"><animateMotion dur="3.6s" repeatCount="indefinite" path="M362 231C421 126 436 126 475 151C600 151 681 165 710 165"/></circle></g>
        <g className="pulses fast"><circle r="6"><animateMotion dur="1.15s" repeatCount="indefinite" path="M377 320C426 386 444 390 485 390H734"/></circle></g>
        <g className="pulses return"><circle r="5"><animateMotion dur="2.4s" repeatCount="indefinite" path="M825 244V354C670 530 420 540 289 429"/></circle></g>
        <g className="contact-event"><circle cx="174" cy="306" r="34"/><circle cx="174" cy="306" r="18"/><path d="M140 306h-38"/><text x="51" y="295">CONTACT</text><text x="51" y="315">EVENT</text></g>
      </svg>
      <div className="latency-label fast-label"><b>快速通路</b><span>确定时限 · 局部安全</span></div>
      <div className="latency-label slow-label"><b>高级通路</b><span>长时历史 · 多模态推理</span></div>
    </div>
  )
}

function FutureSlideLegacy() {
  const [scenario, setScenario] = useState<Scenario>('slip')
  const scenarioData: Record<Scenario, { en: string; title: string; lead: string; points: string[] }> = {
    slip: { en: '01 / FAST REFLEX', title: '滑移：先反射，再解释', lead: '高频变化沿短通路触发抓力修正；高层模型随后更新对象与任务状态。', points: ['端侧检测初触、冲击、滑移与过载', '最坏响应时间比平均推理速度更关键'] },
    explore: { en: '02 / ACTIVE TOUCH', title: '未知物体：主动获得证据', lead: '世界模型比较候选接触后果，选择信息收益更高且风险可控的下一次触碰。', points: ['动作条件建模区分物体属性与探索方式', '联合优化信息增益、任务进展与损伤风险'] },
    human: { en: '03 / SOCIAL TOUCH', title: '人机接触：双向而有边界', lead: '系统既理解人的接触状态，也以力、振动或形变回应；同意与退出不是附加项。', points: ['先保证物理安全与行为可预测', '持续同意、个体适应和可撤回机制'] },
  }
  const current = scenarioData[scenario]
  return (
    <SlideFrame metaIndex={8}>
      <div className="future-layout">
        <div className="scenario-panel">
          <div className="scenario-tabs">
            <button className={scenario === 'slip' ? 'active' : ''} onClick={() => setScenario('slip')}><i/>滑移反射</button>
            <button className={scenario === 'explore' ? 'active' : ''} onClick={() => setScenario('explore')}><i/>主动探索</button>
            <button className={scenario === 'human' ? 'active' : ''} onClick={() => setScenario('human')}><i/>人机触觉</button>
          </div>
          <div className="scenario-copy">
            <span>{current.en}</span>
            <h2>{current.title}</h2>
            <p>{current.lead}</p>
            <ul>{current.points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>
          </div>
          <div className="roadmap-mini">
            <span>TECHNOLOGY ROUTE</span>
            <div><i>01</i><p>共同接口</p></div><b />
            <div><i>02</i><p>分层闭环</p></div><b />
            <div><i>03</i><p>预测与主动</p></div><b />
            <div><i>04</i><p>双向交互</p></div>
          </div>
        </div>
        <NervousSystemVisual scenario={scenario} />
      </div>
    </SlideFrame>
  )
}

type FuturePart = 'overview' | 'brain' | 'spine' | 'hand' | 'contact'
type FutureStructure = Exclude<FuturePart, 'overview'>

interface FuturePartInfo {
  number: string
  eyebrow: string
  title: string
  question: string
  route: string
  short: string
}

const futurePartData: Record<FuturePart, FuturePartInfo> = {
  overview: {
    number: '00',
    eyebrow: 'SYSTEM VIEW',
    title: '感知、理解、执行、再感知',
    question: '结合软硬件，把接触、反射、理解与行动组织成一条闭环。',
    route: '从身体接口出发，局部反射做精细控制，高阶模型形成预测、认知和主动接触规划。',
    short: '完整闭环',
  },
  brain: {
    number: '01',
    eyebrow: 'COGNITIVE LOOP',
    title: '大脑 · 高级触觉中枢',
    question: '形成触觉表征，预测接触后果，理解任务，主动决策',
    route: '跨时间、跨部位和跨模态统一表征、触觉世界模型、任务驱动的主动感知、人机协同',
    short: '理解、预测与策略',
  },
  spine: {
    number: '02',
    eyebrow: 'LOCAL REFLEX',
    title: '脊髓 · 快速局部闭环',
    question: '端侧检测、端侧计算、低级反射',
    route: '端侧事件检测、反射控制、安全约束与可验证的时限。',
    short: '低时延局部闭环',
  },
  hand: {
    number: '03',
    eyebrow: 'BODY INTERFACE',
    title: '手 · 感受与执行共位',
    question: '操作和探索动作，分布式感受器、触觉输出、局部计算与可维护体表',
    route: '感知与执行共享同一身体界面，并在形变、磨损和大面积部署下持续工作',
    short: '感受器与效应器',
  },
  contact: {
    number: '04',
    eyebrow: 'WORLD COUPLING',
    title: '接触 · 感受器与触觉身体',
    question: '获取机械、热、化学、近场和本体信息，并适应多种智能体',
    route: '接触事件编码、动作条件建模与超人类触觉感知。',
    short: '环境与动作后果',
  },
}

const futureStructures: FutureStructure[] = ['brain', 'spine', 'hand', 'contact']

function FutureAnchorVisual({ focus, onFocus, playing, playRun, onPlay }: {
  focus: FuturePart
  onFocus: (part: FuturePart) => void
  playing: boolean
  playRun: number
  onPlay: () => void
}) {
  const activate = (part: FutureStructure) => onFocus(focus === part ? 'overview' : part)
  return (
    <div className={`future-anchor-visual focus-${focus} ${playing ? 'is-playing' : ''}`}>
      <div className="future-art-stage">
      <img
        className="future-neuro-image"
        src="/assets/embodied-tactile-neural-hero-refined-v1.png"
        alt="侧面人体以手指触碰界面，脑、脊髓与手之间由具身触觉通路连接"
      />
      <img
        className="future-neuro-highlight"
        src="/assets/embodied-tactile-neural-hero-refined-v1.png"
        alt=""
        aria-hidden="true"
      />
      <svg className="future-neuro-art" viewBox="0 0 1000 620" role="img" aria-labelledby="future-figure-title future-figure-desc" preserveAspectRatio="xMidYMid meet">
        <title id="future-figure-title">具身触觉神经系统功能类比</title>
        <desc id="future-figure-desc">二维侧面人物通过手指触碰柔性表面，脑、脊髓、手和环境由感觉上行、快速反射与控制下行通路连接。</desc>
        <defs>
          <linearGradient id="futureBodyFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--future-body-hi)" />
            <stop offset="1" stopColor="var(--future-body-lo)" />
          </linearGradient>
          <linearGradient id="futureSurfaceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--future-surface-hi)" />
            <stop offset="1" stopColor="var(--future-surface-lo)" />
          </linearGradient>
          <radialGradient id="futureAura" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--future-aura)" stopOpacity=".34" />
            <stop offset="1" stopColor="var(--future-aura)" stopOpacity="0" />
          </radialGradient>
          <filter id="futureSoftShadow" x="-25%" y="-25%" width="150%" height="170%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="var(--future-shadow)" floodOpacity=".13" />
          </filter>
          <filter id="futurePulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <ellipse className="future-neuro-aura" cx="421" cy="191" rx="176" ry="176" fill="url(#futureAura)" />
        <ellipse className="future-neuro-ground" cx="660" cy="590" rx="315" ry="17" />

        <g className="future-neuro-body" filter="url(#futureSoftShadow)">
          <path className="future-neuro-torso" d="M222 620 C222 558 225 505 241 457 C258 406 293 371 340 349 L354 305 C326 279 309 241 311 198 C313 143 347 99 398 83 C444 70 490 83 517 116 C530 132 537 150 537 168 C552 176 565 185 571 195 C576 203 571 210 560 214 L548 218 C552 231 550 240 541 246 C544 261 536 272 520 278 C501 284 481 277 465 270 L461 309 C498 317 526 335 545 362 C570 398 577 455 572 515 L566 620 Z" />
          <path className="future-neuro-arm" d="M477 322 C519 318 557 334 593 359 C630 385 666 401 708 409 C746 416 773 410 800 405 C814 402 827 410 831 423 C834 436 827 448 814 454 C797 462 777 459 754 456 C728 453 705 455 681 452 C640 448 607 438 573 420 C539 402 510 382 491 370 Z" />
          <g className="future-neuro-fingers">
            <path d="M810 410 C795 406 781 397 768 386 C758 378 747 380 741 390 C736 400 741 411 751 417 L795 441 C807 448 819 444 824 435 C830 424 822 413 810 410 Z" />
            <path d="M802 418 C813 423 816 434 810 445 L788 481 C782 491 772 494 764 488 C756 482 756 472 763 464 L788 431 C794 423 795 419 802 418 Z" />
            <path d="M819 422 C831 425 837 436 833 449 L820 496 C817 508 808 515 799 512 C789 509 785 499 790 488 L807 444 C811 433 811 426 819 422 Z" />
            <path d="M838 421 C850 421 859 431 859 444 L858 501 C858 514 850 523 840 523 C830 523 823 514 825 503 L832 444 C833 433 832 425 838 421 Z" />
            <path className="future-neuro-index" d="M857 419 C870 417 883 426 887 440 C893 464 896 489 900 515 L905 541 C907 552 900 561 890 562 C880 563 872 555 871 545 L865 516 C860 490 856 466 851 444 C848 431 850 423 857 419 Z" />
            <path className="future-neuro-palm" d="M788 399 C810 391 840 393 860 408 C878 421 886 443 881 465 C875 491 857 507 832 508 C807 509 787 495 780 472 C773 451 774 411 788 399 Z" />
          </g>
        </g>

        <g className="future-neuro-spine">
          <path className="future-spine-ribbon" d="M420 181 C414 221 409 264 402 306 C395 347 383 386 386 426 C389 465 394 495 385 533" />
          <path className="future-spine-core" d="M420 181 C414 221 409 264 402 306 C395 347 383 386 386 426 C389 465 394 495 385 533" />
        </g>
        <path className="future-neuro-underlay" d="M420 181 C414 218 411 263 405 304 C402 322 399 337 400 350 C466 338 526 357 590 390 C649 424 708 438 776 433 C817 430 847 439 863 464 C879 489 884 524 890 554" />

        <g className="future-neuro-brain">
          <path className="future-brain-shape" d="M366 157 C354 145 357 126 372 119 C375 102 393 94 408 103 C420 89 443 92 450 108 C468 105 482 120 478 137 C491 148 487 167 472 174 C469 192 449 200 434 191 C420 204 399 198 394 182 C375 185 360 174 366 157 Z" />
          <g className="future-brain-folds">
            <path d="M378 143 C392 133 405 137 412 149 C420 162 416 175 404 181" />
            <path d="M413 106 C405 121 410 132 423 137 C435 141 443 153 439 166" />
            <path d="M452 113 C443 124 445 138 457 144 C468 150 471 160 465 171" />
          </g>
          <circle className="future-brain-wave wave-one" cx="422" cy="149" r="56" />
          <circle className="future-brain-wave wave-two" cx="422" cy="149" r="56" />
        </g>

        <g className="future-neuro-hand-detail">
          <path d="M856 438 C864 455 867 477 869 498" />
          <path d="M838 440 C839 459 835 477 831 492" />
          <path d="M819 440 C814 457 807 474 800 487" />
          <path d="M803 434 C793 449 782 463 772 475" />
          <path d="M845 455 C836 463 829 470 821 482 M845 455 C832 449 816 445 799 442 M845 455 C850 475 853 489 855 504" />
        </g>
        <g className="future-neuro-face-detail">
          <path d="M512 167 Q521 173 531 167" />
          <path d="M527 238 Q534 242 541 236" />
          <ellipse cx="525" cy="217" rx="17" ry="11" />
        </g>

        <g className="future-flow-static" aria-hidden="true">
          <path className="sensory" pathLength="1" d="M830 560 C805 535 781 513 755 492 C699 469 632 454 577 424 C507 386 451 341 342 292 C328 271 323 246 321 218 C319 173 290 126 250 86" />
          <path className="motor" pathLength="1" d="M264 92 C300 143 326 187 333 229 C338 260 340 286 360 303 C423 357 499 403 576 439 C651 474 724 484 781 511 C800 521 817 539 830 560" />
          <path className="reflex" pathLength="1" d="M830 560 C788 522 730 497 664 480 C590 460 519 427 454 386 C409 358 369 325 342 299 C375 316 408 344 445 377 C505 431 578 466 659 485 C724 500 780 523 818 564" />
        </g>

        <g key={playRun} className="future-flow-live" aria-hidden="true">
          <path className="sensory" pathLength="1" d="M830 560 C805 535 781 513 755 492 C699 469 632 454 577 424 C507 386 451 341 342 292 C328 271 323 246 321 218 C319 173 290 126 250 86" />
          <path className="motor" pathLength="1" d="M264 92 C300 143 326 187 333 229 C338 260 340 286 360 303 C423 357 499 403 576 439 C651 474 724 484 781 511 C800 521 817 539 830 560" />
          <path className="reflex" pathLength="1" d="M830 560 C788 522 730 497 664 480 C590 460 519 427 454 386 C409 358 369 325 342 299 C375 316 408 344 445 377 C505 431 578 466 659 485 C724 500 780 523 818 564" />
        </g>

        <g className="future-neuro-contact-surface">
          <path className="future-contact-fill" d="M710 556 C770 552 829 552 860 552 C872 552 878 562 890 562 C902 562 908 552 921 552 C945 552 968 553 988 556 L988 603 C896 597 803 598 710 603 Z" />
          <path className="future-contact-edge" d="M710 556 C770 552 829 552 860 552 C872 552 878 562 890 562 C902 562 908 552 921 552 C945 552 968 553 988 556" />
          <path className="future-contact-ripple ripple-one" d="M851 575 C870 584 909 584 929 575" />
          <path className="future-contact-ripple ripple-two" d="M832 584 C863 600 916 600 947 583" />
        </g>
      </svg>

      <button type="button" className="future-hotspot hotspot-brain" aria-label="查看大脑：理解、预测与策略" aria-pressed={focus === 'brain'} aria-controls="future-detail" onClick={() => activate('brain')}><i/><span>大脑</span></button>
      <button type="button" className="future-hotspot hotspot-spine" aria-label="查看脊髓：低时延局部闭环" aria-pressed={focus === 'spine'} aria-controls="future-detail" onClick={() => activate('spine')}><i/><span>脊髓</span></button>
      <button type="button" className="future-hotspot hotspot-hand" aria-label="查看手：感受与执行共位" aria-pressed={focus === 'hand'} aria-controls="future-detail" onClick={() => activate('hand')}><i/><span>手</span></button>
      <button type="button" className="future-hotspot hotspot-contact" aria-label="查看接触：环境进入系统" aria-pressed={focus === 'contact'} aria-controls="future-detail" onClick={() => activate('contact')}><i/><span>接触</span></button>
      </div>

      <div className="future-visual-controls">
        <button type="button" className="future-overview-button" onClick={() => onFocus('overview')} aria-pressed={focus === 'overview'}>全景</button>
        <button type="button" className="future-play-button" onClick={onPlay} disabled={playing}><span className="play-icon">{playing ? '•••' : '▶'}</span>{playing ? '闭环演示中' : playRun > 0 ? '重新播放闭环' : '播放闭环'}</button>
      </div>
      <div className="future-flow-legend" aria-label="信息流图例"><span className="sensory">感觉上行</span><span className="reflex">脊髓反射</span><span className="motor">控制下行</span></div>
    </div>
  )
}

function FutureSlide() {
  const [focus, setFocus] = useState<FuturePart>('overview')
  const [playing, setPlaying] = useState(false)
  const [playRun, setPlayRun] = useState(0)
  const current = futurePartData[focus]

  const playLoop = () => {
    if (playing) return
    setFocus('overview')
    setPlayRun(run => run + 1)
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing) return
    // Keep the state alive through the slower spinal relay and the final hand response.
    const timer = window.setTimeout(() => setPlaying(false), 5600)
    return () => window.clearTimeout(timer)
  }, [playing, playRun])

  return (
    <SlideFrame metaIndex={10}>
      <div className="future-anchor-layout">
        <aside className="future-anchor-copy">
          <p className="future-anchor-thesis">未来的触觉系统，不应只是更灵敏的传感器，而应像神经系统一样组织感知、反射、理解与行动。</p>
          <div id="future-detail" className={`future-detail detail-${focus}`}>
            <div className="future-detail-heading"><span>{current.number}</span><div><small>{current.eyebrow}</small><h2>{current.title}</h2></div></div>
            <div className="future-detail-block"><span>核心功能</span><p>{current.question}</p></div>
            <div className="future-detail-block"><span>研究问题</span><p>{current.route}</p></div>
          </div>
          <div className="future-part-nav" aria-label="选择神经系统结构">
            {futureStructures.map(part => (
              <button key={part} type="button" className={focus === part ? 'active' : ''} onClick={() => setFocus(focus === part ? 'overview' : part)} aria-pressed={focus === part} aria-controls="future-detail">
                <span>{futurePartData[part].number}</span><strong>{futurePartData[part].title.split(' · ')[0]}</strong><small>{futurePartData[part].short}</small>
              </button>
            ))}
          </div>
          <p className="future-anchor-note"><i/>本文前瞻构想 · 功能类比，不是生物结构复刻</p>
          <span className="sr-only" aria-live="polite">当前显示：{current.title}{playing ? '，正在播放感知与控制闭环' : ''}</span>
        </aside>
        <FutureAnchorVisual focus={focus} onFocus={setFocus} playing={playing} playRun={playRun} onPlay={playLoop} />
      </div>
    </SlideFrame>
  )
}

function FutureCapabilitySlide() {
  const sensingModalities = [
    { label:'机械', detail:'法向 / 切向力 · 接触几何 · 微滑移', tone:'coral' },
    { label:'热学', detail:'温度 · 热流 · 材料热属性', tone:'cyan' },
    { label:'化学', detail:'气味 · pH · 挥发性物质', tone:'violet' },
    { label:'近场', detail:'接近 · 多光谱 · 环境异常', tone:'green' },
  ]
  const bodyRequirements = [
    ['共形', '适配尺寸、曲率与局部刚度'],
    ['可变形', '随拉伸、弯曲和运动保持标定'],
    ['泛在部署', '从指尖扩展到手、足、臂与躯干'],
    ['可维护', '局部更换、自修复与安全降级'],
  ]
  const evaluations = [
    ['精密装配', '位置 / 力误差 · 卡阻提前量'],
    ['高速抓取', '滑移提前量 · 端到端响应'],
    ['危险环境', '热 / 化学异常检出与误报'],
    ['长期运行', '漂移 · 磨损 · 重标定 · 降级'],
  ]
  return (
    <SlideFrame metaIndex={11}>
      <div className="future-capability-layout">
        <div className="future-capability-thesis"><span>RECEPTOR × TACTILE BODY</span><strong>不是把单一通道无限加密，而是让任务需要的物理量可观测，并让这些观测长期属于身体。</strong></div>
        <div className="future-route-grid">
          <section className="future-route-card route-superhuman">
            <header><div><span>4.2 / RECEPTOR</span><h2>超人类任务相关感知</h2></div><b>扩大“能感知什么”</b></header>
            <div className="modality-map">
              <div className="modality-core"><span>TASK</span><strong>任务所需<br/>接触状态</strong><small>同一身体坐标 × 同一时间基准</small></div>
              {sensingModalities.map((item,index) => <div key={item.label} className={`modality-node modality-${index} tone-${item.tone}`}><i/><strong>{item.label}</strong><small>{item.detail}</small></div>)}
            </div>
            <div className="route-evidence"><span>代表路径</span><p><b>星鼻鼹仿生阵列</b>：形貌、刚度与气味协同；<b>SuperTac</b>：约 1 mm 皮肤内集成多光谱、摩擦电与惯性信息；<b>多模态热敏触觉</b>：联合压力、温度、纹理和滑移。</p></div>
            <div className="route-direction"><span>技术路线</span><strong>多机制协同</strong><i>→</i><strong>时空对齐</strong><i>→</i><strong>策略可调用状态</strong></div>
          </section>
          <section className="future-route-card route-body">
            <header><div><span>4.3 / TACTILE BODY</span><h2>可变形触觉身体与泛在部署</h2></div><b>扩大“能部署在哪里”</b></header>
            <div className="body-deployment-map">
              <div className="body-silhouette" aria-hidden="true"><i className="body-head"/><i className="body-torso"/><i className="body-arm arm-left"/><i className="body-arm arm-right"/><i className="body-leg leg-left"/><i className="body-leg leg-right"/>{Array.from({length:12}).map((_,i)=><b key={i} style={{'--dot':i} as CSSProperties}/>)}</div>
              <div className="body-requirements">{bodyRequirements.map(([title,detail],index)=><div key={title}><span>0{index+1}</span><strong>{title}</strong><small>{detail}</small></div>)}</div>
            </div>
            <div className="route-evidence"><span>代表路径</span><p><b>GelSight Svelte</b>：沿整根手指部署；<b>可拉伸手套</b>：1152 个力感知通道并主动抑制应变干扰；<b>软体触觉手</b>：掌—指协同完成感知与抓取。</p></div>
            <div className="route-direction"><span>技术路线</span><strong>共形集成</strong><i>→</i><strong>几何自标定</strong><i>→</i><strong>全生命周期维护</strong></div>
          </section>
        </div>
        <section className="future-evaluation-strip"><div><span>共同终点 / TASK-LEVEL VALIDATION</span><strong>两条路线必须在真实任务中汇合</strong></div>{evaluations.map(([title,detail])=><div key={title}><strong>{title}</strong><small>{detail}</small></div>)}</section>
      </div>
    </SlideFrame>
  )
}

function FutureEdgeSlide() {
  const [activeRoute, setActiveRoute] = useState(0)
  const latencyStages = [
    ['材料响应', '接触先变成可测信号'],
    ['采样 / 读出', '阵列扫描与前端转换'],
    ['传输 / 调度', '总线、缓存与任务等待'],
    ['推理', '状态识别与风险判断'],
    ['执行器响应', '产生有效力变化'],
  ]
  const route = [
    { n:'01', title:'传感—计算一体化', body:'在传感器附近完成补偿、变化检测、接触区域提取和健康监测。', tags:'模拟前端 · 事件读出 · MCU / FPGA / NPU' },
    { n:'02', title:'快慢双通路', body:'快通路处理初触、冲击、微滑移和过载；慢通路整合视觉、语言、本体与长时历史。', tags:'局部反射 · 高层策略 · 权限仲裁' },
    { n:'03', title:'分层数据通路', body:'常态上传低维状态，突变缓存高频片段，异常时开放受控原始窗口。', tags:'任务保持压缩 · 原始旁路 · 按需带宽' },
    { n:'04', title:'安全与可验证性', body:'用硬实时状态机、控制屏障或力限幅保证底线，并保留触发证据以便追溯。', tags:'最坏延迟 · 冗余 · 安全降级' },
  ]
  return (
    <SlideFrame metaIndex={12}>
      <div className="future-edge-layout">
        <section className="edge-necessity-card">
          <div className="edge-card-head"><span>WHY EDGE?</span><h2>端侧处理的必要性</h2><p>滑移、碰撞、夹伤和过载不会等待高层模型完成推理。系统必须从任务允许的最晚响应时间反推整条链路。</p></div>
          <div className="latency-race">
            <div className="deadline-band"><span>物理失效窗口</span><strong>事件发生</strong><i/><b>最晚安全响应</b></div>
            <div className="latency-chain">{latencyStages.map(([title,detail],index)=><div key={title}><span>0{index+1}</span><strong>{title}</strong><small>{detail}</small>{index < latencyStages.length-1 && <i>→</i>}</div>)}</div>
            <div className="edge-split"><div><span>仅上传主机</span><strong>延迟 + 抖动逐段累积</strong><small>阵列扫描、通信、调度和通用模型共同决定尾部延迟</small></div><div className="edge-fast"><span>端侧感知 + 端侧反射</span><strong>在局部闭合严格时限</strong><small>先形成接触 / 滑移 / 风险状态，再直接增力、卸力、停止或退让</small></div></div>
          </div>
          <div className="edge-definition"><div><span>AFFERENT</span><strong>端侧触觉感知</strong><small>把原始信号变成接触、滑移和风险状态</small></div><i>≠</i><div><span>REFLEX</span><strong>端侧反射控制</strong><small>在高级认知完成前直接产生受限局部动作</small></div></div>
        </section>
        <section className="edge-roadmap-card">
          <header><span>TECHNICAL ROADMAP</span><h2>从智能节点到可验证的分层反射</h2></header>
          <div className="edge-roadmap-flow">
            <div className="edge-roadmap-steps" role="tablist" aria-label="四步技术路线">
              {route.map((item, index) => <button key={item.n} role="tab" aria-selected={activeRoute === index} className={activeRoute === index ? 'active' : ''} onClick={() => setActiveRoute(index)}><b>{item.n}</b><span>{item.title}</span></button>)}
            </div>
            <div className="edge-roadmap-detail" role="tabpanel">
              <div className="edge-roadmap-detail-index">{route[activeRoute].n}</div>
              <div><strong>{route[activeRoute].title}</strong><p>{route[activeRoute].body}</p><small>{route[activeRoute].tags}</small></div>
            </div>
          </div>
          <div className="edge-contract">
            <span>快慢通路的接口契约</span>
            <div><strong>高层下发</strong><p>任务阶段 · 预期接触 · 允许力范围</p></div><i>⇄</i><div><strong>端侧报告</strong><p>真实接触 · 预测偏差 · 不确定度 / 风险</p></div>
          </div>
          <div className="edge-compression"><span>任务保持率</span><p>压缩后仍需保持<strong>滑移提前量、控制稳定裕度和异常可诊断性</strong>；不能只报告压缩比或重建误差。</p></div>
        </section>
        <section className="edge-metrics-strip"><div><span>SYSTEM VALIDATION</span><strong>评价完整感知—执行链</strong></div><div><strong>尾部响应</strong><small>最大端到端延迟 · 抖动</small></div><div><strong>安全检测</strong><small>漏检率 · 误触发损失</small></div><div><strong>故障状态</strong><small>通信阻塞 · taxel 故障 · 计算过载</small></div><div><strong>闭环结果</strong><small>稳定裕度 · 任务保持 · 安全降级</small></div></section>
      </div>
    </SlideFrame>
  )
}

type BrainLayer = 'representation' | 'world' | 'policy'

function FutureBrainSlide() {
  const [layer, setLayer] = useState<BrainLayer>('representation')
  const data: Record<BrainLayer, { label: string; en: string; tone: string; title: string; lead: string; points: string[] }> = {
    representation: { label: '统一表征', en: 'REPRESENTATION', tone: 'cyan', title: '保留身体坐标与接触时间', lead: '触觉表征不能只把原始信号压成通用 token；身体位置、接触结构和时间演化必须仍然可追溯。', points: ['信号层：图像、阵列、事件流、力 / 力矩与本体状态', '时间层：持续压力、初触、冲击、滑移和动作历史', '空间—物理层：身体位置、接触坐标、压力、剪切与材质'] },
    world: { label: '触觉世界模型', en: 'TACTILE WORLD MODEL', tone: 'violet', title: '从“发生了什么”预测“接下来会怎样”', lead: '世界模型把动作条件、接触建立、位姿变化与力学后果连接起来，为策略提供可比较的未来。', points: ['动作 → 接触事件 → 力学后果的条件建模', '预测分布而非单一猜测，并显式表达不确定性', '用真实触觉反馈修正预测，缩小仿真—现实差距'] },
    policy: { label: '预测—执行—校正', en: 'PREDICT / ACT / CORRECT', tone: 'coral', title: '高层规划、中层预测与低层反馈形成闭环', lead: '策略不应只消费识别标签，而要在不同时间尺度上联合规划、预测、执行与纠偏。', points: ['高层：视觉—语言模型理解目标并规划长程任务', '中层：触觉世界模型比较候选动作与短期接触后果', '低层：端侧策略依据真实滑移、冲击与过载快速修正'] },
  }
  const current = data[layer]
  return <SlideFrame metaIndex={13}><div className="future-brain-layout"><aside className="future-brain-sidebar"><div className="future-brain-thesis"><span>THE TACTILE BRAIN</span><strong>让触觉成为具身“脑”可以预测的物理语言</strong></div><nav className="future-brain-tabs" aria-label="4.5 技术主题">{(Object.keys(data) as BrainLayer[]).map((key, i) => <button key={key} aria-selected={layer === key} className={layer === key ? `active tone-${data[key].tone}` : ''} onClick={() => setLayer(key)}><b>0{i + 1}</b><span>{data[key].label}</span><small>{data[key].en}</small></button>)}</nav><section className={`future-brain-detail tone-${current.tone}`}><div className="future-brain-detail-head"><span>0{(Object.keys(data) as BrainLayer[]).indexOf(layer) + 1}</span><div><small>{current.en}</small><h2>{current.title}</h2></div></div><p>{current.lead}</p><ul>{current.points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul></section><p className="future-brain-note"><i/>AnyTouch · UniTacHand · FTP-1 · ContactWorld · DreamTacVLA</p></aside><section className="future-brain-canvas" aria-label="预测执行误差校正闭环"><div className="brain-canvas-header"><span>MODEL → REALITY</span><strong>预测 — 执行 — 误差 — 修正</strong></div><div className="brain-loop"><div className="brain-loop-node node-state"><span>当前状态</span><strong>触觉表征</strong><small>位置 · 接触 · 力学 · 历史</small></div><div className="brain-loop-node node-predict"><span>动作条件</span><strong>未来触觉</strong><small>候选动作 + 不确定性</small></div><div className="brain-loop-node node-real"><span>执行</span><strong>真实触觉</strong><small>滑移 · 冲击 · 过载</small></div><div className="brain-loop-node node-error"><span>在线比较</span><strong>预测误差</strong><small>偏差 · 风险 · 置信度</small></div><div className="brain-loop-node node-correct"><span>分层响应</span><strong>动作修正</strong><small>局部修正 · 重规划 · 停机</small></div><svg viewBox="0 0 760 330" aria-hidden="true"><path className="brain-link link-cyan" d="M235 112H525"/><path className="brain-link link-violet" d="M650 154V218"/><path className="brain-link link-coral" d="M520 264H500"/><path className="brain-link link-coral" d="M260 264H235"/><path className="brain-link link-return" d="M118 218V154"/></svg></div><div className="brain-layer-strip"><div><span>HIGH LEVEL</span><strong>目标理解 / 长程规划</strong></div><div><span>MID LEVEL</span><strong>接触后果 / 候选动作</strong></div><div><span>LOW LEVEL</span><strong>真实反馈 / 安全边界</strong></div></div><div className="brain-eval-strip"><span><strong>评价不只是 embedding 相似度</strong></span><b>跨本体迁移</b><b>接触物理预测</b><b>真实闭环收益</b></div></section></div></SlideFrame>
}

type DynamicMode = 'dynamic' | 'active' | 'integrated'
function FutureDynamicSlide() {
  const [mode, setMode] = useState<DynamicMode>('dynamic')
  const data: Record<DynamicMode, { label: string; en: string; tone: string; title: string; lead: string; points: string[] }> = {
    dynamic: { label: '动态触觉', en: 'DYNAMIC TOUCH', tone: 'cyan', title: '保留“怎么发生”，而不只是“发生了什么”', lead: '初触、冲击、接触面扩张、剪切累积、微滑移和滚动都发生在时间序列中。', points: ['低频通路保持持续压力与形变，高频 / 事件通路捕捉冲击、纹理和滑移先兆', '用事件流、帧、振动和状态估计共同构成时空接触图', '评价变化检测提前量、事件漏检与时间对齐延迟'] },
    active: { label: '主动触觉', en: 'ACTIVE TOUCH', tone: 'violet', title: '让动作本身成为感知器的一部分', lead: '系统通过按压、滑动、滚动、调整抓力等动作主动改变接触条件，从结果中获取信息。', points: ['根据不确定性选择接触位置、方向、力、速度和停止时机', '用信息增益、任务进展、能耗与损伤风险共同约束探索', '世界模型先预测动作可能产生的触觉分布，再选择风险可控动作'] },
    integrated: { label: '感知—操作一体化', en: 'SENSE / ACT / UPDATE', tone: 'coral', title: '每一次操作都同时改变世界与下一次证据', lead: '动态触觉提供变化，主动触觉制造变化；两者共同把触觉变成持续更新的控制闭环。', points: ['抓力调整、插入中的微振动、滚动与擦拭同时完成操作和属性辨识', '策略目标同时包含任务进展、信息收益、接触安全与探索代价', '把感知层、控制层和任务层的收益分开评价'] },
  }
  const current = data[mode]
  // Connector geometry is kept in the same logical 760×348 coordinate space as the SVG.
  return <SlideFrame metaIndex={14}><div className="future-dynamic-layout"><aside className="future-dynamic-sidebar"><div className="future-dynamic-thesis"><span> DYNAMIC + ACTIVE</span><strong>让触觉从“读数”变成“探索中的证据”</strong></div><nav className="future-dynamic-tabs" aria-label="4.6 技术主题">{(Object.keys(data) as DynamicMode[]).map((key, i) => <button key={key} aria-selected={mode === key} className={mode === key ? `active tone-${data[key].tone}` : ''} onClick={() => setMode(key)}><b>0{i + 1}</b><span>{data[key].label}</span><small>{data[key].en}</small></button>)}</nav><section className={`future-dynamic-detail tone-${current.tone}`}><div className="future-dynamic-detail-head"><span>0{(Object.keys(data) as DynamicMode[]).indexOf(mode) + 1}</span><div><small>{current.en}</small><h2>{current.title}</h2></div></div><p>{current.lead}</p><ul>{current.points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul></section><p className="future-dynamic-note"><i/>Tac2Pose · Evetac · NeuTouch · Tactile Dexterity · UniTacVLA</p></aside><section className="future-dynamic-canvas" aria-label="动态触觉与主动触觉闭环"><div className="dynamic-canvas-header"><span>CONTACT AS A TIME SERIES</span><strong>动作改变接触，接触更新动作</strong></div><div className="dynamic-loop"><div className="dynamic-axis axis-time"><span>时间</span><i/><b>初触</b><b>加载</b><b>滑移 / 滚动</b><b>释放 / 再接触</b></div><div className="dynamic-signal signal-low"><span>低频状态</span><div>{[1,2,3,4,5,6,7].map(i => <i key={i}/>)}</div><small>持续压力 · 形变 · 姿态</small></div><div className="dynamic-signal signal-high"><span>高频 / 事件</span><div>{[1,2,3,4,5,6,7,8,9].map(i => <i key={i}/>)}</div><small>冲击 · 纹理 · 微滑移先兆</small></div><div className="dynamic-state"><span>共享接触状态</span><strong>位置 × 速度 × 载荷</strong><small>不确定性 / 置信度</small></div><div className="dynamic-action"><span>主动动作</span><strong>按压 · 滑动 · 滚动</strong><small>信息增益 + 安全约束</small></div><svg viewBox="0 0 760 348" aria-hidden="true"><path className="dynamic-link dynamic-cyan" d="M364 35H396"/><path className="dynamic-link dynamic-violet" d="M364 174H396"/><path className="dynamic-link dynamic-coral" d="M578 219V278"/><path className="dynamic-link dynamic-return" d="M396 313H364"/></svg></div><div className="dynamic-eval"><div><span>感知层</span><strong>变化检测提前量</strong><small>事件漏检 · 时间对齐</small></div><div><span>控制层</span><strong>接触期修正</strong><small>滑移抑制 · 稳定裕度</small></div><div><span>任务层</span><strong>信息收益 / 代价</strong><small>探索效率 · 损伤风险</small></div></div></section></div></SlideFrame>
}

type SocialLayer = 'cooperation' | 'communication' | 'ethics'

function FutureSocialSlide() {
  const [layer, setLayer] = useState<SocialLayer>('cooperation')
  const data: Record<SocialLayer, { label: string; en: string; tone: string; title: string; lead: string; points: string[] }> = {
    cooperation: { label: '理解与协作', en: 'SENSE / COOPERATE', tone: 'cyan', title: '先读懂人的接触，再共同完成动作', lead: '触觉从保护性传感器扩展为协作接口：系统需要把接触位置、方向、持续时间、压力分布和节奏，与姿态、视线、语言和当前任务共同解释。', points: ['保护性触觉：碰撞、夹伤、过载先触发安全旁路', '协作性触觉：推、拉、扶持、交接与共同承载传递低带宽动作意图', '社会性触觉：握手、轻拍、拥抱和接触节奏表达关系与互动意愿', '从手势分类转向交互状态估计，并保留意图不确定性'] },
    communication: { label: '通信与再现', en: 'HAPTIC COMMUNICATION', tone: 'violet', title: '把接触事件编码，再在另一端安全重放', lead: '双向触觉通信不是逐点复制原始信号，而是共享接触事件、身体坐标和动力学语义，由接收端依据设备能力与人的感知阈值进行可辨认、受限的再现。', points: ['传感端：估计位置、意图、力学状态与接触事件，而非只上传高维原始流', '输出端：用力、振动、压力、形变、温度或柔顺执行器表达触觉', '关键约束：通信延迟、缩放误差、再现力上限与闭环稳定性', '应用路径：远程力觉、社交机器人表面、可穿戴映射与示范迁移'] },
    ethics: { label: '伦理与评价', en: 'CONSENT / EVALUATION', tone: 'coral', title: '能接触，不等于可以接触', lead: '人体触觉具有侵入性；系统必须把持续同意、个体差异、隐私和可撤回机制写进控制闭环，并用长期、跨人群的多源证据评价交互。', points: ['接触前取得可理解的同意，接触中检测退缩、抵抗和撤回并立即减力退出', '最小化采集、端侧匿名特征、用途授权和可删除记录，保护情绪与健康隐私', '评价同时覆盖峰值力、冲击、退出时间、意图识别、舒适度、自然度和长期信任', '从假体与力学模型，到受控用户研究，再到长期、跨文化和特殊人群验证'] }
  }
  const current = data[layer]
  return <SlideFrame metaIndex={15}>
    <div className="future-social-layout">
      <div className="future-social-thesis"><span>4.7 / HUMAN ↔ ROBOT</span><strong>触觉不再只是机器人理解世界的输入，也成为人与机器共同调节行为的双向语言。</strong></div>
      <nav className="future-social-tabs" aria-label="4.7 技术主题">{(Object.keys(data) as SocialLayer[]).map((key, i) => <button key={key} aria-selected={layer === key} className={layer === key ? `active tone-${data[key].tone}` : ''} onClick={() => setLayer(key)}><b>0{i + 1}</b><span>{data[key].label}</span><small>{data[key].en}</small></button>)}</nav>
      <div className="future-social-lower">
      <aside className="future-social-sidebar">
        <section className={`future-social-detail tone-${current.tone}`}><div className="future-social-detail-head"><span>0{(Object.keys(data) as SocialLayer[]).indexOf(layer) + 1}</span><div><small>{current.en}</small><h2>{current.title}</h2></div></div><p>{current.lead}</p><ul>{current.points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul></section>
        <p className="future-social-note"><i/>社会触觉 · 远程触觉 · 协作交接 · 同意与退出</p>
      </aside>
      <section className="future-social-canvas" aria-label="两个并列的人机触觉技术域">
        <div className="social-canvas-header"><span>{layer === 'cooperation' ? 'DOMAIN A / EMBODIED COOPERATION' : layer === 'communication' ? 'DOMAIN B / HAPTIC COMMUNICATION' : 'DOMAIN C / CONSENT & EVALUATION'}</span><strong>{layer === 'cooperation' ? '接触理解 → 协商 → 协作回应' : layer === 'communication' ? '接触编码 → 通信映射 → 触觉再现' : '同意边界 → 安全约束 → 多源评价'}</strong></div>
        <div className={`social-loop social-view-${layer}`}>
          {layer === 'cooperation' && <div className="social-domain social-cooperation-domain"><div className="social-domain-label"><span>DOMAIN A / EMBODIED COOPERATION</span><strong>协同接触：理解人的意图，共同完成动作</strong></div><div className="social-domain-flow"><div className="social-person social-human"><span>人</span><strong>接触 / 意图</strong><small>姿态 · 语言 · 压力 · 节奏</small></div><i className="social-domain-arrow social-link-cyan">→</i><div className="social-node social-understand"><span>01</span><strong>理解</strong><small>保护 · 协作 · 社会语义</small></div><i className="social-domain-arrow social-link-cyan">→</i><div className="social-node social-plan"><span>02</span><strong>协商</strong><small>任务阶段 · 边界 · 不确定性</small></div><i className="social-domain-arrow social-link-cyan">→</i><div className="social-person social-robot"><span>具身智能体</span><strong>动作 / 回应</strong><small>交接 · 搀扶 · 引导 · 退出</small></div></div></div>}
          {layer === 'communication' && <div className="social-domain social-communication-domain"><div className="social-domain-label"><span>DOMAIN B / HAPTIC COMMUNICATION &amp; DISPLAY</span><strong>触觉通信：编码接触事件，在另一端安全再现</strong></div><div className="social-domain-flow"><div className="social-node social-source"><span>发送端</span><strong>接触事件 / 动力学语义</strong><small>位置 · 意图 · 力学状态</small></div><i className="social-domain-arrow social-link-violet">⇄</i><div className="social-node social-render"><span>通信与映射</span><strong>触觉输出 / 再现</strong><small>力 · 振动 · 压力 · 形变 · 温度</small></div><i className="social-domain-arrow social-link-violet">⇄</i><div className="social-node social-receiver"><span>接收端</span><strong>远程力觉 / 社交机器人</strong><small>可辨认 · 受限 · 可稳定</small></div></div></div>}
          {layer === 'ethics' && <><div className="social-guardrail social-ethics-card"><span>不可越过的底线</span><strong>持续同意 · 实时撤回 · 保守降级</strong><small>任何社会语义推理，都不能延迟碰撞、夹伤和过载的安全响应。</small></div><div className="social-eval-strip social-ethics-card"><div><span>评价闭环</span><strong>从“能不能识别”走向“是否安全、舒适、合规、可迁移”</strong></div><b>物理安全</b><b>意图与阶段</b><b>舒适 / 信任</b><b>跨人群与长期</b></div></>}
        </div>
        </section>
    </div>
    </div>
  </SlideFrame>
}

function FutureRoadmapSlide() {
  const steps = [
    { n: '4.9.1', title: '任务牵引 · 共同基础', en: 'TASK-GROUNDED FOUNDATION', body: '从“传感器能测什么”转向“任务需要知道什么”，用统一接口和评价协议连接异构身体。', tags: ['任务相关性', '可迁移性', '可解释性'], tone: 'cyan' },
    { n: '4.9.2', title: '分层触觉 · 闭环架构', en: 'LAYERED CLOSED LOOP', body: '协同机械、热、化学、近场与本体模态；快速通路处理初触、冲击、滑移和过载，高级通路处理长时程推理。', tags: ['动态响应', '长期稳定', '快速反射'], tone: 'violet' },
    { n: '4.9.3', title: '预测世界 · 主动获取', en: 'PREDICT + EXPLORE', body: '由描述当前接触走向预测动作后果，让世界模型比较探索动作，并以信息增益和任务收益选择下一次触碰。', tags: ['反事实推理', '信息增益', '感知—行动一体化'], tone: 'coral' },
    { n: '4.9.4', title: '社会触觉 · 人体增强', en: 'SOCIAL + AUGMENTATION', body: '在物理安全、同意和个体适应基础上，扩展到双向人机接口、触觉替代、增强和康复。', tags: ['可撤回', '个体化编码', '临床有效性'], tone: 'cyan' },
  ]
  return <SlideFrame metaIndex={16}><div className="roadmap-layout"><header className="roadmap-header"><div><span>4.9 / SYSTEM ROADMAP</span><h1>总体技术路线：让触觉成为可积累、可预测、可协作的系统能力</h1><p>宏观目标不是堆叠更多传感器或扩大模型规模，而是建立连接硬件、任务、具身形态与人的共同研究基础。</p></div><div className="roadmap-principles"><b>身体</b><i>→</i><b>环境</b><i>→</i><b>行动</b><i>→</i><b>人</b></div></header><div className="roadmap-spine" aria-hidden="true"><span/><span/><span/><span/></div><section className="roadmap-grid">{steps.map(step => <article key={step.n} className={`roadmap-card tone-${step.tone}`}><div className="roadmap-card-head"><span>{step.n}</span><small>{step.en}</small></div><h2>{step.title}</h2><p>{step.body}</p><div className="roadmap-tags">{step.tags.map(tag => <b key={tag}>{tag}</b>)}</div></article>)}</section><footer className="roadmap-footer"><span>评价标准同步升级</span><strong>跨硬件迁移 · 接触物理预测 · 动态闭环可靠性 · 对人的体验与自主性的尊重</strong></footer></div></SlideFrame>
}

function SummarySlide() {
  const [selectedRecognition, setSelectedRecognition] = useState(0)
  const recognitions = [
    ['01', '触觉与视觉互补', '视觉负责接触前的全局发现；触觉负责接触后的状态确认、动力学反馈与主动探索。'],
    ['02', '传感器必须嵌入完整链路', '灵敏度只有在机械结构、读出、校准、时空组织和控制时限共同成立时，才会转化为任务收益。'],
    ['03', '触觉是动作条件下的局部高频模态', '接触门控、形态感知表示、快慢双通路与分层控制，是由触觉信息结构决定的系统需求。'],
    ['04', '统一表征要保留物理接地', '跨设备对齐不能抹平身体位置、接触坐标、动作条件与局部控制所需的细节。'],
    ['05', '世界模型需要真实接触反馈', '力、滑移和形变让预测获得物理约束；主动触觉则把信息增益纳入行动决策。'],
    ['06', '感知与行动不可分割', '策略不只追求“摸得更准”，还要共同优化任务进展、探索代价、能耗与损伤风险。'],
  ]
  return <SlideFrame metaIndex={17}><div className="summary-layout"><div className="summary-columns"><section className="summary-recognition"><div className="summary-section-label"><span>5.2 / WHAT WE NOW KNOW</span><strong>六条主要认识</strong></div><div className="recognition-grid">{recognitions.map(([n,title], index) => <button key={n} className={selectedRecognition === index ? 'active' : ''} onClick={() => setSelectedRecognition(index)}><span>{n}</span><h3>{title}</h3></button>)}</div><div className="recognition-detail"><span>{recognitions[selectedRecognition][0]} / DETAIL</span><p>{recognitions[selectedRecognition][2]}</p></div></section><aside className="summary-limit"><div className="summary-section-label"><span>5.3 / LIMITS</span><strong>证据边界</strong></div><ul><li>跨论文实验条件异构，横向比较不能替代统一基准。</li><li>触觉 VLA、世界模型与跨本体策略仍缺少长期独立验证。</li><li>磨损、污染、故障、隐私和跨人群社会触觉证据仍不足。</li></ul><div className="summary-limit-note">因此，本文提出的是研究路线与问题框架，而不是已经成熟的统一方案。</div></aside></div><section className="summary-thesis"><div><span>5.4 / OUTLOOK</span><strong>核心论断</strong></div><blockquote>触觉技术真正成熟的标志，不是机器人能够在受控数据上判断“摸到了什么”，而是能够在未知对象、变化环境和长期运行中理解接触正在发生什么、预测动作将造成什么后果，并据此及时、安全且合乎情境地调整行为。</blockquote><footer><b>专用传感器</b><i>→</i><b>通用具身基础能力</b><i>→</i><b>连接身体、物理世界与智能决策的基础接口</b></footer></section></div></SlideFrame>
}

const renderers = [CoverSlide, ValueSlide, UniquenessSlide, FrontierSlide, OutlineSlide, TactileContentSlide, SensorMapSlide, PipelineSlide, FusionSlide, TaskValueSlide, ChallengeSlide, FutureSlide, FutureCapabilitySlide, FutureEdgeSlide, FutureBrainSlide, FutureDynamicSlide, FutureSocialSlide, FutureRoadmapSlide, SummarySlide, QASlide]

function EvidenceDrawer({ slideIndex, open, onClose }: { slideIndex: number; open: boolean; onClose: () => void }) {
  const meta = slides[slideIndex]
  return (
    <aside className={`evidence-drawer ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="证据与来源">
      <div className="drawer-head">
        <div><span>EVIDENCE / SOURCE</span><h2>证据与来源</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="关闭证据面板"><Icon name="close" /></button>
      </div>
      <div className="drawer-body">
        <EvidenceBadge kind={meta.evidenceKind} label={meta.evidenceLabel} />
        <h3>{meta.title}</h3>
        <section><span>论文定位</span>{meta.locations.map(item => <p key={item}>{item}</p>)}</section>
        <section className="source-section"><span>完整文献</span><div className="source-list">{meta.sources.map(source => <article className="source-item" key={source}><code>{source}</code><p>{formatCitation(source) || `未在 ref.bib 中找到：${source}`}</p></article>)}</div></section>
        <section className="scope-note"><span>展示边界</span><p>{meta.note}</p></section>
        <p className="drawer-foot">书目信息由已定稿的 <code>ref.bib</code> 生成；文件定位条目保留为原文位置说明。</p>
      </div>
    </aside>
  )
}

function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  const shortcuts = [['← / →', '切换屏幕'], ['Space', '下一屏'], ['T', '切换视觉主题'], ['E', '证据与来源'], ['F', '全屏'], ['H / Esc', '帮助 / 关闭']]
  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label="快捷键">
      <button className="help-backdrop" onClick={onClose} aria-label="关闭" />
      <div className="help-card"><div className="drawer-head"><div><span>PRESENTATION CONTROL</span><h2>演示快捷键</h2></div><button className="icon-button" onClick={onClose}><Icon name="close" /></button></div><div className="shortcut-grid">{shortcuts.map(([key, value]) => <div key={key}><kbd>{key}</kbd><span>{value}</span></div>)}</div><p>原型按 16:9 桌面投影优先设计；所有内容均可用按钮操作。</p></div>
    </div>
  )
}

export default function App() {
  const initial = Math.max(0, slides.findIndex(item => `#${item.id}` === window.location.hash))
  const [current, setCurrent] = useState(initial)
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('tactile-prototype-theme') as Theme) || 'lab')
  const [evidence, setEvidence] = useState(false)
  const [help, setHelp] = useState(false)

  const go = useCallback((index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index))
    setCurrent(next)
    setEvidence(false)
    window.history.replaceState(null, '', `#${slides[next].id}`)
  }, [])

  const toggleTheme = useCallback(() => setTheme(value => value === 'lab' ? 'atlas' : 'lab'), [])
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  }, [])

  useEffect(() => {
    localStorage.setItem('tactile-prototype-theme', theme)
  }, [theme])

  useEffect(() => {
    const syncFromHash = () => {
      const index = slides.findIndex(item => `#${item.id}` === window.location.hash)
      if (index >= 0) {
        setCurrent(index)
        setEvidence(false)
      }
    }
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key === 'Escape') { setEvidence(false); setHelp(false); return }
      if (help || event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (target.closest('button, a, input, textarea, select, [role="button"], [contenteditable="true"]')) return
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') { event.preventDefault(); go(current + 1) }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); go(current - 1) }
      if (event.key.toLowerCase() === 't') toggleTheme()
      if (event.key.toLowerCase() === 'e') setEvidence(value => !value)
      if (event.key.toLowerCase() === 'h') setHelp(value => !value)
      if (event.key.toLowerCase() === 'f') void toggleFullscreen()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, go, help, toggleFullscreen, toggleTheme])

  const CurrentSlide = useMemo(() => renderers[current], [current])
  const viewportRef = useRef<HTMLElement | null>(null)
  const [stageScale, setStageScale] = useState(1)

  // Keep every scene on one logical 1600×900 canvas. The browser only scales
  // that canvas as a whole; it never gets to reflow the slide internals.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const syncScale = () => {
      const rect = viewport.getBoundingClientRect()
      const next = Math.max(0.1, Math.min(rect.width / 1600, rect.height / 900))
      setStageScale(Number(next.toFixed(5)))
    }
    syncScale()
    const observer = new ResizeObserver(syncScale)
    observer.observe(viewport)
    window.addEventListener('resize', syncScale)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncScale)
    }
  }, [])

  // The slide is authored on a fixed 1600×900 canvas. Apply the readability
  // floor after each scene mounts so legacy per-scene labels (some authored at
  // 7–11px) cannot become illegible in projection or browser playback. Larger
  // headings/body text are left untouched.
  useLayoutEffect(() => {
    const stage = viewportRef.current?.querySelector('.slide-stage')
    if (!stage) return
    const textSelector = 'p,li,small,span,b,strong,button,label,dt,dd,em,blockquote,h1,h2,h3,h4,h5,h6,text'
    stage.querySelectorAll(textSelector).forEach((node) => {
      const element = node as HTMLElement
      const size = Number.parseFloat(window.getComputedStyle(element).fontSize)
      if (Number.isFinite(size) && size < 16) element.style.fontSize = '16px'
    })
  }, [current])

  useEffect(() => {
    const stage = viewportRef.current?.querySelector('.slide-stage')
    if (!stage) return
    const applyReadableFloor = () => {
      const textSelector = 'p,li,small,span,b,strong,button,label,dt,dd,em,blockquote,h1,h2,h3,h4,h5,h6,text'
      stage.querySelectorAll(textSelector).forEach((node) => {
        const element = node as HTMLElement
        const size = Number.parseFloat(window.getComputedStyle(element).fontSize)
        if (Number.isFinite(size) && size < 16) element.style.fontSize = '16px'
      })
    }
    const frame = window.requestAnimationFrame(applyReadableFloor)
    const timer = window.setTimeout(applyReadableFloor, 0)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [current])

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <div className="brand-mark" aria-label="面向具身交互的触觉感知">
          <svg viewBox="0 0 38 38" aria-hidden="true"><path d="M7 19c0-6.7 5.3-12 12-12s12 5.3 12 12-5.3 12-12 12S7 25.7 7 19Z"/><path d="M12 19c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7Z"/><circle cx="19" cy="19" r="2.2"/></svg>
          <div><strong>具身触觉</strong><span>TACTILE PERCEPTION FOR EMBODIED INTERACTION</span></div>
        </div>
        <div className="header-center"><span>综合考试论文汇报</span><i /> <span>动态演示 · {String(slides.length).padStart(2, '0')} SCENES</span></div>
        <nav className="header-actions" aria-label="演示控制">
          <button onClick={() => setEvidence(true)} title="证据与来源（E）"><Icon name="evidence"/><span>依据</span></button>
          <button onClick={toggleTheme} title="切换主题（T）"><Icon name="theme"/><span>{theme === 'lab' ? '图谱' : '暗场'}</span></button>
          <button onClick={() => void toggleFullscreen()} title="全屏（F）"><Icon name="fullscreen"/></button>
          <button onClick={() => setHelp(true)} title="快捷键（H）"><Icon name="help"/></button>
        </nav>
      </header>

      <nav className="chapter-rail" aria-label="原型屏幕">
        <div className="rail-line" />
        {slides.map((slide, index) => (
          <button key={slide.id} className={current === index ? 'active' : ''} onClick={() => go(index)} aria-current={current === index ? 'page' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span><i /><strong>{slide.short}</strong>
          </button>
        ))}
      </nav>

      <main className="slide-viewport" ref={viewportRef}>
        <div className="slide-stage-wrap" style={{ '--stage-scale': stageScale } as CSSProperties}>
          <div className="slide-stage"><CurrentSlide /></div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="slide-position"><span>{String(current + 1).padStart(2, '0')}</span><i>/</i><span>{String(slides.length).padStart(2, '0')}</span></div>
        <div className="progress-track">{slides.map((slide,index)=><button key={slide.id} className={index <= current ? 'passed' : ''} onClick={() => go(index)} aria-label={`转到${slide.short}`}><i /></button>)}</div>
        <div className="footer-hint"><span>← → 切换</span><span>T 主题</span><span>E 依据</span></div>
        <div className="footer-nav"><button onClick={() => go(current - 1)} disabled={current === 0} aria-label="上一屏">←</button><button onClick={() => go(current + 1)} disabled={current === slides.length - 1}>下一屏 <span>→</span></button></div>
      </footer>

      <button className={`drawer-scrim ${evidence ? 'show' : ''}`} onClick={() => setEvidence(false)} aria-label="关闭证据面板" />
      <EvidenceDrawer slideIndex={current} open={evidence} onClose={() => setEvidence(false)} />
      <HelpOverlay open={help} onClose={() => setHelp(false)} />
    </div>
  )
}
