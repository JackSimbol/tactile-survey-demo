const fs=require('fs'); const p='src/App.tsx'; let s=fs.readFileSync(p,'utf8')
const challengeStart=s.indexOf('function ChallengeSlide()')
const taskStart=s.indexOf('function TaskValueSlide()')
const nextStart=s.indexOf('function FutureSlideLegacy()')
if(challengeStart<0 || taskStart<0 || nextStart<0) throw new Error('component markers not found')
const challenge=`function ChallengeSlide() {
  const [active, setActive] = useState(0)
  const items = [
    { n:'01', label:'信息覆盖', title:'覆盖与分辨率难以同时满足', detail:'高分辨率、大面积覆盖、多轴测量与柔性封装存在成本权衡。' },
    { n:'02', label:'时间闭环', title:'检测到了，但来不及修正', detail:'采样、读出、传输、推理与执行共同决定端到端时延。' },
    { n:'03', label:'长期可靠', title:'离线标定无法覆盖真实时变', detail:'漂移、迟滞、温度与磨损会改变同一接触的观测映射。' },
    { n:'04', label:'身体泛化', title:'数据含义依赖身体与部署位置', detail:'换手、换位置或换动作后，同一数组未必代表同一接触。' },
    { n:'05', label:'任务评价', title:'识别准确不等于任务可靠', detail:'需要用真实闭环、失败恢复和安全降级共同评价。' },
  ]
  const current=items[active]
  return <SlideFrame metaIndex={9}><div className="challenge-layout"><section className="challenge-copy"><span>FIVE SYSTEM BREAKPOINTS</span><h2>触觉为什么<br/><em>仍然难以可靠行动？</em></h2><p>问题不在某一个指标，而在硬件、数据、模型和任务评价尚未形成稳定闭环。</p><div className="challenge-list">{items.map((item,i)=><button key={item.n} className={active===i?'active':''} onClick={()=>setActive(i)}><span>{item.n}</span><strong>{item.label}</strong><small>{item.title}</small><i>→</i></button>)}</div></section><section className="challenge-system"><div className="challenge-panel"><div className="challenge-panel-head"><span>{current.n} / SYSTEM GAP</span><b>{current.label}</b></div><h3>{current.title}</h3><p>{current.detail}</p></div></section></div></SlideFrame>
}

`
const task=`function TaskValueSlide() {
  const [active,setActive]=useState(0)
  const items=[
    {n:'01',label:'确认',en:'CONFIRM',title:'确认接触是否真实建立',body:'把接触建立、安全交互和承载确认变成可执行事实。'},
    {n:'02',label:'校正',en:'CORRECT',title:'把接触误差转成动作修正',body:'局部反馈让抓取、装配和柔性操作在失败前得到修正。'},
    {n:'03',label:'探索',en:'EXPLORE',title:'主动获得视觉无法提供的证据',body:'按压、滑动、滚动和重新接触共同降低物理属性不确定性.'},
  ]
  const current=items[active]
  return <SlideFrame metaIndex={8}><div className="task-value-layout"><section className="task-value-copy"><span>TACTILE VALUE IN TASKS</span><h2>触觉不只是<br/><em>识别更多</em></h2><p>它把接触后的物理后果变成行动依据，形成观测—动作—再观测的具身闭环。</p><div className="value-function-tabs">{items.map((item,i)=><button key={item.n} className={active===i?'active':''} onClick={()=>setActive(i)}><span>{item.n}</span><strong>{item.label}</strong><small>{item.en}</small></button>)}</div></section><section className="task-value-system"><div className="task-value-detail"><span>{current.n} / {current.en}</span><h3>{current.title}</h3><p>{current.body}</p><div className="task-card"><span>核心价值</span><h4>{current.label}</h4><p>触觉信息进入行动闭环，成为任务级反馈。</p></div></div></section></div></SlideFrame>
}

`
s=s.slice(0,challengeStart)+challenge+task+s.slice(nextStart)
fs.writeFileSync(p,s,'utf8')
