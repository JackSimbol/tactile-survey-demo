const fs = require('fs')
const p = 'src/App.tsx'
let s = fs.readFileSync(p, 'utf8')
s = s.replace("import { useCallback, useEffect, useMemo, useState } from 'react'", "import { useCallback, useEffect, useMemo, useRef, useState } from 'react'")
s = s.replace("  const [help, setHelp] = useState(false)\n", "  const [help, setHelp] = useState(false)\n  const railRef = useRef<HTMLElement>(null)\n")
const marker = "  useEffect(() => {\n    localStorage.setItem('tactile-prototype-theme', theme)\n  }, [theme])\n"
const insert = marker + "\n  useEffect(() => {\n    const rail = railRef.current\n    const active = rail?.querySelector<HTMLElement>('button.active')\n    if (!rail || !active) return\n    const railBox = rail.getBoundingClientRect()\n    const activeBox = active.getBoundingClientRect()\n    const margin = Math.min(72, railBox.height * 0.18)\n    if (activeBox.top < railBox.top + margin || activeBox.bottom > railBox.bottom - margin) {\n      active.scrollIntoView({ block: 'center', behavior: 'smooth' })\n    }\n  }, [current])\n"
if (!s.includes('const margin = Math.min(72')) s = s.replace(marker, insert)
s = s.replace('<nav className="chapter-rail" aria-label="鍘熷瀷灞忓箷">', '<nav ref={railRef} className="chapter-rail" aria-label="原型屏幕导航">')
fs.writeFileSync(p, s, 'utf8')
