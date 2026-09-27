const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '../src/App.tsx')
let s = fs.readFileSync(file, 'utf8')

// The interrupted write dropped closing ASCII quotes from a handful of lines.
// Only repair a quote when the question mark is immediately before a syntax delimiter.
s = s.replace(/('[^'\r\n]*?)\?([,}\)])/g, "$1'$2")
s = s.replace(/("[^"\r\n]*?)\?(\s*\/?\>)/g, '$1"$2')
s = s.replace(/('[^'\r\n]*?)\?(\s*:\s*)/g, "$1'$2")
s = s.replace(/('[^'\r\n]*?)\?(\s*\})/g, "$1'$2")
fs.writeFileSync(file, s, 'utf8')
