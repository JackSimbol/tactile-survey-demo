from pathlib import Path

path = Path('src/App.tsx')
text = path.read_text(encoding='utf-8')
markers = '鍊瑙鐨浠璇绱惰莠銆€鈥€闂€寮€鎺€浼€鏁€瑙€绔€璇€鍐€閮€缁€鍔€姣€瀹€鍒€'

def fix_line(line: str) -> str:
    if not any(ch in line for ch in markers):
        return line
    # Most damaged lines were UTF-8 bytes decoded as GBK. Preserve lines that
    # cannot round-trip, because they may contain intentionally mixed text.
    try:
        candidate = line.encode('gb18030').decode('utf-8')
    except UnicodeError:
        try:
            candidate = line.encode('gbk').decode('utf-8')
        except UnicodeError:
            return line
    return candidate

fixed = '\n'.join(fix_line(line) for line in text.split('\n'))
path.write_text(fixed, encoding='utf-8', newline='\n')
