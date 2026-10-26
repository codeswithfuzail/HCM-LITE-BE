import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Moon, ShieldCheck, Sparkles, Sun, Users, Wallet } from 'lucide-react';
import { api } from './api';
import { useAuth } from './AuthContext';

function usePublicTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('hcm-theme') || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('hcm-theme', theme);
  }, [theme]);
  return [theme, () => setTheme(value => value === 'dark' ? 'light' : 'dark')];
}

function ThemeButton({ theme, onToggle }) {
  const Icon = theme === 'dark' ? Sun : Moon;
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon size={17}/><span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span></button>;
}

function Brand() {
  return <Link className="public-brand" to="/"><span className="brand-mark small">H</span><b>HCM <em>Lite</em></b></Link>;
}

function TeamIllustration({ compact = false }) {
  return <svg className={compact ? 'team-illustration compact' : 'team-illustration'} viewBox="0 0 600 470" role="img" aria-label="Illustration of a connected team workspace" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#eff8f3"/></linearGradient><linearGradient id="orb" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bcebd4"/><stop offset="1" stopColor="#d8d4fb"/></linearGradient></defs>
    <circle cx="306" cy="232" r="190" fill="url(#orb)" opacity=".58"/><circle cx="306" cy="232" r="148" fill="#fff" opacity=".34"/>
    <rect x="82" y="82" width="430" height="300" rx="23" fill="url(#panel)" stroke="#fff" strokeWidth="8"/>
    <rect x="103" y="103" width="113" height="258" rx="14" fill="#172522"/><rect x="118" y="119" width="23" height="23" rx="7" fill="#16875f"/><path d="M125 130h9m-4-4v9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <rect x="118" y="162" width="79" height="9" rx="4.5" fill="#8abda5"/><rect x="118" y="187" width="61" height="8" rx="4" fill="#53635b"/><rect x="118" y="210" width="70" height="8" rx="4" fill="#53635b"/><rect x="118" y="233" width="55" height="8" rx="4" fill="#53635b"/><rect x="118" y="256" width="67" height="8" rx="4" fill="#53635b"/>
    <text x="241" y="133" fill="#21302b" fontSize="13" fontFamily="Arial" fontWeight="700">Team overview</text><text x="241" y="153" fill="#7c8a82" fontSize="8" fontFamily="Arial">A clearer view of your people</text>
    <rect x="241" y="170" width="76" height="65" rx="11" fill="#fff" stroke="#e8efea"/><rect x="328" y="170" width="76" height="65" rx="11" fill="#fff" stroke="#e8efea"/><rect x="415" y="170" width="76" height="65" rx="11" fill="#fff" stroke="#e8efea"/>
    <circle cx="258" cy="190" r="7" fill="#d9f1e3"/><path d="M254 191c1-4 7-4 8 0m-7 3h6" stroke="#16875f" strokeWidth="1.5" strokeLinecap="round"/><text x="250" y="212" fill="#92a098" fontSize="7" fontFamily="Arial">PEOPLE</text><text x="250" y="226" fill="#24332d" fontSize="13" fontFamily="Arial" fontWeight="700">128</text>
    <circle cx="345" cy="190" r="7" fill="#fff0d4"/><path d="M345 186v5l3 2" stroke="#ba872d" strokeWidth="1.5" strokeLinecap="round"/><text x="337" y="212" fill="#92a098" fontSize="7" fontFamily="Arial">ATTENDANCE</text><text x="337" y="226" fill="#24332d" fontSize="13" fontFamily="Arial" fontWeight="700">94%</text>
    <circle cx="432" cy="190" r="7" fill="#eeebfb"/><path d="M432 186v8m-3-5h6" stroke="#8173bd" strokeWidth="1.4" strokeLinecap="round"/><text x="424" y="212" fill="#92a098" fontSize="7" fontFamily="Arial">ON LEAVE</text><text x="424" y="226" fill="#24332d" fontSize="13" fontFamily="Arial" fontWeight="700">06</text>
    <rect x="241" y="249" width="250" height="91" rx="12" fill="#fff" stroke="#e8efea"/><text x="256" y="269" fill="#26362f" fontSize="9" fontFamily="Arial" fontWeight="700">People activity</text><text x="452" y="269" fill="#16875f" fontSize="7" fontFamily="Arial">THIS WEEK</text>
    <path d="M256 319l29-25 26 10 27-33 30 23 26-11 29 22 31-38" fill="none" stroke="#16875f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M256 319l29-25 26 10 27-33 30 23 26-11 29 22 31-38v52H256z" fill="#d9f1e4" opacity=".57"/>
    <rect x="35" y="297" width="162" height="72" rx="15" fill="#fff" stroke="#e9efeb"/><circle cx="63" cy="333" r="17" fill="#ccebd8"/><circle cx="63" cy="328" r="6" fill="#956d55"/><path d="M51 345c1-8 23-8 24 0" fill="#328e6c"/><text x="89" y="326" fill="#26362f" fontSize="9" fontFamily="Arial" fontWeight="700">A team in sync</text><text x="89" y="341" fill="#829088" fontSize="7" fontFamily="Arial">Time off approved</text><circle cx="183" cy="311" r="9" fill="#e4f5eb"/><path d="m179 311 3 3 5-6" stroke="#16875f" strokeWidth="1.5" fill="none"/>
    <rect x="395" y="344" width="168" height="70" rx="14" fill="#fff" stroke="#e9efeb"/><circle cx="423" cy="379" r="16" fill="#e9e5fa"/><circle cx="423" cy="374" r="5.5" fill="#745b4b"/><path d="M411 391c1-8 23-8 24 0" fill="#7166aa"/><text x="449" y="373" fill="#26362f" fontSize="9" fontFamily="Arial" fontWeight="700">Payroll is ready</text><text x="449" y="388" fill="#829088" fontSize="7" fontFamily="Arial">Review this month’s run</text><circle cx="549" cy="357" r="8" fill="#fff0d4"/><path d="M549 353v4l3 2" stroke="#ba872d" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>;
}

