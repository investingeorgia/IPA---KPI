// ============================================================
// hub-kpis.jsx — KPI list, KPI detail, LogModal (2-step), CreateKpiModal
// ============================================================

/* ---------------- LogModal (2-step) ---------------- */
function LogModal({ onClose, presetKpiId }) {
  const s = window.useStore();
  const { Icon } = window;
  const lang = s.lang;
  const myKpis = s.kpis.filter(k => !k.archived && (s.isAdmin || k.assignees.includes(s.currentUser.id)));
  const [step, setStep] = React.useState(1);
  const [kpiId, setKpiId] = React.useState(presetKpiId || (myKpis[0] && myKpis[0].id) || '');
  const [atype, setAtype] = React.useState('meeting');
  const [count, setCount] = React.useState(1);
  const [entityName, setEntityName] = React.useState('');
  const [comment, setComment] = React.useState('');

  const entityType = atype==='article' ? 'article' : 'company';
  const kpi = s.kpis.find(k=>k.id===kpiId);

  const finish = () => {
    s.logProgress({ kpiId, userId:s.currentUser.id, activityType:atype, count, entityType, entityName, comment });
    onClose();
  };

  const foot = step===1 ? (
    <>
      <button className="btn btn-ghost" onClick={onClose}>{window.tr('cancel',lang)}</button>
      <button className="btn btn-primary" disabled={!kpiId} onClick={()=>setStep(2)}>{window.tr('next',lang)} <Icon name="arrow" className="icon icon-sm"/></button>
    </>
  ) : (
    <>
      <button className="btn btn-ghost" onClick={()=>setStep(1)}><Icon name="chevLeft" className="icon icon-sm"/> {window.tr('back',lang)}</button>
      <button className="btn btn-primary" onClick={finish}><Icon name="check" className="icon icon-sm"/> {window.tr('submit',lang)}</button>
    </>
  );

  return (
    <window.Modal title={window.tr('logProgress',lang)} sub={(lang==='ge'?'ნაბიჯი ':'Step ')+step+'/2'} onClose={onClose} foot={foot}>
      {step===1 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="field">
            <label className="field-label">KPI</label>
            <select className="select" value={kpiId} onChange={e=>setKpiId(e.target.value)}>
              {myKpis.map(k => <option key={k.id} value={k.id}>{k.title[lang]} ({window.tr(k.program,lang)})</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">{window.tr('activityType',lang)}</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {window.SEED.ATYPES.map(a => (
                <button key={a} onClick={()=>setAtype(a)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', borderRadius:12, border:'1px solid', cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:500,
                  background:atype===a?'var(--green-50)':'#fff', borderColor:atype===a?'var(--green-500)':'var(--line)', color:atype===a?'var(--green-900)':'var(--ink-2)' }}>
                  <Icon name={window.activityIcon(a)} className="icon icon-lg"/>{window.tr(a,lang)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{window.tr('count',lang)}</label>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button className="btn btn-ghost" onClick={()=>setCount(c=>Math.max(1,c-1))} style={{ width:40, justifyContent:'center' }}>−</button>
              <input className="input mono" type="number" value={count} onChange={e=>setCount(Math.max(1,+e.target.value||1))} style={{ textAlign:'center', fontSize:18, fontWeight:600, width:90 }}/>
              <button className="btn btn-ghost" onClick={()=>setCount(c=>c+1)} style={{ width:40, justifyContent:'center' }}>+</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:12, background:'var(--cream)', borderRadius:12, fontSize:13 }}>
            <Icon name={window.activityIcon(atype)} className="icon"/>
            <span><strong>+{count}</strong> {window.tr(atype,lang).toLowerCase()}</span>
            <span style={{ color:'var(--ink-3)' }}>· {kpi?.title[lang]}</span>
          </div>
          {entityType==='company' ? (
            <div className="field">
              <label className="field-label">{window.tr('companyName',lang)}</label>
              <input className="input" list="company-list" value={entityName} onChange={e=>setEntityName(e.target.value)} placeholder="Schneider Electric…" autoFocus/>
              <datalist id="company-list">{s.companies.map(c=><option key={c.id} value={c.name}/>)}</datalist>
            </div>
          ) : (
            <div className="field">
              <label className="field-label">{window.tr('articleLink',lang)}</label>
              <input className="input" value={entityName} onChange={e=>setEntityName(e.target.value)} placeholder="https://…" autoFocus/>
            </div>
          )}
          <div style={{ fontSize:11.5, color:'var(--ink-3)', display:'flex', alignItems:'center', gap:6, marginTop:-8 }}>
            <Icon name="db" className="icon icon-sm"/>
            {entityName.trim()
              ? ((entityType==='company' ? s.companies.some(c=>c.name.toLowerCase()===entityName.trim().toLowerCase()) : s.articles.some(a=>a.url.toLowerCase()===entityName.trim().toLowerCase()))
                  ? (lang==='ge'?'არსებულ ჩანაწერთან დაკავშირდება':'Links to existing record')
                  : (lang==='ge'?'შეიქმნება ახალი ჩანაწერი':'Creates a new database record'))
              : (lang==='ge'?'ბაზა ავტომატურად განახლდება':'Database auto-populates from this')}
          </div>
          <div className="field">
            <label className="field-label">{window.tr('notes',lang)} ({lang==='ge'?'არასავალდ.':'optional'})</label>
            <textarea className="textarea" rows={2} value={comment} onChange={e=>setComment(e.target.value)} style={{ resize:'none', fontFamily:'inherit' }}/>
          </div>
        </div>
      )}
    </window.Modal>
  );
}
window.LogModal = LogModal;

