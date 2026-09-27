from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768),(1280,720)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]});page.goto('http://127.0.0.1:4174/#future-social');page.wait_for_timeout(1000)
  for idx in [None,2]:
   if idx is not None: page.locator('.future-social-tabs button').nth(idx).click();page.wait_for_timeout(100)
   d=page.evaluate('''() => {let q=s=>{let e=document.querySelector(s);if(!e)return null;let r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,h:r.height,sh:e.scrollHeight,ch:e.clientHeight}};return {v:q('.slide-viewport'),layout:q('.future-social-layout'),th:q('.future-social-thesis'),tabs:q('.future-social-tabs'),lower:q('.future-social-lower'),side:q('.future-social-sidebar'),canvas:q('.future-social-canvas'),detail:q('.future-social-detail'),loop:q('.social-loop'),guard:q('.social-guardrail'),eval:q('.social-eval-strip'),bodyW:document.body.scrollWidth,bodyH:document.body.scrollHeight}}''')
   print(size,'ethics' if idx is not None else 'coop',d)
  page.close()
 b.close()
