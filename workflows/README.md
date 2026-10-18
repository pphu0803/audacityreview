# 发稿管线（issue-pipeline）

从 vault 素材到上线的全流程编排：`issue-pipeline.workflow.js`（DSH `workflow` 工具脚本）。

```
vault 下期候选/_draft-*.md
        │
        ▼
[01 初稿编写]     素材 → 散文化编辑 → reviewing/<issue>/<slug>.md（工作区，不发布）
        │
        ▼
[02 自我审查]     事实核查（web 核实引语/日期/数字/sourceUrl）+ 逻辑公允性（双审并行）
        │          fail → 打回修订，最多 2 轮
        ▼
[03 中英翻译]     NLR 口吻散文译，引语回溯原文不回译 → reviewing/<issue>/en/
        │
        ▼
[04 AI指纹审计]   23 项清单逐项审（中英各一审）+ em-dash 密度基线
        │          fail → 逐句手术修复一轮 → 复审
        ▼
[05 配图]         riso 双专色封面：读 _design-philosophy.md → @napi-rs/canvas 纯函数脚本
        │          （复用 codevid 的 cover.js 模式与 node_modules）→ read_image 看图验证
        ▼
[06 装配预览]     复制进 posts/ 与 posts/en/ → node build.js → 本地静态服务预览
        │
        ▼
   ═══ 人工审核 ═══  （唯一的发布闸门）
        │
        ▼
git add posts assets reviewing && git commit && git push
        → Cloudflare Pages 自动部署 audacityreview.org
```

## 运行方式

对 DSH 说"跑发稿管线"，或直接调用 workflow 工具，script = 本文件内容，args：

```json
{
  "issueDir": "下期候选",
  "drafts": [
    { "slug": "essay-symbolic-luddism", "file": "_draft-06-symbolic-luddism.md" },
    { "slug": "essay-minefields-safety-valves", "file": "_draft-07-minefields-and-safety-valves.md" },
    { "slug": "essay-broiler-comfort", "file": "_draft-08-broiler-comfort.md" }
  ],
  "date": "2026-10-18",
  "startOrder": 19,
  "previewPort": 8123
}
```

## 依赖的既有资产

| 资产 | 路径 | 作用 |
|---|---|---|
| 散文化改写准则 | `reviewing/_rewrite-guidelines.md` | 初稿与审稿的共同标准 |
| AI 指纹 23 项清单 | vault `技术笔记/学术论文AI指纹.md` | 指纹审计的判定依据 + 修复纪律 |
| 封面设计哲学 | `reviewing/_design-philosophy.md` | riso 双专色规范与 prompt 模板 |
| codevid 出图模式 | `C:\Code\codevid\projects\*\02-production\cover.js` | 帧=纯函数、@napi-rs/canvas、种子可复现 |
| 站点构建 | `build.js`（零依赖） | posts/*.md → dist/ 静态站 |

## 设计要点

- **工作区与发布隔离**：全流程只写 `reviewing/<issue>/`，最后装配阶段才碰 `posts/`。中途任何失败都不会污染线上目录。
- **审计用结构化输出**（schema）：`verdict: pass/minor/fail + findings[]`，fail 才触发修订循环，避免无限重试。
- **修复纪律写死在 prompt 里**：逐句手术不整段重写；承重对冲语不是指纹不得删；数字与引语零变更（这条来自 2026-10-16 的教训：`essentially monotone` 被误当指纹删过）。
- **封面验证判据是"看"**：程序产图后必须 `read_image` 人审规格，不过关只调视觉参数不动隐喻设计。
- **发布闸门只在最后且属于人类**：管线终点是预览 URL，`git push` 由人执行（或明确指示助手执行）。

## 已知边界

- 事实核查依赖 web_search/web_fetch，碰不到原文（如付费墙）时会降级为"改写为有出处的表述或删"。
- 英文指纹的 em-dash 基线（6-18/千词）来自个人经验值，不是统计结论；audit 只报超出，不自动删。
- 配图是程序化抽象封面；如需 AIGC 素材封面，走 codevid 的空位机制另行处理。
