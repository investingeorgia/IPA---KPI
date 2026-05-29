// ============================================================
// hub-team.jsx — Team management, Member detail, Profile
// ============================================================
function TeamView() {
  const s = window.useStore();
  const { Icon, Avatar, ProgressBar } = window;
  const lang = s.lang;
  const [showNew, setShowNew] = React.useState(false);

  const lastActivityOf = (uid) => {
    const ls = s.logs.filter(l=>l.userId===uid);
    if(!ls.length) return null;
    return ls.reduce((a,b)=> new Date(a.date)>new Date(b.date)?a:b).date;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div><h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{window.tr('teamMgmt',lang)}</h1>
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:2 }}>{s.users.length} {lang==='ge'?'წევრი':'members'} · 4 {window.tr('program',lang).toLowerCase()}</div></div>
        <button className="btn btn-primary" onClick={()=>setShowNew(true)}><Icon name="plus" className="icon icon-sm"/> {window.tr('newUser',lang)}</button>
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="tbl-head" style={{ gridTemplateColumns:'1.6fr 1.4fr 90px 100px 110px 28px' }}>
          <div>{lang==='ge'?'წევრი':'Member'}</div><div>{window.tr('email',lang)}</div><div>{window.tr('role',lang)}</div><div style={{textAlign:'center'}}>{window.tr('activeKpis',lang)}</div><div style={{textAlign:'right'}}>{window.tr('lastActivity',lang)}</div><div></div>
        </div>
        {s.users.map(u => {
          const kc = s.kpis.filter(k=>!k.archived && k.assignees.includes(u.id)).length;
          const la = lastActivityOf(u.id);
          return (
            <button key={u.id} className="tbl-row" style={{ gridTemplateColumns:'1.6fr 1.4fr 90px 100px 110px 28px' }} onClick={()=>window.navigate('/team/'+u.id)}>
              <span style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar user={u}/><span style={{ fontWeight:500 }}>{u.name}</span></span>
              <span style={{ fontSize:12, color:'var(--ink-3)' }}>{u.email}</span>
              <span><span className={`badge ${u.role==='admin'?'badge-green':'badge-gray'}`} style={{ fontSize:10.5 }}>{window.tr(u.role,lang)}</span></span>
              <span className="mono" style={{ textAlign:'center', fontWeight:600 }}>{kc}</span>
              <span style={{ textAlign:'right', fontSize:11.5, color: la&&window.daysBetween(la)>-7?'var(--ink-2)':'var(--warn)' }}>{la?window.fmtDate(la,lang):'—'}</span>
              <Icon name="chev" className="icon icon-sm"/>
            </button>
          );
        })}
      </div>
      {showNew && <NewUserModal onClose={()=>setShowNew(false)}/>}
    </div>
  );
}
window.TeamView = TeamView;

