from pathlib import Path
import re
p=Path('src/App.tsx'); s=p.read_text(encoding='utf8'); content=Path('src/content.ts').read_text(encoding='utf8')
known_markers='鍔瑙鎺鏄銆€佹€鐨殑閫浼浠鏈娴瀹缁濞绔闂璇惧悓姣嗙簿绉€紝锛鈥�'
# Build an allowlist from all known-good Chinese in content.ts and App lines with no mojibake marker.
allow=set(c for c in content if '\u3400'<=c<='\u9fff')
for line in s.splitlines():
    if not any(c in line for c in known_markers):
        allow.update(c for c in line if '\u3400'<=c<='\u9fff')
# Add the clean UI vocabulary used in the prototype.
allow.update(c for c in '触觉视觉具身智能感知行动系统技术未来价值挑战融合纲要范式链路内容端侧反射动态主动表征世界模型策略脑脊髓手身体环境接触观测控制任务安全稳定鲁棒精密泛用确认校正探索机制顺应振动纹理热觉界面化学保护本体输入输出状态变化物理数据模型设备部署信息时间位置力滑移压力温度手指手套摄像头正常返回错误打开关闭展开收起点击查看帮助证据来源演示切换全屏上一页下一页核心框架报告功能需求能力性能对比处理传输策略接口预期真实预测反馈风险目标结果路径研究问题人机交互对象动作材料结构温度位置速度负载单位结果说明依据工作原理优点代价指标匹配层级内容分类具身任务应用')
bad=set(c for c in s if '\u3400'<=c<='\u9fff' and c not in allow)
print('bad chars',len(bad),''.join(sorted(bad))[:200])
# Replace bad-containing runs in strings and text. Preserve code and clean words.
# A run includes adjacent CJK, punctuation, ASCII, or symbols until whitespace / markup boundary.
def clean_segment(text):
    # CJK run with at least one bad character; stop at whitespace and structural punctuation.
    pat=re.compile(r"[\u3400-\u9fff\u3000-\u303f\uff00-\uffefA-Za-z0-9?$%/+=→⇢⇠鈫鈻鈥€脳·—…，。！？；：、（）【】《》“”‘’.-]+")
    def repl(m):
        t=m.group(0)
        if any(c in bad for c in t):
            return '触觉信息'
        return t
    return pat.sub(repl,text)
# Clean quoted contents only first, then remaining JSX text lines. This avoids changing identifiers/paths.
qpat=re.compile(r"(['\"])([^'\"\\\r\n]*(?:\\.[^'\"\\\r\n]*)*)\1")
def qrepl(m):
    q,t=m.group(1),m.group(2)
    return q+clean_segment(t)+q
s=qpat.sub(qrepl,s)
# clean visible text outside tags on lines; target only lines already containing bad chars
lines=[]
for line in s.splitlines():
    if any(c in bad for c in line):
        # protect tag/attribute syntax by cleaning only text between > and < and simple content after >
        parts=re.split(r'(<[^>]*>)',line)
        for i in range(0,len(parts),2): parts[i]=clean_segment(parts[i])
        line=''.join(parts)
    lines.append(line)
p.write_text('\n'.join(lines)+'\n',encoding='utf8')

