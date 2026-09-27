from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080})
 for sid in ['future-roadmap','summary','fusion']:
  page.goto('http://127.0.0.1:4174/#'+sid);page.wait_for_timeout(900)
  print(sid,page.evaluate('''() => {let q=s=>{let e=document.querySelector(s);if(!e)return null;let r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,sh:e.scrollHeight,ch:e.clientHeight}}; let v=q('.slide-viewport');return {v,slide:q('.slide'),head:q('.slide-heading'),content:q('.roadmap-layout,.summary-layout,.fusion-layout'),bodyW:document.body.scrollWidth,bodyH:document.body.scrollHeight}}'''))
 b.close()
