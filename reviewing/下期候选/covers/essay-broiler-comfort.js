// essay-broiler-comfort.js —— 《肉鸡的舒适》4:3 riso 封面（1600×1200）
//
// 隐喻句（文章收束句）：
//   「一个社会的稳定如果以思想的单一化为代价，
//    那么这种稳定本身，就是它最深处的不稳定。」
//
// 抽象形式：一块温吞的蓝灰"鸡舍"色域（圆角围栏，手裁边缘），里面是
// 完全 identical 的一网格赭石圆点——品种单一化；网格右缘渐次溶解成
// 半调噪点散落——框架外连想象都想象不出来。围栏与点阵各带 1–2mm
// 套印偏移的软重影。超过一半画面是奶油纸的留白。
//
// 两专色：dusty blue（蓝灰）+ faded ochre（褪赭），叠印处 multiply 出
// 第三调。无文字、无人物、无具象。种子固定，可复现。

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('C:/Code/codevid/node_modules/@napi-rs/canvas');

// ---------- 常量 ----------
const W = 1600, H = 1200;
const SEED = 20261018; // 固定种子
const OUT = 'C:/Code/homepage/assets/essay-broiler-comfort.png';

// riso 专色（低对比、相邻明度）+ 纸色
const PAPER = '#f2ecdd';   // cream / bone 纸
const INK_A = '#69798a';   // dusty blue 蓝灰
const INK_B = '#bf8f5e';   // faded ochre 褪赭

// ---------- 种子随机（mulberry32，可复现） ----------
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(SEED);

// ---------- 手裁 imperfect 边缘：带微抖动的圆角矩形路径 ----------
function handCutRect(ctx, x, y, w, h, r, jitter) {
  const pts = 96; // 采样点数
  ctx.beginPath();
  for (let i = 0; i <= pts; i++) {
    const t = (i / pts) * Math.PI * 2 - Math.PI; // 起点在左侧中部
    // 超椭圆近似圆角矩形（squircle，柔和印刷感）
    const ct = Math.cos(t), st = Math.sin(t);
    const px = Math.sign(ct) * Math.pow(Math.abs(ct), 0.62);
    const py = Math.sign(st) * Math.pow(Math.abs(st), 0.62);
    const jx = (rand() - 0.5) * jitter;
    const jy = (rand() - 0.5) * jitter;
    const X = x + w / 2 + px * (w / 2 - r * 0.29) + jx;
    const Y = y + h / 2 + py * (h / 2 - r * 0.29) + jy;
    if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
  }
  ctx.closePath();
}

// ---------- 墨点颗粒：在指定区域内随机撒半透明小点 ----------
function grain(ctx, color, count, alphaMin, alphaMax) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const x = rand() * W, y = rand() * H;
    const r = 0.6 + rand() * 1.6;
    ctx.globalAlpha = alphaMin + rand() * (alphaMax - alphaMin);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- 构建 ----------
const cv = createCanvas(W, H);
const ctx = cv.getContext('2d');

// 1) 纸色 + 纸纤维
ctx.fillStyle = PAPER;
ctx.fillRect(0, 0, W, H);
grain(ctx, '#d9d0ba', 9000, 0.10, 0.30); // 纸的细纤维点

// 2) 蓝灰"鸡舍"色域（叠印 multiply），带 1–2mm（≈9px）套印偏移软重影
const pen = { x: 430, y: 430, w: 740, h: 500, r: 130 };
ctx.save();
ctx.globalCompositeOperation = 'multiply';
ctx.globalAlpha = 0.34;
ctx.fillStyle = INK_A;
handCutRect(ctx, pen.x + 9, pen.y + 7, pen.w, pen.h, pen.r, 7); // 偏移重影
ctx.fill();
ctx.globalAlpha = 0.62;
handCutRect(ctx, pen.x, pen.y, pen.w, pen.h, pen.r, 7); // 主版
ctx.fill();
ctx.restore();

// 3) 网格化的 identical 赭石圆点——品种单一化；右缘概率性溶解成半调
const cols = 8, rows = 5;
const gx0 = pen.x + 92, gy0 = pen.y + 96;
const gapX = (pen.w - 184) / (cols - 1);
const gapY = (pen.h - 192) / (rows - 1);
ctx.save();
ctx.globalCompositeOperation = 'multiply';
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    // 溶解概率：越靠右越可能缺席（框架外的消散）
    const dissolve = Math.pow(c / (cols - 1), 2.6);
    if (rand() < dissolve * 0.85) continue;
    const x = gx0 + c * gapX;
    const y = gy0 + r * gapY;
    // 半径轻微手印抖动，但保持"同一品种"的整齐
    const rad = 17 + (rand() - 0.5) * 2.4;
    // 套印偏移的软重影
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = INK_B;
    ctx.beginPath(); ctx.arc(x + 6, y + 5, rad, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.88;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }
}
ctx.restore();

// 4) 右缘散落的半调噪点（溶解出去的"基因"）
ctx.save();
ctx.globalCompositeOperation = 'multiply';
ctx.fillStyle = INK_B;
for (let i = 0; i < 90; i++) {
  const t = rand();
  const x = pen.x + pen.w - 60 + t * t * 330 + (rand() - 0.5) * 60;
  const y = pen.y + 60 + rand() * (pen.h - 120);
  ctx.globalAlpha = 0.12 + rand() * 0.35;
  ctx.beginPath();
  ctx.arc(x, y, 2 + rand() * 8, 0, Math.PI * 2);
  ctx.fill();
}
ctx.restore();

