const B = import.meta.env.VITE_API_URL || '/api';
export const api = async (p, o = {}) => {
  const t = localStorage.getItem('t');
  const r = await fetch(B + p, { ...o, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: o.body && JSON.stringify(o.body) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Something went wrong'); return d;
};
