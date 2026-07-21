#!/usr/bin/env node
/**
 * 一次性处理脚本：把 reviewing/第三期随笔_review/ 下的 6 篇随笔
 *  转换为符合站点约定的 posts/*.md / posts/en/*.md
 *
 * 处理内容：
 *  1. 删除文末致谢段（--- + 空行 + *本文基于思想孵化机...*）
 *  2. 调整 order 字段（随笔原为 13/14/15，与论文冲突，改为 16/17/18）
 *  3. 写到 posts/ 和 posts/en/（文件名已在外部重命名）
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Code\\homepage';

const ESSAYS = [
  { slug: 'essay-anger-math',     order: 16 },
  { slug: 'essay-post-useful',    order: 17 },
  { slug: 'essay-knowledge-wall', order: 18 },
];

/** 删除文末致谢段：末尾的 --- + 空行 + *本文基于...* / *This essay is adapted...* */
function stripAcknowledgement(body) {
  // 匹配末尾的：\n\n---\n\n*...本文基于思想孵化机...* 或 *This essay is adapted...*
  // 致谢段是斜体（*...*），可能跨多行
  const re = /\n+---\s*\n+\s*\*[\s\S]*?\*\s*$/;
  return body.replace(re, '').replace(/\s+$/, '') + '\n';
}

/** 调整 order 字段 */
function updateOrder(frontmatterSrc, newOrder) {
  return frontmatterSrc.replace(/^order:\s*\d+/m, `order: ${newOrder}`);
}

// ---- 运行 ----

for (const e of ESSAYS) {
  const zhSrcPath = path.join(ROOT, 'reviewing', '第三期随笔_review', `${e.slug}.md`);
  const enSrcPath = path.join(ROOT, 'reviewing', '第三期随笔_review', 'en', `${e.slug}.md`);
  const zhDstPath = path.join(ROOT, 'posts', `${e.slug}.md`);
  const enDstPath = path.join(ROOT, 'posts', 'en', `${e.slug}.md`);

  // 中文版
  let zhSrc = fs.readFileSync(zhSrcPath, 'utf8').replace(/\r\n/g, '\n');
  // 分离 frontmatter 和 body
  const zhFmMatch = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(zhSrc);
  let zhFm = zhFmMatch[1];
  let zhBody = zhFmMatch[2];
  zhBody = stripAcknowledgement(zhBody);
  zhFm = updateOrder(zhFm, e.order);
  const zhOut = `---\n${zhFm}\n---\n${zhBody}`;
  fs.writeFileSync(zhDstPath, zhOut, 'utf8');

  // 英文版
  let enSrc = fs.readFileSync(enSrcPath, 'utf8').replace(/\r\n/g, '\n');
  const enFmMatch = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(enSrc);
  let enFm = enFmMatch[1];
  let enBody = enFmMatch[2];
  enBody = stripAcknowledgement(enBody);
  enFm = updateOrder(enFm, e.order);
  const enOut = `---\n${enFm}\n---\n${enBody}`;
  fs.writeFileSync(enDstPath, enOut, 'utf8');

  console.log(`✓ ${e.slug} (order: ${e.order})`);
  console.log(`    ZH → posts/${e.slug}.md`);
  console.log(`    EN → posts/en/${e.slug}.md`);
}
