// ============================================================
// hub-todos.jsx — To-do (My/Team toggle, List/Board/Timeline, filters)
// ============================================================
function TodosView() {
  const s = window.useStore();
  const { Icon } = window;
  const lang = s.lang;
  const me = s.currentUser;
  const [scope, setScope] = React.useState('my'); // my | team
  const [vmode, setVmode] = React.useState('list'); // list | board | timeline
  const [statusF, setStatusF] = React.useState('all');
  const [showNew, setShowNew] = React.useState(false);

  let todos = s.todos.filter(t => scope==='my' ? (t.ownerId===me.id || t.assignees.includes(me.id)) && t.type==='personal' || (t.type==='personal'&&t.ownerId===me.id) : t.type==='team' && (s.isAdmin || t.assignees.includes(me.id)));
  // simplify: my = personal owned by me; team = team todos visible to me
  todos = scope==='my'
    ? s.todos.filter(t => t.type==='personal' && t.ownerId===me.id)
    : s.todos.filter(t => t.type==='team' && (s.isAdmin || t.assignees.includes(me.id)));

  const withOverdue = todos.map(t => ({ ...t, overdue: t.status!=='done' && window.daysBetween(t.dueDate)<0 }));
  const filtered = withOverdue.filter(t => statusF==='all' ? true : statusF==='overdue' ? t.overdue : t.status===statusF);

  const canCreate = scope==='my' || s.isAdmin;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
        <div><h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{window.tr('todos',lang)}</h1>
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:2 }}>{filtered.filter(t=>t.status!=='done').length} {window.tr('open',lang).toLowerCase()} · {filtered.filter(t=>t.status==='done').length} {window.tr('done',lang).toLowerCase()}</div></div>
        {canCreate && <button className="btn btn-primary" onClick={()=>setShowNew(true)}><Icon name="plus" className="icon icon-sm"/> {window.tr('newTodo',lang)}</button>}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div className="seg">
          <button className={scope==='my'?'active':''} onClick={()=>setScope('my')}>{window.tr('myTodos',lang)}</button>
          <button className={scope==='team'?'active':''} onClick={()=>setScope('team')}>{window.tr('teamTodos',lang)}</button>
        </div>
        <div className="seg">
          {['list','board','timeline'].map(v => <button key={v} className={vmode===v?'active':''} onClick={()=>setVmode(v)}><Icon name={v==='list'?'list':v==='board'?'grid':'calendar'} className="icon icon-sm"/> {window.tr(v,lang)}</button>)}
        </div>
        <div className="seg" style={{ marginLeft:'auto' }}>
          {['all','open','done','overdue'].map(f => <button key={f} className={statusF===f?'active':''} onClick={()=>setStatusF(f)}>{window.tr(f,lang)}</button>)}
        </div>
      </div>

      {vmode==='list' && <TodoListView todos={filtered} scope={scope}/>}
      {vmode==='board' && <TodoBoardView todos={filtered}/>}
      {vmode==='timeline' && <TodoTimelineView todos={filtered}/>}

      {showNew && <NewTodoModal scope={scope} onClose={()=>setShowNew(false)}/>}
    </div>
  );
}
window.TodosView = TodosView;

