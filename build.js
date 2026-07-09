#!/usr/bin/env node
/**
 * AUDACITY REVIEW —— 左翼翻译与随笔 静态站点生成器
 *
 * 读取 posts/*.md（含 front matter），生成：
 *   - dist/index.html        首页（3 栏卡片网格）
 *   - dist/post/<slug>.html  每篇文章详情页（左主体 + 右推荐栏）
 *
 * 用法：
 *   node build.js        构建
 *   node build.js -w     监听变化自动重建
 *
 * 零依赖：手写 Markdown 子集解析器 + front matter 解析。
 */

const fs = require('fs');
const path = require('path');

/* ============================================================
 * 0. 站点配置
 * ============================================================ */
const SITE = {
  name: 'AUDACITY REVIEW',
  tagline: '左翼思想 · 解读 · 评论 · 随笔',
  url: 'https://audacityreview.org',
  description: 'A review of left-wing thought — readings, essays, and critique on politics, economy, society, and philosophy.',
  colophon: '本刊解读左翼理论与时评，兼发个人随笔。所涉政治、经济、社会、哲学，立场坦白，议论锋利。',
  // 导航：label 显示，tag 对应文章 front matter 里的 tag 值；href=/ 全部
  nav: [
    { label: '首页', href: '/' },
    { label: '解读', tag: '解读' },
    { label: '随笔', tag: '随笔' },
    { label: '关于', href: '/about.html' },
  ],
  // 每页卡片数（首页用）
  perPage: 12,
};

const ROOT = __dirname;
const POSTS_DIR = path.join(ROOT, 'posts');
const DIST_DIR = path.join(ROOT, 'dist');
const STYLE_HREF = '/style.css';

/* ============================================================
 * 1. 工具函数
 * ============================================================ */
const ensureDir = d => fs.mkdirSync(d, { recursive: true });
const readText = p => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');

/** 删除目录，对 Windows 上的 EBUSY/EPERM 容错：多次重试，仍失败则清空内容 */
function rmrf(d) {
  if (!fs.existsSync(d)) return;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      fs.rmSync(d, { recursive: true, force: true });
      return;
    } catch (e) {
      if (e.code === 'EBUSY' || e.code === 'EPERM' || e.code === 'ENOTEMPTY') {
        // 可能是某个进程占用——重试前等一下
        if (attempt < 4) { fs.rmSync; sleepSync(300 * (attempt + 1)); continue; }
        // 重试耗尽：退而清空目录内容（保留空目录），避免阻塞构建
        clearContents(d);
        return;
      }
      throw e;
    }
  }
}
function clearContents(d) {
  for (const entry of fs.readdirSync(d)) {
    fs.rmSync(path.join(d, entry), { recursive: true, force: true });
  }
}
function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* busy wait */ }
}

function htmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDateCN(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ============================================================
 * 2. Front Matter 解析
 * ============================================================ */
function parseFrontMatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

/* ============================================================
 * 3. Markdown 解析（手写，子集）
 * ============================================================ */
function inline(s) {
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) =>
    `<img alt="${htmlEscape(alt)}" src="${htmlEscape(src)}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
    `<a href="${htmlEscape(u)}">${t}</a>`);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${htmlEscape(c)}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return s;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0, listType = null, para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

  while (i < lines.length) {
    const line = lines[i];

    // 围栏代码块
    const fence = /^```(\w+)?\s*$/.exec(line);
    if (fence) {
      flushPara(); closeList();
      const buf = []; i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      const lang = fence[1] ? ` class="language-${fence[1]}"` : '';
      out.push(`<pre><code${lang}>${htmlEscape(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^\s*$/.test(line)) { flushPara(); closeList(); i++; continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flushPara(); closeList(); out.push('<hr>'); i++; continue; }

    // 表格（GFM）：表头行 + 分隔行 |---| + 数据行
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && /\|/.test(lines[i + 1])) {
      flushPara(); closeList();
      const parseRow = (l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => inline(c.trim()));
      const header = parseRow(line);
      i += 2; // 跳过表头行和分隔行
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${header.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
      out.push(`<table class="md-table">${thead}${tbody}</table>`);
      continue;
    }

    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      flushPara(); closeList();
      const lv = h[1].length + 1;
      out.push(`<h${lv}>${inline(h[2])}</h${lv}>`);
      i++; continue;
    }
    if (/^>\s?/.test(line)) {
      flushPara(); closeList();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      if (listType !== 'ol') { closeList(); out.push('<ol>'); listType = 'ol'; }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      i++; continue;
    }
    closeList();
    para.push(line);
    i++;
  }
  flushPara(); closeList();
  return out.join('\n');
}

/* ============================================================
 * 4. 读取文章
 * ============================================================ */
function loadPosts() {
  ensureDir(POSTS_DIR);
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
  const posts = files.map(f => {
    const { data, body } = parseFrontMatter(readText(path.join(POSTS_DIR, f)));
    const slug = data.slug || f.replace(/\.md$/, '');
    return {
      slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      author: data.author || '',
      translator: data.translator || '',
      source: data.source || '',
      sourceUrl: data.sourceUrl || '',
      excerpt: data.excerpt || makeExcerpt(body),
      cover: data.cover || '',
      category: data.category || '',
      tags: (data.tags || '').split(',').map(s => s.trim()).filter(Boolean),
      order: data.order !== undefined ? Number(data.order) : 0,
      body,
      file: f,
    };
  });

  // 生成篇号：按日期分组，同日按 order 字段排序（默认 0），order 相同再按文件名
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seqByDate = {};
  const dated = posts
    .slice()
    .sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      if (a.order !== b.order) return a.order - b.order;   // order 小的先编号
      return a.file < b.file ? -1 : 1;
    });
  dated.forEach(p => {
    const d = new Date(p.date + 'T00:00:00');
    seqByDate[p.date] = (seqByDate[p.date] || 0) + 1;
    p.seq = seqByDate[p.date];
    p.id = p.date.replace(/-/g, '') + String(p.seq).padStart(3, '0');   // 排序用: 20260709001
    const yr = d.getFullYear();
    const mo = MONTHS[d.getMonth()];
    const dy = String(d.getDate()).padStart(2, '0');
    const sq = String(p.seq).padStart(3, '0');
    p.displayNo = `№ ${yr}.${mo}.${dy}-${sq}`;                          // 显示用: № 2026.Jul.09-001
  });

  // 最终排序：篇号倒序（新的在前）
  posts.sort((a, b) => a.id < b.id ? 1 : a.id > b.id ? -1 : 0);
  return posts;
}

function makeExcerpt(body, n = 110) {
  const text = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#>*`\-]/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > n ? text.slice(0, n) + '…' : text;
}

/** 拼出"作者/译者"署名行 */
function byline(p) {
  const parts = [];
  if (p.author) parts.push(htmlEscape(p.author));
  if (p.translator) parts.push(`译 / ${htmlEscape(p.translator)}`);
  return parts.join('　');
}

/* ============================================================
 * 5. 页面外壳
 * ============================================================ */
function shell({ title, description, bodyHtml, activeHref = '/', activeTag = '', extraHead = '' }) {
  const fullTitle = title === SITE.name ? title : `${title} · ${SITE.name}`;
  const navHtml = SITE.nav.map(n => {
    const href = n.href || `/tag/${encodeURIComponent(n.tag)}.html`;
    const isActive = n.href ? (n.href === activeHref) : (n.tag === activeTag);
    return `<a href="${href}"${isActive ? ' class="is-active"' : ''}>${n.label}</a>`;
  }).join('\n      ');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(fullTitle)}</title>
  ${description ? `<meta name="description" content="${htmlEscape(description)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Serif+SC:wght@400;500;600;700;900&family=Spectral:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  ${extraHead}
  <link rel="stylesheet" href="${STYLE_HREF}">
</head>
<body>
  <header class="masthead">
    <div class="masthead__rule"></div>
    <div class="masthead__inner">
      <a href="/" class="logo" aria-label="${htmlEscape(SITE.name)}">
        <span class="logo__word">AUDACITY</span>
        <span class="logo__word">REVIEW</span>
      </a>
    </div>
    <div class="masthead__rule"></div>
    <nav class="masthead__nav">
      ${navHtml}
    </nav>
  </header>

  <main class="page">
${bodyHtml}
  </main>

  <footer class="colophon">
    <div class="colophon__rule"></div>
    <div class="colophon__inner">
      <a href="/" class="colophon__title">${htmlEscape(SITE.name)}</a>
      <p class="colophon__text">${htmlEscape(SITE.colophon)}</p>
      <p class="colophon__meta">© ${new Date().getFullYear()} ${htmlEscape(SITE.url.replace(/^https?:\/\//, ''))} · 译介仅供参考，版权归原作者所有</p>
    </div>
  </footer>
</body>
</html>`;
}

/* ============================================================
 * 6. 卡片（首页用）
 * ============================================================ */
function coverImg(cover, alt, cls) {
  if (!cover) return `<span class="${cls} ${cls}--placeholder" aria-hidden="true">A·R</span>`;
  return `<img class="${cls}" src="${htmlEscape(cover)}" alt="${htmlEscape(alt)}" loading="lazy">`;
}

function tagHref(tag) { return `/tag/${encodeURIComponent(tag)}.html`; }

function card(p, index) {
  const authorLine = byline(p);
  const tagsLine = p.tags.length
    ? p.tags.map(t => `<a class="tag" href="${tagHref(t)}">${htmlEscape(t)}</a>`).join('')
    : '';
  return `
      <article class="card" style="--i:${index}">
        <a class="card__media" href="/post/${p.slug}.html">
          ${coverImg(p.cover, p.title, 'card__img')}
        </a>
        <div class="card__body">
          <p class="card__no">${p.displayNo}</p>
          ${tagsLine ? `<p class="card__tags">${tagsLine}</p>` : ''}
          <h3 class="card__title"><a href="/post/${p.slug}.html">${htmlEscape(p.title)}</a></h3>
          ${authorLine ? `<p class="card__author">${authorLine}</p>` : ''}
          <p class="card__excerpt">${htmlEscape(p.excerpt)}</p>
          <p class="card__foot">
            <time datetime="${p.date}">${formatDateShort(p.date)}</time>
            <a class="readmore" href="/post/${p.slug}.html">+ READ MORE</a>
          </p>
        </div>
      </article>`;
}

/* ============================================================
 * 7. 首页（3 栏卡片网格）
 * ============================================================ */
function buildIndexHtml(posts) {
  const cards = posts.slice(0, SITE.perPage).map((p, i) => card(p, i)).join('');

  const bodyHtml = `
    <section class="dateline">
      <span>${htmlEscape(SITE.tagline)}</span>
      <span class="dateline__issue">${posts.length ? formatDateShort(posts[0].date) : ''}</span>
    </section>

    <section class="grid">
${cards}
    </section>
  `;

  return shell({
    title: SITE.name,
    description: SITE.description,
    activeHref: '/',
    bodyHtml,
  });
}

/* ============================================================
 * 8. 文章详情页（左主体 + 右推荐栏）
 * ============================================================ */
function buildPostHtml(post, allPosts) {
  const content = mdToHtml(post.body);

  // 推荐栏：tag 重叠数优先，其次同分类，最后取最近；排除自己，取 5 篇
  const tagSet = new Set(post.tags);
  const related = allPosts
    .filter(p => p.slug !== post.slug)
    .map(p => ({ p, overlap: p.tags.filter(t => tagSet.has(t)).length }))
    .sort((a, b) => {
      if (a.overlap !== b.overlap) return b.overlap - a.overlap;
      const aCat = a.p.category === post.category ? 0 : 1;
      const bCat = b.p.category === post.category ? 0 : 1;
      if (aCat !== bCat) return aCat - bCat;
      return a.p.date < b.p.date ? 1 : -1;
    })
    .slice(0, 5)
    .map(x => x.p);

  const relatedHtml = related.map(p => `
          <li class="related__item">
            <a href="/post/${p.slug}.html">
              <span class="related__title">${htmlEscape(p.title)}</span>
              <span class="related__meta">${formatDateShort(p.date)}${p.author ? ' · ' + htmlEscape(p.author) : ''}</span>
            </a>
          </li>`).join('');

  // 来源信息块
  let sourceBlock = '';
  if (post.source || post.sourceUrl) {
    const srcText = post.sourceUrl
      ? `原文：<a href="${htmlEscape(post.sourceUrl)}">${htmlEscape(post.source || post.sourceUrl)}</a>`
      : `原文：${htmlEscape(post.source)}`;
    sourceBlock = `<p class="article__source">${srcText}</p>`;
  }

  const tagsLine = post.tags.length
    ? post.tags.map(t => `<a class="tag" href="${tagHref(t)}">${htmlEscape(t)}</a>`).join('')
    : '';

  const bodyHtml = `
    <div class="article-layout">
      <article class="article">
        <p class="article__no">${post.displayNo}</p>
        ${tagsLine ? `<p class="article__tags article__tags--top">${tagsLine}</p>` : ''}
        <h1 class="article__title">${htmlEscape(post.title)}</h1>
        ${post.author ? `<p class="article__author">${htmlEscape(post.author)}${post.translator ? ' ｜ 解读 / ' + htmlEscape(post.translator) : ''}</p>` : (post.translator ? `<p class="article__author">解读 / ${htmlEscape(post.translator)}</p>` : '')}
        <p class="article__date"><time datetime="${post.date}">${formatDateCN(post.date)}</time></p>
        ${sourceBlock}
        <div class="article__rule"></div>
        <div class="article__content">
${content}
        </div>
        ${tagsLine ? `<div class="article__tags">${tagsLine}</div>` : ''}
        <p class="article__back"><a href="/">← 返回首页</a></p>
      </article>

      <aside class="sidebar">
        <div class="sidebar__block">
          <h4 class="sidebar__head">推荐阅读</h4>
          <ul class="related">
${relatedHtml}
          </ul>
        </div>
        ${post.tags.length ? `
        <div class="sidebar__block">
          <h4 class="sidebar__head">关键词</h4>
          <div class="sidebar__tags">${tagsLine}</div>
        </div>` : ''}
        <div class="sidebar__block sidebar__about">
          <h4 class="sidebar__head">关于本刊</h4>
          <p class="sidebar__text">${htmlEscape(SITE.colophon)}</p>
        </div>
      </aside>
    </div>
  `;

  return shell({
    title: post.title,
    description: post.excerpt,
    activeHref: '/',
    bodyHtml,
  });
}

/* ============================================================
 * 9. 分类页
 * ============================================================ */
/* ============================================================
 * 9. 标签页（/tag/<name>.html）
 * ============================================================ */
function buildTagHtml(tag, posts) {
  const filtered = posts.filter(p => p.tags.includes(tag));
  const cards = filtered.map((p, i) => card(p, i)).join('');

  const bodyHtml = `
    <section class="dateline">
      <span>#${htmlEscape(tag)}</span>
      <span class="dateline__issue">共 ${filtered.length} 篇</span>
    </section>
    <section class="grid">
${cards || '<p class="empty">暂无内容。</p>'}
    </section>
  `;

  return shell({
    title: `#${tag}`,
    description: `${SITE.name} · 标签 ${tag}`,
    activeTag: tag,
    bodyHtml,
  });
}

/** 收集所有 tag 及其文章数，按数量降序 */
function collectTags(posts) {
  const map = {};
  posts.forEach(p => p.tags.forEach(t => { map[t] = (map[t] || 0) + 1; }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

/* ============================================================
 * 10. 关于页
 * ============================================================ */
function buildAboutHtml() {
  const aboutPath = path.join(ROOT, 'about.md');
  let body = '';
  if (fs.existsSync(aboutPath)) {
    body = parseFrontMatter(readText(aboutPath)).body;
  } else {
    body = '在项目根目录新建 `about.md` 写关于内容。';
  }
  const bodyHtml = `
    <article class="article article--single">
      <p class="article__type">关于</p>
      <h1 class="article__title">关于本刊</h1>
      <div class="article__content">
${mdToHtml(body)}
      </div>
    </article>
  `;
  return shell({ title: '关于', description: '关于本刊', activeHref: '/about.html', bodyHtml });
}

/* ============================================================
 * 11. RSS feed
 * ============================================================ */
function buildRss(posts) {
  const items = posts.slice(0, 20).map(p => `    <item>
      <title>${htmlEscape(p.title)}</title>
      <link>${SITE.url}/post/${p.slug}.html</link>
      <guid>${SITE.url}/post/${p.slug}.html</guid>
      <pubDate>${new Date(p.date + 'T00:00:00').toUTCString()}</pubDate>
      <description>${htmlEscape(p.excerpt)}</description>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${htmlEscape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${htmlEscape(SITE.description)}</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;
}

/* ============================================================
 * 12. 主流程
 * ============================================================ */
function build() {
  const t0 = Date.now();
  rmrf(DIST_DIR);
  ensureDir(DIST_DIR);
  ensureDir(path.join(DIST_DIR, 'post'));
  ensureDir(path.join(DIST_DIR, 'tag'));

  copyStatic('style.css');
  copyStatic('assets');
  copyStatic('favicon.ico');

  const posts = loadPosts();

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), buildIndexHtml(posts), 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), buildAboutHtml(), 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), buildRss(posts), 'utf8');

  // 生成所有标签页
  const tags = collectTags(posts);
  for (const [tag] of tags) {
    const tagFile = path.join(DIST_DIR, 'tag', `${tag}.html`);
    fs.writeFileSync(tagFile, buildTagHtml(tag, posts), 'utf8');
  }

  for (const post of posts) {
    fs.writeFileSync(path.join(DIST_DIR, 'post', `${post.slug}.html`), buildPostHtml(post, posts), 'utf8');
  }

  console.log(`✓ 构建完成：${posts.length} 篇文章，${tags.length} 个标签，耗时 ${Date.now() - t0}ms → dist/`);
}

function copyStatic(name) {
  const src = path.join(ROOT, name);
  const dst = path.join(DIST_DIR, name);
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dst);
    for (const f of fs.readdirSync(src)) {
      fs.copyFileSync(path.join(src, f), path.join(dst, f));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

if (process.argv.includes('-w')) {
  build();
  console.log('👁  监听中…（Ctrl+C 退出）');
  let timer = null;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(build, 150); };
  fs.watch(POSTS_DIR, rebuild);
  fs.watch(ROOT, (ev, file) => { if (file === 'style.css' || file === 'about.md') rebuild(); });
} else {
  build();
}
