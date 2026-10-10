// Cloudflare Worker: serves the built site and the shared content API.
// Content is stored in a Workers KV namespace bound as CONTENT, so every device reads the same data.
//
// Bindings and secrets:
//   CONTENT          KV namespace binding (see wrangler.jsonc)
//   STUDIO_PASSCODE  secret: the passcode for the Studio editor

const KEY = 'portfolio-content';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function getContent(env) {
  const data = await env.CONTENT.get(KEY, 'json');
  return json(data ?? {});
}

async function saveContent(request, env) {
  if (!env.STUDIO_PASSCODE || request.headers.get('X-Studio-Passcode') !== env.STUDIO_PASSCODE) {
    return json({ error: 'Wrong passcode' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Expected JSON' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Expected a JSON object' }, 400);
  }
  await env.CONTENT.put(KEY, JSON.stringify(body));
  return json({ ok: true });
}

// /api/health: one-step check that the storage and passcode are set up.
async function health(env) {
  const missing = [];
  if (!env.CONTENT) missing.push('CONTENT (KV namespace in wrangler.jsonc)');
  if (!env.STUDIO_PASSCODE) missing.push('STUDIO_PASSCODE (secret)');
  if (missing.length) return json({ configured: false, missing });
  try {
    await env.CONTENT.get(KEY);
    await env.CONTENT.put('health-check', new Date().toISOString());
    return json({ configured: true, canRead: true, canWrite: true, hint: 'All good: the Studio can save.' });
  } catch (e) {
    return json({ configured: true, canRead: false, canWrite: false, detail: String(e && e.message ? e.message : e) }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/health') return await health(env);
      if (url.pathname === '/api/content') {
        if (request.method === 'GET') return await getContent(env);
        if (request.method === 'PUT') return await saveContent(request, env);
        return json({ error: 'Method not allowed' }, 405);
      }
    } catch (e) {
      return json({ error: 'Server error', detail: String(e && e.message ? e.message : e) }, 500);
    }
    // Everything else is the website itself.
    return env.ASSETS.fetch(request);
  },
};
