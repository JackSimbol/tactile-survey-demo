const fs=require('fs'); const p='src/App.tsx'; let s=fs.readFileSync(p,'utf8')
// Replace only user-facing text fragments that were irreversibly damaged.
const pairs={
  '瑙﹁瑙傛祴绐':'触觉观测窗','瑙﹁鐢卞姩浣滀骇鐢':'触觉由动作产生','瑙﹁瀹氫箟韬綋杈圭晫':'触觉定义身体边界',
  '瑙嗙嚎琚寚鑵规埅鏂':'视线被手指遮挡','椋熸寚鎸囧皷':'食指指尖','灞€閮ㄥ帇鍔涘満':'局部压力场',
  '鍔ㄤ綔鍚庢灉涓嶅彲瑙':'动作后果不可见','鐗╃悊浜ゆ崲':'物理交换','鎴愬姛鍒ゆ嵁':'成功判据',
  '鎺㈢储鍔ㄤ綔':'探索动作','鏉′欢瑙傛祴':'条件观测','澶栫晫浣滅敤':'外界作用','韬綋鐘舵€':'身体状态',
  'FIRST PRINCIPLES / 01鈥?3':'FIRST PRINCIPLES / 01—03','鈥?':'—','锛':'，','瑙﹁':'触觉','鎺ヨ':'接触',
  '瑙嗚':'视觉','鍔ㄤ綔':'动作','瑙傛祴':'观测','鎺у埗':'控制','鍏疯韩':'具身','韬綋':'身体',
  '鐗╃悊':'物理','鎴愬姛':'成功','瀹夊叏':'安全','绋冲畾':'稳定','鏍℃':'校正','鎺㈢储':'探索'
}
for(const [a,b] of Object.entries(pairs)) s=s.split(a).join(b)
fs.writeFileSync(p,s,'utf8')
