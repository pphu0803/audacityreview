// essay-censorship-without-censor.js —— 《没有审查官的审查：The Canary 之死与产权语法》封面
// 1600×1200（4:3）· riso 双专色 + 纸色 · @napi-rs/canvas · 固定种子，帧=纯函数可复现
//
// ── 隐喻句（出自正文「一、审查官在哪里」，essay-censorship-without-censor.md:34）──
//    它不需要被禁止说话，它只需要收不到钱。
// ──────────────────────────────────────────────────────────────────────────
// 抽象形式（一个形式讲这一句话）：
//   一条贯穿画面的水平墨带   = 所有人都必须经过的支付通道；
//   带中央一段无名的空缺     = 没有审查官的切断——没有刀、没有手，只有「不再通过」；
//   断口两侧墨带溶成半调墨点 = 钱流散成颗粒；
//   两块专色版的缺口位置互错 = 链条上没有任何一环承认自己切的那一刀。
//
// riso 语法：dusty blue × muted clay 两块专色版「互斥分工」——B 版只印在 A 版形状的
//   空白处（在 A 版的断口里仍印到自己的断口为止），一像素至多一种油墨：纸底外恒为
//   两种墨色；multiply 仅用于油墨压深纸色，不做版间叠印。墨点随机抖动颗粒（确定性
//   坐标哈希，固定种子 SEED）；12px 水平套印偏移（1600px ≈ 200mm 成稿宽 ≈1.5mm）；
//   奶白纸底带纤维噪点；留白 > 一半。两墨明度相邻（≈1.1:1），墨-纸对比 ≈3.3:1。

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('C:/Code/codevid/node_modules/@napi-rs/canvas');

const W = 1600, H = 1200;            // 4:3
const SEED = 20261023;               // 固定种子（文章日期），复现用

const PAPER = [242, 236, 220];       // 纸色：bone/cream
const INK_A = [100, 124, 144];       // 专色一：dusty blue（调亮一档：墨-纸 WCAG ≈3.3:1，低对比）
const INK_B = [148, 120, 96];        // 专色二：muted clay

const CY = 578, HH = 95;             // 通道带：中心略高于几何中心，带高 190
const GAP_A = [660, 980];            // 专色 A 版的缺口
const GAP_B = [624, 944];            // 专色 B 版的缺口（两版对「切在哪里」各执一词）
const DISSOLVE = 150;                // 断口半调溶解长度
const REG_DX = 12, REG_DY = 0;       // 套印偏移（水平 12px ≈1.5mm @ 200mm 成稿宽；垂直归零：
                                     //   B 版既让位于 A 版，垂直偏移会让 B 沿带边整条露边）

const OUT = 'C:/Code/homepage/assets/essay-censorship-without-censor.png';

const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

