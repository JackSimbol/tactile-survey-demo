const fs=require('fs')
const p='src/App.tsx'
const lines=fs.readFileSync(p,'utf8').split(/\r?\n/)
lines[480] = `    evaluation: { n:'05', label:'评价与仿真', en:'EVALUATION', title:'识别准确，不等于任务可靠', symptom:'离线分类很高，但真实任务仍会滑落、卡阻、损伤或无法恢复。', cause:'真实值昂贵且难同步；仿真缺少材料、接触和传感器数字孪生；评价偏重平均精度。', metrics:'任务成功 / 失败恢复 / 作用力峰值 / 长时稳定 / 仿真—真实差距', fix:'用真实闭环、罕见失败、不确定性与安全降级建立共同评价。' },`
fs.writeFileSync(p,lines.join('\n'),'utf8')
