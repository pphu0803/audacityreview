// 订阅 API
// POST /api/subscribe  body: { email: "xxx@xxx.com" }
//   → 存入 KV，返回 { ok: true }
// GET /api/subscribers  （仅列出邮箱数量，不含地址，用于展示）
//   → 返回 { count: number }

export async function onRequestPost({ request, env }) {
  let email;
  try {
    const body = await request.json();
    email = body.email;
  } catch {
    return jsonResponse({ ok: false, error: '无效请求' }, 400);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: '邮箱格式不正确' }, 400);
  }

  email = email.toLowerCase().trim();
  const key = `sub:${email}`;

  // 已存在则不重复
  const existing = await env.AR_KV.get(key);
  if (existing) {
    return jsonResponse({ ok: true, duplicate: true });
  }

  await env.AR_KV.put(key, JSON.stringify({ email, date: new Date().toISOString() }));

  // 计数器 +1
  const countRaw = await env.AR_KV.get('sub:count');
  const count = parseInt(countRaw || '0', 10) + 1;
  await env.AR_KV.put('sub:count', String(count));

  return jsonResponse({ ok: true });
}

export async function onRequestGet({ env }) {
  const countRaw = await env.AR_KV.get('sub:count');
  const count = parseInt(countRaw || '0', 10);
  return jsonResponse({ count });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
