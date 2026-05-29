// ============================================================
// hub-reports.jsx — Export report (scope, range, language, preview, PDF)
// ============================================================
function ReportsView() {
  const s = window.useStore();
  const { Icon } = window;
  const lang = s.lang;
  const [repLang, setRepLang] = React.useState(lang);
  const [scope, setScope] = React.useState('all'); // all | program:* | member:*
  const [range, setRange] = React.useState('q2');

  const rl = repLang; // language used inside the report preview

  // Build report rows
  let kpis = s.kpis.filter(k=>!k.archived);
  let scopeLabel = window.tr('allKpis', rl);
  if (scope.startsWith('program:')) { const pr=scope.split(':')[1]; kpis=kpis.filter(k=>k.program===pr); scopeLabel=window.tr(pr,rl); }
  else if (scope.startsWith('member:')) { const uid=scope.split(':')[1]; kpis=kpis.filter(k=>k.assignees.includes(uid)); scopeLabel=window.userById(s,uid).name; }

  const rangeLabel = { q2:'Q2 2026 (Apr–Jun)', m:'May 2026', q1:'Q1 2026 (Jan–Mar)' }[range];
  const logsInScope = s.logs.filter(l => kpis.some(k=>k.id===l.kpiId));
  const byType = {};
  logsInScope.forEach(l => { byType[l.activityType]=(byType[l.activityType]||0)+l.count; });
  const totalTasks = kpis.reduce((a,k)=>a+k.tasks.length,0);
  const doneTasks = kpis.reduce((a,k)=>a+k.tasks.filter(t=>t.status==='done').length,0);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:24, alignItems:'flex-start' }}>
      {/* config */}
      <div style={{ display:'flex', flexDirection:'column', gap:18, position:'sticky', top:0 }}>
        <h1 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>{window.tr('exportReport',lang)}</h1>
        <div className="card" style={{ padding:18, display:'flex', flexDirection:'column', gap:16 }}>
          <div className="field"><label className="field-label">{window.tr('language',lang)}</label>
            <div className="seg"><button className={repLang==='en'?'active':''} onClick={()=>setRepLang('en')}>English</button><button className={repLang==='ge'?'active':''} onClick={()=>setRepLang('ge')}>ქართული</button></div>
          </div>
          <div className="field"><label className="field-label">{window.tr('scope',lang)}</label>
            <select className="select" value={scope} onChange={e=>setScope(e.target.value)}>
              <option value="all">{window.tr('allKpis',lang)}</option>
              <optgroup label={window.tr('program',lang)}>{window.PROGRAMS.map(p=><option key={p} value={'program:'+p}>{window.tr(p,lang)}</option>)}</optgroup>
              <optgroup label={window.tr('individual',lang)}>{s.users.filter(u=>u.role!=='admin').map(u=><option key={u.id} value={'member:'+u.id}>{u.name}</option>)}</optgroup>
            </select>
          </div>
          <div className="field"><label className="field-label">{window.tr('dateRange',lang)}</label>
            <select className="select" value={range} onChange={e=>setRange(e.target.value)}>
              <option value="q2">Q2 2026 (Apr–Jun)</option><option value="m">May 2026</option><option value="q1">Q1 2026 (Jan–Mar)</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ justifyContent:'center' }} onClick={()=>window.print()}><Icon name="doc" className="icon icon-sm"/> {window.tr('exportPdf',lang)}</button>
          <div style={{ fontSize:11, color:'var(--ink-3)', textAlign:'center' }}>{lang==='ge'?'PDF იხსნება ბეჭდვის ფანჯარაში':'Opens your browser’s print-to-PDF'}</div>
        </div>
      </div>

      {/* preview */}
      <div>
        <div style={{ fontSize:12, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600, marginBottom:10 }}>{window.tr('preview',lang)}</div>
        <div id="report-sheet" style={{ background:'#fff', border:'1px solid var(--line)', borderRadius:8, padding:'40px 44px', boxShadow:'var(--shadow-1)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid var(--green-900)', paddingBottom:18, marginBottom:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'var(--green-900)', display:'grid', placeItems:'center', color:'#fff' }}><Icon name="target" className="icon icon-sm"/></div>
                <div style={{ fontWeight:700, fontSize:15 }}>{window.tr('org',rl)}</div>
              </div>
              <h2 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', margin:'14px 0 4px' }}>{rl==='ge'?'KPI ანგარიში':'KPI Performance Report'}</h2>
              <div style={{ fontSize:13, color:'var(--ink-3)' }}>{scopeLabel} · {rangeLabel}</div>
            </div>
            <div style={{ textAlign:'right', fontSize:11, color:'var(--ink-3)' }}>{rl==='ge'?'შექმნილია':'Generated'}<br/>{window.fmtDate(window.SEED.today.toISOString().slice(0,10), rl)} 2026</div>
          </div>

          {/* summary band */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:26 }}>
            {[
              [kpis.length, window.tr('kpis',rl)],
              [logsInScope.reduce((a,l)=>a+l.count,0), rl==='ge'?'აქტივობა':'Activities'],
              [Math.round(kpis.reduce((a,k)=>a+Math.min(100,k.current/k.target*100),0)/(kpis.length||1))+'%', window.tr('progress',rl)],
              [(totalTasks?Math.round(doneTasks/totalTasks*100):0)+'%', rl==='ge'?'დავალებები':'Task rate'],
            ].map(([n,l],i)=>(
              <div key={i} style={{ background:'var(--cream)', borderRadius:10, padding:'12px 14px' }}><div className="mono" style={{ fontSize:24, fontWeight:600 }}>{n}</div><div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>{l}</div></div>
            ))}
          </div>

          {/* KPI table */}
          <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>{rl==='ge'?'KPI დეტალები':'KPI breakdown'}</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead><tr style={{ borderBottom:'1px solid var(--line)', textAlign:'left', color:'var(--ink-3)' }}>
              <th style={{ padding:'8px 6px', fontWeight:600 }}>KPI</th>
              <th style={{ padding:'8px 6px', fontWeight:600 }}>{window.tr('program',rl)}</th>
              <th style={{ padding:'8px 6px', fontWeight:600, textAlign:'right' }}>{window.tr('progress',rl)}</th>
              <th style={{ padding:'8px 6px', fontWeight:600, textAlign:'right' }}>{window.tr('target',rl)}</th>
              <th style={{ padding:'8px 6px', fontWeight:600 }}>{window.tr('status',rl)}</th>
            </tr></thead>
            <tbody>
              {kpis.map(k => (
                <tr key={k.id} style={{ borderBottom:'1px solid var(--line)' }}>
                  <td style={{ padding:'9px 6px', fontWeight:500 }}>{k.title[rl]}</td>
                  <td style={{ padding:'9px 6px', color:'var(--ink-2)' }}>{window.tr(k.program,rl)}</td>
                  <td style={{ padding:'9px 6px', textAlign:'right' }} className="mono">{k.current}/{k.target}</td>
                  <td style={{ padding:'9px 6px', textAlign:'right' }} className="mono">{window.pct(k.current,k.target)}%</td>
                  <td style={{ padding:'9px 6px' }}><window.StatusBadge status={window.kpiStatus(k.current,k.target)} lang={rl}/></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* activity breakdown */}
          <div style={{ fontSize:13, fontWeight:600, margin:'26px 0 10px' }}>{rl==='ge'?'აქტივობის ტიპები':'Activity summary'}</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {window.SEED.ATYPES.map(a => (
              <div key={a} style={{ flex:'1 1 120px', background:'var(--cream)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:99, background:'var(--green-50)', display:'grid', placeItems:'center', color:'var(--green-900)' }}><Icon name={window.activityIcon(a)} className="icon icon-sm"/></div>
                <div><div className="mono" style={{ fontSize:18, fontWeight:600 }}>{byType[a]||0}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{window.tr(a,rl)}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.ReportsView = ReportsView;
