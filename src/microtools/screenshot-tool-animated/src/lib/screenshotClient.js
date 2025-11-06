// Build ScreenshotMachine URL using your key + fixed dimension.
export function buildScreenshotUrl({ url, format = 'png' }) {
  const normalized = normalizeUrl(url);
  if (!normalized) throw new Error('Invalid URL');

  const key = '74c587'; // your API key
  const base = 'https://api.screenshotmachine.com';
  const params = new URLSearchParams({
    key,
    url: normalized,
    dimension: '1024x768',
    format,
    cacheLimit: '0'
  });
  return `${base}?${params.toString()}`;
}

export function normalizeUrl(input) {
  try {
    let u = String(input || '').trim();
    if (!u) return null;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    const parsed = new URL(u);
    return parsed.href;
  } catch {
    return null;
  }
}
