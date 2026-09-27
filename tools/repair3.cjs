const fs = require('fs')
const p = 'src/App.tsx'
const a = fs.readFileSync(p, 'utf8').split(/\r?\n/)
const set = (n, v) => { a[n - 1] = v }
set(869, `              <div className="route-evidence"><span>代表路径</span><p><b>仿生阵列</b>：形貌、刚度与气味协同；<b>SuperTac</b>：皮肤内集成多光谱、摩擦电与惯性信息；<b>多模态热敏触觉</b>：联合压力、温度、纹理和滑移。</p></div>`)
set(878, `              <div className="route-evidence"><span>代表路径</span><p><b>GelSight Svelte</b>：沿整根手指部署；<b>可拉伸手套</b>：多通道力感知并主动抑制应变干扰；<b>软体触觉手</b>：掌—指协同完成感知与抓取。</p></div>`)
fs.writeFileSync(p, a.join('\n'), 'utf8')
