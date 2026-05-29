// ============================================================
// hub-database.jsx — Company & Article database (3-pane + full page)
// ============================================================
function DatabaseView({ tab }) {
  const s = window.useStore();
  const { Icon } = window;
  const lang = s.lang;
  const [activeTab, setActiveTab] = React.useState(tab || 'companies');
  const [selId, setSelId] = React.useState(null);
  const [q, setQ] = React.useState('');

  React.useEffect(()=>{ setActiveTab(tab||'companies'); setSelId(null); }, [tab]);

  const records = activeTab==='companies' ? s.companies : s.articles;
  const mentionsOf = (id) => s.logs.filter(l => l.entityId===id);
  const lastMentionOf = (id) => { const ls=mentionsOf(id); if(!ls.length)return null; return ls.reduce((a,b)=>new Date(a.date)>new Date(b.date)?a:b).date; };
  const filtered = records.filter(r => { const name=(r.name||r.title||r.url||'').toLowerCase(); return name.includes(q.toLowerCase()); });
  const selected = records.find(r=>r.id===selId);

  return (
    <div className="three-pane" style={{ gridTemplateColumns: selected?'1fr 380px':'1fr 0px' }}>
      {/* central */}
      <div style={{ display:'flex', flexDirection:'column', minWidth:0, height:'100%' }}>
        <div style={{ padding:'18px 24px 0' }}>
          <h1 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', margin:'0 0 14px' }}>{window.tr('database',lang)}</h1>
          <div className="tabs" style={{ marginBottom:0 }}>
            <button className={activeTab==='companies'?'active':''} onClick={()=>{ setActiveTab('companies'); setSelId(null); window.navigate('/database/companies'); }}>{window.tr('companies',lang)} <span style={{ color:'var(--ink-3)' }}>{s.companies.length}</span></button>
            <button className={activeTab==='articles'?'active':''} onClick={()=>{ setActiveTab('articles'); setSelId(null); window.navigate('/database/articles'); }}>{window.tr('articles',lang)} <span style={{ color:'var(--ink-3)' }}>{s.articles.length}</span></button>
          </div>
        </div>
        <div style={{ padding:'14px 24px 10px' }}>
          <div style={{ position:'relative', display:'flex', alignItems:'center', maxWidth:320 }}>
            <span style={{ position:'absolute', left:11, color:'var(--ink-3)', display:'flex' }}><Icon name="search" className="icon icon-sm"/></span>
            <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder={window.tr('search',lang)} style={{ paddingLeft:32, height:34, borderRadius:999, background:'var(--cream)' }}/>
          </div>
        </div>
        <div style={{ flex:1, minHeight:0, overflowY:'auto' }}>
          <div className="tbl-head" style={{ gridTemplateColumns: activeTab==='companies'?'1.6fr 1.2fr 80px 90px 1fr':'2fr 80px 90px 1.2fr' }}>
            {activeTab==='companies'
              ? <><div>{window.tr('companyName',lang)}</div><div>{window.tr('website',lang)}</div><div style={{textAlign:'center'}}>{window.tr('mentions',lang)}</div><div style={{textAlign:'right'}}>{window.tr('lastMention',lang)}</div><div>{window.tr('appearsIn',lang)}</div></>
              : <><div>{window.tr('title',lang)}</div><div style={{textAlign:'center'}}>{window.tr('mentions',lang)}</div><div style={{textAlign:'right'}}>{window.tr('lastMention',lang)}</div><div>{window.tr('appearsIn',lang)}</div></>}
          </div>
          {filtered.map(r => {
            const ms = mentionsOf(r.id);
            const lm = lastMentionOf(r.id);
            const kpiIds = [...new Set(ms.map(l=>l.kpiId))];
            return (
              <button key={r.id} className={`tbl-row ${selId===r.id?'selected':''}`} style={{ gridTemplateColumns: activeTab==='companies'?'1.6fr 1.2fr 80px 90px 1fr':'2fr 80px 90px 1.2fr' }} onClick={()=>setSelId(r.id)}>
                <span style={{ fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name||r.title}</span>
                {activeTab==='companies' && <span style={{ fontSize:12, color:'var(--green-700)' }}>{r.website||'—'}</span>}
                <span className="mono" style={{ textAlign:'center', fontWeight:600 }}>{ms.reduce((a,l)=>a+l.count,0)}</span>
                <span style={{ textAlign:'right', fontSize:11.5, color:'var(--ink-3)' }}>{lm?window.fmtDate(lm,lang):'—'}</span>
                <span style={{ display:'flex', gap:4, flexWrap:'wrap' }}>{kpiIds.slice(0,2).map(kid => { const k=s.kpis.find(x=>x.id===kid); return k?<span key={kid} className={`pill cat-bg-${k.program}`} style={{ fontSize:9.5 }}>{k.title[lang].slice(0,14)}</span>:null; })}{kpiIds.length>2 && <span style={{ fontSize:10, color:'var(--ink-3)' }}>+{kpiIds.length-2}</span>}</span>
              </button>
            );
          })}
          {!filtered.length && <div className="empty">{lang==='ge'?'ჩანაწერი არ მოიძებნა':'No records'}</div>}
        </div>
      </div>

      {/* right detail */}
      {selected && <RecordDetail kind={activeTab==='companies'?'company':'article'} record={selected} onClose={()=>setSelId(null)} mentions={mentionsOf(selected.id)}/>}
    </div>
  );
}
window.DatabaseView = DatabaseView;

function RecordDetail({ kind, record, onClose, mentions, full }) {
  const s = window.useStore();
  const { Icon, Avatar } = window;
  const lang = s.lang;
  const update = kind==='company' ? s.updateCompany : s.updateArticle;
  const kpiIds = [...new Set(mentions.map(l=>l.kpiId))];

  return (
    <div className="detail-pane" style={ full?{ border:'none', background:'transparent' }:null}>
      <div style={{ padding:'18px 20px' }}>
        {!full && <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <a className="lnk" style={{ border:'none', fontSize:12, display:'flex', alignItems:'center', gap:5 }} href={'#/database/'+(kind==='company'?'companies':'articles')+'/'+record.id}><Icon name="ext" className="icon icon-sm"/>{window.tr('openFull',lang)}</a>
          <button className="btn-icon" onClick={onClose}><Icon name="x" className="icon"/></button>
        </div>}

        <input className="input" defaultValue={record.name||record.title} onBlur={e=>update(record.id, kind==='company'?{name:e.target.value}:{title:e.target.value})} style={{ fontSize:17, fontWeight:600, border:'none', padding:'4px 0', background:'transparent' }}/>

        {kind==='company' ? (
          <div className="field" style={{ marginTop:14 }}>
            <label className="field-label">{window.tr('website',lang)}</label>
            <input className="input" defaultValue={record.website} onBlur={e=>update(record.id,{website:e.target.value})} placeholder="example.com"/>
          </div>
        ) : (
          <div className="field" style={{ marginTop:14 }}>
            <label className="field-label">URL</label>
            <div style={{ display:'flex', gap:6 }}>
              <input className="input" defaultValue={record.url} onBlur={e=>update(record.id,{url:e.target.value})}/>
              <a className="btn btn-ghost" href={record.url} target="_blank" rel="noreferrer"><Icon name="ext" className="icon icon-sm"/></a>
            </div>
          </div>
        )}

        <div className="field" style={{ marginTop:14 }}>
          <label className="field-label">{window.tr('notes',lang)}</label>
          <textarea className="textarea" defaultValue={record.description} onBlur={e=>update(record.id,{description:e.target.value})} rows={3} style={{ resize:'none', fontFamily:'inherit' }}/>
        </div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14 }}>
          <span style={{ fontSize:11, color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', width:'100%' }}>{window.tr('appearsIn',lang)}</span>
          {kpiIds.map(kid => { const k=s.kpis.find(x=>x.id===kid); return k?<a key={kid} className={`pill cat-bg-${k.program}`} style={{ fontSize:11, textDecoration:'none' }} href={'#/kpis/'+kid}>{k.title[lang]}</a>:null; })}
          {!kpiIds.length && <span style={{ fontSize:12, color:'var(--ink-4)' }}>—</span>}
        </div>
      </div>

      <div style={{ borderTop:'1px solid var(--line)', padding:'14px 20px' }}>
        <div style={{ fontSize:11, color:'var(--ink-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>{window.tr('activityHistory',lang)} · {mentions.length}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {mentions.map(l => {
            const u=window.userById(s,l.userId); const k=s.kpis.find(x=>x.id===l.kpiId);
            return (
              <div key={l.id} className="feed-item">
                <div style={{ width:28, height:28, borderRadius:99, background:'var(--green-50)', display:'grid', placeItems:'center', color:'var(--green-900)', flex:'0 0 auto', zIndex:1 }}><Icon name={window.activityIcon(l.activityType)} className="icon icon-sm"/></div>
                <div style={{ flex:1, fontSize:12.5 }}>
                  <div><strong>+{l.count}</strong> {window.tr(l.activityType,lang).toLowerCase()} · {k?.title[lang]}</div>
                  <div style={{ color:'var(--ink-3)', fontSize:11, marginTop:2 }}>{u.name.split(' ')[0]} · {window.fmtDate(l.date,lang)}</div>
                </div>
              </div>
            );
          })}
          {!mentions.length && <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>{window.tr('noActivity',lang)}</div>}
        </div>
      </div>
    </div>
  );
}
window.RecordDetail = RecordDetail;

