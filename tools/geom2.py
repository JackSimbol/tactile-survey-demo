from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768),(1536,864),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]}); page.goto('http://127.0.0.1:4174/#summary'); page.wait_for_timeout(1500)
  print(size,page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,w:r.width,h:r.height}};return {vp:q('.slide-viewport'),wrap:q('.slide-stage-wrap'),st:q('.slide-stage'),sl:q('.slide'),sum:q('.summary-layout'), sc:document.querySelector('.slide-stage-wrap').style.getPropertyValue('--stage-scale')}}'''))
  page.close()
 b.close()
