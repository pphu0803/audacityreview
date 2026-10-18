// issue-pipeline.workflow.js —— AUDACITY REVIEW 发稿管线（DSH workflow 脚本）
//
// 用法：把本文件内容作为 workflow 工具的 script，args 传：
//   {
//     "issueDir": "下期候选",                          // vault 材料目录（相对 VAULT_ROOT）
//     "drafts": [{ "slug": "symbolic-luddism", "file": "_draft-06-symbolic-luddism.md" }, ...],
//     "date": "2026-10-18",                            // 发稿日期
//     "startOrder": 19,                                // posts 排序起点
//     "previewPort": 8123                              // 本地预览端口
//   }
//
// 阶段：初稿编写 → 自我审查（事实核查 + 逻辑审查，不过关打回）→ 中英翻译
//   → AI 指纹审计（23 项清单，不过关修复一轮再审）→ 配图（riso 规范，canvas 程序出图）
//   → 装配 + 本地预览。人工审核通过后 git push 发布（Cloudflare Pages 自动部署）。
//
// 约定：reviewing/<issue>/ 是工作区（不发布）；posts/ 与 posts/en/ 只在最后装配阶段写入。

const VAULT_ROOT = 'C:/Users/liu08/Documents/Obsidian Vault/技术笔记/AUDACITY REVIEW 材料';
const HOME = 'C:/Code/homepage';
const FP_CHECKLIST = 'C:/Users/liu08/Documents/Obsidian Vault/技术笔记/学术论文AI指纹.md';
const CODEVID_NODE_MODULES = 'C:/Code/codevid/node_modules';

const issueDir = args.issueDir || '下期候选';
const date = args.date;
const startOrder = args.startOrder || 19;
const port = args.previewPort || 8123;
const drafts = args.drafts;

if (!drafts || !drafts.length) { log('args.drafts 为空，无事可做'); return { done: true }; }

// ---------- 共用文案 ----------

const conventions = `
站点约定（homepage 仓库）：
- frontmatter 字段：title/date/order/author/category/tags/cover/excerpt，翻译类另有 source/sourceUrl/translator。
- 中文文章最终落 posts/<slug>.md，英文落 posts/en/<slug>.md，slug 前缀按类型：essay- / paper- / original- / 刊名缩写-。
- 正文 ## 标题分节，散文化口吻，段落 2-4 行。文件以单个换行结尾。
- 改写准则全文在 ${HOME}/reviewing/_rewrite-guidelines.md（必读）。
- 工作区文件放 ${HOME}/reviewing/${issueDir}/（中文）与 reviewing/${issueDir}/en/（英文），最终装配前不得写 posts/。`;

const fpItems = `
逐项审计（23 项，完整定义见 ${FP_CHECKLIST}，必须先读全文）：
1 规整总分总 2 列表式/三点式排列 3 绝对化语气与夸大 4 破折号频繁
5 "不仅…而且…"固定关联词 6 总结-贡献-局限三段模板 7 泛化过渡句（综上所述/如前所述）
8 模棱两可短语 9 过度被动语态 10 千篇一律引文句式 11 安全陈旧无争议观点
12 无数据支撑的概括断言 13 和稀泥结论 14 虚构或错乱参考文献 15 段落长度均匀
16 过度注释 17 描述不存在的图表 18 摘要繁琐冗余 19 摘要结论高度重复
20 over claim（前提与范围被悄悄扩大） 21 claim density 过高 22 Proposition overload 23 多余预告。
修复纪律：逐句斟酌，不用一段 AI 味的话替换另一段 AI 味的话；承重的对冲语（限定真实结论范围的）不是指纹，不得删。`;

const auditSchema = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'minor', 'fail'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          location: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'location', 'issue', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['verdict', 'findings', 'summary'],
};

// ---------- 阶段 1：初稿编写 ----------

