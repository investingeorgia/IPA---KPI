// Variation A — Sidebar SaaS layout for Enterprise Georgia KPI Hub.
// Internal nav switches between Admin / Member / Todo / KPI-Detail views.

const { useState: aUseState, useMemo: aUseMemo, useEffect: aUseEffect } = React;
const { Icon: A_Icon, Avatar: A_Avatar, ProgressBar: A_PB, CategoryPill: A_CatPill, StatusPill: A_StatusPill, LangToggle: A_Lang } = window;
const A_t = window.t;

function AppA({ frameId }) {
  const [lang, setLang] = aUseState('en');
  const [view, setView] = aUseState('admin'); // admin | member | todo | kpi
  const [currentUser, setCurrentUser] = aUseState('m0'); // m0 = admin Nino
  const [todos, setTodos] = aUseState(window.INITIAL_TODOS);
  const [categories, setCategories] = aUseState(window.CATEGORIES);
  const [selectedKpi, setSelectedKpi] = aUseState('k4'); // KPI detail focus
  const [filterCat, setFilterCat] = aUseState('all');
  const [showAddTask, setShowAddTask] = aUseState(false);

  const allKpis = aUseMemo(() => categories.flatMap(c => c.kpis.map(k => ({...k, cat: c.id}))), [categories]);
  const me = window.memberById(currentUser);

  const updateKpi = (kpiId, delta) => {
    setCategories(cats => cats.map(c => ({
      ...c, kpis: c.kpis.map(k => k.id === kpiId ? { ...k, current: Math.max(0, k.current + delta) } : k)
    })));
  };

  const setKpiValue = (kpiId, value) => {
    setCategories(cats => cats.map(c => ({
      ...c, kpis: c.kpis.map(k => k.id === kpiId ? { ...k, current: Math.max(0, value) } : k)
    })));
  };

  return (
    <div className={`kpi-root lang-${lang}`} style={{ height: '100%', display: 'flex', background: 'var(--cream)' }}>
      <A_Sidebar lang={lang} view={view} setView={setView} setLang={setLang} me={me} setCurrentUser={setCurrentUser} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <A_TopBar lang={lang} view={view} me={me} setCurrentUser={setCurrentUser} setLang={setLang} />
        <div style={{ flex: 1, minHeight: 0, padding: '20px 28px 24px', overflowY: 'auto' }}>
          {view === 'admin'  && <A_AdminView  lang={lang} categories={categories} todos={todos} setSelectedKpi={(id)=>{setSelectedKpi(id); setView('kpi');}} />}
          {view === 'member' && <A_MemberView lang={lang} me={me} allKpis={allKpis} setSelectedKpi={(id)=>{setSelectedKpi(id); setView('kpi');}} updateKpi={updateKpi} setKpiValue={setKpiValue} />}
          {view === 'todo'   && <A_TodoView   lang={lang} todos={todos} setTodos={setTodos} filterCat={filterCat} setFilterCat={setFilterCat} showAdd={showAddTask} setShowAdd={setShowAddTask} />}
          {view === 'team'   && <A_TeamView   lang={lang} categories={categories} todos={todos} setCurrentUser={setCurrentUser} goMember={()=>setView('member')} />}
          {view === 'kpi'    && <A_KpiDetail  lang={lang} kpi={allKpis.find(k=>k.id===selectedKpi)} setKpiValue={setKpiValue} updateKpi={updateKpi} todos={todos} />}
        </div>
      </main>
    </div>
  );
}

// ---------- Sidebar ----------
function A_Sidebar({ lang, view, setView, setLang, me }) {
  const navItems = [
    { id: 'admin',  icon: 'grid',     key: 'navAdmin',  badge: '10' },
    { id: 'member', icon: 'user',     key: 'navMember', badge: null },
    { id: 'todo',   icon: 'list',     key: 'navTodo',   badge: '13' },
    { id: 'team',   icon: 'users',    key: 'navTeam',   badge: '11' },
    { id: 'kpi',    icon: 'target',   key: 'navKpi',    badge: null },
  ];
  return (
    <aside style={{ width: 240, background: '#fff', borderRight: '1px solid var(--line)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, flex: '0 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--green-900)', display: 'grid', placeItems: 'center', color: '#fff' }}>
          <A_Icon name="target" className="icon icon-sm" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{A_t('appName', lang)}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>Enterprise Georgia</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setView(n.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10,
                     background: view === n.id ? 'var(--green-50)' : 'transparent',
                     color: view === n.id ? 'var(--green-900)' : 'var(--ink-2)',
                     border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                     textAlign: 'left', width: '100%' }}>
            <A_Icon name={n.icon} className="icon" />
            <span style={{ flex: 1 }}>{A_t(n.key, lang)}</span>
            {n.badge && <span style={{ fontSize: 10, color: 'var(--ink-3)', background: 'var(--cream-2)', padding: '1px 7px', borderRadius: 99 }}>{n.badge}</span>}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 14, background: 'var(--green-50)', borderRadius: 14, border: '1px solid var(--green-100)' }}>
          <div style={{ fontSize: 11, color: 'var(--green-900)', fontWeight: 600, opacity: 0.7 }}>Q2 · 2026</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--green-900)', letterSpacing: '-0.02em', marginTop: 2 }}>34 {lang==='ka'?'დღე':'days'}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 2 }}>{A_t('daysLeft', lang)}</div>
        </div>
        <A_Lang lang={lang} setLang={setLang} />
      </div>
    </aside>
  );
}