function AuthShell({ theme, onToggle, title, eyebrow, description, children, artTitle, artCopy }) {
  return <main className={`public-page auth-page theme-${theme}`}><header className="auth-nav"><Brand/><ThemeButton theme={theme} onToggle={onToggle}/></header><div className="auth-layout"><section className="auth-visual"><div className="auth-visual-copy"><span className="public-eyebrow">{eyebrow}</span><h2>{artTitle}</h2><p>{artCopy}</p></div><TeamIllustration compact/><div className="auth-trust"><ShieldCheck size={15}/> Private, role-based access for your team</div></section><section className="auth-card-side"><div className="auth-card-head"><div className="auth-icon"><Sparkles size={18}/></div><h1>{title}</h1><p>{description}</p></div>{children}</section></div><footer className="auth-footer"><span>© 2026 HCM Lite</span><Link to="/">Back to home</Link></footer></main>;
}

export function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = usePublicTheme();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={user.mustChangePassword ? '/change-password' : '/'} replace/>;
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const data = (await api.post('/auth/login', { email: event.currentTarget.email.value, password: event.currentTarget.password.value })).data;
      localStorage.setItem('hcm-token', data.token); setUser(data.user); navigate(data.user.mustChangePassword ? '/change-password' : '/');
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <AuthShell theme={theme} onToggle={toggleTheme} eyebrow="WELCOME BACK" title="Sign in to HCM Lite" description="Pick up where your team left off." artTitle="Good work starts with a connected team." artCopy="People, attendance, time off and payroll—all in one calm, clear workspace.">
    <form onSubmit={submit} className="public-form"><label>Work email<input required name="email" type="email" autoComplete="username" placeholder="you@company.com"/></label><label>Password<input required name="password" type="password" autoComplete="current-password" placeholder="Enter your password"/></label>{error&&<p className="public-error">{error}</p>}<button className="public-submit" disabled={busy}>{busy?'Signing in…':'Sign in'}<ArrowRight size={16}/></button></form>
    <p className="auth-switch">New to HCM Lite? <Link to="/setup">Create your company <ArrowUpRight size={14}/></Link></p>
  </AuthShell>;
}

