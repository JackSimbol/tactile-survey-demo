from playwright.sync_api import sync_playwright
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]})
  for sid in ['future-roadmap','summary']:
   page.goto('http://127.0.0.1:4174/#'+sid); page.wait_for_timeout(1000)
   page.screenshot(path=f'qa/screenshots/density-{sid}-{size[0]}.png',full_page=True)
   print(size,sid,page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,h:r.height,sh:e.scrollHeight,ch:e.clientHeight}};return {v:q('.slide-viewport'),c:q('.roadmap-layout,.summary-layout'),a:q('.roadmap-grid,.summary-columns'),b:q('.roadmap-footer,.summary-thesis'),rec:q('.summary-recognition'),lim:q('.summary-limit')}}'''))
  page.close()
 b.close()
