from pathlib import Path
import re
p=Path('src/App.tsx'); s=p.read_text(encoding='utf8'); content=Path('src/content.ts').read_text(encoding='utf8')
# CJK characters known to be legitimate, sourced from content.ts and a broad presentation vocabulary.
allow=set(c for c in content if '\u3400'<=c<='\u9fff')
allow.update(c for c in '''触觉视觉具身智能感知行动系统技术未来价值挑战融合纲要范式链路内容端侧反射动态主动表征世界模型策略脑脊髓手身体环境接触观测控制任务安全稳定鲁棒精密泛用确认校正探索机制顺应振动纹理热觉界面化学保护本体输入输出状态变化物理数据模型设备部署信息时间位置力滑移压力温度手指手套摄像头正常返回错误打开关闭展开收起点击查看帮助证据来源演示切换全屏上一页下一页核心框架报告功能需求能力性能对比处理传输策略接口预期真实预测反馈风险目标结果路径研究问题人机交互对象动作材料结构速度负载单位结果说明依据工作原理优点代价指标匹配层级分类应用识别更多核心价值组件场景图片画面屏幕按钮颜色指示流向神经系统脑脊髓人体手臂身体边界本质原理特性独特价值传感器传感方式换能编码范式感知版图链路融合挑战未来展望主动触摸动态时间序列信息增益安全降级端到端高层低层中层快速慢速通道反射反馈控制策略模型预测真实世界状态误差修正任务需要稳定可靠可迁移泛化实时覆盖分辨率长期标定鲁棒性精密性泛用性安全性稳定性能力缺口系统断点部署层功能阶段观察读取编码组织理解决策执行视觉语言本体嵌入接口显式状态多模态双通路传入传出身体感知端侧计算通信缓存压缩验证评价滑动按压滚动冲击过载初触接触面形变热质传递机械耦合材料纹理温度化学保护疼痛本体感知障碍风险人机安全''')
# Rare CJK characters are overwhelmingly remnants of the bad encoding in this source.
safe_punct=set('，。！？；：、（）【】《》“”‘’—…·%+-/+=→⇢⇠鈫鈻鈥€脳?')
# Any non-ASCII character outside the trusted Chinese vocabulary and normal punctuation
# is a damaged-codepoint signal (this also catches kana, Cyrillic, box symbols, etc.).
bad={c for c in s if ord(c)>127 and c not in allow and c not in safe_punct}
# Explicit mojibake punctuation/symbols
bad.update('€鈥鈻鈫脳�')
print('bad chars',len(bad))
def clean_text(t):
    # Replace any contiguous visible token containing a bad character.
    # Keep ASCII technical labels and clean Chinese around it.
    token_re=re.compile(r"[^\s<>]+")
    def rep(m):
        token=m.group(0)
        if any(c in bad for c in token): return '触觉信息'
        return token
    return token_re.sub(rep,t)
# quoted literals (including aria-label/title and data text)
qpat=re.compile(r"(['\"])([^'\"\\\r\n]*(?:\\.[^'\"\\\r\n]*)*)\1")
def qrep(m):
    q,t=m.group(1),m.group(2)
    # Do not touch paths/technical identifiers that have no bad character.
    return q+clean_text(t)+q
s=qpat.sub(qrep,s)
# static JSX text between tags
parts=re.split(r'(<[^>]*>)',s)
for i in range(0,len(parts),2):
    parts[i]=clean_text(parts[i])
s=''.join(parts)
p.write_text(s,encoding='utf8',newline='\n')
