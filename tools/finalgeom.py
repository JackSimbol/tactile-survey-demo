from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768),(1536,864),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]})
  for sid in ['future-roadmap','summary','fusion']:
   page.goto('http://127.0.0.1:4174/#'+sid); page.wait_for_timeout(1000)
   g=page.evaluate('''() => {const q=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,sh:e.scrollHeight,ch:e.clientHeight}};return {v:q('.slide-viewport'),sl:q('.slide'),h:q('.slide-heading'),c:q('.roadmap-layout,.summary-layout,.fusion-layout'),th:q('.summary-thesis'),gd:q('.recognition-grid'),dt:q('.recognition-detail')}}''')
   print(size,sid,g)
  page.close()
 b.close()
