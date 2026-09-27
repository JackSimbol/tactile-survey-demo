from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080});page.goto('http://127.0.0.1:4174/#future-social');page.wait_for_timeout(1000);page.locator('.future-social-tabs button').nth(2).click();page.wait_for_timeout(150);page.screenshot(path='qa/screenshots/social-ethics-before.png',full_page=True)
 print(page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e?.getBoundingClientRect();return e&&{t:r.top,b:r.bottom,h:r.height,w:r.width,sh:e.scrollHeight,ch:e.clientHeight}};return {lower:q('.future-social-lower'),side:q('.future-social-sidebar'),detail:q('.future-social-detail'),canvas:q('.future-social-canvas'),loop:q('.social-loop'),guard:q('.social-guardrail'),eval:q('.social-eval-strip')}}'''))
 b.close()
