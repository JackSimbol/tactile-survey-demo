from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe', headless=True)
 for size in [(1920,1080),(1366,768)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]}); page.goto('http://127.0.0.1:4174/#future-social'); page.wait_for_timeout(1000); page.screenshot(path=f'qa/screenshots/social-before-{size[0]}.png',full_page=True)
  print(size,page.evaluate('''() => {let q=s=>{let e=document.querySelector(s);if(!e)return null;let r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,h:r.height,w:r.width,sh:e.scrollHeight,ch:e.clientHeight}};return {slide:q('.slide'),heading:q('.slide-heading'),layout:q('.future-social-layout'),thesis:q('.future-social-thesis'),tabs:q('.future-social-tabs'),lower:q('.future-social-lower'),side:q('.future-social-sidebar'),canvas:q('.future-social-canvas'),loop:q('.social-loop'),guard:q('.social-guardrail'),eval:q('.social-eval-strip')}}'''))
  page.close()
 b.close()
