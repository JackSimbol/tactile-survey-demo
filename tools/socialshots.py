from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080});page.goto('http://127.0.0.1:4174/#future-social');page.wait_for_timeout(1000);page.screenshot(path='qa/screenshots/social-after-1920.png',full_page=True);page.locator('.future-social-tabs button').nth(2).click();page.wait_for_timeout(150);page.screenshot(path='qa/screenshots/social-ethics-after-1920.png',full_page=True)
 b.close()
