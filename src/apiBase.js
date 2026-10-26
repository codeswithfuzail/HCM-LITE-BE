export function normalizeApiBase(value) {
  const raw = (value || '').trim();
  if (!raw) return 'http://localhost:4000/api';
  const absolute = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const normalized = absolute.replace(/\/+$/, '');
  return /\/api$/i.test(normalized) ? normalized : `${normalized}/api`;
}
