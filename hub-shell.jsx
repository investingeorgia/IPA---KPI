// ============================================================
// hub-shell.jsx — Login, App shell (sidebar + topbar + router)
// ============================================================
const shellUS = React.useState, shellUE = React.useEffect;

/* ---------------- Login ---------------- */
function LoginView() {
  const s = window.useStore();
  const { Icon, Avatar } = window;
  const [email, setEmail] = React.useState('nino.beridze@enterprise.gov.ge');
  const [pw, setPw] = React.useState('demo');
  const lang = s.lang;

  const submit = (e) => {
    e.preventDefault();
    const u = s.users.find(x => x.email.toLowerCase() === email.trim().toLowerCase());
    s.login(u ? u.id : 'u0');
    window.navigate('/dashboard');
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', background:'var(--cream)' }}>
      <div style={{ display:'grid', placeItems:'center', padding:40 }}>
        <form onSubmit={submit} style={{ width:'100%', maxWidth:360 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
            <div style={{ width:40, height:40, borderRadius:11, background:'var(--green-900)', display:'grid', placeItems:'center', color:'#fff' }}><Icon name="target" className="icon icon-lg"/></div>
            <div><div style={{ fontWeight:700, fontSize:17, whiteSpace:'nowrap' }}>{window.tr('appName',lang)}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{window.tr('org',lang)}</div></div>
          </div>
          <h1 style={{ fontSize:28, fontWeight:600, letterSpacing:'-0.02em', margin:'0 0 6px' }}>{window.tr('signIn',lang)}</h1>
          <p style={{ fontSize:13, color:'var(--ink-3)', margin:'0 0 24px' }}>{window.tr('signInSub',lang)}</p>
          <div className="field" style={{ marginBottom:14 }}>
            <label className="field-label">{window.tr('email',lang)}</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} style={{ height:42 }}/>
          </div>
          <div className="field" style={{ marginBottom:22 }}>
            <label className="field-label">{window.tr('password',lang)}</label>
            <input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} style={{ height:42 }}/>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center', height:44, fontSize:14 }}>{window.tr('signIn',lang)}</button>
          <div style={{ marginTop:20, padding:14, background:'#fff', border:'1px solid var(--line)', borderRadius:12 }}>
            <div style={{ fontSize:11, color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Prototype — pick a role</div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={()=>{ s.login('u0'); window.navigate('/dashboard'); }}><Avatar user={s.users[0]} size="sm"/> Admin</button>
              <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={()=>{ s.login('u1'); window.navigate('/dashboard'); }}><Avatar user={s.users[1]} size="sm"/> Member</button>
            </div>
          </div>
        </form>
      </div>
      <div style={{ background:'var(--green-900)', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 64px' }}>
        <div style={{ fontSize:12, opacity:0.6, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600, marginBottom:18 }}>{window.tr('org',lang)}</div>
        <div style={{ fontSize:40, fontWeight:600, letterSpacing:'-0.03em', lineHeight:1.12 }}>{lang==='ge'?'KPI-ები, პროგრესი და გუნდი — ერთ სივრცეში.':'KPIs, progress and your team — in one place.'}</div>
        <div style={{ display:'flex', gap:28, marginTop:40 }}>
          {[['4',window.tr('program',lang)],['12','KPIs'],['11',window.tr('team',lang)]].map(([n,l])=>(
            <div key={l}><div className="mono" style={{ fontSize:34, fontWeight:600 }}>{n}</div><div style={{ fontSize:12, opacity:0.6 }}>{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.LoginView = LoginView;

/* ---------------- App shell ---------------- */
function AppShell() {
  const s = window.useStore();
  const route = window.useRoute();
  const { Icon, Avatar } = window;
  const lang = s.lang;
  const [quickLog, setQuickLog] = React.useState(false);

  // admin-guard redirects (must run before any early return to keep hook order stable)
  shellUE(() => {
    if (s.currentUser && (route.startsWith('/team') || route.startsWith('/reports')) && !s.isAdmin) window.navigate('/dashboard');
  }, [route, s.isAdmin, s.currentUser]);

  if (!s.currentUser) return <LoginView/>;

  const nav = [
    { to:'/dashboard', icon:'grid',   key:'dashboard' },
    { to:'/kpis',      icon:'target', key:'kpis' },
    { to:'/todos',     icon:'list',   key:'todos' },
    { to:'/team',      icon:'users',  key:'team', admin:true },
    { to:'/database',  icon:'db',     key:'database' },
    { to:'/reports',   icon:'doc',    key:'reports', admin:true },
  ].filter(n => !n.admin || s.isAdmin);

  const isActive = (to) => route === to || route.startsWith(to + '/');

  // route → view
  let view = null;
  const m = (p) => window.matchRoute(route, p);
  if (m('/dashboard')) view = <window.DashboardView/>;
  else if (m('/kpis')) view = <window.KpiListView/>;
  else if (m('/kpis/:id')) view = <window.KpiDetailView id={m('/kpis/:id').id}/>;
  else if (m('/todos')) view = <window.TodosView/>;
  else if (m('/team') && s.isAdmin) view = <window.TeamView/>;
  else if (m('/team/:userId') && s.isAdmin) view = <window.MemberDetailView userId={m('/team/:userId').userId}/>;
  else if (m('/profile')) view = <window.ProfileView/>;
  else if (m('/database')) view = <window.DatabaseView tab="companies"/>;
  else if (m('/database/companies')) view = <window.DatabaseView tab="companies"/>;
  else if (m('/database/companies/:id')) view = <window.RecordFullView kind="company" id={m('/database/companies/:id').id}/>;
  else if (m('/database/articles')) view = <window.DatabaseView tab="articles"/>;
  else if (m('/database/articles/:id')) view = <window.RecordFullView kind="article" id={m('/database/articles/:id').id}/>;
  else if (m('/reports') && s.isAdmin) view = <window.ReportsView/>;
  else view = <div className="empty">Redirecting…</div>;

  // admin-guard redirects
  const fullBleed = route.startsWith('/database');

  return (
    <div className={`kpi-root lang-${lang}`} style={{ height:'100vh', display:'flex', background:'var(--cream)' }}>
      {/* Sidebar */}
      <aside style={{ width:236, background:'#fff', borderRight:'1px solid var(--line)', padding:'18px 14px', display:'flex', flexDirection:'column', gap:16, flex:'0 0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'2px 6px' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'var(--green-900)', display:'grid', placeItems:'center', color:'#fff' }}><Icon name="target" className="icon icon-sm"/></div>
          <div><div style={{ fontWeight:700, fontSize:13.5, lineHeight:1 }}>{window.tr('appName',lang)}</div><div style={{ fontSize:10.5, color:'var(--ink-3)', marginTop:3 }}>{window.tr('org',lang)}</div></div>
        </div>

        <button className="btn btn-primary" onClick={()=>setQuickLog(true)} style={{ justifyContent:'center' }}><Icon name="bolt" className="icon icon-sm"/> {window.tr('quickLog',lang)}</button>

        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {nav.map(n => (
            <button key={n.to} onClick={()=>window.navigate(n.to)} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, textAlign:'left', width:'100%',
            background:isActive(n.to)?'var(--green-50)':'transparent', color:isActive(n.to)?'var(--green-900)':'var(--ink-2)' }}>
              <Icon name={n.icon} className="icon"/>{window.tr(n.key,lang)}
            </button>
          ))}
        </nav>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>window.navigate('/profile')} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px', borderRadius:10, border:'1px solid var(--line)', background: route==='/profile'?'var(--green-50)':'#fff', cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>
            <Avatar user={s.currentUser} size="sm"/>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.currentUser.name}</div><div style={{ fontSize:10.5, color:'var(--ink-3)' }}>{window.tr(s.currentUser.role,lang)}</div></div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <header style={{ padding:'12px 24px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', gap:14, background:'#fff', flex:'0 0 auto' }}>
          <div style={{ position:'relative', display:'flex', alignItems:'center', flex:1, maxWidth:340 }}>
            <span style={{ position:'absolute', left:11, color:'var(--ink-3)', display:'flex' }}><Icon name="search" className="icon icon-sm"/></span>
            <input className="input" placeholder={window.tr('search',lang)} style={{ paddingLeft:32, height:36, borderRadius:999, background:'var(--cream)' }}/>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
            <window.RoleSwitcher/>
            <window.LangToggle lang={lang} setLang={s.setLang}/>
            <button className="btn-icon"><Icon name="bell" className="icon"/></button>
            <button className="btn-icon" onClick={s.logout} title={window.tr('logout',lang)}><Icon name="logout" className="icon"/></button>
          </div>
        </header>
        <div style={{ flex:1, minHeight:0, overflowY: fullBleed?'hidden':'auto' }}>
          {fullBleed ? view : <div style={{ padding:'24px 28px 32px', maxWidth:1320, margin:'0 auto' }}>{view}</div>}
        </div>
      </main>

      {quickLog && <window.LogModal onClose={()=>setQuickLog(false)} />}
    </div>
  );
}
window.AppShell = AppShell;

/* Role/user switcher (prototype convenience) */
function RoleSwitcher() {
  const s = window.useStore();
  const { Avatar, Icon } = window;
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position:'relative' }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px 4px 4px', background:'var(--cream-2)', border:'none', borderRadius:99, cursor:'pointer', fontFamily:'inherit' }}>
        <Avatar user={s.currentUser} size="sm"/>
        <span style={{ fontSize:12.5, fontWeight:500 }}>{s.currentUser.name.split(' ')[0]}</span>
        <span className={`badge ${s.isAdmin?'badge-green':'badge-gray'}`} style={{ fontSize:9.5, padding:'1px 6px' }}>{window.tr(s.currentUser.role, s.lang)}</span>
        <Icon name="chevDown" className="icon icon-sm"/>
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', width:248, background:'#fff', border:'1px solid var(--line)', borderRadius:14, boxShadow:'var(--shadow-2)', zIndex:50, padding:6, maxHeight:360, overflowY:'auto' }}>
          {s.users.map(u => (
            <button key={u.id} onClick={()=>{ s.login(u.id); setOpen(false); window.navigate('/dashboard'); }} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'7px 8px', borderRadius:9, border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', background:s.currentUserId===u.id?'var(--green-50)':'transparent' }}>
              <Avatar user={u} size="sm"/>
              <span style={{ fontSize:12.5, flex:1 }}>{u.name}</span>
              {u.role==='admin' && <span className="badge badge-green" style={{ fontSize:9, padding:'1px 6px' }}>ADMIN</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
window.RoleSwitcher = RoleSwitcher;
