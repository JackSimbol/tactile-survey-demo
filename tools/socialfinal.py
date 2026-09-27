from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]}); page.goto('http://127.0.0.1:4174/#future-social'); page.wait_for_timeout(1000)
  for idx in [0,1,2]:
   page.locator('.future-social-tabs button').nth(idx).click(); page.wait_for_timeout(80)
   d=page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e&&e.getBoundingClientRect();return e&&{t:r.top,b:r.bottom,h:r.height,sh:e.scrollHeight,ch:e.clientHeight}};return {v:q('.slide-viewport'),l:q('.future-social-layout'),tabs:q('.future-social-tabs'),low:q('.future-social-lower'),side:q('.future-social-sidebar'),canvas:q('.future-social-canvas'),detail:q('.future-social-detail'),note:q('.future-social-note'),guard:q('.social-guardrail'),eval:q('.social-eval-strip'),bodyW:document.body.scrollWidth,bodyH:document.body.scrollHeight}}''')
   print(size,idx,d)
  page.close()
 b.close()
