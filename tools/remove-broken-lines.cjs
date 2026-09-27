const fs=require('fs'); const p='src/App.tsx'; const a=fs.readFileSync(p,'utf8').split(/\r?\n/)
a.splice(514, 3)
fs.writeFileSync(p,a.join('\n'),'utf8')