/* Full-page record (filterable history table) */
function RecordFullView({ kind, id }) {
  const s = window.useStore();
  const { Icon } = window;
  const lang = s.lang;
  const records = kind==='company' ? s.companies : s.articles;
  const record = records.find(r=>r.id===id);
  const [fUser, setFUser] = React.useState('all');
  const [fKpi, setFKpi] = React.useState('all');
  if(!record) return <div style={{ padding:28 }}><div className="empty">Record not found. <a className="lnk" href="#/database">{window.tr('database',lang)}</a></div></div>;

  let mentions = s.logs.filter(l=>l.entityId===id);
  mentions = mentions.filter(l => (fUser==='all'||l.userId===fUser) && (fKpi==='all'||l.kpiId===fKpi));
  const allMentions = s.logs.filter(l=>l.entityId===id);
  const userIds = [...new Set(allMentions.map(l=>l.userId))];
  const kpiIds = [...new Set(allMentions.map(l=>l.kpiId))];

  return (
    <div style={{ height:'100%', overflowY:'auto' }}>
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'24px 28px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:'var(--ink-3)', marginBottom:18 }}>
          <a className="lnk" style={{ border:'none' }} href={'#/database/'+(kind==='company'?'companies':'articles')}>{window.tr('database',lang)}</a><Icon name="chev" className="icon icon-sm"/><span>{record.name||record.title}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:24, alignItems:'flex-start' }}>
          <div className="card" style={{ padding:0 }}><RecordDetail kind={kind} record={record} mentions={allMentions} full onClose={()=>{}}/></div>
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <div style={{ fontWeight:600, fontSize:14, flex:1 }}>{window.tr('activityHistory',lang)}</div>
              <select className="select" value={fUser} onChange={e=>setFUser(e.target.value)} style={{ width:'auto', height:30, fontSize:12, padding:'4px 8px' }}>
                <option value="all">{window.tr('all',lang)} · {window.tr('user',lang)}</option>
                {userIds.map(uid=><option key={uid} value={uid}>{window.userById(s,uid).name}</option>)}
              </select>
              <select className="select" value={fKpi} onChange={e=>setFKpi(e.target.value)} style={{ width:'auto', height:30, fontSize:12, padding:'4px 8px' }}>
                <option value="all">{window.tr('all',lang)} · KPI</option>
                {kpiIds.map(kid=><option key={kid} value={kid}>{s.kpis.find(k=>k.id===kid)?.title[lang]}</option>)}
              </select>
            </div>
            <div className="tbl-head" style={{ gridTemplateColumns:'80px 1fr 1fr 60px' }}><div>{lang==='ge'?'თარიღი':'Date'}</div><div>{window.tr('user',lang)}</div><div>KPI</div><div style={{textAlign:'right'}}>{window.tr('count',lang)}</div></div>
            {mentions.map(l => (
              <div key={l.id} className="tbl-row" style={{ gridTemplateColumns:'80px 1fr 1fr 60px', cursor:'default' }}>
                <span style={{ fontSize:12, color:'var(--ink-3)' }}>{window.fmtDate(l.date,lang)}</span>
                <span style={{ fontSize:12.5 }}>{window.userById(s,l.userId).name.split(' ')[0]}</span>
                <span style={{ fontSize:12.5 }}>{s.kpis.find(k=>k.id===l.kpiId)?.title[lang]}</span>
                <span className="mono" style={{ textAlign:'right', fontWeight:600 }}>+{l.count}</span>
              </div>
            ))}
            {!mentions.length && <div className="empty">{window.tr('noActivity',lang)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
window.RecordFullView = RecordFullView;
