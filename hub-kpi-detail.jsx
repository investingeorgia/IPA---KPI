// ============================================================
// hub-kpi-detail.jsx — KPI detail (progress log, tasks, log/edit)
// ============================================================
function KpiDetailView({ id }) {
  const s = window.useStore();
  const { Icon, Avatar, ProgressBar, StatusBadge, ProgramPill, Cbx } = window;
  const lang = s.lang;
  const kpi = s.kpis.find(k=>k.id===id);
  const [showLog, setShowLog] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [newTask, setNewTask] = React.useState('');

  if (!kpi) return <div className="empty">KPI not found. <a className="lnk" href="#/kpis">{window.tr('kpis',lang)}</a></div>;
  const canEdit = s.isAdmin;
  const myLogs = s.logs.filter(l => l.kpiId===kpi.id && (s.isAdmin || l.userId===s.currentUser.id));
  const p = window.pct(kpi.current, kpi.target);
  const status = window.kpiStatus(kpi.current, kpi.target);

  const addTask = () => { if(!newTask.trim())return; s.addTask(kpi.id,{ title:{en:newTask,ge:newTask}, assignedTo:s.currentUser.id, dueDate:window.SEED.today.toISOString().slice(0,10) }); setNewTask(''); setShowAddTask(false); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:'var(--ink-3)' }}>
        <a className="lnk" style={{ border:'none' }} href="#/kpis">{window.tr('kpis',lang)}</a><Icon name="chev" className="icon icon-sm"/><span>{kpi.title[lang]}</span>
      </div>

      {/* hero */}
      <div className="card" style={{ padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}><ProgramPill program={kpi.program} lang={lang}/><StatusBadge status={status} lang={lang}/></div>
            <h1 style={{ fontSize:30, fontWeight:600, letterSpacing:'-0.025em', margin:0 }}>{kpi.title[lang]}</h1>
            <div style={{ display:'flex', gap:24, marginTop:14, fontSize:12.5, color:'var(--ink-3)', flexWrap:'wrap' }}>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}><Icon name="calendar" className="icon icon-sm"/>{window.tr('deadline',lang)}: <strong style={{ color: window.daysBetween(kpi.deadline)<14?'var(--warn)':'var(--ink-2)' }}>{window.fmtDate(kpi.deadline,lang)}</strong></span>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>{window.tr('assignedTo',lang)}:
                <span className="avatar-stack" style={{ marginLeft:4 }}>{kpi.assignees.map(aid=><Avatar key={aid} user={window.userById(s,aid)} size="sm"/>)}</span></span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {canEdit && <button className="btn btn-ghost" onClick={()=>setShowEdit(true)}><Icon name="edit" className="icon icon-sm"/> {window.tr('edit',lang)}</button>}
            <button className="btn btn-primary" onClick={()=>setShowLog(true)}><Icon name="bolt" className="icon icon-sm"/> {window.tr('logProgress',lang)}</button>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:24, marginTop:22 }}>
          <div className="mono" style={{ fontSize:44, fontWeight:600, letterSpacing:'-0.03em', lineHeight:1 }}>{window.fmtN(kpi.current)}<span style={{ fontSize:20, color:'var(--ink-3)' }}> / {window.fmtN(kpi.target)} {kpi.unit!=='#'?kpi.unit:''}</span></div>
          <div className="mono" style={{ marginLeft:'auto', fontSize:30, fontWeight:600, color: p<40?'var(--danger)':p<70?'var(--warn)':'var(--green-900)' }}>{p}%</div>
        </div>
        <div style={{ marginTop:12 }}><ProgressBar value={kpi.current} target={kpi.target} size="lg"/></div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18, alignItems:'flex-start' }}>
        {/* Progress log */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{window.tr('progressLog',lang)}</div>
            <span style={{ fontSize:12, color:'var(--ink-3)' }}>{myLogs.length}</span>
          </div>
          <div style={{ maxHeight:420, overflowY:'auto' }}>
            {myLogs.map(l => {
              const u = window.userById(s,l.userId);
              const ent = l.entityType==='company' ? s.companies.find(c=>c.id===l.entityId) : s.articles.find(a=>a.id===l.entityId);
              return (
                <div key={l.id} style={{ padding:'13px 18px', borderBottom:'1px solid var(--line)', display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:30, height:30, borderRadius:99, background:'var(--green-50)', display:'grid', placeItems:'center', color:'var(--green-900)', flex:'0 0 auto' }}><Icon name={window.activityIcon(l.activityType)} className="icon icon-sm"/></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13 }}><strong>+{l.count}</strong> {window.tr(l.activityType,lang).toLowerCase()}{ent && <> · <a className="lnk" href={'#/database/'+(l.entityType==='company'?'companies':'articles')+'/'+l.entityId}>{ent.name||ent.title}</a></>}</div>
                    {l.comment && <div style={{ fontSize:12, color:'var(--ink-2)', marginTop:3 }}>{l.comment}</div>}
                    <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:3 }}>{u.name.split(' ')[0]} · {window.fmtDate(l.date,lang)}</div>
                  </div>
                  {s.isAdmin && <button className="btn-icon" onClick={()=>s.deleteLog(l.id)} title="Delete"><Icon name="trash" className="icon icon-sm"/></button>}
                </div>
              );
            })}
            {!myLogs.length && <div className="empty">{window.tr('noActivity',lang)}</div>}
          </div>
        </div>

        {/* Tasks */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{window.tr('tasks',lang)}</div>
            {s.isAdmin && <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }} onClick={()=>setShowAddTask(v=>!v)}><Icon name="plus" className="icon icon-sm"/> {window.tr('addTask',lang)}</button>}
          </div>
          {showAddTask && (
            <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--line)', display:'flex', gap:8 }}>
              <input className="input" value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder={window.tr('addTask',lang)} autoFocus/>
              <button className="btn btn-primary" onClick={addTask}>{window.tr('save',lang)}</button>
            </div>
          )}
          <div>
            {kpi.tasks.map(t => {
              const doneCount = t.subtasks.filter(st=>st.done).length;
              const u = window.userById(s,t.assignedTo);
              return (
                <div key={t.id} style={{ padding:'13px 18px', borderBottom:'1px solid var(--line)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{t.title[lang]}</span>
                    {u && <Avatar user={u} size="sm"/>}
                    <span style={{ fontSize:11, color: window.daysBetween(t.dueDate)<0?'var(--danger)':'var(--ink-3)' }}>{window.relDate(t.dueDate,lang)}</span>
                  </div>
                  {t.subtasks.length>0 && (
                    <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:7, paddingLeft:2 }}>
                      {t.subtasks.map(st => (
                        <div key={st.id} style={{ display:'flex', alignItems:'center', gap:9, fontSize:12.5 }}>
                          <Cbx checked={st.done} size="sm" onClick={()=>s.toggleSubtask(kpi.id,t.id,st.id)}/>
                          <span style={{ textDecoration:st.done?'line-through':'none', color:st.done?'var(--ink-3)':'var(--ink-2)' }}>{st.title[lang]}</span>
                        </div>
                      ))}
                      <div style={{ fontSize:10.5, color:'var(--ink-3)', marginTop:2 }}>{doneCount}/{t.subtasks.length} {window.tr('subtasks',lang)}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {!kpi.tasks.length && <div className="empty">{lang==='ge'?'დავალება არ არის':'No tasks yet'}</div>}
          </div>
        </div>
      </div>

      {showLog && <window.LogModal onClose={()=>setShowLog(false)} presetKpiId={kpi.id}/>}
      {showEdit && <window.EditKpiModal kpi={kpi} onClose={()=>setShowEdit(false)}/>}
    </div>
  );
}
window.KpiDetailView = KpiDetailView;

/* ---------------- Edit KPI Modal (admin) ---------------- */
function EditKpiModal({ kpi, onClose }) {
  const s = window.useStore();
  const lang = s.lang;
  const [f, setF] = React.useState({ target:kpi.target, deadline:kpi.deadline, program:kpi.program, assignees:[...kpi.assignees] });
  const set = (k,v)=>setF(o=>({...o,[k]:v}));
  const toggle = (id)=>setF(o=>({...o, assignees:o.assignees.includes(id)?o.assignees.filter(x=>x!==id):[...o.assignees,id]}));
  const save = ()=>{ s.updateKpi(kpi.id,{ target:+f.target, deadline:f.deadline, program:f.program, assignees:f.assignees }); onClose(); };

  return (
    <window.Modal title={window.tr('edit',lang)+' · '+kpi.title[lang]} onClose={onClose} foot={<>
      <button className="btn btn-ghost" onClick={()=>{ s.archiveKpi(kpi.id); onClose(); }} style={{ color:'var(--danger)' }}>{window.tr('archive',lang)}</button>
      <div style={{ display:'flex', gap:8 }}><button className="btn btn-ghost" onClick={onClose}>{window.tr('cancel',lang)}</button><button className="btn btn-primary" onClick={save}>{window.tr('save',lang)}</button></div>
    </>}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="field"><label className="field-label">{window.tr('target',lang)}</label><input className="input mono" type="number" value={f.target} onChange={e=>set('target',e.target.value)}/></div>
          <div className="field"><label className="field-label">{window.tr('deadline',lang)}</label><input className="input" type="date" value={f.deadline} onChange={e=>set('deadline',e.target.value)}/></div>
        </div>
        <div className="field"><label className="field-label">{window.tr('program',lang)}</label>
          <select className="select" value={f.program} onChange={e=>set('program',e.target.value)}>{window.PROGRAMS.map(p=><option key={p} value={p}>{window.tr(p,lang)}</option>)}</select></div>
        <div className="field"><label className="field-label">{window.tr('assignees',lang)}</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {s.users.filter(u=>u.role!=='admin').map(u => (
              <button key={u.id} onClick={()=>toggle(u.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px 5px 5px', borderRadius:99, border:'1px solid', cursor:'pointer', fontFamily:'inherit', fontSize:12,
                background:f.assignees.includes(u.id)?'var(--green-50)':'#fff', borderColor:f.assignees.includes(u.id)?'var(--green-500)':'var(--line)' }}>
                <window.Avatar user={u} size="sm"/>{u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </window.Modal>
  );
}
window.EditKpiModal = EditKpiModal;
