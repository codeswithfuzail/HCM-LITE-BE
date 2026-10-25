import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from './api.js'; import { useAuth } from './App.jsx';

const inp = 'border border-slate-300 rounded px-3 py-2 w-full bg-white';
const btn = 'bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2 disabled:opacity-50';
const Card = ({ children, className = '' }) => <div className={`bg-white border border-slate-200 rounded-lg p-4 ${className}`}>{children}</div>;
const Kpi = ({ label, value }) => <Card><div className="text-3xl font-semibold text-teal-700">{value ?? '–'}</div><div className="text-sm text-slate-500">{label}</div></Card>;
const Err = ({ e }) => e ? <p className="text-red-600 text-sm my-2">{e}</p> : null;
const Empty = ({ t }) => <p className="text-slate-500 py-6 text-center">{t}</p>;
const H = ({ children }) => <h1 className="text-2xl font-semibold mb-4">{children}</h1>;
const Table = ({ head, rows, empty }) => rows.length ? <div className="overflow-x-auto"><table className="w-full text-sm bg-white border border-slate-200 rounded">
  <thead className="bg-slate-100 text-left"><tr>{head.map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead>
  <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-slate-100">{r.map((c, j) => <td key={j} className="p-2">{c}</td>)}</tr>)}</tbody></table></div> : <Empty t={empty} />;
const useLoad = (path) => { const [d, setD] = useState(null), [e, setE] = useState(''); const load = () => api(path).then(setD).catch(x => setE(x.message)); useEffect(() => { load(); }, [path]); return [d, load, e]; };
const useForm = (init) => { const [f, setF] = useState(init); return [f, (k) => (ev) => setF({ ...f, [k]: ev.target.value }), setF]; };

function AuthShell({ title, children }) {
  return <div className="min-h-screen grid md:grid-cols-2">
    <div className="bg-slate-900 text-white p-10 flex flex-col justify-center"><h1 className="text-5xl font-bold text-teal-300">HCM Lite</h1>
      <p className="mt-4 text-slate-300 max-w-sm">Attendance, leave and payroll in one place, with an assistant that answers from your real data.</p></div>
    <div className="p-8 flex items-center justify-center"><div className="w-full max-w-sm space-y-3"><h2 className="text-2xl font-semibold">{title}</h2>{children}</div></div></div>;
}
export function Login({ setup }) {
  const { setUser } = useAuth(), [f, set] = useForm({ email: '', password: '' }), [e, setE] = useState('');
  const go = async (ev) => { ev.preventDefault(); try { const d = await api('/auth/login', { method: 'POST', body: f }); localStorage.setItem('t', d.token); setUser(d.user); } catch (x) { setE(x.message); } };
  return <AuthShell title="Log in"><form onSubmit={go} className="space-y-3"><input className={inp} placeholder="Email" type="email" value={f.email} onChange={set('email')} required />
    <input className={inp} placeholder="Password" type="password" value={f.password} onChange={set('password')} required /><Err e={e} /><button className={btn + ' w-full'}>Log in</button></form>
    {setup && <p className="text-sm">First time here? <Link className="text-teal-700 underline" to="/setup">Set up your company</Link></p>}</AuthShell>;
}
export function Setup() {
  const { setUser } = useAuth(), nav = useNavigate(), [f, set] = useForm({ company: '', name: '', email: '', password: '' }), [e, setE] = useState('');
  const go = async (ev) => { ev.preventDefault(); try { const d = await api('/auth/setup', { method: 'POST', body: f }); localStorage.setItem('t', d.token); setUser(d.user); nav('/'); } catch (x) { setE(x.message); } };
  return <AuthShell title="Set up company"><form onSubmit={go} className="space-y-3">
    {[['company', 'Company name'], ['name', 'Admin name'], ['email', 'Admin email'], ['password', 'Password (min 6)']].map(([k, p]) => <input key={k} className={inp} placeholder={p} type={k === 'password' ? 'password' : 'text'} value={f[k]} onChange={set(k)} required />)}
    <Err e={e} /><button className={btn + ' w-full'}>Create admin account</button></form><Link className="text-sm underline" to="/login">Back to login</Link></AuthShell>;
}
export function ChangePassword() {
  const { setUser } = useAuth(), [p, setP] = useState(''), [e, setE] = useState('');
  return <AuthShell title="Set a new password"><p className="text-sm text-slate-600">You signed in with a temporary password. Choose your own to continue.</p>
    <input className={inp} type="password" placeholder="New password" value={p} onChange={x => setP(x.target.value)} /><Err e={e} />
    <button className={btn + ' w-full'} onClick={() => api('/auth/change-password', { method: 'POST', body: { password: p } }).then(d => setUser(d.user)).catch(x => setE(x.message))}>Save password</button></AuthShell>;
}

export function Dashboard() {
  const { user } = useAuth(), [d, , e] = useLoad('/dashboard'), [sum, setSum] = useState(''), [a, , ] = [null];
  const act = (p) => api(p, { method: 'POST' }).then(() => location.reload()).catch(x => alert(x.message));
  if (!d) return <Err e={e} /> || <p>Loading…</p>;
  if (user.role === 'employee') return <><H>Hello, {user.name}</H><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
    <Kpi label="Days present this month" value={d.present} /><Kpi label="Late this month" value={d.late} />
    <Kpi label="Casual left" value={d.balance.casual.quota - d.balance.casual.used} /><Kpi label="Sick left" value={d.balance.sick.quota - d.balance.sick.used} /></div>
    <Card><p className="mb-2">Today: {d.today ? `${d.today.status}${d.today.checkOut ? ' · checked out' : ''}` : 'not checked in'}</p>
      <button className={btn + ' mr-2'} disabled={!!d.today} onClick={() => act('/attendance/checkin')}>Check in</button>
      <button className={btn} disabled={!d.today || !!d.today?.checkOut} onClick={() => act('/attendance/checkout')}>Check out</button></Card></>;
  return <><H>{user.role === 'admin' ? 'Company' : 'HR'} dashboard</H><div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
    <Kpi label="Headcount" value={d.headcount} /><Kpi label="Present today" value={d.present} /><Kpi label="On leave" value={d.onLeave} /><Kpi label="Late today" value={d.late} /><Kpi label="Pending leave" value={d.pending} /></div>
    <Card className="mb-4"><h3 className="font-semibold mb-2">Headcount by department</h3><Table head={['Department', 'People', 'Avg gross']} empty="No employees yet" rows={d.byDept.map(x => [x._id || '—', x.n, Math.round(x.avgGross)])} /></Card>
    <Card><button className={btn} onClick={() => api('/ai/summary', { method: 'POST', body: { kpis: d } }).then(r => setSum(r.answer))}>Summarize with AI</button>
      {sum && <><p className="mt-3 whitespace-pre-wrap">{sum}</p><p className="text-xs text-slate-400 mt-1">AI-generated</p></>}</Card></>;
}

export function Employees() {
  const { user } = useAuth(), [q, setQ] = useState(''), [list, load, e] = useLoad('/employees?q=' + q), [f, set, setF] = useForm({ name: '', email: '', dept: '', designation: '', basic: '', phone: '', password: '' }), [err, setErr] = useState('');
  const [hr, setHr] = useForm({ name: '', email: '', password: '' }); const [hf, hset, setHf] = [hr, setHr, null];
  const add = async (ev) => { ev.preventDefault(); try { await api('/employees', { method: 'POST', body: { ...f, basic: +f.basic } }); setF({ name: '', email: '', dept: '', designation: '', basic: '', phone: '', password: '' }); setErr(''); load(); } catch (x) { setErr(x.message); } };
  return <><H>Employees</H>
    {user.role === 'hr' && <Card className="mb-4"><form onSubmit={add} className="grid md:grid-cols-3 gap-2">
      {[['name', 'Name'], ['email', 'Email'], ['dept', 'Department'], ['designation', 'Designation'], ['basic', 'Basic salary'], ['password', 'Temporary password']].map(([k, p]) => <input key={k} className={inp} placeholder={p} value={f[k]} onChange={set(k)} required={k !== 'dept' && k !== 'designation'} />)}
      <button className={btn}>Register employee</button></form><Err e={err} /></Card>}
    {user.role === 'admin' && <Card className="mb-4"><p className="font-medium mb-2">Create HR login</p><form className="grid md:grid-cols-4 gap-2" onSubmit={async (ev) => { ev.preventDefault(); try { await api('/hr', { method: 'POST', body: hr }); alert('HR created'); load(); } catch (x) { alert(x.message); } }}>
      {['name', 'email', 'password'].map(k => <input key={k} className={inp} placeholder={k} value={hr[k]} onChange={setHr(k)} required />)}<button className={btn}>Create</button></form></Card>}
    <input className={inp + ' mb-3'} placeholder="Search name, email or department" value={q} onChange={x => setQ(x.target.value)} /><Err e={e} />
    <Table head={['Name', 'Email', 'Role', 'Dept', 'Basic', 'Status', '']} empty="No employees yet. Register the first one above." rows={(list || []).map(u => [u.name, u.email, u.role, u.dept || '—', user.role === 'hr' || user.role === 'admin' ? u.basic : '', u.active ? 'Active' : 'Inactive',
      user.role === 'admin' ? <button className="underline" onClick={() => api('/employees/' + u._id, { method: 'PATCH', body: { active: !u.active } }).then(load)}>{u.active ? 'Deactivate' : 'Activate'}</button> : ''])} /></>;
}

export function Attendance() {
  const [rows, , e] = useLoad('/attendance'), t = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
  return <><H>Attendance</H><Err e={e} /><Table head={['Date', 'Employee', 'In', 'Out', 'Status']} empty="No attendance records yet. Check in from the dashboard." rows={(rows || []).map(r => [r.date, r.user?.name, t(r.checkIn), t(r.checkOut), r.status])} /></>;
}

export function Leave() {
  const { user } = useAuth(), [rows, load, e] = useLoad('/leave'), [f, set, setF] = useForm({ type: 'casual', start: '', end: '', reason: '' }), [text, setText] = useState(''), [err, setErr] = useState('');
  const smart = () => api('/ai/leave', { method: 'POST', body: { text } }).then(j => { setF({ type: j.type, start: j.start, end: j.end, reason: j.reason || '' }); setErr(''); }).catch(x => setErr(x.message));
  const submit = async (ev) => { ev.preventDefault(); try { await api('/leave', { method: 'POST', body: f }); setErr(''); load(); } catch (x) { setErr(x.message); } };
  const decide = (id, status) => api('/leave/' + id, { method: 'PATCH', body: { status, comment: status === 'rejected' ? prompt('Reason?') : '' } }).then(load).catch(x => alert(x.message));
  return <><H>Leave</H>
    {user.role !== 'admin' && <Card className="mb-4 space-y-2"><div className="flex gap-2"><input className={inp} placeholder='e.g. "Need next Monday and Tuesday off for a wedding"' value={text} onChange={x => setText(x.target.value)} /><button className={btn} onClick={smart}>Fill with AI</button></div>
      <form onSubmit={submit} className="grid md:grid-cols-5 gap-2"><select className={inp} value={f.type} onChange={set('type')}>{['annual', 'sick', 'casual', 'unpaid'].map(t => <option key={t}>{t}</option>)}</select>
        <input className={inp} type="date" value={f.start} onChange={set('start')} required /><input className={inp} type="date" value={f.end} onChange={set('end')} required />
        <input className={inp} placeholder="Reason" value={f.reason} onChange={set('reason')} /><button className={btn}>Apply</button></form><Err e={err} /></Card>}
    <Err e={e} /><Table head={['Employee', 'Type', 'From', 'To', 'Days', 'Status', '']} empty="No leave requests yet." rows={(rows || []).map(l => [l.user?.name, l.type, l.start, l.end, l.days, l.status + (l.comment ? ` (${l.comment})` : ''),
      user.role === 'hr' && l.status === 'pending' ? <span className="space-x-2"><button className="underline text-teal-700" onClick={() => decide(l._id, 'approved')}>Approve</button><button className="underline text-red-600" onClick={() => decide(l._id, 'rejected')}>Reject</button></span>
        : l.status === 'pending' && user.role === 'employee' ? <button className="underline" onClick={() => api('/leave/' + l._id, { method: 'DELETE' }).then(load)}>Cancel</button> : ''])} /></>;
}

export function Payroll() {
  const { user } = useAuth(), [ps, load, e] = useLoad('/payroll'), [m, setM] = useState(new Date().toISOString().slice(0, 7));
  const run = () => api('/payroll/run', { method: 'POST', body: { month: m } }).then(load).catch(x => alert(x.message));
  const fin = (mo) => api(`/payroll/${mo}/finalize`, { method: 'POST' }).then(load).catch(x => alert(x.message));
  return <><H>Payroll</H>
    {user.role === 'hr' && <Card className="mb-4 flex gap-2"><input className={inp} type="month" value={m} onChange={x => setM(x.target.value)} /><button className={btn} onClick={run}>Create / refresh draft</button></Card>}
    <Err e={e} />{(ps || []).length === 0 && <Empty t="No payroll yet." />}
    {(ps || []).map(p => <Card key={p.month} className="mb-4"><div className="flex justify-between mb-2"><b>{p.month} {p.finalized ? '· finalized' : p.finalized === false ? '· draft' : ''}</b>
      {user.role === 'admin' && !p.finalized && <button className={btn} onClick={() => fin(p.month)}>Finalize</button>}
      <button className="underline text-sm" onClick={() => window.print()}>Print / PDF</button></div>
      <Table head={['Employee', 'Gross', 'Deductions', 'Tax', 'Net']} empty="No rows" rows={p.rows.map(r => [r.name, r.gross, r.deductions, r.tax, r.net])} /></Card>)}</>;
}

export function Assistant() {
  const [msgs, setMsgs] = useState([]), [t, setT] = useState(''), [busy, setBusy] = useState(false);
  const send = async () => { if (!t.trim()) return; const q = t; setT(''); setBusy(true); setMsgs(m => [...m, { r: 'u', t: q }]);
    try { const d = await api('/ai/chat', { method: 'POST', body: { message: q } }); setMsgs(m => [...m, { r: 'a', t: d.answer }]); } catch (x) { setMsgs(m => [...m, { r: 'a', t: x.message }]); } setBusy(false); };
  return <><H>AI Assistant</H><Card className="min-h-80 space-y-3 mb-3">{msgs.length === 0 && <Empty t='Try: "Who is on leave today?" or "How many sick leaves do I have left?"' />}
    {msgs.map((m, i) => <div key={i} className={m.r === 'u' ? 'text-right' : ''}><span className={`inline-block rounded px-3 py-2 max-w-[85%] text-left whitespace-pre-wrap ${m.r === 'u' ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>{m.t}</span>
      {m.r === 'a' && <div className="text-xs text-slate-400">AI-generated</div>}</div>)}{busy && <p className="text-slate-400">Thinking…</p>}</Card>
    <div className="flex gap-2"><input className={inp} value={t} onChange={x => setT(x.target.value)} onKeyDown={x => x.key === 'Enter' && send()} placeholder="Ask anything about your HR data" /><button className={btn} onClick={send} disabled={busy}>Send</button></div></>;
}

export function Audit() {
  const [rows, , e] = useLoad('/audit');
  return <><H>Audit log</H><Err e={e} /><Table head={['When', 'Actor', 'Action', 'Entity', 'Detail']} empty="No actions logged yet." rows={(rows || []).map(a => [new Date(a.createdAt).toLocaleString(), a.actor, a.action, a.entity, JSON.stringify(a.detail)])} /></>;
}
