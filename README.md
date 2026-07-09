# AUDACITY REVIEW

独立左翼思想刊物 · 翻译 · 评论 · 随笔

Caslon 衬线字标 · 加宽带宽 · 3 栏卡片列表 · 左右两栏文章页 · 零依赖静态站点。

## 目录结构

```
homepage/
├── build.js            构建脚本（Markdown → 静态 HTML）
├── style.css           样式（月刊版式）
├── about.md            「关于」页内容
├── posts/              ← 文章都放这里
│   ├── 2026-07-fisher-capitalism.md
│   └── ...
├── assets/             ← 自己的图片放这里（自动复制到 dist/）
└── dist/               ← 构建产物
    ├── index.html      首页（3 栏卡片）
    ├── about.html
    ├── feed.xml        RSS 订阅
    ├── category/
    │   ├── translation.html
    │   └── essay.html
    └── post/<slug>.html
```

## 写一篇文章

在 `posts/` 新建 `.md` 文件，开头 front matter：

```markdown
---
title: 文章标题
date: 2026-07-09
type: translation          # translation（翻译）或 essay（随笔）
author: 原作者             # 翻译必填；随笔可填"编者"
translator: 译者名         # 仅翻译需要
source: 原文出处           # 如 "New Left Review, No.142"
sourceUrl: https://...     # 原文链接（可选）
category: 政治经济学        # 分类
tags: 资本主义,危机        # 逗号分隔
cover: https://图片地址.jpg  # 4:3 头图
excerpt: 摘要文字           # 不填则自动摘取
---

正文从这里开始。
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 标题 |
| `date` | 是 | `YYYY-MM-DD`，决定排序 |
| `type` | 是 | `translation` 或 `essay`，决定分类页归属 |
| `author` | 翻译必填 | 原作者；随笔填"编者" |
| `translator` | 翻译用 | 译者 |
| `source` | 翻译用 | 原文出处（刊物名、期号） |
| `sourceUrl` | 翻译用 | 原文链接 |
| `category` | 否 | 分类标签 |
| `tags` | 否 | 关键词，逗号分隔 |
| `cover` | 否 | 头图 URL，建议 4:3 横图。不填显示占位 |
| `excerpt` | 否 | 摘要。不填自动摘前 110 字 |

> **头图**：文章正文第一张图会自动浮动到正文右上角（详情页）。首页卡片用的是 front matter 的 `cover`。

## 构建与部署

```bash
node build.js          # 构建
node build.js -w       # 监听模式
```

### 部署到 Cloudflare Pages（推荐）

1. 把项目推到 GitHub
2. Cloudflare Pages → 新建项目 → 连接仓库
3. 构建命令：`node build.js`；输出目录：`dist`
4. 绑定自定义域名 `audacityreview.org`

每次 `git push` 自动部署，免费，全球 CDN。

## 自定义

- **站名/刊语/导航**：`build.js` 顶部 `SITE` 对象
- **配色/字体/带宽**：`style.css` 顶部 `:root` 变量

---

© AUDACITY REVIEW
