// ============================================================
// hub-dashboard.jsx — Dashboard (admin + user)
// ============================================================
function DashboardView() {
  const s = window.useStore();
  const { Icon, Avatar, ProgressBar, StatusBadge, ProgramPill } = window;
  const lang = s.lang;
  const me = s.currentUser;

  const visibleKpis = s.kpis.filter(k => !k.archived && (s.isAdmin || k.assignees.includes(me.id)));
  const counts = { onTrack:0, atRisk:0, behind:0, done:0 };
  visibleKpis.forEach(k => counts[window.kpiStatus(k.current,k.target)]++);

  const myTodos = s.todos.filter(t => t.assignees.includes(me.id) && t.status!=='done');
  const myOverdue = myTodos.filter(t => window.daysBetween(t.dueDate) < 0).length;

  const myLogs = s.logs.filter(l => s.isAdmin || l.userId===me.id).slice(0, 6);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <div style={{ fontSize:12, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{window.tr('org',lang)} · Q2 2026</div>
        <h1 style={{ fontSize:30, fontWeight:600, letterSpacing:'-0.025em', margin:'6px 0 0' }}>{lang==='ge'?'გამარჯობა, ':'Hello, '}{me.name.split(' ')[0]}</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr 1fr', gap:14 }}>
        <div style={{ background:'var(--green-900)', color:'#fff', borderRadius:'var(--r-lg)', padding:18 }}>
          <div style={{ fontSize:12, opacity:0.7, fontWeight:500 }}>{window.tr('totalKpis',lang)}</div>
          <div className="num-xl" style={{ marginTop:6 }}>{visibleKpis.length}</div>
          <div style={{ fontSize:11.5, opacity:0.7, marginTop:6 }}>{s.isAdmin?(lang==='ge'?'მთელ გუნდში':'across the team'):(lang==='ge'?'შენზე მინიჭებული':'assigned to you')}</div>
        </div>
        {[['onTrack',counts.onTrack+counts.done,'cat-bg-invest'],['atRisk',counts.atRisk,'cat-bg-awareness'],['behind',counts.behind,'cat-bg-aftercare']].map(([k,n,c])=>(
          <div key={k} className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'var(--ink-3)', fontWeight:500 }}><span className={`cat-dot ${c}`} style={{ background:'currentColor', opacity:0.5 }}/>{window.tr(k,lang)}</div>
            <div className="num-xl" style={{ marginTop:6 }}>{n}</div>
            <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:6 }}>KPIs</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: s.isAdmin?'1.4fr 1fr':'1fr 1fr', gap:18, alignItems:'flex-start' }}>
        {/* Admin: team health / Member: my KPIs */}
        {s.isAdmin ? (
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{window.tr('teamHealth',lang)}</div>
              <button className="btn btn-ghost" style={{ fontSize:12, padding:'5px 10px' }} onClick={()=>window.navigate('/team')}>{window.tr('team',lang)} <Icon name="arrow" className="icon icon-sm"/></button>
            </div>
            {window.PROGRAMS.map(pr => {
              const ks = visibleKpis.filter(k=>k.program===pr);
              if(!ks.length) return null;
              const avg = Math.round(ks.reduce((a,k)=>a+Math.min(100,k.current/k.target*100),0)/ks.length);
              const stale = ks.filter(k => !s.logs.some(l => l.kpiId===k.id && window.daysBetween(l.date) > -7)).length;
              return (
                <div key={pr} style={{ padding:'13px 18px', borderBottom:'1px solid var(--line)', display:'grid', gridTemplateColumns:'180px 1fr 60px 90px', gap:14, alignItems:'center' }}>
                  <ProgramPill program={pr} lang={lang}/>
                  <ProgressBar value={avg} target={100} tone=""/>
                  <span className="mono" style={{ fontSize:13, fontWeight:600, textAlign:'right' }}>{avg}%</span>
                  {stale>0 ? <span className="badge badge-amber" style={{ fontSize:10 }}>{stale} {window.tr('stale',lang)}</span> : <span style={{ fontSize:11, color:'var(--ink-4)', textAlign:'right' }}>✓</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{window.tr('kpis',lang)}</div>
              <button className="btn btn-ghost" style={{ fontSize:12, padding:'5px 10px' }} onClick={()=>window.navigate('/kpis')}>{window.tr('viewAll',lang)} <Icon name="arrow" className="icon icon-sm"/></button>
            </div>
            {visibleKpis.map(k => (
              <button key={k.id} onClick={()=>window.navigate('/kpis/'+k.id)} className="tbl-row" style={{ gridTemplateColumns:'1.6fr 1fr 80px 90px', borderBottomColor:'var(--line)' }}>
                <span style={{ fontWeight:500 }}>{k.title[lang]}</span>
                <ProgressBar value={k.current} target={k.target} size="sm"/>
                <span className="mono" style={{ fontSize:12, textAlign:'right' }}>{window.fmtN(k.current)}/{window.fmtN(k.target)}</span>
                <span style={{ textAlign:'right' }}><StatusBadge status={window.kpiStatus(k.current,k.target)} lang={lang}/></span>
              </button>
            ))}
          </div>
        )}

        {/* Right column: to-dos + activity */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{window.tr('myTasks',lang)}</div>
              {myOverdue>0 && <span className="badge badge-red" style={{ fontSize:10 }}>{myOverdue} {window.tr('overdue',lang)}</span>}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:12 }}>
              <span className="num-xl">{myTodos.length}</span><span style={{ fontSize:12, color:'var(--ink-3)' }}>{window.tr('open',lang).toLowerCase()}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {myTodos.slice(0,4).map(t => {
                const od = window.daysBetween(t.dueDate)<0;
                return (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                    <window.Cbx checked={false} size="sm" onClick={()=>s.updateTodo(t.id,{status:'done'})}/>
                    <span style={{ flex:1 }}>{t.title[lang]}</span>
                    <span style={{ fontSize:11, color: od?'var(--danger)':'var(--ink-3)', fontWeight: od?600:400 }}>{window.relDate(t.dueDate,lang)}</span>
                  </div>
                );
              })}
              {!myTodos.length && <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>{lang==='ge'?'ღია დავალება არ არის 🎉':'No open tasks 🎉'}</div>}
            </div>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:12, fontSize:12.5 }} onClick={()=>window.navigate('/todos')}>{window.tr('viewAll',lang)}</button>
          </div>

          <div className="card" style={{ padding:18 }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>{window.tr('recentActivity',lang)}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {myLogs.map(l => {
                const u = window.userById(s,l.userId);
                const kpi = s.kpis.find(k=>k.id===l.kpiId);
                const ent = l.entityType==='company' ? s.companies.find(c=>c.id===l.entityId) : s.articles.find(a=>a.id===l.entityId);
                return (
                  <div key={l.id} className="feed-item">
                    <div style={{ width:28, height:28, borderRadius:99, background:'var(--green-50)', display:'grid', placeItems:'center', color:'var(--green-900)', flex:'0 0 auto', zIndex:1 }}><Icon name={window.activityIcon(l.activityType)} className="icon icon-sm"/></div>
                    <div style={{ flex:1, fontSize:12.5 }}>
                      <div><strong>{u.name.split(' ')[0]}</strong> {lang==='ge'?'დააფიქსირა':'logged'} <strong>+{l.count}</strong> {window.tr(l.activityType,lang).toLowerCase()} · {kpi?.title[lang]}</div>
                      <div style={{ color:'var(--ink-3)', fontSize:11, marginTop:2 }}>{ent ? (ent.name||ent.title) : ''} · {window.fmtDate(l.date,lang)}</div>
                    </div>
                  </div>
                );
              })}
              {!myLogs.length && <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>{window.tr('noActivity',lang)}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.DashboardView = DashboardView;