/* ---------------- KPI List ---------------- */
function KpiListView() {
  const s = window.useStore();
  const { ProgressBar, StatusBadge, ProgramPill, Avatar, Icon } = window;
  const lang = s.lang;
  const [prog, setProg] = React.useState('all');
  const [showCreate, setShowCreate] = React.useState(false);

  const kpis = s.kpis.filter(k => !k.archived && (s.isAdmin || k.assignees.includes(s.currentUser.id)) && (prog==='all'||k.program===prog));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div><h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{window.tr('kpis',lang)}</h1>
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:2 }}>{s.isAdmin ? (lang==='ge'?'ყველა პროგრამა':'All programs') : (lang==='ge'?'შენზე მინიჭებული':'Assigned to you')} · {kpis.length} KPIs</div></div>
        {s.isAdmin && <button className="btn btn-primary" onClick={()=>setShowCreate(true)}><Icon name="plus" className="icon icon-sm"/> {window.tr('createKpi',lang)}</button>}
      </div>

      <div className="seg" style={{ alignSelf:'flex-start' }}>
        {['all',...window.PROGRAMS].map(p => <button key={p} className={prog===p?'active':''} onClick={()=>setProg(p)}>{p==='all'?window.tr('all',lang):window.tr(p,lang)}</button>)}
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="tbl-head" style={{ gridTemplateColumns:'1.8fr 1fr 1.1fr 110px 90px 110px 28px' }}>
          <div>KPI</div><div>{window.tr('program',lang)}</div><div>{window.tr('progress',lang)}</div><div>{window.tr('assignees',lang)}</div><div style={{textAlign:'right'}}>{window.tr('deadline',lang)}</div><div>{window.tr('status',lang)}</div><div></div>
        </div>
        {kpis.map(k => (
          <button key={k.id} className="tbl-row" style={{ gridTemplateColumns:'1.8fr 1fr 1.1fr 110px 90px 110px 28px' }} onClick={()=>window.navigate('/kpis/'+k.id)}>
            <span style={{ fontWeight:500 }}>{k.title[lang]}</span>
            <span><ProgramPill program={k.program} lang={lang}/></span>
            <span style={{ display:'flex', alignItems:'center', gap:8 }}><ProgressBar value={k.current} target={k.target} size="sm"/><span className="mono" style={{ fontSize:11.5, minWidth:30, textAlign:'right' }}>{window.pct(k.current,k.target)}%</span></span>
            <span className="avatar-stack">{k.assignees.slice(0,3).map(id=><Avatar key={id} user={window.userById(s,id)} size="sm"/>)}</span>
            <span className="mono" style={{ fontSize:11.5, textAlign:'right', color: window.daysBetween(k.deadline)<14?'var(--warn)':'var(--ink-3)' }}>{window.fmtDate(k.deadline,lang)}</span>
            <span><StatusBadge status={window.kpiStatus(k.current,k.target)} lang={lang}/></span>
            <Icon name="chev" className="icon icon-sm"/>
          </button>
        ))}
        {!kpis.length && <div className="empty">{lang==='ge'?'KPI არ მოიძებნა':'No KPIs found'}</div>}
      </div>
      {showCreate && <window.CreateKpiModal onClose={()=>setShowCreate(false)}/>}
    </div>
  );
}
window.KpiListView = KpiListView;

/* ---------------- Create KPI Modal ---------------- */
function CreateKpiModal({ onClose }) {
  const s = window.useStore();
  const lang = s.lang;
  const [f, setF] = React.useState({ title:'', program:'invest', target:100, unit:'#', deadline:window.SEED.today.toISOString().slice(0,10), assignees:[] });
  const set = (k,v) => setF(o=>({...o,[k]:v}));
  const toggleAssignee = (id) => setF(o=>({...o, assignees: o.assignees.includes(id)?o.assignees.filter(x=>x!==id):[...o.assignees,id]}));
  const save = () => { if(!f.title.trim())return; s.createKpi({ title:{en:f.title,ge:f.title}, program:f.program, target:+f.target, unit:f.unit, deadline:f.deadline, assignees:f.assignees }); onClose(); };

  return (
    <window.Modal title={window.tr('createKpi',lang)} onClose={onClose} foot={<>
      <button className="btn btn-ghost" onClick={onClose}>{window.tr('cancel',lang)}</button>
      <button className="btn btn-primary" onClick={save}>{window.tr('save',lang)}</button>
    </>}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="field"><label className="field-label">{window.tr('title',lang)}</label><input className="input" value={f.title} onChange={e=>set('title',e.target.value)} autoFocus/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="field"><label className="field-label">{window.tr('program',lang)}</label>
            <select className="select" value={f.program} onChange={e=>set('program',e.target.value)}>{window.PROGRAMS.map(p=><option key={p} value={p}>{window.tr(p,lang)}</option>)}</select></div>
          <div className="field"><label className="field-label">{window.tr('deadline',lang)}</label><input className="input" type="date" value={f.deadline} onChange={e=>set('deadline',e.target.value)}/></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="field"><label className="field-label">{window.tr('target',lang)}</label><input className="input mono" type="number" value={f.target} onChange={e=>set('target',e.target.value)}/></div>
          <div className="field"><label className="field-label">{window.tr('unit',lang)}</label><input className="input" value={f.unit} onChange={e=>set('unit',e.target.value)}/></div>
        </div>
        <div className="field"><label className="field-label">{window.tr('assignees',lang)}</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {s.users.filter(u=>u.role!=='admin').map(u => (
              <button key={u.id} onClick={()=>toggleAssignee(u.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px 5px 5px', borderRadius:99, border:'1px solid', cursor:'pointer', fontFamily:'inherit', fontSize:12,
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
window.CreateKpiModal = CreateKpiModal;