// ---- 确定性随机：绘制用 mulberry32；颗粒用坐标哈希（与遍历顺序无关）----
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y, s) {
  let h = (Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 1442695041) ^ Math.imul(SEED, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const jit = (rnd, amp) => (rnd() - 0.5) * amp;

// ---- 形状：手裁毛边的墨带段 ----
function jagEdge(ctx, x, fromTop, rnd) {   // 朝缺口一侧的毛边竖边
  const n = 6;
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const y = fromTop ? CY - HH + 2 * HH * t : CY + HH - 2 * HH * t;
    ctx.lineTo(x + jit(rnd, 12), y + jit(rnd, 6));
  }
}
function bandSegment(ctx, x0, x1, rnd, jagLeft, jagRight) {
  const step = 26, amp = 3.5;
  ctx.beginPath();
  ctx.moveTo(x0, CY - HH + jit(rnd, amp));
  for (let x = x0 + step; x < x1; x += step) ctx.lineTo(x, CY - HH + jit(rnd, amp));
  if (jagRight) jagEdge(ctx, x1, true, rnd); else ctx.lineTo(x1, CY - HH + jit(rnd, amp));
  for (let x = x1 - step; x > x0; x -= step) ctx.lineTo(x, CY + HH + jit(rnd, amp));
  if (jagLeft) jagEdge(ctx, x0, false, rnd); else ctx.lineTo(x0, CY + HH + jit(rnd, amp));
  ctx.closePath();
  ctx.fill();
}
function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

function dissolve(ctx, solidX, dir, rnd) {  // 断口溶解：墨带散成半调点
  for (let c = 0; c <= DISSOLVE; c += 21) {
    const t = c / DISSOLVE;
    const cx = solidX + dir * (c + jit(rnd, 8));
    for (let y = CY - HH + 8; y <= CY + HH - 8; y += 25) {
      const dyN = Math.abs(y - CY) / HH;
      if (rnd() >= (1 - t * 0.78) * (1 - 0.4 * dyN)) continue;
      dot(ctx, cx + jit(rnd, 9), y + jit(rnd, 10), (7.2 * (1 - t) + 1.3) * (0.7 + 0.6 * rnd()));
    }
  }
}
function strays(ctx, x0, x1, rnd) {         // 漂进空缺的最后几粒墨点
  for (let i = 0; i < 8; i++) dot(ctx, x0 + (x1 - x0) * rnd(), CY + jit(rnd, HH * 1.1), 0.8 + rnd() * 1.6);
}
function drawInkLayer(ctx, gap, salt) {
  const rnd = mulberry32(SEED * 31 + salt);
  bandSegment(ctx, -24, gap[0], rnd, false, true);    // 左段（右端朝缺口，毛边）
  bandSegment(ctx, gap[1], W + 24, rnd, true, false); // 右段（左端朝缺口，毛边）
  dissolve(ctx, gap[0], +1, rnd);
  dissolve(ctx, gap[1], -1, rnd);
  strays(ctx, gap[0] + DISSOLVE, gap[0] + DISSOLVE + 140, rnd);
  strays(ctx, gap[1] - DISSOLVE - 140, gap[1] - DISSOLVE, rnd);
}

// ---- 质感 ----
function paperTexture(cv) {                 // 纸底纤维噪点
  const ctx = cv.getContext('2d');
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, n = hash2(x, y, 101);
    let dv = (n - 0.5) * 7;                 // 细微明度起伏
    if (n > 0.9965) dv -= 20;               // 深色纤维斑
    else if (n < 0.004) dv += 12;           // 亮斑
    for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, d[i + k] + dv));
  }
  ctx.putImageData(img, 0, 0);
}
function grain(cv, salt) {                  // 墨点颗粒：随机点抖动，抗锯齿边抖成颗粒边
  const ctx = cv.getContext('2d');
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, a = d[i + 3];
    if (!a) continue;
    d[i + 3] = hash2(x, y, salt) < (a / 255) * 0.9 + 0.015 ? 232 : 0;  // ~9% 露纸
  }
  ctx.putImageData(img, 0, 0);
}

