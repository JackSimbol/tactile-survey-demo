from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080})
 for sid in ['future-roadmap','summary','fusion']:
  page.goto('http://127.0.0.1:4174/#'+sid); page.wait_for_timeout(1000)
  print(sid,page.evaluate('''() => {let s=document.querySelector('.slide-stage'), sl=document.querySelector('.slide'),w=document.querySelector('.slide-stage-wrap'),v=document.querySelector('.slide-viewport'); return {stage:getComputedStyle(s).cssText,sttrans:getComputedStyle(s).transform,sltrans:getComputedStyle(sl).transform,wraptrans:getComputedStyle(w).transform,sw:s.getBoundingClientRect().width,slw:sl.getBoundingClientRect().width,scale:w.style.getPropertyValue('--stage-scale'),v:v.getBoundingClientRect().toJSON()}}'''))
 b.close()
