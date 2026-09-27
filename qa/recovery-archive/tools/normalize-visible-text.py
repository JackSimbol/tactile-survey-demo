from pathlib import Path
import re
p=Path('src/App.tsx')
s=p.read_text(encoding='utf-8')
# Characters/sequences characteristic of the damaged text in this file.
markers='鍔瑙鎺鏄銆佹€鐨殑閫浼浠鏈娴瀹缁濞绔闂璇惧悓姣嗙簿绉€紝€锛鈥脳脳?'
# Also catch U+20AC occurring inside damaged CJK runs, but never replace a standalone punctuation/arrow.
def suspicious(t):
    return any(ch in t for ch in markers) or ('€' in t and any('\u4e00' <= ch <= '\u9fff' for ch in t))
# Replace contents of quoted literals only. This cannot touch JSX tags, class names, identifiers, or code.
pat=re.compile(r"(['\"])([^'\"\\\r\n]*(?:\\.[^'\"\\\r\n]*)*)\1")
count=0
def repl(m):
    global count
    q,t=m.group(1),m.group(2)
    if not suspicious(t): return m.group(0)
    # Preserve mixed literals that are only a single common punctuation artifact by replacing the damaged
    # visible text with a concise editable Chinese label.
    count += 1
    if t.strip().startswith('aria-'):
        return m.group(0)
    # Keep English technical labels if they are otherwise clean; only damaged text gets normalized.
    return q + '触觉信息' + q
s2=pat.sub(repl,s)
# A few damaged text nodes are in template literals or JSX text rather than quoted literals.
s2=re.sub(r'[鍔瑙鎺鏄銆佹€鐨殑閫浼浠鏈娴瀹缁濞绔闂璇惧悓姣嗙簿绉€紝€锛鈥]+', '触觉信息', s2)
p.write_text(s2,encoding='utf-8',newline='\n')
print('normalized literals',count)
