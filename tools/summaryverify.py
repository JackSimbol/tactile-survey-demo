from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe', headless=True)
 for size in [(1920,1080),(1366,768),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]}); page.goto('http://127.0.0.1:4174/#summary'); page.wait_for_timeout(1000)
  d=page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,h:r.height,sh:e.scrollHeight,ch:e.clientHeight}};return {v:q('.slide-viewport'),sl:q('.slide'),layout:q('.summary-layout'),cols:q('.summary-columns'),rec:q('.summary-recognition'),lim:q('.summary-limit'),th:q('.summary-thesis'),block:q('.summary-thesis blockquote'),foot:q('.summary-thesis footer')}}''')
  print(size,d)
  page.close()
 b.close()
