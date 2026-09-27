const fs=require('fs'); const p='src/App.tsx'; const a=fs.readFileSync(p,'utf8').split(/\r?\n/)
a[498]=`      confirm: { n:'01', label:'确认', en:'CONFIRM', title:'确认接触是否真实建立', body:'触觉把接触建立、安全交互和承载确认变成可执行事实。', tasks:[], metrics:'接触检测率 / 碰撞定位误差 / 任务成功率', example:'视觉被遮挡后，触觉仍能确认手指与物体是否接触。' },`
a[499]=`      correct: { n:'02', label:'校正', en:'CORRECT', title:'把接触后的受力、位姿与滑移误差转成动作修正', body:'局部高相关反馈让抓取、装配和柔性操作在失败前得到修正。', tasks:[], metrics:'失败恢复率 / 滑移提前量 / 完成时间', example:'插入、旋转或抓取中，触觉把卡阻和微滑移转成动作修正。' },`
a[500]=`      explore: { n:'03', label:'探索', en:'EXPLORE', title:'通过主动触觉获得视觉无法提供的物理证据', body:'按压、滑动、滚动和重新接触共同降低材料与局部形状的不确定性。', tasks:[], metrics:'信息增益 / 属性识别率 / 探索代价', example:'下一次接触的位置、方向和载荷决定能否区分相似外观下的物理属性。' },`
fs.writeFileSync(p,a.join('\n'),'utf8')
