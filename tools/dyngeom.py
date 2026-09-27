from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080}); page.goto('http://127.0.0.1:4174/#future-dynamic'); page.wait_for_timeout(1000); page.screenshot(path='qa/screenshots/dynamic-before.png',full_page=True)
 print(page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e&&e.getBoundingClientRect();return e&&{t:r.top,b:r.bottom,l:r.left,r:r.right,w:r.width,h:r.height}};return {canvas:q('.future-dynamic-canvas'),loop:q('.dynamic-loop'),axis:q('.dynamic-axis'),low:q('.signal-low'),high:q('.signal-high'),state:q('.dynamic-state'),action:q('.dynamic-action'),svg:q('.dynamic-loop svg'),paths:[...document.querySelectorAll('.dynamic-loop path')].map(e=>e.getAttribute('d'))}}'''))
 b.close()
