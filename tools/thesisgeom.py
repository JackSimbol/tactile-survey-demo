from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe', headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080}); page.goto('http://127.0.0.1:4174/#summary'); page.wait_for_timeout(1000)
 print(page.evaluate('''() => {let q=s=>{let e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return {r:{t:r.top,b:r.bottom,h:r.height},sh:e.scrollHeight,ch:e.clientHeight,pad:c.padding,fs:c.fontSize,lh:c.lineHeight,overflow:c.overflow}}; return {layout:q('.summary-layout'), cols:q('.summary-columns'), rec:q('.summary-recognition'), thesis:q('.summary-thesis'), block:q('.summary-thesis blockquote'), foot:q('.summary-thesis footer')}}'''))
 b.close()
