// essay-symbolic-luddism.js —— 《符号卢德主义》4:3 封面（1600×1200）
//
// 隐喻句（文章一句话核心）：
//   "符号是砸不到机器的——把铁锤换成合同条款的卢德主义，
//    只是一次没有物理效力的表态；机器照转，禁令只落在自己身上。"
//
// 抽象形式：
//   左侧一记下坠的厚重楔形墨块（锤的势能），在触及右侧一排纹丝不动的
//   细密竖线阵列（照转的机器/训练管线）之前，溶解成散落的半调墨点
//   （表态化为符号、消散于空气）；竖线阵列毫发无损，余下过半留白。
//
// 规范：riso 双专色（尘蓝 dusty blue + 褪赭 faded ochre，明度相邻）+ 米色纸；
//   墨点颗粒（固定种子随机抖动）；1–2mm 套印偏移（~8px @1600px 宽）；
//   叠印出第三色；无文字、无人物、非具象；留白过半。
// 出图：C:/Code/homepage/assets/essay-symbolic-luddism.png
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('C:/Code/codevid/node_modules/@napi-rs/canvas');

const W = 1600, H = 1200;              // 4:3
const SEED = 20261018;                 // 固定种子，可复现
const OUT = 'C:/Code/homepage/assets/essay-symbolic-luddism.png';

// ---- riso 专色（相邻明度，低对比）----
const PAPER = '#f2ecdd';               // 米色纸
const INK_A = '#5d7291';               // 尘蓝 dusty blue
const INK_B = '#b98d5f';               // 褪赭 faded ochre

// ---- 种子随机（mulberry32）----
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEED);

// 手切感多边形：顶点微抖
function roughPoly(ctx, pts, jitter) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    const jx = (rnd() - 0.5) * jitter, jy = (rnd() - 0.5) * jitter;
    if (i === 0) ctx.moveTo(p[0] + jx, p[1] + jy);
    else ctx.lineTo(p[0] + jx, p[1] + jy);
  });
  ctx.closePath();
  ctx.fill();
}

// 墨点颗粒：在一批点坐标上撒随机大小/位置的圆点
function grain(ctx, pts, color, rMin, rMax, alpha) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (const [x, y] of pts) {
    const r = rMin + rnd() * (rMax - rMin);
    const jx = (rnd() - 0.5) * r * 3, jy = (rnd() - 0.5) * r * 3;
    ctx.beginPath();
    ctx.arc(x + jx, y + jy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---- 帧绘制（纯函数式：同种子同输出）----
function draw(ctx, offX, offY) {
  const MISO = { dx: offX, dy: offY };   // 套印偏移量

  // ① 机器阵列（尘蓝）：右侧一列细密竖线，纹丝不动 —— 先画，被叠印后仍完整
  const linesX0 = W * 0.60, linesX1 = W * 0.94;
  const nLines = 26;
  ctx.fillStyle = INK_A;
  ctx.globalAlpha = 0.85;
  for (let i = 0; i < nLines; i++) {
    const x = linesX0 + ((linesX1 - linesX0) * i) / (nLines - 1);
    const top = H * 0.18 + Math.sin(i * 1.7) * H * 0.03;   // 手工感的轻微起伏
    const bot = H * 0.82 + Math.cos(i * 1.3) * H * 0.03;
    ctx.fillRect(x, top, 7, bot - top);
  }
  ctx.globalAlpha = 1;

  // ② 下坠楔形墨块（褪赭，主形）：从左上坠向右下，止于阵列之前
  //    顶点粗略勾出：一个钝重的斜切矩形，右缘参差（力量已散）
  ctx.save();
  ctx.translate(MISO.dx, MISO.dy);
  ctx.fillStyle = INK_B;
  ctx.globalAlpha = 0.9;
  roughPoly(ctx, [
    [W * 0.10, H * 0.24],
    [W * 0.50, H * 0.34],
    [W * 0.55, H * 0.52],
    [W * 0.50, H * 0.66],
    [W * 0.13, H * 0.58],
  ], 9);
  // 内部一道手切裂口（锤与柄之间那道缝的抽象）：用纸色划开
  ctx.fillStyle = PAPER;
  roughPoly(ctx, [
    [W * 0.22, H * 0.30],
    [W * 0.30, H * 0.33],
    [W * 0.34, H * 0.58],
    [W * 0.25, H * 0.55],
  ], 6);
  ctx.restore();
  ctx.globalAlpha = 1;

  // ③ 半调溶解（双专色混撒）：楔块右缘与阵列之间的过渡带，密度向右递减
  const dissolvePts = [];
  const bandX0 = W * 0.46, bandX1 = W * 0.60;
  for (let i = 0; i < 900; i++) {
    const t = rnd();                          // 密度向右衰减：靠近楔块密，靠近阵列疏
    const x = bandX0 + (bandX1 - bandX0) * Math.pow(t, 0.55);
    const y = H * (0.30 + rnd() * 0.42) + Math.sin(x * 0.02) * H * 0.02;
    dissolvePts.push([x, y]);
  }
  // 偏移 + 少量点：赭（楔块的余烬）
  ctx.save();
  ctx.translate(MISO.dx * 0.6, MISO.dy * 0.6);
  grain(ctx, dissolvePts.slice(0, 600), INK_B, 2.5, 7, 0.55);
  ctx.restore();
  // 主层：尘蓝细点（像被阵列弹开的灰）
  grain(ctx, dissolvePts.slice(300), INK_A, 1.5, 4.5, 0.5);

  // ④ 两枚落点墨点（锤落之地，仅回声）：阵列右下角外侧两粒大点
  ctx.fillStyle = INK_B;
  ctx.globalAlpha = 0.8;
  ctx.beginPath(); ctx.arc(W * 0.57 + MISO.dx, H * 0.88 + MISO.dy, 11, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.arc(W * 0.615 + MISO.dx, H * 0.905 + MISO.dy, 6, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

// ---- 主流程 ----
const cv = createCanvas(W, H);
const ctx = cv.getContext('2d');

// 纸色底 + 纸纤维颗粒（细微、全幅）
ctx.fillStyle = PAPER;
ctx.fillRect(0, 0, W, H);
const fiber = [];
for (let i = 0; i < 2600; i++) fiber.push([rnd() * W, rnd() * H]);
grain(ctx, fiber, '#ded5bf', 0.5, 1.4, 0.5);

// 第一遍：主套印层（multiply 模拟 riso 叠印）
ctx.globalCompositeOperation = 'multiply';
draw(ctx, 0, 0);
// 第二遍：错位回声层（1–2mm ≈ 7px @1600px），半透明、multiply 出第三色
ctx.globalAlpha = 0.32;
draw(ctx, 7, 5);
ctx.globalAlpha = 1;
ctx.globalCompositeOperation = 'source-over';

// 全幅极轻噪点（riso 颗粒感收尾）
const noise = [];
for (let i = 0; i < 4200; i++) noise.push([rnd() * W, rnd() * H]);
grain(ctx, noise, '#8a8574', 0.4, 1.1, 0.14);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, cv.encodeSync('png'));
console.log('cover ->', OUT, `(${W}x${H}, seed ${SEED})`);
