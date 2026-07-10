#!/usr/bin/env node
/**
 * AUDACITY REVIEW —— 双语静态站点生成器
 *
 * 中文（默认）: posts/*.md          → /post/xxx.html
 * 英文:         posts/en/*.md       → /en/post/xxx.html
 *
 * 用法：
 *   node build.js        构建
 *   node build.js -w     监听变化自动重建
 */

const fs = require('fs');
const path = require('path');

/* ============================================================
 * 0. 站点配置（双语）
 * ============================================================ */
const SITE_URL = 'https://audacityreview.org';

// 两种语言的 UI 配置
const I18N = {
  zh: {
    htmlLang: 'zh-CN',
    tagline: '左翼思想 · 解读 · 评论 · 随笔',
    description: 'AUDACITY REVIEW — 左翼思想刊物的翻译、评论与原创研究。',
    colophon: '本刊解读左翼理论与时评，兼发个人随笔。所涉政治、经济、社会、哲学，立场坦白，议论锋利。',
    nav: [
      { label: '首页', href: '/' },
      { label: '解读', tag: '解读' },
      { label: '随笔', tag: '随笔' },
      { label: '关于', href: '/about.html' },
    ],
    strings: {
      reads: '阅读',
      readMore: '+ READ MORE',
      backHome: '← 返回首页',
      original: '原文：',
      interpBy: '解读 / ',
      byTranslator: ' ｜ 解读 / ',
      recommended: '推荐阅读',
      keywords: '关键词',
      aboutSite: '关于本刊',
      aboutLabel: '关于',
      aboutTitle: '关于本刊',
      totalArticles: '篇',
      empty: '暂无内容。',
      subscribePlaceholder: '邮箱地址',
      subscribeBtn: '订阅',
      submitting: '提交中…',
      subscribedOk: '✓ 已订阅。有新文章时会通知你。',
      subscribeFail: '订阅失败，请稍后重试。',
      subscribeNetworkError: '网络错误，请稍后重试。',
      submitEmail: '投稿 audacityreview@gmail.com',
      langSwitchLabel: 'EN',
    },
  },
  en: {
    htmlLang: 'en',
    tagline: 'Left Thought · Readings · Critique · Essays',
    description: 'AUDACITY REVIEW — A review of left-wing thought: readings, essays, and critique on politics, economy, society, and philosophy.',
    colophon: 'We publish readings of left-wing theory and commentary, alongside original essays and research. Politics, economy, society, philosophy — stated plainly, argued sharply.',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Readings', tag: 'reading' },
      { label: 'Essays', tag: 'essay' },
      { label: 'About', href: '/about.html' },
    ],
    strings: {
      reads: 'Reads',
      readMore: '+ READ MORE',
      backHome: '← Back to home',
      original: 'Source: ',
      interpBy: 'Reading by ',
      byTranslator: ' ｜ Reading by ',
      recommended: 'Recommended',
      keywords: 'Keywords',
      aboutSite: 'About',
      aboutLabel: 'About',
      aboutTitle: 'About AUDACITY REVIEW',
      totalArticles: 'articles',
      empty: 'No content yet.',
      subscribePlaceholder: 'Email address',
      subscribeBtn: 'Subscribe',
      submitting: 'Submitting…',
      subscribedOk: '✓ Subscribed. You will be notified of new articles.',
      subscribeFail: 'Subscription failed. Please try again later.',
      subscribeNetworkError: 'Network error. Please try again later.',
      submitEmail: 'Submissions: audacityreview@gmail.com',
      langSwitchLabel: '中文',
    },
  },
};

const SITE_NAME = 'AUDACITY REVIEW';
const ROOT = __dirname;
const POSTS_DIR = path.join(ROOT, 'posts');
const DIST_DIR = path.join(ROOT, 'dist');
const STYLE_HREF = '/style.css';   // 绝对路径，中英共享

/* ============================================================
 * 1. 工具函数
 * ============================================================ */
const ensureDir = d => fs.mkdirSync(d, { recursive: true });
const rmrf = d => { if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true }); };
const readText = p => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');

function htmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDateCN(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function formatDateEN(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatDate(dateStr, lang) {
  return lang === 'en' ? formatDateEN(dateStr) : formatDateCN(dateStr);
}

/** 英文版路径前缀 */
function base(lang) { return lang === 'en' ? '/en' : ''; }

/** 构建一个页面在本语言内的 URL */
function pageUrl(type, slug, lang) {
  const b = base(lang);
  switch (type) {
    case 'index':   return `${b}/`;
    case 'post':    return `${b}/post/${slug}.html`;
    case 'tag':     return `${b}/tag/${encodeURIComponent(slug)}.html`;
    case 'about':   return `${b}/about.html`;
    default:        return `${b}/`;
  }
}

/** 计算对岸 URL（语言切换器目标） */
function counterpartUrl(type, slug, currentLang, hasCounterpart) {
  if (!hasCounterpart) return null;
  const otherLang = currentLang === 'zh' ? 'en' : 'zh';
  return pageUrl(type, slug, otherLang);
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
 * 3. Markdown 解析
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

    // GFM 表格
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && /\|/.test(lines[i + 1])) {
      flushPara(); closeList();
      const parseRow = (l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => inline(c.trim()));
      const header = parseRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(parseRow(lines[i])); i++; }
      out.push(`<table class="md-table"><thead><tr>${header.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }

    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { flushPara(); closeList(); out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); i++; continue; }
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
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`); i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`); i++; continue;
    }
    closeList(); para.push(line); i++;
  }
  flushPara(); closeList();
  return out.join('\n');
}

/* ============================================================
 * 4. 读取文章
 * ============================================================ */
function loadPosts(lang) {
  const dir = lang === 'en' ? path.join(POSTS_DIR, 'en') : POSTS_DIR;
  ensureDir(dir);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  const posts = files.map(f => {
    const { data, body } = parseFrontMatter(readText(path.join(dir, f)));
    const slug = data.slug || f.replace(/\.md$/, '');
    return {
      slug, lang,
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
      body, file: f,
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

function makeExcerpt(body, n = 110) {
  const text = body.replace(/^---[\s\S]*?---/, '').replace(/[#>*`\-]/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ').trim();
  return text.length > n ? text.slice(0, n) + '…' : text;
}

/** 生成篇号：以中文版为基准，英文版继承同 slug 的编号 */
function assignNumbers(zhPosts, enPosts) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seqByDate = {};
  const lookup = {};  // slug → displayNo/id

  // 中文版编号
  const dated = zhPosts.slice().sort((a, b) => {
    if (a.date < b.date) return -1; if (a.date > b.date) return 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.file < b.file ? -1 : 1;
  });
  dated.forEach(p => {
    const d = new Date(p.date + 'T00:00:00');
    seqByDate[p.date] = (seqByDate[p.date] || 0) + 1;
    p.seq = seqByDate[p.date];
    p.id = p.date.replace(/-/g, '') + String(p.seq).padStart(3, '0');
    const yr = d.getFullYear(), mo = MONTHS[d.getMonth()], dy = String(d.getDate()).padStart(2, '0');
    p.displayNo = `№ ${yr}.${mo}.${dy}-${String(p.seq).padStart(3, '0')}`;
    lookup[p.slug] = { id: p.id, displayNo: p.displayNo };
  });
  zhPosts.sort((a, b) => a.id < b.id ? 1 : a.id > b.id ? -1 : 0);

  // 英文版继承编号
  enPosts.forEach(p => {
    const ref = lookup[p.slug];
    if (ref) { p.id = ref.id; p.displayNo = ref.displayNo; }
    else {
      // 英文版独有（无中文配对）：自己编号
      const d = new Date(p.date + 'T00:00:00');
      p.id = p.date.replace(/-/g, '') + '001';
      p.displayNo = `№ ${d.getFullYear()}.${MONTHS[d.getMonth()]}.${String(d.getDate()).padStart(2,'0')}-001`;
    }
  });
  enPosts.sort((a, b) => a.id < b.id ? 1 : a.id > b.id ? -1 : 0);

  return lookup;
}

/** 拼出署名行 */
function byline(p, S) {
  const parts = [];
  if (p.author) parts.push(htmlEscape(p.author));
  if (p.translator) parts.push(`${S.interpBy}${htmlEscape(p.translator)}`);
  return parts.join(S.byTranslator && p.author && p.translator ? S.byTranslator : '');
}

/* ============================================================
 * 5. 页面外壳（双语）
 * ============================================================ */
