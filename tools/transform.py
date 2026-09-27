from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe',headless=True)
 page=b.new_page(viewport={'width':1920,'height':1080}); page.goto('http://127.0.0.1:4174/#summary'); page.wait_for_timeout(1000)
 print(page.evaluate('''() => {let a=document.querySelector('.slide'),b=document.querySelector('.slide-stage'),w=document.querySelector('.slide-stage-wrap');return {a:getComputedStyle(a).transform,an:getComputedStyle(a).animationName,ad:getComputedStyle(a).animationDuration,ao:getComputedStyle(a).animationPlayState,ar:a.getBoundingClientRect().toJSON(),br:b.getBoundingClientRect().toJSON(),wr:w.getBoundingClientRect().toJSON(), offset:a.offsetTop, pos:getComputedStyle(a).position, h:getComputedStyle(a).height, box:getComputedStyle(a).boxSizing}}'''))
 b.close()
