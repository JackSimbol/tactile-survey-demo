from playwright.sync_api import sync_playwright
from pprint import pprint
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe', headless=True)
 for size in [(1920,1080),(1366,768),(1536,864),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]})
  for sid in ['future-roadmap','summary','fusion']:
   page.goto('http://127.0.0.1:4174/#'+sid, wait_until='domcontentloaded'); page.wait_for_timeout(200)
   vals=page.evaluate('''() => { const q=s=>{const e=document.querySelector(s); if(!e)return null; const r=e.getBoundingClientRect(); return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,w:r.width,h:r.height,sh:e.scrollHeight,ch:e.clientHeight,sw:e.scrollWidth,cw:e.clientWidth}}; return {body:{sw:document.body.scrollWidth,sh:document.body.scrollHeight}, viewport:q('.slide-viewport'),stage:q('.slide-stage'),slide:q('.slide'),heading:q('.slide-heading'),roadmap:q('.roadmap-layout'),rg:q('.roadmap-grid'),rf:q('.roadmap-footer'),summary:q('.summary-layout'),cols:q('.summary-columns'),rec:q('.summary-recognition'),grid:q('.recognition-grid'),detail:q('.recognition-detail'),thesis:q('.summary-thesis'),fusion:q('.fusion-layout')}; }''')
   print(size,sid); pprint(vals)
  page.close()
 b.close()
