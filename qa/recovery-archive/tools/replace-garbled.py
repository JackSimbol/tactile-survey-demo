from pathlib import Path
import re

p = Path('src/App.tsx')
s = p.read_text(encoding='utf-8')
s = re.sub(r'[\ue000-\uf8ff]', '', s)
repls = {
    '瑙﹁瑙傛祴绐': '触觉观测窗',
    '瑙﹁鐢卞姩浣滀骇鐢': '触觉由动作产生',
    '瑙﹁瀹氫箟韬綋杈圭晫': '触觉定义身体边界',
    '鎺ヨЕ': '接触',
    '瑙嗚': '视觉',
    '鍏疯韩': '具身',
}
for a, b in repls.items():
    s = s.replace(a, b)
p.write_text(s, encoding='utf-8', newline='\n')
