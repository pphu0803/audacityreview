// essay-minefields-safety-valves.js —— 《雷区与安全阀》4:3 封面（1600×1200）
//
// 隐喻句（出自正文第三节的浓缩）：
//   「高压锅里的蒸汽——本该用于阶级政治的能量——只被允许从两道窄缝里嘶嘶泄掉；
//     发泄得越激烈，锅体越稳固。」
//
// 抽象形式（非具象，一句话可解）：
//   下方一整片密排的短线地层（受压的能量），其中埋着一块不敢触碰的实心墨块（雷区/核心议题）；
//   头顶一条近乎连续的横带（围栏/阀板）只留两道窄缝，
//   缝上方稀疏的墨点渐次消散（泄掉的蒸汽）——密度在缝口最高，越升越稀。
//
// 工艺：riso 双专色 + 纸色。Indigo（尘蓝）与 Flat Gold（褪金赭）明度相邻，
//   叠印处 multiply 出第三层深调；1–2mm 套印偏移（ink B 层错位 +9/+5px）；
//   墨点颗粒为固定种子的随机抖动（mulberry32, seed=20261018），可复现。
// 纪律：无文字、无人物、无具象物；留白过半；无渐变无光效。

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('C:/Code/codevid/node_modules/@napi-rs/canvas');

// ---------- 常量 ----------
const W = 1600, H = 1200;
const OUT = 'C:/Code/homepage/assets/essay-minefields-safety-valves.png';
const SEED = 20261018;

const PAPER = '#f2ead9';   // bone 纸色
const INK_A = '#46587f';   // riso Indigo（压暗一档的尘蓝）
const INK_B = '#b0894f';   // riso Flat Gold（褪金赭）

// ---------- 种子随机（mulberry32，可复现） ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 帧＝纯函数 ----------
function makeCover(W, H, seed) {
  const rnd = mulberry32(seed);
  const cv = createCanvas(W, H);
  const ctx = cv.getContext('2d');

  // 纸底 + 纤维（空区域里极淡的微点，固定种子）
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(120, 104, 78, 0.05)';
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * W, y = rnd() * H, r = 0.6 + rnd() * 1.2;
    ctx.fillRect(x, y, r, r);
  }

  // 几何布局（mm 感：1600px 宽按 240mm 计，1mm ≈ 6.7px）
  const ML = 170;                       // 左右边距，留白过半
  const fieldTop = H * 0.560;           // 能量地层顶
  const fieldBot = H * 0.860;           // 地层底
  const plateY = H * 0.470;             // 阀板（围栏）y
  const plateH = 26;
  const gapW = 34;                      // 两道窄缝宽（安全阀）
  const gap1X = ML + (W - 2 * ML) * 0.285;
  const gap2X = ML + (W - 2 * ML) * 0.715;

  // ===== Ink A（Indigo，正位）：受压的地层 + 埋着的雷区实心块 =====
  ctx.save();
  ctx.fillStyle = INK_A;

  // 地层：密排水平短线，行间错缝；随机抖端点＋随机缺线（≈8% 颗粒孔）
  const dashH = 7, dashGap = 16, rowH = 26;
  for (let y = fieldTop; y < fieldBot; y += rowH) {
    const jitter = (rnd() - 0.5) * rowH * 0.5;
    for (let x = ML + rnd() * dashGap; x < W - ML - dashH; x += dashH + dashGap) {
      if (rnd() < 0.08) continue;                     // 墨点颗粒孔
      const yj = y + jitter + (rnd() - 0.5) * 4;      // 手工排线抖动
      const stretch = 1 + rnd() * 0.5;
      ctx.fillRect(x + (rnd() - 0.5) * 3, yj, dashH * stretch, dashH);
    }
  }

  // 雷区：地层中央一块实心墨块（唯一的大密度，谁也不敢把线排进去）
  const coreW = 150, coreH = 96;
  const coreX = (W - coreW) / 2, coreY = (fieldTop + fieldBot) / 2 - coreH / 2;
  ctx.fillRect(coreX, coreY, coreW, coreH);
  // 实心块上的纸色刻痕（手切边的不完美）
  ctx.fillStyle = PAPER;
  for (let i = 0; i < 26; i++) {
    ctx.fillRect(coreX + rnd() * coreW, coreY + rnd() * coreH, 1 + rnd() * 2.5, 1 + rnd() * 2);
  }
  ctx.restore();

  // ===== Ink B（Flat Gold，错位 +9/+5 ≈ 1.5mm 套印偏移）=====
  // 叠印设 multiply：与地层相交处压出第三层深调
  ctx.save();
  ctx.translate(9, 5);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = INK_B;

  // 阀板：近连续横带，只留两道窄缝（安全阀）；带体微倾 0.3°，手切感
  ctx.save();
  ctx.translate(W / 2, plateY + plateH / 2);
  ctx.rotate(0.005);
  const plateL = ML - 14, plateR = W - ML + 14;
  ctx.fillRect(plateL, -plateH / 2, gap1X - plateL - gapW / 2, plateH);
  ctx.fillRect(gap1X + gapW / 2, -plateH / 2, gap2X - gap1X - gapW, plateH);
  ctx.fillRect(gap2X + gapW / 2, -plateH / 2, plateR - gap2X - gapW / 2, plateH);
  ctx.restore();

  // 泄出的蒸汽：缝口向上渐稀的墨点（halftone dissolve）
  const dissolveH = plateY - H * 0.120;               // 上升高度
  for (const gx of [gap1X, gap2X]) {
    for (let i = 0; i < 460; i++) {
      const t = rnd();                                 // 0=缝口 1=顶端
      const y = plateY - 20 - t * dissolveH;
      const pKeep = Math.pow(1 - t, 1.6) * 0.92;       // 越升越稀
      if (rnd() > pKeep) continue;
      const spread = 14 + t * 130;                     // 越升越散
      const x = gx + (rnd() + rnd() - 1) * spread;
      const r = 2.4 * (1 - t) + 1.2;
      ctx.fillRect(x, y, r, r);
    }
  }
  ctx.restore();

  // ===== 全局纸色干版粒（加强一档：riso 颗粒须肉眼可辨，不再“极轻”）=====
  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 2600; i++) {
    ctx.fillRect(rnd() * W, rnd() * H, 1.6, 1.6);
  }
  ctx.restore();

  // ===== 程序化自检（代替不可用的目检：纯像素统计）=====
  const report = verify(cv, W, H);
  console.log('[self-check]', JSON.stringify(report));
  const checks = [
    ['留白过半（纸色占比>50%）', report.paperRatio > 0.5],
    ['双专色低对比（A/B 明度差<60）', report.lumDiff < 60],
    ['无纯黑像素（不引入第三色）', report.blackPixels === 0],
    ['墨面有颗粒（干版粒生效）', report.grainSamples > 0],
  ];
  let pass = true;
  for (const [name, ok] of checks) {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
    if (!ok) pass = false;
  }
  if (!pass) { console.error('[self-check] 有项未通过'); process.exitCode = 1; }

  return cv;
}