function MemberDetailView({ userId }) {
  const s = window.useStore();
  const { Icon, Avatar, ProgressBar, StatusBadge, ProgramPill } = window;
  const lang = s.lang;
  const u = window.userById(s, userId);
  if(!u) return <div className="empty">Member not found. <a className="lnk" href="#/team">{window.tr('team',lang)}</a></div>;

  const kpis = s.kpis.filter(k=>!k.archived && k.assignees.includes(u.id));
  const logs = s.logs.filter(l=>l.userId===u.id);
  const todos = s.todos.filter(t=>(t.ownerId===u.id||t.assignees.includes(u.id)) && t.status!=='done');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:'var(--ink-3)' }}>
        <a className="lnk" style={{ border:'none' }} href="#/team">{window.tr('team',lang)}</a><Icon name="chev" className="icon icon-sm"/><span>{u.name}</span>
      </div>

      <div className="card" style={{ padding:22, display:'flex', alignItems:'center', gap:18 }}>
        <Avatar user={u} size="xl"/>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{u.name}</h1>
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:4, display:'flex', alignItems:'center', gap:10 }}>{u.email}<span className={`badge ${u.role==='admin'?'badge-green':'badge-gray'}`} style={{ fontSize:10 }}>{window.tr(u.role,lang)}</span><ProgramPill program={u.program} lang={lang}/></div>
        </div>
        <div style={{ display:'flex', gap:24, textAlign:'center' }}>
          <div><div className="num-lg mono">{kpis.length}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{window.tr('activeKpis',lang)}</div></div>
          <div><div className="num-lg mono">{logs.length}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{window.tr('activityHistory',lang).split(' ')[0]}</div></div>
          <div><div className="num-lg mono">{todos.length}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{window.tr('open',lang)}</div></div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18, alignItems:'flex-start' }}>
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', fontWeight:600, fontSize:14 }}>{window.tr('kpis',lang)}</div>
          {kpis.map(k => (
            <div key={k.id} style={{ padding:'13px 18px', borderBottom:'1px solid var(--line)', display:'grid', gridTemplateColumns:'1.6fr 1fr 80px 100px', gap:12, alignItems:'center' }}>
              <a className="lnk" style={{ border:'none', fontSize:13, fontWeight:500 }} href={'#/kpis/'+k.id}>{k.title[lang]}</a>
              <ProgressBar value={k.current} target={k.target} size="sm"/>
              <span className="mono" style={{ fontSize:11.5, textAlign:'right' }}>{window.pct(k.current,k.target)}%</span>
              <span style={{ display:'flex', justifyContent:'flex-end', gap:6 }}><StatusBadge status={window.kpiStatus(k.current,k.target)} lang={lang}/></span>
            </div>
          ))}
          {!kpis.length && <div className="empty">{lang==='ge'?'KPI არ აქვს':'No KPIs'}</div>}
          <div style={{ padding:'12px 18px' }}><button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:12.5 }}><Icon name="arrow" className="icon icon-sm"/> {window.tr('reassign',lang)}</button></div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', fontWeight:600, fontSize:14 }}>{window.tr('progressLog',lang)}</div>
            <div style={{ maxHeight:280, overflowY:'auto' }}>
              {logs.map(l => {
                const kpi=s.kpis.find(k=>k.id===l.kpiId);
                return (
                  <div key={l.id} style={{ padding:'11px 18px', borderBottom:'1px solid var(--line)', display:'flex', gap:10, alignItems:'center', fontSize:12.5 }}>
                    <div style={{ width:26, height:26, borderRadius:99, background:'var(--green-50)', display:'grid', placeItems:'center', color:'var(--green-900)', flex:'0 0 auto' }}><Icon name={window.activityIcon(l.activityType)} className="icon icon-sm"/></div>
                    <span style={{ flex:1 }}><strong>+{l.count}</strong> {window.tr(l.activityType,lang).toLowerCase()} · {kpi?.title[lang]}</span>
                    <span style={{ color:'var(--ink-3)', fontSize:11 }}>{window.fmtDate(l.date,lang)}</span>
                  </div>
                );
              })}
              {!logs.length && <div className="empty">{window.tr('noActivity',lang)}</div>}
            </div>
          </div>
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', fontWeight:600, fontSize:14 }}>{window.tr('myTasks',lang)}</div>
            {todos.map(t => (
              <div key={t.id} style={{ padding:'11px 18px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', gap:10, fontSize:12.5 }}>
                <span style={{ flex:1 }}>{t.title[lang]}</span>
                <span style={{ fontSize:11, color:window.daysBetween(t.dueDate)<0?'var(--danger)':'var(--ink-3)' }}>{window.relDate(t.dueDate,lang)}</span>
              </div>
            ))}
            {!todos.length && <div className="empty">{lang==='ge'?'ღია დავალება არ არის':'No open tasks'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
window.MemberDetailView = MemberDetailView;

function NewUserModal({ onClose }) {
  const s = window.useStore();
  const lang = s.lang;
  const [f,setF] = React.useState({ name:'', email:'', role:'user', program:'invest' });
  const set=(k,v)=>setF(o=>({...o,[k]:v}));
  return (
    <window.Modal title={window.tr('newUser',lang)} onClose={onClose} foot={<>
      <button className="btn btn-ghost" onClick={onClose}>{window.tr('cancel',lang)}</button>
      <button className="btn btn-primary" onClick={onClose}>{window.tr('save',lang)}</button>
    </>}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="field"><label className="field-label">{window.tr('displayName',lang)}</label><input className="input" value={f.name} onChange={e=>set('name',e.target.value)} autoFocus/></div>
        <div className="field"><label className="field-label">{window.tr('email',lang)}</label><input className="input" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="field"><label className="field-label">{window.tr('role',lang)}</label><select className="select" value={f.role} onChange={e=>set('role',e.target.value)}><option value="user">{window.tr('user',lang)}</option><option value="admin">{window.tr('admin',lang)}</option></select></div>
          <div className="field"><label className="field-label">{window.tr('program',lang)}</label><select className="select" value={f.program} onChange={e=>set('program',e.target.value)}>{window.PROGRAMS.map(p=><option key={p} value={p}>{window.tr(p,lang)}</option>)}</select></div>
        </div>
        <div style={{ fontSize:11.5, color:'var(--ink-3)', display:'flex', alignItems:'center', gap:6 }}><Icon name="user" className="icon icon-sm"/>{lang==='ge'?'დროებითი პაროლი გაიგზავნება ელ-ფოსტაზე':'A temporary password is emailed to the user'}</div>
      </div>
    </window.Modal>
  );
}

/* ---------------- Profile ---------------- */
function ProfileView() {
  const s = window.useStore();
  const { Avatar, Icon } = window;
  const lang = s.lang;
  const me = s.currentUser;
  return (
    <div style={{ maxWidth:620, display:'flex', flexDirection:'column', gap:18 }}>
      <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{window.tr('profile',lang)}</h1>
      <div className="card" style={{ padding:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <Avatar user={me} size="xl"/>
          <div><div style={{ fontWeight:600, fontSize:17 }}>{me.name}</div><div style={{ fontSize:13, color:'var(--ink-3)' }}>{me.email}</div></div>
          <button className="btn btn-ghost" style={{ marginLeft:'auto' }}><Icon name="edit" className="icon icon-sm"/> {lang==='ge'?'ავატარი':'Avatar'}</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="field"><label className="field-label">{window.tr('displayName',lang)}</label><input className="input" defaultValue={me.name}/></div>
          <div className="field"><label className="field-label">{window.tr('langPref',lang)}</label>
            <div className="seg" style={{ alignSelf:'flex-start' }}>
              <button className={lang==='en'?'active':''} onClick={()=>s.setLang('en')}>English</button>
              <button className={lang==='ge'?'active':''} onClick={()=>s.setLang('ge')}>ქართული</button>
            </div>
            <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:4 }}>{lang==='ge'?'ეს ენა გამოიყენება ექსპორტში':'Also controls export language'}</div>
          </div>
        </div>
      </div>
      <div className="card" style={{ padding:22 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>{window.tr('changePassword',lang)}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="field"><label className="field-label">{lang==='ge'?'ახალი პაროლი':'New password'}</label><input className="input" type="password"/></div>
          <div className="field"><label className="field-label">{lang==='ge'?'გაიმეორეთ':'Confirm'}</label><input className="input" type="password"/></div>
          <button className="btn btn-primary" style={{ alignSelf:'flex-start' }}>{window.tr('changePassword',lang)}</button>
        </div>
      </div>
    </div>
  );
}
window.ProfileView = ProfileView;
