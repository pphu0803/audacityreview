#!/usr/bin/env node
/**
 * 一次性处理脚本：把 reviewing/ 下的 6 篇 AI 认知三部曲论文
 *  转换为符合站点约定的 posts/*.md / posts/en/*.md
 *
 * 处理内容：
 *  1. 去掉正文里的 [N] / <sup>...</sup> 引用标记
 *  2. 去掉文末的 ## 参考文献 / ## References + <ol>...</ol> 整段
 *  3. 去掉正文开头的 **摘要** / **Abstract** + 紧随的段落
 *  4. 去掉 **关键词** / **Keywords** 行
 *  5. 去掉首个 # 标题行（H1 由 frontmatter title 生成）
 *  6. 补 YAML frontmatter
 *  7. 写到目标路径
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Code\\homepage';

// 中英对照的目标映射
const PAPERS = [
  {
    slug: 'paper-cognitive-means-phase-transition',
    srcZh: 'reviewing/cognitive-means-phase-transition-paper.md',
    srcEn: 'reviewing/en/cognitive-means-phase-transition-paper.md',
    cover: '/assets/paper-cognitive-means-phase-transition.png',
    seriesOrder: 1,
    order: 13,
  },
  {
    slug: 'paper-reclaiming-cognitive-means',
    srcZh: 'reviewing/reclaiming-cognitive-means-paper.md',
    srcEn: 'reviewing/en/reclaiming-cognitive-means-paper.md',
    cover: '/assets/paper-reclaiming-cognitive-means.png',
    seriesOrder: 2,
    order: 14,
  },
  {
    slug: 'paper-post-rebellion-cognitive',
    srcZh: 'reviewing/post-rebellion-cognitive-infrastructure.md',
    srcEn: 'reviewing/en/post-rebellion-cognitive-infrastructure.md',
    cover: '/assets/paper-post-rebellion-cognitive.png',
    seriesOrder: 3,
    order: 15,
  },
];

const DATE = '2026-07-18';
const AUTHOR = 'Liutao Hu';

// ---- 处理函数 ----

/** 删除文末"参考文献"段：从 ## 参考文献 / ## References 行开始到文件末尾 */
function stripReferences(body) {
  // 匹配 "## 参考文献" 或 "## References"（含可能的尾随空白）
  const idx = body.search(/^##\s+(参考文献|References)\s*$/m);
  if (idx === -1) return body;
  return body.slice(0, idx).replace(/\s+$/, '') + '\n';
}

/** 删除 [N] 引用标记（含 <sup> 包裹形式） */
function stripCitationMarkers(body) {
  // <sup><a href="#cite-N">[N]</a></sup>  →  删除
  let s = body.replace(/<sup>\s*<a[^>]*>\s*\[\d+\]\s*<\/a>\s*<\/sup>/g, '');
  // <sup>...[N]...</sup>  兜底：把残留的 <sup>[N]</sup> 也删掉
  s = s.replace(/<sup>\s*\[\d+\]\s*<\/sup>/g, '');
  // 单独的 [N]（紧跟在汉字/标点/英文后，被当作引用标记）
  // 用负向断言避免误伤列表项 "1. " 等：只匹配 \d{1,3}
  s = s.replace(/\s*\[(\d{1,3})\](?!\.)/g, '');
  return s;
}

/** 删除 **摘要** / **Abstract** + 后面紧跟的段落（容忍中英文冒号） */
function stripAbstract(body) {
  // 匹配 **摘要** / **摘要**： / **Abstract** / **Abstract:** 后面跟一个空行，再跟一段
  const re = /\*\*(摘要|Abstract)\*\*[:：]?\s*\n[\s\S]*?(?=\n\s*\n)/;
  let out = body.replace(re, '');
  // 如果摘要在文件开头，正则可能留下前导换行；统一清理
  out = out.replace(/^\s+/, '');
  return out;
}

/** 删除 **关键词** / **关键词：** / **Keywords** / **Keywords:** 行（容忍冒号在 ** 内外） */
function stripKeywords(body) {
  return body.replace(/^\*\*(?:关键词|Keywords)[:：]?\*\*[:：]?[^\n]*\n?/m, '');
}

/** 删除首个 # 标题行 */
function stripH1(body) {
  return body.replace(/^#\s+[^\n]*\n+/, '');
}

/** 主处理流程 */
function processBody(src) {
  let body = src.replace(/\r\n/g, '\n');
  // 先去掉参考文献段（防止 [N] 在参考文献条目里被删后留下混乱）
  body = stripReferences(body);
  // 去掉引用标记
  body = stripCitationMarkers(body);
  // 去掉摘要段
  body = stripAbstract(body);
  // 去掉关键词行
  body = stripKeywords(body);
  // 去掉 H1
  body = stripH1(body);
  // 清理开头多余空行、可能残留的 ---（源文件中作为正文分隔符的）
  body = body.replace(/^(?:\s*---\s*\n)+/, '');
  body = body.replace(/^\s+/, '');
  // 文件以单个换行结尾
  body = body.replace(/\s+$/, '') + '\n';
  return body;
}

/** 构造 frontmatter */
function makeFrontmatter(meta) {
  const isEn = meta.lang === 'en';
  return [
    '---',
    `title: ${meta.title}`,
    `date: ${DATE}`,
    `order: ${meta.order}`,
    `author: ${AUTHOR}`,
    `category: ${isEn ? 'Thought' : '思想实验'}`,
    `tags: ${isEn ? 'thought-experiment,philosophy,AI,political-economy,platform-capitalism,phase-transition,cognitive-production-means' : '思想实验,哲学,AI,政治经济学,平台资本主义,相变,认知生产手段'}`,
    `cover: ${meta.cover}`,
    `excerpt: ${meta.excerpt}`,
    `series: ${isEn ? 'Means of Cognitive Production Trilogy' : '认知生产手段三部曲'}`,
    `seriesOrder: ${meta.seriesOrder}`,
    '---',
    '',
  ].join('\n');
}

// ---- 运行 ----

for (const p of PAPERS) {
  const zhSrc = fs.readFileSync(path.join(ROOT, p.srcZh), 'utf8');
  const enSrc = fs.readFileSync(path.join(ROOT, p.srcEn), 'utf8');

  // 解析标题（用于 excerpt 提示，但 excerpt 需要手工写好——我们从源文件提取首段作为默认值）
  // 这里直接 hard-code 每篇的 excerpt，避免抽取失败
  const excerpts = {
    zh: {
      'paper-cognitive-means-phase-transition':
        '算力、数据与模型权重构成了 AI 时代的"认知生产手段"。这三重载体在跨过功能性转变区间后，从训练与推理工具变为约束他人可行集合的控制变量，制造出"计算领主—认知佃农—认知被排斥者"的三阶级结构，构成 pro tanto 非正义，触及认知排斥时升级为基本权利侵害。诊断为主，不开药方。',
      'paper-reclaiming-cognitive-means':
        '前篇诊断了认知生产手段的集中结构。本文追问被剥夺者如何行动：个体技术退出是死路，自由主义行动理论在深度俘获下效力递减。文章形式化"认知协调陷阱"这一多重约束结构，并将反抗策略组织为两个层级——结构内部的策略有不可逾越的天花板，替代性生产实体指向改变产权结构本身。',
      'paper-post-rebellion-cognitive':
        '集体行动打破了旧的认知生产手段集中结构之后，如何防止其再次形成？苏联的教训是革命替换了人但不替换结构。本文从病理诊断出发，构建了对称覆盖三重互补瓶颈的规范性框架——算力原则、数据原则、权重原则——并直面核心悖论：任何反俘获制度本身也可能沦为俘获的对象。',
    },
    en: {
      'paper-cognitive-means-phase-transition':
        'Compute, data, and model weights constitute the "means of cognitive production" of the AI era. Upon crossing a functional transition zone, these three carriers shift from tools of training and inference into control variables that constrain the feasible sets of others, producing a three-class structure of "compute lords—cognitive serfs—cognitively excluded," which constitutes a pro tanto injustice and escalates into a violation of basic rights when it reaches cognitive exclusion. Diagnosis only, no prescription.',
      'paper-reclaiming-cognitive-means':
        'The previous article diagnosed the concentrated structure of the means of cognitive production. This article asks how the dispossessed can act: individual technological exit is a dead end, and liberal action theory loses force under deep capture. The article formalizes the "Cognitive Coordination Trap" as a structure of multiple binding constraints, and organizes resistance into two tiers—intra-structure strategies hit an unbreakable ceiling; alternative production entities aim to change the property-rights structure itself.',
      'paper-post-rebellion-cognitive':
        'After collective action breaks the old concentrated structure of the means of cognitive production, how do we prevent it from re-forming? The lesson of the Soviet Union is that revolution replaces people but not structure. Starting from the pathological diagnosis, this article builds a normative framework that symmetrically covers the three complementary bottlenecks—the Compute Principle, the Data Principle, the Weight Principle—and confronts the core paradox: any anti-capture institution can itself become an object of capture.',
    },
  };

  // 处理中文版
  const zhBody = processBody(zhSrc);
  const zhFm = makeFrontmatter({
    lang: 'zh',
    title: extractTitle(zhSrc),
    order: p.order,
    cover: p.cover,
    excerpt: excerpts.zh[p.slug],
    seriesOrder: p.seriesOrder,
  });
  const zhOut = zhFm + zhBody;
  const zhDst = path.join(ROOT, 'posts', `${p.slug}.md`);
  fs.writeFileSync(zhDst, zhOut, 'utf8');

  // 处理英文版
  const enBody = processBody(enSrc);
  const enFm = makeFrontmatter({
    lang: 'en',
    title: extractTitle(enSrc),
    order: p.order,
    cover: p.cover,
    excerpt: excerpts.en[p.slug],
    seriesOrder: p.seriesOrder,
  });
  const enOut = enFm + enBody;
  const enDst = path.join(ROOT, 'posts', 'en', `${p.slug}.md`);
  fs.writeFileSync(enDst, enOut, 'utf8');

  console.log(`✓ ${p.slug}`);
  console.log(`    ZH: ${p.srcZh} → posts/${p.slug}.md  (${zhBody.length} chars body)`);
  console.log(`    EN: ${p.srcEn} → posts/en/${p.slug}.md  (${enBody.length} chars body)`);
}

/** 从源文件提取 H1 标题文本 */
function extractTitle(src) {
  const m = /^#\s+(.+?)\s*$/m.exec(src);
  return m ? m[1].trim() : 'Untitled';
}