function shell({ title, description, bodyHtml, lang = 'zh', activeHref = '/', activeTag = '',
                 extraHead = '', bodyAttr = '', counterpartUrl: cUrl = null }) {
  const I = I18N[lang];
  const S = I.strings;
  const b = base(lang);
  const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;

  // 导航
  const navHtml = I.nav.map(n => {
    const href = n.href ? `${b}${n.href}` : `${b}/tag/${encodeURIComponent(n.tag)}.html`;
    const isActive = n.href ? (n.href === activeHref) : (n.tag === activeTag);
    return `<a href="${href}"${isActive ? ' class="is-active"' : ''}>${n.label}</a>`;
  }).join('\n      ');

  // 语言切换器
  const langSwitchHtml = cUrl
    ? `<a href="${cUrl}" class="lang-switch">${S.langSwitchLabel}</a>`
    : `<span class="lang-switch lang-switch--disabled">${S.langSwitchLabel}</span>`;

  return `<!doctype html>
<html lang="${I.htmlLang}">
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
  <link rel="icon" type="image/png" href="/assets/logo.png">
</head>
<body${bodyAttr ? ' ' + bodyAttr : ''}>
  <header class="masthead">
    <div class="masthead__rule"></div>
    <div class="masthead__inner">
      <a href="${b}/" class="logo" aria-label="${SITE_NAME}">
        <span class="logo__word">AUDACITY</span>
        <span class="logo__word">REVIEW</span>
      </a>
    </div>
    <div class="masthead__rule"></div>
    <nav class="masthead__nav">
      ${navHtml}
      ${langSwitchHtml}
    </nav>
  </header>

  <main class="page">
${bodyHtml}
  </main>

  <footer class="colophon">
    <div class="colophon__rule"></div>
    <div class="colophon__inner">
      <a href="${b}/" class="colophon__title">${SITE_NAME}</a>
      <p class="colophon__text">${htmlEscape(I.colophon)}</p>
      <form class="subscribe" data-subscribe-form>
        <input type="email" placeholder="${htmlEscape(S.subscribePlaceholder)}" required>
        <button type="submit">${htmlEscape(S.subscribeBtn)}</button>
      </form>
      <p class="subscribe__msg" data-subscribe-msg></p>
      <p class="colophon__meta">© ${new Date().getFullYear()} ${SITE_URL.replace(/^https?:\/\//, '')} · ${htmlEscape(S.submitEmail)}</p>
    </div>
  </footer>

  <script>
  (function() {
    var S = ${JSON.stringify(S)};
    var API = '/api';
    function post(url, body) { return fetch(url, { method: 'POST', headers: body ? {'Content-Type':'application/json'} : {}, body: body ? JSON.stringify(body) : null }).then(function(r){return r.json();}).catch(function(){return null;}); }
    function get(url) { return fetch(url).then(function(r){return r.json();}).catch(function(){return null;}); }

    var articleSlug = document.body.getAttribute('data-slug');
    if (articleSlug) {
      post(API + '/view/' + articleSlug).then(function(d) {
        if (d && d.views !== undefined) { var el = document.querySelector('[data-views]'); if (el) el.textContent = d.views; }
      });
      var likeBtn = document.querySelector('[data-like-btn]');
      var likeDisplay = document.querySelector('[data-likes]');
      var liked = localStorage.getItem('liked:' + articleSlug);
      if (likeBtn) {
        get(API + '/like/' + articleSlug).then(function(d) { if (d && d.likes !== undefined && likeDisplay) likeDisplay.textContent = d.likes; });
        if (liked) likeBtn.classList.add('is-liked');
        likeBtn.addEventListener('click', function() {
          if (liked) return;
          post(API + '/like/' + articleSlug).then(function(d) {
            if (d && d.likes !== undefined && likeDisplay) { likeDisplay.textContent = d.likes; likeBtn.classList.add('is-liked'); liked = '1'; localStorage.setItem('liked:' + articleSlug, '1'); }
          });
        });
      }
    }

    var cards = document.querySelectorAll('.card[data-card-slug]');
    if (cards.length) {
      cards.forEach(function(card) {
        var slug = card.getAttribute('data-card-slug');
        get(API + '/view/' + slug).then(function(d) {
          if (d && d.views !== undefined) { var el = card.querySelector('[data-card-views]'); if (el) { el.textContent = d.views; el.parentElement.style.display = ''; } }
        });
      });
    }

    var subForm = document.querySelector('[data-subscribe-form]');
    if (subForm) {
      subForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = subForm.querySelector('input[type="email"]');
        var btn = subForm.querySelector('button');
        var msg = document.querySelector('[data-subscribe-msg]');
        if (!input || !input.value) return;
        btn.disabled = true; btn.textContent = S.submitting;
        fetch(API + '/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: input.value }) })
          .then(function(r){return r.json();}).then(function(d) {
            btn.disabled = false; btn.textContent = S.subscribeBtn;
            if (d && d.ok) { subForm.innerHTML = '<p class="sub-ok">' + S.subscribedOk + '</p>'; }
            else if (msg) { msg.textContent = (d && d.error) ? d.error : S.subscribeFail; }
          }).catch(function() { btn.disabled = false; btn.textContent = S.subscribeBtn; if (msg) msg.textContent = S.subscribeNetworkError; });
      });
    }
  })();
  </script>
</body>
</html>`;
}

