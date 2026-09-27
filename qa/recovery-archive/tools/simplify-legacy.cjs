const fs=require('fs'); const p='src/App.tsx'; const a=fs.readFileSync(p,'utf8').split(/\r?\n/)
a[513]=`      explore: { n:'03', label:'探索', en:'EXPLORE', title:'通过主动触觉探索获得物理属性证据', body:'动作条件决定观测质量，感知与行动共同降低不确定性。', tasks:[], metrics:'信息增益 / 属性识别率 / 探索代价', example:'下一次接触如何发生，决定能否区分相似外观下的物理属性。' },`
fs.writeFileSync(p,a.join('\n'),'utf8')
