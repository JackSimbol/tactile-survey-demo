from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1366,'height':768});page.goto('http://127.0.0.1:4174/#future-social');page.wait_for_timeout(1000);page.locator('.future-social-tabs button').nth(2).click();page.wait_for_timeout(150);page.screenshot(path='qa/screenshots/social-ethics-after-1366.png',full_page=True)
 print(page.evaluate('''() => [...document.querySelectorAll('.future-social-detail,.social-guardrail,.social-eval-strip,.social-eval-strip>*')].map(e=>{let r=e.getBoundingClientRect();return [e.className,r.top,r.bottom,r.height,e.scrollHeight,e.clientHeight]})'''))
 b.close()