// ---------- Top bar ----------
function A_TopBar({ lang, view, me, setCurrentUser }) {
  const titleKey = { admin: 'adminTitle', member: 'memberTitle', todo: 'todoTitle', team: 'teamTitle', kpi: 'navKpi' }[view];
  const subKey   = { admin: 'adminSub',   member: 'memberSub',   todo: 'todoSub',   team: 'teamSub',   kpi: '' }[view];
  return (
    <header style={{ padding: '20px 28px 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{A_t(titleKey, lang)}</div>
        {subKey && <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{A_t(subKey, lang)}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', display:'flex', alignItems:'center' }}>
          <span style={{ position: 'absolute', left: 11, color: 'var(--ink-3)', display:'flex' }}>
            <A_Icon name="search" className="icon icon-sm" />
          </span>
          <input className="input" placeholder={A_t('searchPh', lang)}
                 style={{ paddingLeft: 32, width: 220, height: 36, borderRadius: 999, background: 'var(--cream)' }} />
        </div>
        <button className="btn-icon"><A_Icon name="bell" className="icon" /></button>
        <A_UserSwitcher me={me} setCurrentUser={setCurrentUser} lang={lang} />
      </div>
    </header>
  );
}

function A_UserSwitcher({ me, setCurrentUser, lang }) {
  const [open, setOpen] = aUseState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px 4px 4px', background:'var(--cream-2)', border:'none', borderRadius:99, cursor:'pointer', fontFamily:'inherit' }}>
        <A_Avatar member={me} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{window.memberName(me, lang)}</span>
        <A_Icon name="chevDown" className="icon icon-sm" />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', width: 220, background:'#fff',
                      border:'1px solid var(--line)', borderRadius:14, boxShadow:'var(--shadow-2)', zIndex: 10, padding: 6 }}>
          {window.MEMBERS.map(m => (
            <button key={m.id} onClick={()=>{setCurrentUser(m.id); setOpen(false);}}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'7px 8px', borderRadius:9,
                       background: me.id===m.id?'var(--green-50)':'transparent', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
              <A_Avatar member={m} size="sm" />
              <span style={{ fontSize: 12.5, flex: 1 }}>{window.memberName(m, lang)}</span>
              {m.role==='admin' && <span style={{ fontSize: 9, color:'var(--green-900)', background:'var(--green-100)', padding:'1px 6px', borderRadius:99, fontWeight:600 }}>ADMIN</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Admin view ----------
function A_AdminView({ lang, categories, todos, setSelectedKpi }) {
  const allKpis = categories.flatMap(c => c.kpis.map(k => ({...k, cat: c.id})));
  const overall = Math.round(allKpis.reduce((s,k) => s + Math.min(100, k.current/k.target*100), 0) / allKpis.length);
  const onTrack = allKpis.filter(k => window.statusOf(k.current, k.target) === 'onTrack' || window.statusOf(k.current, k.target) === 'done').length;
  const atRisk  = allKpis.filter(k => window.statusOf(k.current, k.target) === 'atRisk').length;
  const behind  = allKpis.filter(k => window.statusOf(k.current, k.target) === 'behind').length;
  const openTodos = todos.filter(t => !t.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 14 }}>
        <A_StatCard title={A_t('overallProgress', lang)} value={overall + '%'} sub={`${allKpis.length} KPIs · ${lang==='ka'?'მთლიანი':'across team'}`} accent>
          <A_PB value={overall} target={100} size="lg" tone="" />
        </A_StatCard>
        <A_StatCard title={A_t('onTrack', lang)}  value={onTrack} sub={`${lang==='ka'?'KPI გრაფიკში':'KPIs on track'}`} dotClass="cat-bg-invest" />
        <A_StatCard title={A_t('atRisk', lang)}   value={atRisk}  sub={`${lang==='ka'?'მონიტორინგი':'need attention'}`} dotClass="cat-bg-awareness" />
        <A_StatCard title={A_t('behind', lang)}   value={behind}  sub={`${openTodos} ${lang==='ka'?'ღია დავალება':'open tasks'}`} dotClass="cat-bg-aftercare" />
      </div>

      {/* Category breakdown */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{lang==='ka'?'კატეგორიების მიხედვით':'By category'}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>{A_t('byCategory', lang)}</button>
            <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12, background:'var(--cream-2)' }}>{A_t('byMember', lang)}</button>
          </div>
        </div>
        <div>
          {categories.map(c => {
            const catKpis = c.kpis;
            const catProgress = Math.round(catKpis.reduce((s,k) => s + Math.min(100, k.current/k.target*100), 0) / catKpis.length);
            const ownerIds = [...new Set(catKpis.map(k => k.owner))];
            return (
              <div key={c.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '220px 1fr 140px 60px', gap: 18, alignItems: 'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 9 }}>
                  <span className={`cat-dot cat-${c.id}`} style={{ width: 10, height: 10 }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name[lang]}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{catKpis.length} KPIs</div>
                  </div>
                </div>
                <A_PB value={catProgress} target={100} size="md" tone="" />
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <div className="avatar-stack">
                    {ownerIds.slice(0,3).map(id => <A_Avatar key={id} member={window.memberById(id)} size="sm" />)}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ownerIds.length} {A_t('members', lang)}</span>
                </div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{catProgress}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All KPIs table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{lang==='ka'?'ყველა ინდიკატორი':'All indicators'}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{allKpis.length} {lang==='ka'?'სულ':'total'}</div>
        </div>
        <div style={{ padding: '8px 20px', display:'grid', gridTemplateColumns: '1.7fr 1fr 110px 1fr 90px 110px 32px', gap: 14, fontSize: 10.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing: '0.06em', fontWeight: 600, borderBottom: '1px solid var(--line)' }}>
          <div>{A_t('indicator', lang)}</div>
          <div>{A_t('category', lang)}</div>
          <div>{A_t('assignee', lang)}</div>
          <div>{A_t('progress', lang)}</div>
          <div style={{textAlign:'right'}}>{A_t('current', lang)}/{A_t('target', lang)}</div>
          <div>{A_t('status', lang)}</div>
          <div></div>
        </div>
        {allKpis.slice(0, 10).map(k => (
          <button key={k.id} onClick={() => setSelectedKpi(k.id)}
            style={{ padding: '12px 20px', display:'grid', gridTemplateColumns: '1.7fr 1fr 110px 1fr 90px 110px 32px', gap: 14, alignItems:'center', fontSize: 12.5, borderBottom: '1px solid var(--line)', cursor:'pointer', background:'transparent', border:'none', borderBottomStyle:'solid', borderBottomWidth: 1, borderBottomColor:'var(--line)', textAlign:'left', fontFamily:'inherit', width:'100%' }}>
            <div style={{ fontWeight: 500 }}>{k.name[lang]}</div>
            <div><A_CatPill cat={k.cat} lang={lang} /></div>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <A_Avatar member={window.memberById(k.owner)} size="sm" />
              <span style={{ fontSize: 11.5, color:'var(--ink-2)' }}>{window.memberById(k.owner).name_en.split(' ')[0]}</span>
            </div>
            <A_PB value={k.current} target={k.target} size="sm" />
            <div className="mono" style={{ fontSize: 12, textAlign:'right' }}>
              <span style={{ fontWeight: 600 }}>{window.fmtN(k.current)}</span>
              <span style={{ color:'var(--ink-3)' }}>/{window.fmtN(k.target)}</span>
            </div>
            <div><A_StatusPill status={window.statusOf(k.current, k.target)} lang={lang} /></div>
            <A_Icon name="chev" className="icon icon-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

function A_StatCard({ title, value, sub, accent, dotClass, children }) {
  return (
    <div style={{ background: accent?'var(--green-900)':'#fff', color: accent?'#fff':'var(--ink)',
                  border: accent?'none':'1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 16, display:'flex', flexDirection:'column', gap: 10 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 12, color: accent?'rgba(255,255,255,0.7)':'var(--ink-3)', fontWeight: 500 }}>
        {dotClass && <span className={`cat-dot ${dotClass}`} style={{width:8,height:8, background:'currentColor', opacity:0.6}} />}
        {title}
      </div>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div className="num-xl">{value}</div>
        {!accent && <A_Icon name="arrow" className="icon" />}
      </div>
      {children}
      <div style={{ fontSize: 11.5, color: accent?'rgba(255,255,255,0.7)':'var(--ink-3)' }}>{sub}</div>
    </div>
  );
}

// ---------- Member view ----------
function A_MemberView({ lang, me, allKpis, setSelectedKpi, updateKpi, setKpiValue }) {
  const myKpis = allKpis.filter(k => k.owner === me.id);
  const display = myKpis.length ? myKpis : allKpis.filter(k => k.cat === me.cat).slice(0, 4);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 14, padding: '4px 0 6px' }}>
        <A_Avatar member={me} size="xl" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing:'-0.01em' }}>{lang==='ka'?'გამარჯობა':'Hello'}, {window.memberName(me, lang).split(' ')[0]}</div>
          <div style={{ fontSize: 13, color:'var(--ink-3)', marginTop: 2 }}>
            {display.length} {lang==='ka'?'აქტიური KPI':'active KPIs'} · <A_CatPill cat={me.cat} lang={lang} />
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {display.map(k => (
          <A_MyKpiCard key={k.id} k={k} lang={lang} updateKpi={updateKpi} setKpiValue={setKpiValue} onOpen={() => setSelectedKpi(k.id)} />
        ))}
      </div>
    </div>
  );
}

function A_MyKpiCard({ k, lang, updateKpi, setKpiValue, onOpen }) {
  const [editing, setEditing] = aUseState(false);
  const [val, setVal] = aUseState(k.current);
  aUseEffect(() => setVal(k.current), [k.current]);
  const p = window.pct(k.current, k.target);
  return (
    <div className="card" style={{ padding: 18, display:'flex', flexDirection:'column', gap: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <A_CatPill cat={k.cat} lang={lang} />
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, letterSpacing:'-0.01em' }}>{k.name[lang]}</div>
          <div style={{ fontSize: 11.5, color:'var(--ink-3)', marginTop: 2 }}>{A_t('goal', lang)}: {k.goal}</div>
        </div>
        <A_StatusPill status={window.statusOf(k.current, k.target)} lang={lang} />
      </div>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop: 4 }}>
        <div className="mono">
          <span className="num-lg">{window.fmtN(k.current)}</span>
          <span style={{ fontSize: 13, color:'var(--ink-3)' }}> / {window.fmtN(k.target)}{k.unit && k.unit!=='#' ? ' ' + k.unit : ''}</span>
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: p<40?'var(--danger)':p<70?'var(--warn)':'var(--green-900)' }}>{p}%</div>
      </div>
      <A_PB value={k.current} target={k.target} />
      {editing ? (
        <div style={{ display:'flex', gap: 6, marginTop: 4 }}>
          <input className="input" type="number" value={val} onChange={e=>setVal(+e.target.value || 0)} style={{ flex:1 }} />
          <button className="btn btn-primary" onClick={()=>{setKpiValue(k.id, val); setEditing(false);}}>{A_t('add', lang)}</button>
          <button className="btn btn-ghost" onClick={()=>{setVal(k.current); setEditing(false);}}><A_Icon name="x" className="icon icon-sm" /></button>
        </div>
      ) : (
        <div style={{ display:'flex', gap: 6, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={()=>updateKpi(k.id, -1)} style={{ padding:'7px 10px' }}>−1</button>
          <button className="btn btn-ghost" onClick={()=>updateKpi(k.id, +1)} style={{ padding:'7px 10px' }}>+1</button>
          <button className="btn btn-ghost" onClick={()=>updateKpi(k.id, +5)} style={{ padding:'7px 10px' }}>+5</button>
          <button className="btn btn-ghost" onClick={()=>setEditing(true)} style={{ padding:'7px 10px', marginLeft:'auto' }}><A_Icon name="sparkle" className="icon icon-sm" /> {A_t('pushUpdate', lang)}</button>
          <button className="btn btn-ghost" onClick={onOpen} style={{ padding:'7px 10px' }}><A_Icon name="chev" className="icon icon-sm" /></button>
        </div>
      )}
    </div>
  );
}

// ---------- Todo view ----------
function A_TodoView({ lang, todos, setTodos, filterCat, setFilterCat, showAdd, setShowAdd }) {
  const [newTitle, setNewTitle] = aUseState('');
  const [newAssignee, setNewAssignee] = aUseState('m1');
  const [newCat, setNewCat] = aUseState('invest');
  const [newDue, setNewDue] = aUseState(3);

  const toggle = (id) => setTodos(ts => ts.map(t => t.id===id ? {...t, done: !t.done} : t));

  const filtered = todos.filter(t => filterCat==='all' || t.cat === filterCat);
  const buckets = [
    { key: 'overdue', icon: 'flag',    color: 'var(--danger)' },
    { key: 'today',   icon: 'dot',     color: 'var(--green-900)' },
    { key: 'tomorrow',icon: 'calendar',color: 'var(--ink-2)' },
    { key: 'thisWeek',icon: 'calendar',color: 'var(--ink-2)' },
    { key: 'nextWeek',icon: 'calendar',color: 'var(--ink-3)' },
    { key: 'later',   icon: 'calendar',color: 'var(--ink-3)' },
  ];
  const grouped = buckets.map(b => ({ ...b, items: filtered.filter(t => window.bucketOf(t.dueDays) === b.key) })).filter(b => b.items.length);

  return (
    <div style={{ display:'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems:'flex-start' }}>
      <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
        {/* Filter row */}
        <div style={{ display:'flex', alignItems:'center', gap: 6, padding: '2px 0' }}>
          {['all','invest','awareness','aftercare','fdi'].map(c => (
            <button key={c} onClick={()=>setFilterCat(c)}
              style={{ padding:'6px 12px', borderRadius: 99, border:'1px solid', fontSize: 12, fontWeight: 500, fontFamily:'inherit', cursor:'pointer',
                       background: filterCat===c?'var(--green-900)':'#fff',
                       color: filterCat===c?'#fff':'var(--ink-2)',
                       borderColor: filterCat===c?'var(--green-900)':'var(--line)' }}>
              {c==='all' ? A_t('filterAll', lang) : (window.CATEGORIES.find(x=>x.id===c)?.name?.[lang] || c)}
            </button>
          ))}
          <button onClick={()=>setShowAdd(s=>!s)} className="btn btn-primary" style={{ marginLeft:'auto' }}>
            <A_Icon name="plus" className="icon icon-sm" /> {A_t('addTask', lang)}
          </button>
        </div>

        {/* Add task inline */}
        {showAdd && (
          <div className="card" style={{ background:'var(--green-50)', borderColor:'var(--green-100)', padding: 16 }}>
            <div style={{ display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10 }}>
              <input className="input" placeholder={A_t('taskTitle', lang)} value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
              <select className="select" value={newCat} onChange={e=>setNewCat(e.target.value)}>
                {window.CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name[lang]}</option>)}
              </select>
              <select className="select" value={newAssignee} onChange={e=>setNewAssignee(e.target.value)}>
                {window.MEMBERS.filter(m=>m.role!=='admin').map(m => <option key={m.id} value={m.id}>{window.memberName(m, lang)}</option>)}
              </select>
              <select className="select" value={newDue} onChange={e=>setNewDue(+e.target.value)}>
                <option value={0}>{A_t('today', lang)}</option>
                <option value={1}>{A_t('tomorrow', lang)}</option>
                <option value={3}>{lang==='ka'?'3 დღეში':'in 3 days'}</option>
                <option value={7}>{lang==='ka'?'1 კვირაში':'in 1 week'}</option>
              </select>
              <button className="btn btn-primary" onClick={()=>{
                if (!newTitle.trim()) return;
                setTodos(ts => [...ts, { id: 't'+Date.now(), title:{en:newTitle, ka:newTitle}, dueDays:newDue, assignee:newAssignee, cat:newCat, done:false }]);
                setNewTitle(''); setShowAdd(false);
              }}>{A_t('add', lang)}</button>
            </div>
          </div>
        )}

        {/* Grouped lists */}
        {grouped.map(b => (
          <div key={b.key} style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, padding: '8px 4px 4px' }}>
              <span style={{ color: b.color }}><A_Icon name={b.icon} className="icon icon-sm" /></span>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{A_t(b.key, lang)}</div>
              <div style={{ fontSize: 11, color:'var(--ink-3)' }}>{b.items.length}</div>
            </div>
            {b.items.map(t => <A_TodoCard key={t.id} t={t} lang={lang} onToggle={() => toggle(t.id)} />)}
          </div>
        ))}
      </div>

      {/* Right rail: stats */}
      <div style={{ display:'flex', flexDirection:'column', gap: 12, position:'sticky', top: 0 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 10 }}>{lang==='ka'?'მიმდინარე':'This week'}</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 10 }}>
            <div className="num-xl">{todos.filter(t=>!t.done && t.dueDays<=6).length}</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)' }}>{lang==='ka'?'ღია დავალება':'open tasks'}</div>
          </div>
          <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 6 }}>
            {[
              ['overdue', todos.filter(t=>!t.done && t.dueDays<0).length, 'var(--danger)'],
              ['today',   todos.filter(t=>!t.done && t.dueDays===0).length, 'var(--green-900)'],
              ['done',    todos.filter(t=>t.done).length, 'var(--ink-3)'],
            ].map(([k,n,c]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}>
                <span style={{ color:'var(--ink-2)', display:'flex', alignItems:'center', gap: 6 }}>
                  <span style={{ width:6, height:6, borderRadius:99, background:c }} />
                  {A_t(k, lang)}
                </span>
                <span className="mono" style={{ fontWeight: 600 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>{A_t('team', lang)}</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {window.MEMBERS.filter(m=>m.role!=='admin').slice(0, 5).map(m => {
              const count = todos.filter(t=>!t.done && t.assignee===m.id).length;
              return (
                <div key={m.id} style={{ display:'flex', alignItems:'center', gap: 9, fontSize: 12.5 }}>
                  <A_Avatar member={m} size="sm" />
                  <span style={{ flex: 1 }}>{window.memberName(m, lang).split(' ')[0]}</span>
                  <span className="mono" style={{ color:'var(--ink-3)' }}>{count}</span>
                </div>
              );
            })}
            <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 4 }}>+5 {A_t('members', lang)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function A_TodoCard({ t, lang, onToggle }) {
  const m = window.memberById(t.assignee);
  const overdue = t.dueDays < 0 && !t.done;
  return (
    <div className="card" style={{ padding: '12px 14px', display:'flex', alignItems:'center', gap: 12, opacity: t.done?0.55:1 }}>
      <button onClick={onToggle}
        style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid', borderColor: t.done?'var(--green-900)':'var(--ink-4)',
                 background: t.done?'var(--green-900)':'transparent', display:'grid', placeItems:'center', cursor:'pointer', flex:'0 0 auto', padding:0 }}>
          {t.done && <A_Icon name="check" className="icon icon-sm" style={{ color:'#fff' }} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, textDecoration: t.done?'line-through':'none', color: t.done?'var(--ink-3)':'var(--ink)' }}>
          {t.title[lang]}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 5 }}>
          <span className="pill" style={{ background:'var(--cream-2)', color:'var(--ink-2)', fontSize: 10.5 }}>
            <A_Icon name="calendar" className="icon icon-sm" />
            <span style={{ color: overdue?'var(--danger)':'inherit', fontWeight: overdue?600:500 }}>{window.formatRelDate(t.dueDays, lang)}</span>
          </span>
          <span className={`pill cat-bg-${t.cat}`} style={{ fontSize: 10.5 }}>
            <span className={`cat-dot cat-${t.cat}`} />
            {window.CATEGORIES.find(c=>c.id===t.cat)?.name?.[lang]}
          </span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
        <A_Avatar member={m} size="sm" />
        <span style={{ fontSize: 11.5, color:'var(--ink-2)' }}>{window.memberName(m, lang).split(' ')[0]}</span>
      </div>
    </div>
  );
}

