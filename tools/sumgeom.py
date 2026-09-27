from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1366,'height':768});page.goto('http://127.0.0.1:4174/#summary');page.wait_for_timeout(1100)
 print(page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return {rect:[r.x,r.y,r.width,r.height],offset:[e.offsetWidth,e.offsetHeight],client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],display:c.display,grid:c.gridTemplateRows,pad:c.padding,box:c.boxSizing,fs:c.fontSize,lh:c.lineHeight}};return {slide:q('.slide'),head:q('.slide-heading'),layout:q('.summary-layout'),cols:q('.summary-columns'),rec:q('.summary-recognition'),grid:q('.recognition-grid'),btn:q('.recognition-grid button'),det:q('.recognition-detail'),lim:q('.summary-limit'),th:q('.summary-thesis'),quote:q('.summary-thesis blockquote'),foot:q('.summary-thesis footer')}}'''))
 b.close()
