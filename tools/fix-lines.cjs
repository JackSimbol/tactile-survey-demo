const fs = require('fs')
const p = 'src/App.tsx'
const a = fs.readFileSync(p, 'utf8').split(/\r?\n/)
const replacements = {
  41: `        <img className="contact-hero-image" src="./assets/pixverse_image_425925499782304_1790093887417.png" alt="touch glove contacting object" />`,
  43: `      <div className="visual-readout top-left"><span>CONTROL LOOP</span><strong>{tactile ? 'CLOSED' : 'OPEN'}</strong></div>`,
  45: `      <div className="observation-panel vision-panel" aria-label="visual observation window">`,
  91: `          <div className="anchor-claim">具身智能不能只看见世界，<em>还必须感受到行动的后果。</em></div>`,
  200: `          <h2>从“理解触觉”<br/><em>到“用触觉行动”</em></h2>`,
  236: `          <h2>触觉 = <em>身体—环境</em><br/>交互的可观测证据</h2>`,
  331: `          <h2>具身基础模型正在进入<br/><em>触觉丰富的长时程操作。</em></h2>`,
}
for (const [line, value] of Object.entries(replacements)) a[Number(line) - 1] = value
fs.writeFileSync(p, a.join('\n'), 'utf8')
