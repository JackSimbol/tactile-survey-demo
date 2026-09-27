const fs=require('fs'); const p='src/App.tsx'; const a=fs.readFileSync(p,'utf8').split(/\r?\n/)
a[936]=`        lead: '当材料、姿态或接触位置不确定时，系统不应被动等待信息，而应主动选择按压、滑动、滚动或微小摆动来区分候选状态。',`
fs.writeFileSync(p,a.join('\n'),'utf8')
