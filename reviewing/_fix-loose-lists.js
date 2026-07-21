#!/usr/bin/env node
/**
 * 修复宽松有序列表：把"数字. 行 + 空行 + 数字. 行"模式中的空行删掉，
 * 使其成为紧凑列表，从而被 build.js 正确识别为单个 <ol>。
 *
 * 仅处理连续数字项之间的空行（且后续还是数字项），不处理其他空行。
 */

const fs = require('fs');

const files = [
  'posts/paper-cognitive-means-phase-transition.md',
  'posts/paper-reclaiming-cognitive-means.md',
  'posts/paper-post-rebellion-cognitive.md',
  'posts/en/paper-cognitive-means-phase-transition.md',
  'posts/en/paper-reclaiming-cognitive-means.md',
  'posts/en/paper-post-rebellion-cognitive.md',
];

const ROOT = 'C:\\Code\\homepage';

for (const rel of files) {
  const p = require('path').join(ROOT, rel);
  const src = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  const lines = src.split('\n');
  const out = [];
  let fixed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 检测：当前是空行，前一行是数字项，下一行也是数字项 → 跳过当前空行
    const isBlank = /^\s*$/.test(line);
    const prevIsOl = out.length > 0 && /^\s*\d+\.\s+/.test(out[out.length - 1]);
    const nextIsOl = i + 1 < lines.length && /^\s*\d+\.\s+/.test(lines[i + 1]);
    if (isBlank && prevIsOl && nextIsOl) {
      // 检查数字是否连续（避免把 1. / 1. 当成连续列表）
      const prevNum = parseInt(/^\s*(\d+)\./.exec(out[out.length - 1])[1], 10);
      const nextNum = parseInt(/^\s*(\d+)\./.exec(lines[i + 1])[1], 10);
      if (nextNum === prevNum + 1) {
        fixed++;
        continue; // 跳过这个空行
      }
    }
    out.push(line);
  }

  if (fixed > 0) {
    fs.writeFileSync(p, out.join('\n'), 'utf8');
    console.log(`✓ ${rel}: 修复 ${fixed} 处宽松有序列表`);
  } else {
    console.log(`- ${rel}: 无需修复`);
  }
}