// 5) 全局墨点颗粒（riso ink grain）
grain(ctx, INK_A, 26000, 0.03, 0.10);
grain(ctx, INK_B, 14000, 0.03, 0.09);
grain(ctx, '#fbf7ec', 12000, 0.05, 0.15); // 墨里的纸色露点

// ---------- 输出 ----------
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, cv.encodeSync('png'));
console.log('cover ->', OUT, `(${W}x${H}, seed ${SEED})`);

// ---------- 程序化视觉规范验收（read_image 不可用时的替代） ----------
// 检查四项：① 无文字/人物/具象 ② 双专色低对比 ③ 留白 ④ riso 颗粒感
function verify() {
  const img = ctx.getImageData(0, 0, W, H).data;
  const N = W * H;

  // ① 无具象：脚本从未调用 fillText/drawImage，结构上不可能出现文字或位图；
  //    颜色侧验证——每个像素的色相应落在纸/双专色锚点附近（multiply 只会在
  //    锚点连线上产生混色，不会引入新色相）。
  const hueOf = (r, g, b) => {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn < 12) return null; // 近中性灰/纸，不计色相
    let h;
    if (mx === r) h = ((g - b) / (mx - mn)) % 6;
    else if (mx === g) h = (b - r) / (mx - mn) + 2;
    else h = (r - g) / (mx - mn) + 4;
    return ((h * 60) + 360) % 360;
  };
  const anchors = [INK_A, INK_B].map(c => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
    return hueOf(r, g, b);
  });
  const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  let onPalette = 0, hueTotal = 0;
  for (let i = 0; i < N; i++) {
    const h = hueOf(img[i * 4], img[i * 4 + 1], img[i * 4 + 2]);
    if (h === null) continue;
    hueTotal++;
    if (anchors.some(a => hueDist(h, a) < 18)) onPalette++;
  }
  const paletteRatio = onPalette / hueTotal;
  const noRepresentational = paletteRatio > 0.995;

  // ② 双专色低对比：两墨间、墨与纸间的 WCAG 对比度均应偏低（印刷柔和感）
  const lum = (r, g, b) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (c1, c2) => {
    const [r1, g1, b1] = [1, 3, 5].map(i => parseInt(c1.slice(i, i + 2), 16));
    const [r2, g2, b2] = [1, 3, 5].map(i => parseInt(c2.slice(i, i + 2), 16));
    const l1 = lum(r1, g1, b1), l2 = lum(r2, g2, b2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const inkInk = ratio(INK_A, INK_B);
  const inkPaperA = ratio(INK_A, PAPER);
  const lowContrast = inkInk < 2.5 && inkPaperA < 6;

  // ③ 留白：距色域边缘 >80px 且非颗粒底色的"净纸"像素占比应超过一半
  const [pr, pg, pb] = [1, 3, 5].map(i => parseInt(PAPER.slice(i, i + 2), 16));
  const nearPaper = (r, g, b) => Math.abs(r - pr) < 14 && Math.abs(g - pg) < 14 && Math.abs(b - pb) < 14;
  const m = 90; // 忽略边缘
  let paperCount = 0, total = 0, inkCount = 0;
  for (let y = m; y < H - m; y += 3) {
    for (let x = m; x < W - m; x += 3) {
      const i = (y * W + x) * 4;
      total++;
      if (nearPaper(img[i], img[i + 1], img[i + 2])) paperCount++;
      else inkCount++;
    }
  }
  const whitespace = paperCount / total > 0.5;

  // ④ riso 颗粒感：净纸区的高频明度方差应显著高于纯色（墨点颗粒存在）
  const devs = [];
  for (let y = m; y < H - m; y += 6) {
    for (let x = m; x < W - m - 6; x += 6) {
      const i = (y * W + x) * 4, j = (y * W + x + 6) * 4;
      if (nearPaper(img[i], img[i + 1], img[i + 2]) && nearPaper(img[j], img[j + 1], img[j + 2])) {
        devs.push(Math.abs(img[i] - img[j]));
      }
    }
  }
  const mean = devs.reduce((s, v) => s + v, 0) / devs.length;
  const grainy = mean > 1.0 && devs.some(v => v > 8); // 平均微抖 + 存在明显墨点

  const results = { '① 无文字/人物/具象': noRepresentational, '② 双专色低对比': lowContrast, '③ 留白>50%': whitespace, '④ riso 颗粒感': grainy };
  let pass = true;
  for (const [k, v] of Object.entries(results)) {
    console.log(`${v ? 'PASS' : 'FAIL'}  ${k}`);
    if (!v) pass = false;
  }
  console.log(`      调色板色相占比=${(paletteRatio * 100).toFixed(2)}% 墨-墨对比=${inkInk.toFixed(2)} 墨-纸对比=${inkPaperA.toFixed(2)} 净纸占比=${(paperCount / total * 100).toFixed(1)}% 纸面邻差均值=${mean.toFixed(2)}`);
  if (!pass) { console.error('视觉规范验收未全部通过'); process.exitCode = 1; }
}
verify();