function TodoListView({ todos, scope }) {
  const s = window.useStore();
  const { Cbx, Avatar, Icon } = window;
  const lang = s.lang;
  const toggleDone = (t) => s.updateTodo(t.id, { status: t.status==='done'?'open':'done' });
  return (
    <div className="card" style={{ padding:0 }}>
      {todos.map(t => (
        <div key={t.id} style={{ padding:'13px 18px', borderBottom:'1px solid var(--line)', display:'flex', gap:12, alignItems:'flex-start' }}>
          <Cbx checked={t.status==='done'} onClick={()=>toggleDone(t)}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:500, textDecoration:t.status==='done'?'line-through':'none', color:t.status==='done'?'var(--ink-3)':'var(--ink)' }}>{t.title[lang]}</div>
            {t.subtasks.length>0 && (
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
                {t.subtasks.map(st => (
                  <div key={st.id} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                    <Cbx checked={st.done} size="sm" onClick={()=>s.toggleTodoSub(t.id,st.id)}/>
                    <span style={{ textDecoration:st.done?'line-through':'none', color:'var(--ink-2)' }}>{st.title[lang]}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8 }}>
              <span style={{ fontSize:11, color: t.overdue?'var(--danger)':'var(--ink-3)', fontWeight:t.overdue?600:400, display:'flex', alignItems:'center', gap:4 }}><Icon name="calendar" className="icon icon-sm"/>{window.relDate(t.dueDate,lang)}</span>
              {t.type==='team' && <span className="badge badge-gray" style={{ fontSize:10 }}>{window.tr('teamTodos',lang)}</span>}
            </div>
          </div>
          <div className="avatar-stack">{t.assignees.slice(0,3).map(id=><Avatar key={id} user={window.userById(s,id)} size="sm"/>)}</div>
          {(scope==='my' || s.isAdmin) && <button className="btn-icon" onClick={()=>s.deleteTodo(t.id)}><Icon name="trash" className="icon icon-sm"/></button>}
        </div>
      ))}
      {!todos.length && <div className="empty">{lang==='ge'?'დავალება არ მოიძებნა':'No to-dos'}</div>}
    </div>
  );
}

function TodoBoardView({ todos }) {
  const s = window.useStore();
  const { Avatar, Icon } = window;
  const lang = s.lang;
  const cols = [['todo','open'],['inProgress','inProgress'],['done','done']];
  const colItems = (st) => todos.filter(t => st==='open' ? (t.status==='open'||t.status==='todo') : t.status===st);
  const next = { open:'inProgress', inProgress:'done', done:'open' };
  return (
    <div className="kanban">
      {cols.map(([label,st]) => (
        <div key={st} className="kanban-col">
          <div className="kanban-col-head"><span style={{ display:'flex', alignItems:'center', gap:7 }}><window.StatusBadge status={label} lang={lang}/></span><span className="mono" style={{ fontSize:11, color:'var(--ink-3)' }}>{colItems(st).length}</span></div>
          {colItems(st).map(t => (
            <div key={t.id} className="card" style={{ padding:13, cursor:'pointer' }} onClick={()=>s.updateTodo(t.id,{ status: next[t.status==='todo'?'open':t.status] })}>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:8 }}>{t.title[lang]}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:10.5, color:t.overdue?'var(--danger)':'var(--ink-3)', display:'flex', alignItems:'center', gap:4 }}><Icon name="calendar" className="icon icon-sm"/>{window.relDate(t.dueDate,lang)}</span>
                <div className="avatar-stack">{t.assignees.slice(0,3).map(id=><Avatar key={id} user={window.userById(s,id)} size="sm"/>)}</div>
              </div>
            </div>
          ))}
          {!colItems(st).length && <div style={{ fontSize:11.5, color:'var(--ink-4)', textAlign:'center', padding:'14px 0' }}>—</div>}
        </div>
      ))}
    </div>
  );
}

