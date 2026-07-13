/**
 * AUDACITY REVIEW — Worker 入口
 *
 * 静态文件（HTML/CSS/图片）由 Workers 的 assets 托管自动处理。
 * 这个 Worker 只处理 /api/* 路由，其余请求 fallthrough 到静态资源。
 *
 * KV 绑定：env.AR_KV
 */

export interface Env {
  AR_KV: KVNamespace;
  ASSETS: Fetcher;
}

// —— 工具函数 ——
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// 资源文件后缀：这些请求走 CDN 缓存，计入 PV 会严重虚高，日志里跳过。
// 只记录 HTML 页面浏览（/, /page/N/, /posts/..., /about.html 等）。
const ASSET_EXT = /\.(css|js|mjs|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|json|xml|txt|webmanifest|map)$/i;

// 结构化访问日志：字段交给 Workers Logs 存储后在 Query Builder 里聚合。
//   path     — PV 按 path 分组
//   ip       — UV 按 ip 做 count(distinct)
//   country  — 国家分布
function logAccess(request: Request, status: number, ms: number): void {
  const url = new URL(request.url);
  if (ASSET_EXT.test(url.pathname)) return;   // 跳过静态资源
  const cf = (request as Request & { cf?: Record<string, unknown> }).cf;
  console.log(JSON.stringify({
    t: 'view',                                 // 事件类型，便于查询时过滤
    method: request.method,
    path: url.pathname,
    status,
    ms,
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: (cf?.country as string) || '',
    city: (cf?.city as string) || '',
    ua: request.headers.get('User-Agent') || '',
  }));
}

// —— API 路由处理 ——
async function handleApi(request: Request, env: Env, url: URL): Promise<Response | null> {
  const path = url.pathname;

  // /api/view/:slug
  let m = /^\/api\/view\/([^/]+)$/.exec(path);
  if (m) {
    const slug = m[1];
    if (request.method === 'GET') {
      const raw = await env.AR_KV.get(`views:${slug}`);
      return json({ views: parseInt(raw || '0', 10) });
    }
    if (request.method === 'POST') {
      const raw = await env.AR_KV.get(`views:${slug}`);
      const views = parseInt(raw || '0', 10) + 1;
      await env.AR_KV.put(`views:${slug}`, String(views));
      return json({ views });
    }
  }

  // /api/like/:slug
  m = /^\/api\/like\/([^/]+)$/.exec(path);
  if (m) {
    const slug = m[1];
    if (request.method === 'GET') {
      const raw = await env.AR_KV.get(`likes:${slug}`);
      return json({ likes: parseInt(raw || '0', 10) });
    }
    if (request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const dedupKey = `liked:${slug}:${ip}`;
      const already = await env.AR_KV.get(dedupKey);
      if (already) {
        const raw = await env.AR_KV.get(`likes:${slug}`);
        return json({ likes: parseInt(raw || '0', 10), duplicate: true });
      }
      const raw = await env.AR_KV.get(`likes:${slug}`);
      const likes = parseInt(raw || '0', 10) + 1;
      await env.AR_KV.put(`likes:${slug}`, String(likes));
      await env.AR_KV.put(dedupKey, '1', { expirationTtl: 86400 });
      console.log(JSON.stringify({ t: 'like_new', slug, likes }));
      return json({ likes });
    }
  }

  // /api/subscribe
  if (path === '/api/subscribe') {
    if (request.method === 'POST') {
      let email: string;
      try {
        const body = await request.json() as { email?: string };
        email = body.email || '';
      } catch {
        return json({ ok: false, error: '无效请求' }, 400);
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ ok: false, error: '邮箱格式不正确' }, 400);
      }
      email = email.toLowerCase().trim();
      const key = `sub:${email}`;
      const existing = await env.AR_KV.get(key);
      if (existing) return json({ ok: true, duplicate: true });
      await env.AR_KV.put(key, JSON.stringify({ email, date: new Date().toISOString() }));
      const countRaw = await env.AR_KV.get('sub:count');
      const count = parseInt(countRaw || '0', 10) + 1;
      await env.AR_KV.put('sub:count', String(count));
      console.log(JSON.stringify({ t: 'sub_new', email, count }));
      return json({ ok: true });
    }
    if (request.method === 'GET') {
      const countRaw = await env.AR_KV.get('sub:count');
      return json({ count: parseInt(countRaw || '0', 10) });
    }
  }

  // 不是 API 路由
  return null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const start = Date.now();

    // 只拦截 /api/ 开头的请求
    if (url.pathname.startsWith('/api/')) {
      try {
        const result = await handleApi(request, env, url);
        if (result) {
          ctx.waitUntil(Promise.resolve().then(() =>
            logAccess(request, result.status, Date.now() - start)));
          return result;
        }
      } catch (err) {
        console.error(JSON.stringify({
          t: 'api_error', path: url.pathname,
          err: err instanceof Error ? err.stack : String(err),
        }));
        ctx.waitUntil(Promise.resolve().then(() =>
          logAccess(request, 500, Date.now() - start)));
        return json({ error: '服务器错误' }, 500);
      }
    }

    // 其余请求交给静态资源处理；记录页面浏览（PV/UV/国家）
    const res = await env.ASSETS.fetch(request);
    ctx.waitUntil(Promise.resolve().then(() =>
      logAccess(request, res.status, Date.now() - start)));
    return res;
  },
};