// ---- 合成 ----
function makeInkShapes(ink, gap, salt) {     // 专色版形状（未颗粒；A 版兼作 B 版的让位遮罩）
  const cv = createCanvas(W, H), ctx = cv.getContext('2d');
  ctx.fillStyle = rgb(ink);
  drawInkLayer(ctx, gap, salt);
  return cv;
}
function cloneCanvas(src) {
  const cv = createCanvas(W, H);
  cv.getContext('2d').drawImage(src, 0, 0);
  return cv;
}
function subtractPlate(from, by, dx, dy) {   // 让位：by(x+dx, y+dy) 有任何覆盖处，from(x,y) 一律不印
  const bimg = by.getContext('2d').getImageData(0, 0, W, H).data;
  const fctx = from.getContext('2d');
  const img = fctx.getImageData(0, 0, W, H), d = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const bx = x + dx, byy = y + dy;
    if (bx < 0 || bx >= W || byy < 0 || byy >= H) continue;
    if (bimg[(byy * W + bx) * 4 + 3] > 0) d[(y * W + x) * 4 + 3] = 0;
  }
  fctx.putImageData(img, 0, 0);
}
function renderCover() {                    // 帧 = 纯函数（固定种子，可复现）
  const cv = createCanvas(W, H), ctx = cv.getContext('2d');
  ctx.fillStyle = rgb(PAPER);
  ctx.fillRect(0, 0, W, H);
  paperTexture(cv);
  const AShapes = makeInkShapes(INK_A, GAP_A, 1);  // 两版形状各自确定（盐不同 → 毛边/网点互不相同）
  const BShapes = makeInkShapes(INK_B, GAP_B, 2);
  const A = cloneCanvas(AShapes); grain(A, 1);     // A 版上网点（232/0 二值，~8.5% 露纸颗粒）
  const B = cloneCanvas(BShapes); grain(B, 2);     // B 版上网点
  subtractPlate(B, AShapes, REG_DX, REG_DY);       // B 版让位（按套印偏移对位）：两版互斥，一像素至多一墨
  ctx.globalCompositeOperation = 'multiply';   // 油墨只与纸底 multiply 压深；版间不叠印 → 纸底外恒两种墨色
  ctx.drawImage(A, 0, 0);
  ctx.drawImage(B, REG_DX, REG_DY);            // 套印偏移（水平）
  ctx.globalCompositeOperation = 'source-over';
  return cv;
}

// ---- 自检：双专色（纸底外油墨色族数应为 2）与低对比（各族 vs 纸底 WCAG < 6）----
function selfCheck(cv) {
  const d = cv.getContext('2d').getImageData(0, 0, W, H).data;
  const bins = new Map(), exact = new Map();
  for (let i = 0; i < W * H; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
    const ek = (r << 16) | (g << 8) | b, q = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    exact.set(ek, (exact.get(ek) || 0) + 1);
    bins.set(q, (bins.get(q) || 0) + 1);
  }
  const ctr = k => [(k >> 8) * 16 + 8, ((k >> 4) & 15) * 16 + 8, (k & 15) * 16 + 8];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const cr = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const sorted = [...bins.entries()].sort((a, b) => b[1] - a[1]);
  const paperC = ctr(sorted[0][0]);
  let paperN = 0;
  const fams = [];
  for (const [k, n] of sorted) {
    const c = ctr(k);
    if (dist(c, paperC) < 48) { paperN += n; continue; }
    let f = fams.find(f => dist(f.c, c) < 32);
    if (!f) { f = { c, n: 0, bins: new Set() }; fams.push(f); }
    f.n += n; f.bins.add(k);
  }
  for (const f of fams) {                    // 族内模色（精确色）
    let mb = 0; f.modal = f.c;
    for (const [ek, n] of exact) {
      const c = [ek >> 16, (ek >> 8) & 255, ek & 255];
      const q = ((c[0] >> 4) << 8) | ((c[1] >> 4) << 4) | (c[2] >> 4);
      if (f.bins.has(q) && n > mb) { mb = n; f.modal = c; }
    }
  }
  const majors = fams.filter(f => f.n >= 0.003 * W * H)
    .map(f => ({ pct: +(100 * f.n / (W * H)).toFixed(1), modal: f.modal, wcagVsPaper: +cr(f.modal, paperC).toFixed(2) }))
    .sort((a, b) => b.pct - a.pct);
  const ok = majors.length === 2 && majors.every(m => m.wcagVsPaper < 6);
  console.log('self-check |', ok ? 'PASS' : 'FAIL',
    '| ink families:', JSON.stringify(majors),
    '| paper share:', (100 * paperN / (W * H)).toFixed(1) + '%',
    '| exact colors:', exact.size);
}

try {
  const cv = renderCover();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, cv.encodeSync('png'));
  console.log('cover ->', OUT, '| seed', SEED, '|', `${W}x${H}`);
  selfCheck(cv);
} catch (e) { console.error(e); process.exit(1); }
