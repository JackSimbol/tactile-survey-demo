from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080});page.goto('http://127.0.0.1:4174/#summary');page.wait_for_timeout(1000);page.screenshot(path='qa/screenshots/density-summary-1920.png',full_page=True)
 b.close()