function TodoTimelineView({ todos }) {
  const s = window.useStore();
  const { Avatar } = window;
  const lang = s.lang;
  const items = todos.filter(t=>t.status!=='done').map(t => ({ ...t, d: window.daysBetween(t.dueDate) }));
  if (!items.length) return <div className="card"><div className="empty">{lang==='ge'?'ვადები არ არის':'Nothing scheduled'}</div></div>;
  const min = Math.min(...items.map(i=>i.d), 0), max = Math.max(...items.map(i=>i.d), 1);
  const span = (max-min)||1;
  const pos = (d) => ((d-min)/span)*100;
  const todayPos = pos(0);

  return (
    <div className="card" style={{ padding:'18px 20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--ink-3)', marginBottom:10, paddingLeft:212 }}>
        <span>{window.fmtDate(window.SEED.today.toISOString().slice(0,10), lang)} ←</span>
        <span>→ {max} {lang==='ge'?'დღეში':'days'}</span>
      </div>
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:`calc(200px + 12px + ${todayPos}% * (100% - 212px) / 100)`, top:0, bottom:0, width:2, background:'var(--green-200)', zIndex:0 }}/>
        {items.sort((a,b)=>a.d-b.d).map(t => {
          const color = t.overdue ? 'var(--danger)' : t.d<=3 ? 'var(--warn)' : 'var(--green-700)';
          return (
            <div key={t.id} className="gantt-row">
              <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                <div className="avatar-stack">{t.assignees.slice(0,2).map(id=><Avatar key={id} user={window.userById(s,id)} size="sm"/>)}</div>
                <span style={{ fontSize:12.5, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title[lang]}</span>
              </div>
              <div className="gantt-track">
                <div className="gantt-bar" style={{ left:`${Math.min(pos(t.d),92)}%`, background:color, minWidth:fitWidth(t,lang) }}>{window.relDate(t.dueDate,lang)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function fitWidth(t,lang){ return Math.max(70, window.relDate(t.dueDate,lang).length*7+16)+'px'; }

function NewTodoModal({ scope, onClose }) {
  const s = window.useStore();
  const lang = s.lang;
  const isTeam = scope==='team';
  const [title, setTitle] = React.useState('');
  const [due, setDue] = React.useState(window.SEED.today.toISOString().slice(0,10));
  const [assignees, setAssignees] = React.useState(isTeam ? [] : [s.currentUser.id]);
  const [subs, setSubs] = React.useState([]);
  const [subInput, setSubInput] = React.useState('');
  const toggle = (id)=>setAssignees(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  const addSub = ()=>{ if(!subInput.trim())return; setSubs(x=>[...x,{ id:'st'+Date.now(), title:{en:subInput,ge:subInput}, done:false }]); setSubInput(''); };
  const save = ()=>{ if(!title.trim())return; s.createTodo({ title:{en:title,ge:title}, type:isTeam?'team':'personal', ownerId:s.currentUser.id, assignees: isTeam?assignees:[s.currentUser.id], dueDate:due, subtasks:subs }); onClose(); };

  return (
    <window.Modal title={window.tr('newTodo',lang)} sub={isTeam?window.tr('teamTodos',lang):window.tr('myTodos',lang)} onClose={onClose} foot={<>
      <button className="btn btn-ghost" onClick={onClose}>{window.tr('cancel',lang)}</button>
      <button className="btn btn-primary" onClick={save}>{window.tr('save',lang)}</button>
    </>}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="field"><label className="field-label">{window.tr('title',lang)}</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} autoFocus/></div>
        <div className="field"><label className="field-label">{window.tr('due',lang)}</label><input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)}/></div>
        {isTeam && (
          <div className="field"><label className="field-label">{window.tr('assignees',lang)}</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {s.users.filter(u=>u.role!=='admin').map(u => (
                <button key={u.id} onClick={()=>toggle(u.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px 5px 5px', borderRadius:99, border:'1px solid', cursor:'pointer', fontFamily:'inherit', fontSize:12,
                  background:assignees.includes(u.id)?'var(--green-50)':'#fff', borderColor:assignees.includes(u.id)?'var(--green-500)':'var(--line)' }}>
                  <window.Avatar user={u} size="sm"/>{u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="field"><label className="field-label">{window.tr('subtasks',lang)}</label>
          {subs.map(st => <div key={st.id} style={{ fontSize:12.5, padding:'5px 0', display:'flex', alignItems:'center', gap:8 }}><window.Cbx checked={false} size="sm" onClick={()=>{}}/>{st.title.en}</div>)}
          <div style={{ display:'flex', gap:8, marginTop:4 }}>
            <input className="input" value={subInput} onChange={e=>setSubInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSub()} placeholder="+ subtask"/>
            <button className="btn btn-ghost" onClick={addSub}>{lang==='ge'?'დამატება':'Add'}</button>
          </div>
        </div>
      </div>
    </window.Modal>
  );
}
