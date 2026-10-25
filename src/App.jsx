import { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from './api.js';
import { Login, Setup, Dashboard, Employees, Attendance, Leave, Payroll, Assistant, Audit, ChangePassword } from './pages.jsx';

const Ctx = createContext(); export const useAuth = () => useContext(Ctx);

function Layout() {
  const { user, setUser } = useAuth(), nav = useNavigate(), r = user.role;
  const links = [['/', 'Dashboard'], ...(r !== 'employee' ? [['/employees', 'Employees']] : []), ['/attendance', 'Attendance'], ['/leave', 'Leave'], ['/payroll', 'Payroll'], ['/assistant', 'AI Assistant'], ...(r === 'admin' ? [['/audit', 'Audit log']] : [])];
  if (user.mustChange) return <ChangePassword />;
  return (
    <div className="min-h-screen md:flex bg-stone-50 text-slate-800">
      <aside className="md:w-56 bg-slate-900 text-slate-200 p-4 flex md:flex-col gap-1 overflow-x-auto">
        <div className="font-bold text-lg text-teal-300 mb-2 whitespace-nowrap">HCM Lite</div>
        {links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `px-3 py-2 rounded whitespace-nowrap ${isActive ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'}`}>{t}</NavLink>)}
        <div className="md:mt-auto text-sm px-3 whitespace-nowrap">{user.name} · {r}
          <button className="ml-2 underline" onClick={() => { localStorage.removeItem('t'); setUser(null); nav('/login'); }}>Log out</button></div>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-5xl"><Outlet /></main>
    </div>);
}

export default function App() {
  const [user, setUser] = useState(undefined), [setup, setSetup] = useState(false);
  useEffect(() => { api('/auth/status').then(d => setSetup(d.needsSetup)).catch(() => {});
    localStorage.getItem('t') ? api('/auth/me').then(d => setUser(d.user)).catch(() => setUser(null)) : setUser(null); }, []);
  if (user === undefined) return <p className="p-8">Loading…</p>;
  return (
    <Ctx.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setup={setup} />} />
        <Route path="/setup" element={user ? <Navigate to="/" /> : <Setup />} />
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} /><Route path="employees" element={<Employees />} /><Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} /><Route path="payroll" element={<Payroll />} /><Route path="assistant" element={<Assistant />} /><Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </Ctx.Provider>);
}
