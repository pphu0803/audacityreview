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

    // 只拦截 /api/ 开头的请求
    if (url.pathname.startsWith('/api/')) {
      try {
        const result = await handleApi(request, env, url);
        if (result) return result;
      } catch (err) {
        return json({ error: '服务器错误' }, 500);
      }
    }

    // 其余请求交给静态资源处理
    return env.ASSETS.fetch(request);
  },
};