/* ============================================================
 * 6. 卡片
 * ============================================================ */
function coverImg(cover, alt, cls) {
  if (!cover) return `<span class="${cls} ${cls}--placeholder" aria-hidden="true">A·R</span>`;
  return `<img class="${cls}" src="${htmlEscape(cover)}" alt="${htmlEscape(alt)}" loading="lazy">`;
}

function tagHref(tag, lang) { return `${base(lang)}/tag/${encodeURIComponent(tag)}.html`; }

function card(p, index, lang, counterpartExists) {
  const I = I18N[lang], S = I.strings;
  const authorLine = byline(p, S);
  const tagsLine = p.tags.length
    ? p.tags.map(t => `<a class="tag" href="${tagHref(t, lang)}">${htmlEscape(t)}</a>`).join('')
    : '';
  return `
      <article class="card" style="--i:${index}" data-card-slug="${htmlEscape(p.slug)}">
        <a class="card__media" href="${base(lang)}/post/${p.slug}.html">
          ${coverImg(p.cover, p.title, 'card__img')}
        </a>
        <div class="card__body">
          <p class="card__no">${p.displayNo || ''}</p>
          ${tagsLine ? `<p class="card__tags">${tagsLine}</p>` : ''}
          <h3 class="card__title"><a href="${base(lang)}/post/${p.slug}.html">${htmlEscape(p.title)}</a></h3>
          ${authorLine ? `<p class="card__author">${authorLine}</p>` : ''}
          <p class="card__excerpt">${htmlEscape(p.excerpt)}</p>
          <p class="card__foot">
            <time datetime="${p.date}">${formatDate(p.date, lang)}</time>
            <span class="card__views" style="display:none">${S.reads} <span data-card-views>0</span></span>
            <a class="readmore" href="${base(lang)}/post/${p.slug}.html">${S.readMore}</a>
          </p>
        </div>
      </article>`;
}

/* ============================================================
 * 7. 首页
 * ============================================================ */
function buildIndexHtml(posts, lang, slugLookup) {
  const I = I18N[lang];
  const cards = posts.slice(0, 12).map((p, i) => card(p, i, lang)).join('');
  const cUrl = counterpartUrl('index', '', lang, true);  // 首页始终有对岸

  const bodyHtml = `
    <section class="dateline">
      <span>${htmlEscape(I.tagline)}</span>
      <span class="dateline__issue">${posts.length ? formatDate(posts[0].date, lang) : ''}</span>
    </section>
    <section class="grid">
${cards || `<p class="empty">${htmlEscape(I.strings.empty)}</p>`}
    </section>`;

  return shell({ title: SITE_NAME, description: I.description, lang, activeHref: '/',
    counterpartUrl: cUrl, bodyHtml });
}

/* ============================================================
 * 8. 文章详情页
 * ============================================================ */
