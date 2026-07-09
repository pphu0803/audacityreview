// 点赞 API
// GET  /api/like/:slug  → 返回 { likes: number }
// POST /api/like/:slug  → 点赞 +1，返回 { likes: number }
//   防重复：前端用 localStorage 记住已点赞；后端按 IP+slug 做软去重（24h 内同 IP 重复请求不计数）

export async function onRequestGet({ params, env }) {
  const slug = params.slug;
  const raw = await env.AR_KV.get(`likes:${slug}`);
  const likes = parseInt(raw || '0', 10);
  return jsonResponse({ likes });
}

export async function onRequestPost({ params, env, request }) {
  const slug = params.slug;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const dedupKey = `liked:${slug}:${ip}`;

  // 24h 内同 IP 重复点赞不计数
  const already = await env.AR_KV.get(dedupKey);
  if (already) {
    const raw = await env.AR_KV.get(`likes:${slug}`);
    return jsonResponse({ likes: parseInt(raw || '0', 10), duplicate: true });
  }

  const raw = await env.AR_KV.get(`likes:${slug}`);
  const likes = parseInt(raw || '0', 10) + 1;
  await env.AR_KV.put(`likes:${slug}`, String(likes));
  await env.AR_KV.put(dedupKey, '1', { expirationTtl: 86400 }); // 24h 过期
  return jsonResponse({ likes });
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
