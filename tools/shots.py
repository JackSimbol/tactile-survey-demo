from playwright.sync_api import sync_playwright
from pathlib import Path
out=Path('qa/screenshots'); out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 for size in [(1920,1080),(1366,768)]:
  page=b.new_page(viewport={'width':size[0],'height':size[1]})
  for sid in ['future-roadmap','summary','fusion']:
   page.goto('http://127.0.0.1:4174/#'+sid); page.wait_for_timeout(1000); page.screenshot(path=str(out/f'{sid}-{size[0]}x{size[1]}-fixed.png'),full_page=True)
  page.close()
 b.close()