// 明度（近似）：0..255
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
}

// 像素统计：纸色占比 / 墨色像素数 / 颗粒采样 / 纯黑检查
function verify(cv, W, H) {
  const ctx = cv.getContext('2d');
  const img = ctx.getImageData(0, 0, W, H).data;
  const pR = parseInt(PAPER.slice(1, 3), 16), pG = parseInt(PAPER.slice(3, 5), 16), pB = parseInt(PAPER.slice(5, 7), 16);
  const near = (i, r, g, b, tol) => Math.abs(img[i] - r) <= tol && Math.abs(img[i + 1] - g) <= tol && Math.abs(img[i + 2] - b) <= tol;
  let paper = 0, black = 0, grain = 0;
  const step = 4 * 7;                                   // 抽样步长，足够代表
  for (let i = 0; i < img.length; i += step) {
    if (near(i, pR, pG, pB, 14)) paper++;
    if (img[i] < 30 && img[i + 1] < 30 && img[i + 2] < 30) black++;
    // 颗粒：纸色区域内比纸色略深的孤立微调（干版粒/纤维微点）
    if (near(i, pR, pG, pB, 0) === false && near(i, pR, pG, pB, 14) && !near(i, pR, pG, pB, 2)) grain++;
  }
  const sampled = Math.ceil(img.length / step);
  const lumDiff = Math.abs(lum(INK_A) - lum(INK_B));
  return { paperRatio: +(paper / sampled).toFixed(4), lumDiff: +lumDiff.toFixed(1), blackPixels: black, grainSamples: grain, sampled };
}

// ---------- 出图 ----------
const canvas = makeCover(W, H, SEED);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, canvas.encodeSync('png'));
console.log('cover ->', OUT, `(${W}x${H}, seed=${SEED})`);