function buildPostHtml(post, allPosts, lang, counterpartSlugExists) {
  const I = I18N[lang], S = I.strings;
  const content = mdToHtml(post.body);

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
    .slice(0, 5).map(x => x.p);

  const relatedHtml = related.map(p => `
          <li class="related__item">
            <a href="${base(lang)}/post/${p.slug}.html">
              <span class="related__title">${htmlEscape(p.title)}</span>
              <span class="related__meta">${formatDate(p.date, lang)}${p.author ? ' · ' + htmlEscape(p.author) : ''}</span>
            </a>
          </li>`).join('');

  let sourceBlock = '';
  if (post.source || post.sourceUrl) {
    const srcText = post.sourceUrl
      ? `${S.original}<a href="${htmlEscape(post.sourceUrl)}">${htmlEscape(post.source || post.sourceUrl)}</a>`
      : `${S.original}${htmlEscape(post.source)}`;
    sourceBlock = `<p class="article__source">${srcText}</p>`;
  }

  const tagsLine = post.tags.length
    ? post.tags.map(t => `<a class="tag" href="${tagHref(t, lang)}">${htmlEscape(t)}</a>`).join('')
    : '';

  const cUrl = counterpartUrl('post', post.slug, lang, counterpartSlugExists);

  const bodyHtml = `
    <div class="article-layout">
      <article class="article">
        <p class="article__no">${post.displayNo || ''}</p>
        ${tagsLine ? `<p class="article__tags article__tags--top">${tagsLine}</p>` : ''}
        <h1 class="article__title">${htmlEscape(post.title)}</h1>
        ${post.author ? `<p class="article__author">${htmlEscape(post.author)}${post.translator ? S.byTranslator + htmlEscape(post.translator) : ''}</p>` : (post.translator ? `<p class="article__author">${S.interpBy}${htmlEscape(post.translator)}</p>` : '')}
        <p class="article__date"><time datetime="${post.date}">${formatDate(post.date, lang)}</time></p>
        ${sourceBlock}
        <div class="article__rule"></div>
        <div class="article__content">
${content}
        </div>
        ${tagsLine ? `<div class="article__tags">${tagsLine}</div>` : ''}
        <div class="article__engage">
          <span class="engage__views">${S.reads} <span data-views>0</span></span>
          <button class="engage__like" data-like-btn>
            <span class="like__icon">♡</span> <span data-likes>0</span>
          </button>
        </div>
        <p class="article__back"><a href="${base(lang)}/">${htmlEscape(S.backHome)}</a></p>
      </article>

      <aside class="sidebar">
        <div class="sidebar__block">
          <h4 class="sidebar__head">${S.recommended}</h4>
          <ul class="related">
${relatedHtml}
          </ul>
        </div>
        ${post.tags.length ? `
        <div class="sidebar__block">
          <h4 class="sidebar__head">${S.keywords}</h4>
          <div class="sidebar__tags">${tagsLine}</div>
        </div>` : ''}
        <div class="sidebar__block sidebar__about">
          <h4 class="sidebar__head">${S.aboutSite}</h4>
          <p class="sidebar__text">${htmlEscape(I.colophon)}</p>
        </div>
      </aside>
    </div>`;

  return shell({
    title: post.title, description: post.excerpt, lang, activeHref: '/',
    counterpartUrl: cUrl, bodyHtml,
    bodyAttr: `data-slug="${htmlEscape(post.slug)}"`,
  });
}

/* ============================================================
 * 9. 标签页
 * ============================================================ */
function buildTagHtml(tag, posts, lang) {
  const I = I18N[lang], S = I.strings;
  const filtered = posts.filter(p => p.tags.includes(tag));
  const cards = filtered.map((p, i) => card(p, i, lang)).join('');
  // 标签页没有精确的对岸（标签名跨语言不同），切换器指向首页
  const cUrl = counterpartUrl('index', '', lang, true);

  const bodyHtml = `
    <section class="dateline">
      <span>#${htmlEscape(tag)}</span>
      <span class="dateline__issue">${filtered.length} ${S.totalArticles}</span>
    </section>
    <section class="grid">
${cards || `<p class="empty">${htmlEscape(S.empty)}</p>`}
    </section>`;

  return shell({ title: `#${tag}`, description: `${SITE_NAME} · ${tag}`, lang,
    activeTag: tag, counterpartUrl: cUrl, bodyHtml });
}