phase('01 初稿编写');
const staged = await pipeline(drafts,

  async (null_, d, i) => {
    const order = startOrder + i;
    const zhPath = `${HOME}/reviewing/${issueDir}/${d.slug}.md`;
    const r = await agent(`
你是 AUDACITY REVIEW 的编辑。把一份素材草稿整理成可进入审校流程的中文初稿。

素材：${VAULT_ROOT}/${issueDir}/${d.file}（用 read 工具读全文）。
先读 ${HOME}/reviewing/_rewrite-guidelines.md 的散文化准则。
${conventions}

任务：
1. 修正 frontmatter：date 改为 ${date}，order 改为 ${order}，cover 暂写 /assets/${d.slug}.png（图后补），其余字段保留或按素材补全。
2. 通读全文，按散文化准则做一轮编辑：删元话语、拆长段、核对引语与事实声明是否有素材内出处。素材里已有的核心论点、比喻、数据一个不许丢。
3. 素材引用的外部事实（人名、日期、数字、事件）只保留素材中确有出处的；没有出处的显眼事实标注 [待核]。
4. 用 write 写出 ${zhPath}（UTF-8，单换行结尾）。
返回一行确认：文件路径、最终 order、[待核] 数量。`, { label: `draft:${d.slug}`, phase: '01 初稿编写' });
    return { ...d, order, zhPath, draftLog: r };
  },

  // ---------- 阶段 2：自我审查（事实核查 + 逻辑与公允性，并行两审） ----------

  async (prev, d) => {
    phase('02 自我审查');
    const [fact, logic] = await parallel([
      () => agent(`
你是事实核查员。审查 ${prev.zhPath}（read 全文）。
1. 对文中每一条外部事实声明（人名/职务/日期/数字/事件/引语），用 web_search 或 web_fetch 核实；重点核对 frontmatter 的 sourceUrl 是否真实可达、内容是否支持文中转述。
2. 清点 [待核] 标注，逐一核掉或改写为有出处的表述。若文中有任何 [待核] 残留，verdict 必须给 fail。
不修改文件，只出报告。`, { schema: auditSchema, phase: '02 自我审查' }),
      () => agent(`
你是审稿人。审查 ${prev.zhPath}（read 全文），先读 ${HOME}/reviewing/_rewrite-guidelines.md。
检查：论证链条是否断（结论有没有前提撑住）；立场表述是否公允（对被批评对象的立场是否有失真——例如把对方温和的政策说成绝对禁令）；与既刊文章的说法是否冲突（可 grep ${HOME}/posts/ 相关关键词）；段落节奏是否符合散文化准则。
不修改文件，只出报告。`, { schema: auditSchema, phase: '02 自我审查' }),
    ]);
    const all = [...(fact?.findings || []), ...(logic?.findings || [])];
    // critical 发现 → 一律按 fail 处理，进修订循环（[待核] 残留在审查 prompt 里要求判 fail）
    const hasCritical = all.some((f) => f.severity === 'critical');
    const worst = (hasCritical || [fact?.verdict, logic?.verdict].includes('fail')) ? 'fail'
      : [fact?.verdict, logic?.verdict].includes('minor') ? 'minor' : 'pass';
    return { ...prev, review: { fact, logic, worst, all } };
  },

  // 审查不过关 → 打回修订（最多 2 轮）
  async (prev, d) => {
    let cur = prev;
    for (let round = 1; round <= 2 && cur.review.worst === 'fail'; round++) {
      phase(`02 自我审查（打回修订 第${round}轮）`);
      await agent(`
你是原作者。审稿意见如下，逐条处置（critical/major 必须改，minor 酌情）：
${JSON.stringify(cur.review.all, null, 2)}
读 ${cur.zhPath}，用 edit 落地修改。核查类意见若无法核实，改写为有出处的表述或删除，不许留 [待核] 进下一阶段。`, { label: `revise:${d.slug}#${round}`, phase: '02 自我审查' });
      const re = await agent(`复审 ${cur.zhPath}（read 全文）。确认此前审稿意见已处置、未引入新问题。不修改文件。`,
        { schema: auditSchema, phase: '02 自我审查' });
      cur = { ...cur, review: { ...cur.review, worst: re.verdict, all: re.findings } };
    }
    return cur;
  },

  // ---------- 阶段 3：中英翻译 ----------

  async (prev, d) => {
    phase('03 中英翻译');
    const enPath = `${HOME}/reviewing/${issueDir}/en/${prev.slug}.md`;
    await agent(`
你是译者。把 ${prev.zhPath} 翻译成英文，写到 ${enPath}。
风格：英文政论杂志散文（NLR / Monthly Review 的口吻），不是学术论文腔；术语准确（frontmatter 的 title/excerpt/tags 也要译）；引语核对原英文文献还原原文，不回译。
frontmatter 保持字段一致（title/excerpt/tags 英文化，其余同中文版）。文件 UTF-8 单换行结尾。`, { label: `translate:${prev.slug}`, phase: '03 中英翻译' });
    return { ...prev, enPath };
  },

  // ---------- 阶段 4：AI 指纹审计（中英各一审，不过关修复一轮再审） ----------

  async (prev, d) => {
    phase('04 AI指纹审计');
    const auditOne = (p, lang) => agent(`
你是 AI 写作指纹审计员。先读清单全文：${FP_CHECKLIST}。
再读 ${p}，按 23 项逐项给出判定；每项命中必须给行号级证据（location 写节名+引句），并给修复建议（fix）。
英文文本额外基线：em-dash 密度人类水平约 6-18/千词以下，超出必报。`, { schema: auditSchema, phase: '04 AI指纹审计' });

    let zh = await auditOne(prev.zhPath, 'zh');
    let en = await auditOne(prev.enPath, 'en');
    if (zh?.verdict === 'fail' || en?.verdict === 'fail') {
      const fix = (p, findings) => agent(`
按指纹审计报告修复 ${p}（read 后用 edit 逐句手术，不要整段重写）：
${JSON.stringify(findings, null, 2)}
纪律：逐句斟酌；不用新的 AI 句式替换旧的；承重对冲语不删；数字与引语零变更。`, { phase: '04 AI指纹审计' });
      if (zh?.verdict === 'fail') await fix(prev.zhPath, zh.findings);
      if (en?.verdict === 'fail') await fix(prev.enPath, en.findings);
      zh = await auditOne(prev.zhPath, 'zh');
      en = await auditOne(prev.enPath, 'en');
    }
    return { ...prev, fp: { zh: zh?.verdict, en: en?.verdict, zhFindings: zh?.findings, enFindings: en?.findings } };
  },

  // ---------- 阶段 5：配图（riso 规范 + canvas 程序出图 + 看图验证） ----------

  async (prev, d) => {
    phase('05 配图');
    const scriptPath = `${HOME}/reviewing/${issueDir}/covers/${prev.slug}.js`;
    const outPng = `${HOME}/assets/${prev.slug}.png`;

    await agent(`
你是封面生成工程师。为文章 ${prev.zhPath}（read 全文提取核心隐喻）生成 4:3 封面。
先读设计规范 ${HOME}/reviewing/_design-philosophy.md（riso 双专色、抽象非具象、无文字无人物、留白过半、噪点错位质感）。
参考 codevid 的出图模式：C:/Code/codevid/projects/tone-tyrant-cards/02-production/cover.js（@napi-rs/canvas，帧=纯函数，种子随机可复现）。
写一个独立 node 脚本 ${scriptPath}：
- const { createCanvas } = require('@napi-rs/canvas')，模块查找用绝对路径 require('C:/Code/codevid/node_modules/@napi-rs/canvas')。
- 1600x1200 PNG 输出到 ${outPng}；两个 riso 专色 + 纸色；墨点颗粒（随机点抖动，固定种子）；1-2mm 套印偏移；一个抽象形式对应文章一句话隐喻，脚本头部注释写明隐喻句。
- 用 pwsh 运行 node ${scriptPath} 确认产出。
把隐喻句返回。`, { label: `cover:${prev.slug}`, phase: '05 配图' });

    // 看图验证（判据只能是"看"）
    const look = await agent(`
用 read_image 看 ${outPng}。对照规范检查：无文字无人物无具象物体、双专色低对比、留白充足、有 riso 颗粒感。不达标列出问题。`,
      { schema: { type: 'object', properties: { ok: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['ok', 'problems'] }, phase: '05 配图' });
    if (look && !look.ok) {
      await agent(`按以下问题修改封面脚本 ${scriptPath} 并重跑：${look.problems.join('；')}。只改视觉参数，不动隐喻设计。`, { phase: '05 配图' });
    }
    return { ...prev, cover: outPng, coverOk: look ? look.ok : false };
  });

// ---------- 阶段 6：装配 + 本地预览 ----------

phase('06 装配预览');
const okDrafts = staged.filter(Boolean);
const assembly = await agent(`
你是发布装配员。工作区 ${HOME}/reviewing/${issueDir}/ 已通过全流程，执行装配：
1. 把 ${okDrafts.map((d) => d.zhPath).join('、')} 复制到 ${HOME}/posts/（文件名 = slug.md）。
2. 把 ${okDrafts.map((d) => d.enPath).join('、')} 复制到 ${HOME}/posts/en/。
3. 确认每篇 frontmatter 的 cover 指向 /assets/<slug>.png 且对应 PNG 存在于 ${HOME}/assets/。
4. 在 ${HOME} 运行 node build.js，确认零报错、新文章出现在 dist/index.html。
5. 启动本地预览：在 dist 目录用后台方式启动静态服务（端口 ${port}），验证 http://127.0.0.1:${port}/ 可访问、新文章详情页中英双语都能打开。
返回：构建结果、预览 URL、每篇文章的最终路径清单。`, { phase: '06 装配预览' });

return {
  preview: assembly,
  drafts: okDrafts.map((d) => ({
    slug: d.slug, order: d.order,
    zh: d.zhPath, en: d.enPath, cover: d.cover,
    review: d.review.worst, fingerprint: d.fp,
  })),
  next: '人工审核预览站点；通过后：cd C:/Code/homepage; git add posts assets reviewing dist; git commit; git push → Cloudflare Pages 自动部署到 audacityreview.org',
};