export function Setup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = usePublicTheme();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const form = event.currentTarget;
    try {
      const data = (await api.post('/setup/initialize', { companyName: form.companyName.value, adminName: form.adminName.value, email: form.email.value, password: form.password.value, officeStart: form.officeStart.value })).data;
      localStorage.setItem('hcm-token', data.token); setUser(data.user); navigate('/');
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <AuthShell theme={theme} onToggle={toggleTheme} eyebrow="YOUR TEAM, YOUR SPACE" title="Create your company" description="Set up your company workspace and administrator account." artTitle="A better workday starts here." artCopy="Bring your people operations together and give everyone a clearer place to work.">
    <form onSubmit={submit} className="public-form signup-form"><label>Company name<input required name="companyName" minLength="2" maxLength="100" autoComplete="organization" placeholder="e.g. Acme Studio"/></label><label>Your name<input required name="adminName" minLength="2" maxLength="100" autoComplete="name" placeholder="e.g. Ayesha Khan"/></label><label>Work email<input required name="email" type="email" autoComplete="email" placeholder="you@company.com"/></label><div className="form-pair"><label>Office starts at<input name="officeStart" type="time" defaultValue="09:00"/></label><label>Admin password<input required name="password" type="password" minLength="12" autoComplete="new-password" placeholder="At least 12 characters"/></label></div>{error&&<p className="public-error">{error}</p>}<button className="public-submit" disabled={busy}>{busy?'Creating workspace…':'Create company'}<ArrowRight size={16}/></button><small className="form-note">Your company data is isolated from other workspaces.</small></form>
    <p className="auth-switch">Already have a workspace? <Link to="/login">Sign in <ArrowUpRight size={14}/></Link></p>
  </AuthShell>;
}

export function Home() {
  const { user, ready } = useAuth();
  const [theme, toggleTheme] = usePublicTheme();
  if (!ready) return <div className="center">Loading HCM Lite…</div>;
  if (user) return null;
  return <main className={`public-page public-home theme-${theme}`}><header className="home-nav"><Brand/><nav><a href="#features">Features</a><a href="#how-it-works">How it works</a></nav><div className="home-actions"><ThemeButton theme={theme} onToggle={toggleTheme}/><Link className="home-login" to="/login">Sign in</Link><Link className="public-cta" to="/setup">Get started <ArrowRight size={15}/></Link></div></header>
    <section className="hero"><div className="hero-copy"><div className="public-eyebrow"><span/> PEOPLE OPERATIONS, SIMPLIFIED</div><h1>Make work better<br/>for <em>everyone.</em></h1><p>One thoughtful workspace for your people, attendance, time off and payroll. Give your team more clarity from the very first day.</p><div className="hero-actions"><Link className="public-cta hero-cta" to="/setup">Create your company <ArrowRight size={16}/></Link><span className="hero-login-note">Already set up? <Link to="/login">Sign in</Link></span></div><div className="hero-proof"><span className="proof-icon"><Check size={14}/></span><span>Simple to start<span className="proof-dot">·</span>Clear for every role<span className="proof-dot">·</span>Built around people</span></div></div><div className="hero-art-wrap"><div className="hero-art-halo"/><TeamIllustration/><div className="home-float-card"><span className="float-check"><Check size={15}/></span><span><b>One connected workspace</b><small>People · time · payroll</small></span></div></div></section>
    <section className="feature-band" id="features"><div className="feature-band-title"><span className="public-eyebrow">A CLEARER WAY TO WORK</span><h2>Everything your people need,<br/>in one place.</h2><p>Bring everyday HR tasks into a calm, connected workflow.</p></div><div className="feature-cards"><article><span className="feature-tile green"><Users size={20}/></span><h3>People, in focus</h3><p>Organize employee information and keep your team directory up to date.</p></article><article><span className="feature-tile amber"><Clock3 size={20}/></span><h3>Time, made clear</h3><p>Track attendance, manage leave and keep approvals moving.</p></article><article><span className="feature-tile violet"><Wallet size={20}/></span><h3>Payroll, with care</h3><p>Prepare payroll with clear records and role-based access.</p></article><article><span className="feature-tile blue"><CalendarDays size={20}/></span><h3>One team rhythm</h3><p>Share announcements and see the details that matter each day.</p></article></div></section>
    <section className="home-bottom" id="how-it-works"><div><span className="public-eyebrow">READY WHEN YOU ARE</span><h2>Give your company a better workspace.</h2><p>Create your company and administrator account, then invite your team to get started.</p></div><Link className="public-cta" to="/setup">Set up your company <ArrowRight size={15}/></Link></section>
    <footer className="home-footer"><Brand/><span>People-first operations, made simple.</span><Link to="/login">Sign in <ArrowRight size={14}/></Link></footer>
  </main>;
}