function collectTags(posts) {
  const map = {};
  posts.forEach(p => p.tags.forEach(t => { map[t] = (map[t] || 0) + 1; }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

/* ============================================================
 * 10. 关于页
 * ============================================================ */
function buildAboutHtml(lang) {
  const I = I18N[lang], S = I.strings;
  const aboutPath = lang === 'en'
    ? path.join(ROOT, 'about.en.md')
    : path.join(ROOT, 'about.md');
  let body = '';
  if (fs.existsSync(aboutPath)) {
    body = parseFrontMatter(readText(aboutPath)).body;
  } else {
    body = lang === 'en' ? 'Create `about.en.md` for the English about page.' : '在项目根目录新建 `about.md`。';
  }
  const cUrl = counterpartUrl('about', '', lang, true);

  const bodyHtml = `
    <article class="article article--single">
      <p class="article__no">${S.aboutLabel}</p>
      <h1 class="article__title">${S.aboutTitle}</h1>
      <div class="article__content">
${mdToHtml(body)}
      </div>
    </article>`;

  return shell({ title: S.aboutLabel, description: S.aboutTitle, lang,
    activeHref: '/about.html', counterpartUrl: cUrl, bodyHtml });
}

/* ============================================================
 * 11. RSS
 * ============================================================ */
function buildRss(posts, lang) {
  const I = I18N[lang];
  const b = base(lang);
  const items = posts.slice(0, 20).map(p => `    <item>
      <title>${htmlEscape(p.title)}</title>
      <link>${SITE_URL}${b}/post/${p.slug}.html</link>
      <guid>${SITE_URL}${b}/post/${p.slug}.html</guid>
      <pubDate>${new Date(p.date + 'T00:00:00').toUTCString()}</pubDate>
      <description>${htmlEscape(p.excerpt)}</description>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}${b}</link>
    <description>${htmlEscape(I.description)}</description>
    <language>${I.htmlLang}</language>
${items}
  </channel>
</rss>`;
}

/* ============================================================
 * 12. 主流程（双语构建）
 * ============================================================ */
function build() {
  const t0 = Date.now();
  rmrf(DIST_DIR);
  ensureDir(DIST_DIR);

  copyStatic('style.css');
  copyStatic('assets');

  // 加载双语文章
  const zhPosts = loadPosts('zh');
  const enPosts = loadPosts('en');
  const slugLookup = assignNumbers(zhPosts, enPosts);

  // 中文版 slug 集合（用于判断英文版是否有对岸）
  const zhSlugs = new Set(zhPosts.map(p => p.slug));
  const enSlugs = new Set(enPosts.map(p => p.slug));

  // —— 中文（默认，无前缀）——
  ensureDir(path.join(DIST_DIR, 'post'));
  ensureDir(path.join(DIST_DIR, 'tag'));
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), buildIndexHtml(zhPosts, 'zh', slugLookup), 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), buildAboutHtml('zh'), 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), buildRss(zhPosts, 'zh'), 'utf8');
  for (const [tag] of collectTags(zhPosts)) {
    fs.writeFileSync(path.join(DIST_DIR, 'tag', `${tag}.html`), buildTagHtml(tag, zhPosts, 'zh'), 'utf8');
  }
  for (const post of zhPosts) {
    const hasEN = enSlugs.has(post.slug);
    fs.writeFileSync(path.join(DIST_DIR, 'post', `${post.slug}.html`),
      buildPostHtml(post, zhPosts, 'zh', hasEN), 'utf8');
  }

  // —— 英文（/en/ 前缀）——
  if (enPosts.length > 0) {
    ensureDir(path.join(DIST_DIR, 'en', 'post'));
    ensureDir(path.join(DIST_DIR, 'en', 'tag'));
    fs.writeFileSync(path.join(DIST_DIR, 'en', 'index.html'), buildIndexHtml(enPosts, 'en', slugLookup), 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'en', 'about.html'), buildAboutHtml('en'), 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'en', 'feed.xml'), buildRss(enPosts, 'en'), 'utf8');
    for (const [tag] of collectTags(enPosts)) {
      fs.writeFileSync(path.join(DIST_DIR, 'en', 'tag', `${tag}.html`), buildTagHtml(tag, enPosts, 'en'), 'utf8');
    }
    for (const post of enPosts) {
      const hasZH = zhSlugs.has(post.slug);
      fs.writeFileSync(path.join(DIST_DIR, 'en', 'post', `${post.slug}.html`),
        buildPostHtml(post, enPosts, 'en', hasZH), 'utf8');
    }
  }

  console.log(`✓ 构建完成：中文 ${zhPosts.length} 篇，英文 ${enPosts.length} 篇，耗时 ${Date.now() - t0}ms → dist/`);
}

function copyStatic(name) {
  const src = path.join(ROOT, name);
  const dst = path.join(DIST_DIR, name);
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dst);
    for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
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
  fs.watch(path.join(POSTS_DIR, 'en'), rebuild);
  fs.watch(ROOT, (ev, file) => { if (['style.css','about.md','about.en.md'].includes(file)) rebuild(); });
} else {
  build();
}
