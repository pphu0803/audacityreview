// 阅读数 API
// GET  /api/view/:slug  → 返回 { views: number }
// POST /api/view/:slug  → 阅读数 +1，返回 { views: number }

export async function onRequestGet({ params, env }) {
  const slug = params.slug;
  const key = `views:${slug}`;
  const raw = await env.AR_KV.get(key);
  const views = parseInt(raw || '0', 10);
  return jsonResponse({ views });
}

export async function onRequestPost({ params, env }) {
  const slug = params.slug;
  const key = `views:${slug}`;
  const raw = await env.AR_KV.get(key);
  const views = parseInt(raw || '0', 10) + 1;
  await env.AR_KV.put(key, String(views));
  return jsonResponse({ views });
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