// ---------- Team management (admin) ----------
function A_TeamView({ lang, categories, todos, setCurrentUser, goMember }) {
  const allKpis = categories.flatMap(c => c.kpis.map(k => ({...k, cat: c.id})));
  const rows = window.MEMBERS.map(m => {
    const owned = allKpis.filter(k => k.owner === m.id);
    const avg = owned.length ? Math.round(owned.reduce((s,k)=>s+Math.min(100,k.current/k.target*100),0)/owned.length) : null;
    const openT = todos.filter(t => t.assignee === m.id && !t.done).length;
    return { m, owned: owned.length, avg, openT };
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 14 }}>
        <A_StatCard title={A_t('members', lang)} value="11" sub={`10 ${A_t('member', lang).toLowerCase()} · 1 ${A_t('admin', lang).toLowerCase()}`} accent />
        <A_StatCard title={A_t('program', lang)} value={categories.length} sub={lang==='ka'?'აქტიური პროგრამა':'active programs'} dotClass="cat-bg-invest" />
        <A_StatCard title={A_t('ownedKpis', lang)} value={allKpis.length} sub={lang==='ka'?'სულ ინდიკატორი':'total indicators'} dotClass="cat-bg-awareness" />
        <A_StatCard title={A_t('openTasks', lang)} value={todos.filter(t=>!t.done).length} sub={lang==='ka'?'გუნდში':'across team'} dotClass="cat-bg-aftercare" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{A_t('teamTitle', lang)}</div>
          <button className="btn btn-primary"><A_Icon name="plus" className="icon icon-sm" /> {A_t('inviteMember', lang)}</button>
        </div>
        <div style={{ padding:'8px 20px', display:'grid', gridTemplateColumns:'1.6fr 90px 1fr 110px 100px 90px 32px', gap: 14, fontSize: 10.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight: 600, borderBottom:'1px solid var(--line)' }}>
          <div>{A_t('member', lang)}</div>
          <div>{A_t('role', lang)}</div>
          <div>{A_t('program', lang)}</div>
          <div style={{textAlign:'center'}}>{A_t('ownedKpis', lang)}</div>
          <div style={{textAlign:'center'}}>{A_t('openTasks', lang)}</div>
          <div style={{textAlign:'right'}}>{A_t('avgProgress', lang)}</div>
          <div></div>
        </div>
        {rows.map(({m, owned, avg, openT}) => (
          <button key={m.id} onClick={()=>{ setCurrentUser(m.id); goMember(); }}
            style={{ width:'100%', padding:'13px 20px', display:'grid', gridTemplateColumns:'1.6fr 90px 1fr 110px 100px 90px 32px', gap: 14, alignItems:'center', fontSize: 13, borderBottom:'1px solid var(--line)', borderBottomStyle:'solid', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <A_Avatar member={m} />
              <div style={{ fontWeight: 500 }}>{window.memberName(m, lang)}</div>
            </div>
            <div>
              {m.role==='admin'
                ? <span className="pill pill-green" style={{ fontSize: 10.5 }}>{A_t('admin', lang)}</span>
                : <span className="pill" style={{ background:'var(--cream-2)', fontSize: 10.5 }}>{A_t('member', lang)}</span>}
            </div>
            <div><A_CatPill cat={m.cat} lang={lang} /></div>
            <div className="mono" style={{ textAlign:'center', fontWeight: 600 }}>{owned}</div>
            <div className="mono" style={{ textAlign:'center', color: openT>0?'var(--ink)':'var(--ink-3)' }}>{openT}</div>
            <div style={{ display:'flex', alignItems:'center', gap: 8, justifyContent:'flex-end' }}>
              {avg!==null ? (
                <>
                  <div style={{ width: 44 }}><A_PB value={avg} target={100} size="sm" /></div>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, minWidth: 30, textAlign:'right' }}>{avg}%</span>
                </>
              ) : <span style={{ fontSize: 11, color:'var(--ink-4)' }}>—</span>}
            </div>
            <A_Icon name="chev" className="icon icon-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- KPI Detail ----------
function A_KpiDetail({ lang, kpi, setKpiValue, updateKpi, todos }) {
  const [val, setVal] = aUseState(kpi.current);
  const [comment, setComment] = aUseState('');
  aUseEffect(() => setVal(kpi.current), [kpi.id, kpi.current]);

  const m = window.memberById(kpi.owner);
  const p = window.pct(kpi.current, kpi.target);
  const status = window.statusOf(kpi.current, kpi.target);
  const relatedTodos = todos.filter(t => t.cat === kpi.cat).slice(0, 4);

  // fake history sparkline
  const history = [
    { date: 'Apr 12', value: Math.round(kpi.current*0.30) },
    { date: 'Apr 26', value: Math.round(kpi.current*0.50) },
    { date: 'May 5',  value: Math.round(kpi.current*0.68) },
    { date: 'May 14', value: Math.round(kpi.current*0.82) },
    { date: 'May 22', value: Math.round(kpi.current*0.93) },
    { date: 'May 27', value: kpi.current },
  ];
  const maxH = Math.max(...history.map(h=>h.value), kpi.target);

  return (
    <div style={{ display:'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
      <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, fontSize: 12, color:'var(--ink-3)', marginBottom: 8 }}>
            <A_CatPill cat={kpi.cat} lang={lang} />
            <span>·</span>
            <span>{A_t('goal', lang)}: <span style={{ color:'var(--ink-2)' }}>{kpi.goal}</span></span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing:'-0.02em' }}>{kpi.name[lang]}</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap: 24, marginTop: 18 }}>
            <div>
              <div style={{ fontSize: 11, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight: 600 }}>{A_t('current', lang)}</div>
              <div className="mono" style={{ fontSize: 38, fontWeight: 600, letterSpacing:'-0.03em' }}>{window.fmtN(kpi.current)}</div>
            </div>
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontSize: 11, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight: 600 }}>{A_t('target', lang)}</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 500, color:'var(--ink-2)' }}>{window.fmtN(kpi.target)}</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 6 }}>
              <A_StatusPill status={status} lang={lang} />
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, color: p<40?'var(--danger)':p<70?'var(--warn)':'var(--green-900)' }}>{p}%</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}><A_PB value={kpi.current} target={kpi.target} size="lg" /></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 11, color:'var(--ink-3)' }}>
            <span>0</span>
            <span>{window.fmtN(kpi.target)}</span>
          </div>
        </div>

        {/* History chart */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-head" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">{A_t('history', lang)}</div>
              <div className="section-sub">{A_t('velocity', lang)}: +{Math.round((kpi.current/6) || 1)}/wk</div>
            </div>
            <div style={{ display:'flex', gap: 6 }}>
              {['1M','3M','Q'].map((l, i) => (
                <button key={l} className="btn btn-ghost" style={{ padding:'4px 10px', fontSize: 11, background: i===1?'var(--cream-2)':'transparent' }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 140, position:'relative', display:'flex', alignItems:'flex-end', gap: 18, padding:'0 4px' }}>
            <div style={{ position:'absolute', inset:0, borderTop:'1px dashed var(--line)', top:'auto', bottom:`${(kpi.target/maxH)*100}%` }}></div>
            <div style={{ position:'absolute', right: 4, bottom: `calc(${(kpi.target/maxH)*100}% + 4px)`, fontSize: 10, color:'var(--ink-3)', fontWeight: 500 }}>{A_t('target', lang)} · {window.fmtN(kpi.target)}</div>
            {history.map((h, i) => (
              <div key={i} style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
                <div className="mono" style={{ fontSize: 10, color:'var(--ink-3)' }}>{window.fmtN(h.value)}</div>
                <div style={{ width: '100%', height: `${(h.value/maxH)*100}%`, background: i===history.length-1?'var(--green-900)':'var(--green-200)', borderRadius: 6, minHeight: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-around', marginTop: 8, fontSize: 10, color:'var(--ink-3)' }}>
            {history.map((h,i) => <span key={i}>{h.date}</span>)}
          </div>
        </div>

        {/* Related tasks */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-head"><div className="section-title">{lang==='ka'?'დაკავშირებული დავალებები':'Related tasks'}</div><div className="section-sub">{relatedTodos.length}</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {relatedTodos.map(t => <A_TodoCard key={t.id} t={t} lang={lang} onToggle={()=>{}} />)}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        <div className="card" style={{ padding: 20, background:'var(--green-900)', color:'#fff', border:'none' }}>
          <div style={{ fontSize: 12, opacity: 0.7, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 600, marginBottom: 12 }}>{A_t('pushUpdate', lang)}</div>
          <div className="field" style={{ gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom: 6 }}>{A_t('inputNewValue', lang)}</div>
              <input className="input mono" value={val} onChange={e=>setVal(+e.target.value || 0)} type="number"
                     style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', fontSize:20, fontWeight: 600, padding:'10px 14px' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom: 6 }}>{A_t('comment', lang)}</div>
              <textarea className="textarea" value={comment} onChange={e=>setComment(e.target.value)} rows={3}
                        style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', resize:'none', fontFamily:'inherit' }}
                        placeholder={lang==='ka'?'რა შეიცვალა?':'What changed?'} />
            </div>
            <button className="btn" onClick={()=>{setKpiValue(kpi.id, val); setComment('');}}
              style={{ background:'#fff', color:'var(--green-900)', fontWeight: 600, justifyContent:'center', padding:'11px 14px' }}>
              <A_Icon name="check" className="icon icon-sm" /> {A_t('pushUpdate', lang)}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>{A_t('contributors', lang)}</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <A_Avatar member={m} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{window.memberName(m, lang)}</div>
                <div style={{ fontSize: 11, color:'var(--ink-3)' }}>{lang==='ka'?'მთავარი':'Lead'} · {kpi.updated}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>{A_t('recentUpdates', lang)}</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {[
              { who: m, txt: lang==='ka'?'4 ახალი კონტაქტი დაემატა':'Added 4 new contacts', when: '2h ago', delta: '+4' },
              { who: window.memberById('m0'), txt: lang==='ka'?'მიზანი დადასტურდა':'Target confirmed for Q2', when: 'yesterday', delta: null },
              { who: m, txt: lang==='ka'?'პროგრესი განახლდა':'Progress updated', when: '3d ago', delta: '+12' },
            ].map((u, i) => (
              <div key={i} style={{ display:'flex', gap: 9, fontSize: 12 }}>
                <A_Avatar member={u.who} size="sm" />
                <div style={{ flex: 1 }}>
                  <div>{u.txt}</div>
                  <div style={{ color:'var(--ink-3)', fontSize: 11, marginTop: 1 }}>{u.when}</div>
                </div>
                {u.delta && <span className="mono pill pill-green" style={{ alignSelf:'flex-start' }}>{u.delta}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.AppA = AppA;
