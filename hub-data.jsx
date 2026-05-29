// ============================================================
// hub-data.jsx — data model, mock data, i18n, store, router, UI primitives
// Exposed on window for the other module files.
// ============================================================
const { useState, useEffect, useMemo, useRef, useContext, createContext, useCallback } = React;

/* ---------------- i18n ---------------- */
const L = {
  appName:    { en: 'IPA KPI Hub',          ge: 'IPA KPI ჰაბი' },
  org:        { en: 'Enterprise Georgia',   ge: 'აწარმოე საქართველოში' },
  // nav
  dashboard:  { en: 'Dashboard',            ge: 'მთავარი' },
  kpis:       { en: 'KPIs',                 ge: 'KPI-ები' },
  todos:      { en: 'To-do',                ge: 'დავალებები' },
  team:       { en: 'Team',                 ge: 'გუნდი' },
  database:   { en: 'Database',             ge: 'ბაზა' },
  reports:    { en: 'Reports',              ge: 'ანგარიშები' },
  profile:    { en: 'Profile',              ge: 'პროფილი' },
  logout:     { en: 'Log out',              ge: 'გასვლა' },
  // programs
  invest:     { en: 'Investment Attraction',ge: 'ინვესტიციების მოზიდვა' },
  awareness:  { en: 'Awareness',            ge: 'ცნობადობა' },
  aftercare:  { en: 'Aftercare',            ge: 'Aftercare' },
  fdi:        { en: 'FDI Grant',            ge: 'FDI გრანტი' },
  // status
  onTrack:    { en: 'On track',             ge: 'გრაფიკში' },
  atRisk:     { en: 'At risk',              ge: 'რისკში' },
  behind:     { en: 'Behind',               ge: 'ჩამორჩება' },
  done:       { en: 'Done',                 ge: 'დასრულდა' },
  open:       { en: 'Open',                 ge: 'ღია' },
  overdue:    { en: 'Overdue',              ge: 'ვადაგადაცილ.' },
  inProgress: { en: 'In progress',          ge: 'მიმდინარე' },
  todo:       { en: 'To do',                ge: 'გასაკეთებელი' },
  // common
  target:     { en: 'Target',               ge: 'სამიზნე' },
  progress:   { en: 'Progress',             ge: 'პროგრესი' },
  deadline:   { en: 'Deadline',             ge: 'ვადა' },
  program:    { en: 'Program',              ge: 'პროგრამა' },
  status:     { en: 'Status',               ge: 'სტატუსი' },
  assignees:  { en: 'Assignees',            ge: 'პასუხისმგებლები' },
  assignedTo: { en: 'Assigned to',          ge: 'პასუხისმგებელი' },
  logProgress:{ en: 'Log progress',         ge: 'პროგრესის დაფიქსირება' },
  quickLog:   { en: 'Quick log',            ge: 'სწრაფი ჩაწერა' },
  createKpi:  { en: 'New KPI',              ge: 'ახალი KPI' },
  newTodo:    { en: 'New to-do',            ge: 'ახალი დავალება' },
  search:     { en: 'Search…',              ge: 'ძებნა…' },
  cancel:     { en: 'Cancel',               ge: 'გაუქმება' },
  save:       { en: 'Save',                 ge: 'შენახვა' },
  next:       { en: 'Next',                 ge: 'შემდეგი' },
  back:       { en: 'Back',                 ge: 'უკან' },
  submit:     { en: 'Submit',               ge: 'დადასტურება' },
  all:        { en: 'All',                  ge: 'ყველა' },
  myTodos:    { en: 'My to-dos',            ge: 'ჩემი დავალებები' },
  teamTodos:  { en: 'Team to-dos',          ge: 'გუნდის დავალებები' },
  list:       { en: 'List',                 ge: 'სია' },
  board:      { en: 'Board',                ge: 'დაფა' },
  timeline:   { en: 'Timeline',             ge: 'ვადები' },
  // activity types
  meeting:    { en: 'Meeting',              ge: 'შეხვედრა' },
  call:       { en: 'Call',                 ge: 'ზარი' },
  article:    { en: 'Article',              ge: 'სტატია' },
  other:      { en: 'Other',                ge: 'სხვა' },
  // dashboard
  totalKpis:  { en: 'Total KPIs',           ge: 'სულ KPI' },
  myTasks:    { en: 'My open tasks',        ge: 'ჩემი ღია დავალებები' },
  recentActivity:{ en: 'Recent activity',   ge: 'ბოლო აქტივობა' },
  teamHealth: { en: 'Team KPI health',      ge: 'გუნდის KPI ჯანმრთელობა' },
  stale:      { en: 'No recent activity',   ge: 'აქტივობის გარეშე' },
  // kpi detail
  progressLog:{ en: 'Progress log',         ge: 'პროგრესის ისტორია' },
  tasks:      { en: 'Tasks',                ge: 'დავალებები' },
  activityType:{en: 'Activity type',        ge: 'აქტივობის ტიპი' },
  count:      { en: 'Count',                ge: 'რაოდენობა' },
  company:    { en: 'Company',              ge: 'კომპანია' },
  companyName:{ en: 'Company name',         ge: 'კომპანიის სახელი' },
  articleLink:{ en: 'Article link',         ge: 'სტატიის ბმული' },
  linked:     { en: 'links to database',    ge: 'ბაზასთან დაკავშირება' },
  // team
  teamMgmt:   { en: 'Team management',      ge: 'გუნდის მართვა' },
  newUser:    { en: 'New user',             ge: 'ახალი მომხმარებელი' },
  lastActivity:{en: 'Last activity',        ge: 'ბოლო აქტივობა' },
  activeKpis: { en: 'Active KPIs',          ge: 'აქტიური KPI' },
  email:      { en: 'Email',                ge: 'ელ-ფოსტა' },
  role:       { en: 'Role',                 ge: 'როლი' },
  admin:      { en: 'Admin',                ge: 'ადმინი' },
  user:       { en: 'Member',               ge: 'წევრი' },
  reassign:   { en: 'Reassign',             ge: 'გადანაწილება' },
  // database
  companies:  { en: 'Companies',            ge: 'კომპანიები' },
  articles:   { en: 'Articles',             ge: 'სტატიები' },
  website:    { en: 'Website',              ge: 'ვებგვერდი' },
  notes:      { en: 'Notes',                ge: 'შენიშვნები' },
  mentions:   { en: 'Mentions',             ge: 'ხსენებები' },
  lastMention:{ en: 'Last mentioned',       ge: 'ბოლო ხსენება' },
  appearsIn:  { en: 'Appears in',           ge: 'გვხვდება' },
  activityHistory:{en:'Activity history',   ge: 'აქტივობის ისტორია' },
  openFull:   { en: 'Open full page',       ge: 'სრული გვერდი' },
  title:      { en: 'Title',                ge: 'სათაური' },
  // reports
  exportReport:{en: 'Export report',        ge: 'ანგარიშის ექსპორტი' },
  language:   { en: 'Language',             ge: 'ენა' },
  scope:      { en: 'Scope',                ge: 'მოცულობა' },
  dateRange:  { en: 'Date range',           ge: 'პერიოდი' },
  preview:    { en: 'Preview',              ge: 'გადახედვა' },
  exportPdf:  { en: 'Export PDF',           ge: 'PDF ექსპორტი' },
  individual: { en: 'Individual member',    ge: 'ცალკე წევრი' },
  allKpis:    { en: 'All KPIs',             ge: 'ყველა KPI' },
  // login
  signIn:     { en: 'Sign in',              ge: 'შესვლა' },
  password:   { en: 'Password',             ge: 'პაროლი' },
  signInSub:  { en: 'Accounts are created by your administrator.', ge: 'ანგარიშებს ქმნის ადმინისტრატორი.' },
  // misc
  noActivity: { en: 'No activity yet',      ge: 'აქტივობა არ არის' },
  viewAll:    { en: 'View all',             ge: 'ყველას ნახვა' },
  due:        { en: 'Due',                  ge: 'ვადა' },
  changePassword:{en:'Change password',     ge: 'პაროლის შეცვლა' },
  displayName:{ en: 'Display name',         ge: 'სახელი' },
  langPref:   { en: 'Language preference',  ge: 'ენის პარამეტრი' },
  subtasks:   { en: 'subtasks',             ge: 'ქვედავალება' },
  archive:    { en: 'Archive',              ge: 'არქივი' },
  edit:       { en: 'Edit',                 ge: 'რედაქტირება' },
  unit:       { en: 'Unit',                 ge: 'ერთეული' },
  addTask:    { en: 'Add task',             ge: 'დავალების დამატება' },
};
window.L = L;
window.tr = (key, lang) => (L[key] && L[key][lang]) || key;

/* ---------------- Programs ---------------- */
const PROGRAMS = ['invest','awareness','aftercare','fdi'];
window.PROGRAMS = PROGRAMS;

/* ---------------- Mock data ---------------- */
const today = new Date('2026-05-29');
const daysFromNow = (d) => { const x = new Date(today); x.setDate(x.getDate()+d); return x.toISOString().slice(0,10); };

const USERS = [
  { id: 'u0',  name: 'Nino Beridze',         email: 'nino.beridze@enterprise.gov.ge',   role: 'admin', initials: 'NB', color: '#0B3D2E', program: 'invest',    language: 'en', active: true },
  { id: 'u1',  name: 'Giorgi Maisuradze',    email: 'g.maisuradze@enterprise.gov.ge',   role: 'user',  initials: 'GM', color: '#1F5A45', program: 'invest',    language: 'en', active: true },
  { id: 'u2',  name: 'Tamar Kapanadze',      email: 't.kapanadze@enterprise.gov.ge',    role: 'user',  initials: 'TK', color: '#3E8367', program: 'invest',    language: 'ge', active: true },
  { id: 'u3',  name: 'Luka Gelashvili',      email: 'l.gelashvili@enterprise.gov.ge',   role: 'user',  initials: 'LG', color: '#0B3D2E', program: 'invest',    language: 'en', active: true },
  { id: 'u4',  name: 'Ana Javakhishvili',    email: 'a.javakhishvili@enterprise.gov.ge',role: 'user',  initials: 'AJ', color: '#C77A2B', program: 'awareness', language: 'ge', active: true },
  { id: 'u5',  name: 'Davit Kiknadze',       email: 'd.kiknadze@enterprise.gov.ge',     role: 'user',  initials: 'DK', color: '#C77A2B', program: 'awareness', language: 'en', active: true },
  { id: 'u6',  name: 'Salome Gabunia',       email: 's.gabunia@enterprise.gov.ge',      role: 'user',  initials: 'SG', color: '#C77A2B', program: 'awareness', language: 'en', active: true },
  { id: 'u7',  name: 'Nikoloz Badriashvili', email: 'n.badriashvili@enterprise.gov.ge', role: 'user',  initials: 'NB', color: '#5A6FB8', program: 'aftercare', language: 'ge', active: true },
  { id: 'u8',  name: 'Ketevan Chkheidze',    email: 'k.chkheidze@enterprise.gov.ge',    role: 'user',  initials: 'KC', color: '#5A6FB8', program: 'aftercare', language: 'en', active: true },
  { id: 'u9',  name: 'Alexandre Tsereteli',  email: 'a.tsereteli@enterprise.gov.ge',    role: 'user',  initials: 'AT', color: '#5A6FB8', program: 'aftercare', language: 'en', active: true },
  { id: 'u10', name: 'Mariam Putkaradze',    email: 'm.putkaradze@enterprise.gov.ge',   role: 'user',  initials: 'MP', color: '#8B4A8E', program: 'fdi',       language: 'ge', active: true },
];

const KPIS = [
  { id:'k1', title:{en:'Companies screened',ge:'შერჩეული კომპანიები'}, program:'invest', target:200, unit:'#', deadline:daysFromNow(34), assignees:['u1','u2'], current:142, archived:false,
    tasks:[ {id:'t1',title:{en:'Build long-list from sector reports',ge:'სიის შედგენა'},assignedTo:'u1',dueDate:daysFromNow(5),status:'open',subtasks:[{id:'s1',title:{en:'Pull EU manufacturing list',ge:'EU სია'},done:true},{id:'s2',title:{en:'Score by fit',ge:'შეფასება'},done:false}]},
            {id:'t2',title:{en:'Validate contact data',ge:'კონტაქტების ვალიდაცია'},assignedTo:'u2',dueDate:daysFromNow(12),status:'open',subtasks:[{id:'s3',title:{en:'Cross-check CRM',ge:'CRM შემოწმება'},done:false}]} ] },
  { id:'k2', title:{en:'Companies contacted',ge:'კონტაქტირებული კომპანიები'}, program:'invest', target:120, unit:'#', deadline:daysFromNow(34), assignees:['u2','u3'], current:87, archived:false, tasks:[] },
  { id:'k3', title:{en:'Investor visits hosted',ge:'ინვესტორთა ვიზიტები'}, program:'invest', target:20, unit:'#', deadline:daysFromNow(50), assignees:['u3'], current:12, archived:false, tasks:[] },
  { id:'k4', title:{en:'Investment projects launched',ge:'დაწყებული პროექტები'}, program:'invest', target:8, unit:'#', deadline:daysFromNow(80), assignees:['u1'], current:4, archived:false, tasks:[] },
  { id:'k5', title:{en:'Jobs announced',ge:'სამუშაო ადგილები'}, program:'invest', target:500, unit:'#', deadline:daysFromNow(80), assignees:['u1','u3'], current:318, archived:false, tasks:[] },
  { id:'k6', title:{en:'Consultants & media hosted',ge:'კონსულტანტები & მედია'}, program:'awareness', target:15, unit:'#', deadline:daysFromNow(40), assignees:['u4'], current:9, archived:false, tasks:[] },
  { id:'k7', title:{en:'Articles published',ge:'გამოქვეყნებული სტატიები'}, program:'awareness', target:30, unit:'#', deadline:daysFromNow(34), assignees:['u5','u6'], current:22, archived:false, tasks:[] },
  { id:'k8', title:{en:'Social media leads',ge:'სოც. მედია Lead-ები'}, program:'awareness', target:100, unit:'#', deadline:daysFromNow(34), assignees:['u6'], current:41, archived:false, tasks:[] },
  { id:'k9', title:{en:'Issues resolved',ge:'მოგვარებული პრობლემები'}, program:'aftercare', target:45, unit:'#', deadline:daysFromNow(34), assignees:['u7','u8'], current:24, archived:false, tasks:[] },
  { id:'k10',title:{en:'Investor meetings held',ge:'ინვესტორთა შეხვედრები'}, program:'aftercare', target:60, unit:'#', deadline:daysFromNow(34), assignees:['u9'], current:47, archived:false, tasks:[] },
  { id:'k11',title:{en:'Expansion decisions',ge:'გაფართოების გადაწყვეტ.'}, program:'aftercare', target:10, unit:'#', deadline:daysFromNow(60), assignees:['u7'], current:6, archived:false, tasks:[] },
  { id:'k12',title:{en:'FDI grant projects',ge:'FDI გრანტ-პროექტები'}, program:'fdi', target:12, unit:'#', deadline:daysFromNow(70), assignees:['u10'], current:7, archived:false, tasks:[] },
];

const COMPANIES = [
  { id:'c1', name:'Schneider Electric', website:'se.com', description:'French multinational, energy & automation. Evaluating Tbilisi distribution hub.', createdAt:daysFromNow(-40) },
  { id:'c2', name:'Tbilisi Free Zone',  website:'tbilisifreezone.ge', description:'Free industrial zone operator.', createdAt:daysFromNow(-30) },
  { id:'c3', name:'BP Georgia',         website:'bp.com', description:'Existing investor, aftercare account.', createdAt:daysFromNow(-25) },
  { id:'c4', name:'Wissol Group',       website:'wissol.ge', description:'Local energy & retail group.', createdAt:daysFromNow(-15) },
  { id:'c5', name:'Hualing Group',      website:'hualing.ge', description:'Chinese conglomerate, Kutaisi FIZ.', createdAt:daysFromNow(-10) },
];

const ARTICLES = [
  { id:'a1', url:'https://agenda.ge/en/news/invest-georgia-2026', title:'Why investors are looking at Georgia in 2026', description:'Feature in Agenda.ge on the investment climate.', createdAt:daysFromNow(-20) },
  { id:'a2', url:'https://bm.ge/en/article/fdi-growth', title:'FDI inflows rise 14% year-on-year', description:'Business Media Georgia coverage.', createdAt:daysFromNow(-12) },
  { id:'a3', url:'https://reuters.com/markets/georgia-manufacturing', title:'Georgia courts EU manufacturers', description:'Reuters wire story.', createdAt:daysFromNow(-6) },
];

const ATYPES = ['meeting','call','article','other'];
const PROGRESS_LOGS = [
  { id:'p1', kpiId:'k1', userId:'u1', activityType:'meeting', count:4, entityType:'company', entityId:'c1', date:daysFromNow(-2), comment:'Intro meeting with regional team' },
  { id:'p2', kpiId:'k2', userId:'u2', activityType:'call',    count:3, entityType:'company', entityId:'c4', date:daysFromNow(-1), comment:'' },
  { id:'p3', kpiId:'k7', userId:'u5', activityType:'article', count:1, entityType:'article', entityId:'a1', date:daysFromNow(-3), comment:'Published feature' },
  { id:'p4', kpiId:'k7', userId:'u6', activityType:'article', count:1, entityType:'article', entityId:'a2', date:daysFromNow(-5), comment:'' },
  { id:'p5', kpiId:'k9', userId:'u7', activityType:'meeting', count:2, entityType:'company', entityId:'c3', date:daysFromNow(-1), comment:'Aftercare review' },
  { id:'p6', kpiId:'k3', userId:'u3', activityType:'meeting', count:1, entityType:'company', entityId:'c5', date:daysFromNow(-4), comment:'Site visit' },
  { id:'p7', kpiId:'k7', userId:'u5', activityType:'article', count:1, entityType:'article', entityId:'a3', date:daysFromNow(-6), comment:'' },
];

const TODOS = [
  { id:'td1', title:{en:'Send follow-up to Schneider Electric',ge:'Follow-up Schneider-ს'}, type:'personal', ownerId:'u1', assignees:['u1'], status:'open', dueDate:daysFromNow(-2), subtasks:[{id:'st1',title:{en:'Draft email',ge:'იმეილის დრაფტი'},done:true},{id:'st2',title:{en:'Attach deck',ge:'დეკის მიმაგრება'},done:false}] },
  { id:'td2', title:{en:'Prepare investor visit briefing',ge:'ვიზიტის ბრიფინგი'}, type:'personal', ownerId:'u3', assignees:['u3'], status:'open', dueDate:daysFromNow(0), subtasks:[] },
  { id:'td3', title:{en:'Q2 KPI review — all leads',ge:'Q2 KPI მიმოხილვა'}, type:'team', ownerId:'u0', assignees:['u1','u4','u7','u10'], status:'open', dueDate:daysFromNow(3), subtasks:[] },
  { id:'td4', title:{en:'Upload monthly report',ge:'თვიური ანგარიში'}, type:'personal', ownerId:'u1', assignees:['u1'], status:'inProgress', dueDate:daysFromNow(1), subtasks:[] },
  { id:'td5', title:{en:'Review article drafts',ge:'სტატიების გადახედვა'}, type:'personal', ownerId:'u5', assignees:['u5'], status:'open', dueDate:daysFromNow(2), subtasks:[] },
  { id:'td6', title:{en:'Aftercare survey to 30 investors',ge:'Aftercare გამოკითხვა'}, type:'team', ownerId:'u0', assignees:['u7','u8','u9'], status:'open', dueDate:daysFromNow(8), subtasks:[] },
  { id:'td7', title:{en:'Finalize FDI grant rubric',ge:'FDI რუბრიკა'}, type:'personal', ownerId:'u10', assignees:['u10'], status:'done', dueDate:daysFromNow(-3), subtasks:[] },
  { id:'td8', title:{en:'Coordinate media day',ge:'მედია დღის კოორდინაცია'}, type:'team', ownerId:'u0', assignees:['u4','u5','u6'], status:'inProgress', dueDate:daysFromNow(5), subtasks:[] },
];

window.SEED = { USERS, KPIS, COMPANIES, ARTICLES, PROGRESS_LOGS, TODOS, ATYPES, today };

/* ---------------- helpers ---------------- */
window.pct = (cur, tgt) => Math.max(0, Math.min(100, Math.round((cur/tgt)*100)));
window.kpiStatus = (cur, tgt) => { const p=(cur/tgt)*100; if(p>=95)return'done'; if(p>=70)return'onTrack'; if(p>=40)return'atRisk'; return'behind'; };
window.fmtN = (n) => n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(1)+'k':String(n);
window.userById = (s,id) => s.users.find(u=>u.id===id);
window.daysBetween = (iso) => Math.round((new Date(iso)-today)/86400000);
window.fmtDate = (iso, lang) => new Date(iso).toLocaleDateString(lang==='ge'?'ka-GE':'en-GB',{day:'numeric',month:'short'});
window.relDate = (iso, lang) => { const d=window.daysBetween(iso); if(d<0)return Math.abs(d)+(lang==='ge'?' დღ. გადაც.':'d overdue'); if(d===0)return lang==='ge'?'დღეს':'Today'; if(d===1)return lang==='ge'?'ხვალ':'Tomorrow'; return (lang==='ge'?'':'in ')+d+(lang==='ge'?' დღეში':'d'); };

/* ---------------- Store (context) ---------------- */
const StoreContext = createContext(null);
window.useStore = () => useContext(StoreContext);

function StoreProvider({ children }) {
  const [users] = useState(SEED.USERS);
  const [kpis, setKpis] = useState(SEED.KPIS);
  const [companies, setCompanies] = useState(SEED.COMPANIES);
  const [articles, setArticles] = useState(SEED.ARTICLES);
  const [logs, setLogs] = useState(SEED.PROGRESS_LOGS);
  const [todos, setTodos] = useState(SEED.TODOS);
  const [currentUserId, setCurrentUserId] = useState(null); // null = logged out
  const [lang, setLang] = useState('en');

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const isAdmin = currentUser?.role === 'admin';

  const actions = useMemo(() => ({
    login: (id) => { const u = users.find(x=>x.id===id); setCurrentUserId(id); if(u) setLang(u.language); },
    logout: () => setCurrentUserId(null),
    setLang,
    // progress logging + auto db record
    logProgress: ({ kpiId, userId, activityType, count, entityType, entityName, comment }) => {
      let entityId = null;
      if (entityType === 'company' && entityName) {
        const existing = companies.find(c => c.name.toLowerCase() === entityName.trim().toLowerCase());
        if (existing) entityId = existing.id;
        else { entityId = 'c'+Date.now(); setCompanies(cs => [...cs, { id:entityId, name:entityName.trim(), website:'', description:'', createdAt:daysFromNow(0) }]); }
      } else if (entityType === 'article' && entityName) {
        const existing = articles.find(a => a.url.toLowerCase() === entityName.trim().toLowerCase());
        if (existing) entityId = existing.id;
        else { entityId = 'a'+Date.now(); const host=(entityName.match(/https?:\/\/([^\/]+)/)||[])[1]||'article'; setArticles(as => [...as, { id:entityId, url:entityName.trim(), title:'New article — '+host, description:'', createdAt:daysFromNow(0) }]); }
      }
      setLogs(ls => [{ id:'p'+Date.now(), kpiId, userId, activityType, count:+count, entityType, entityId, date:daysFromNow(0), comment:comment||'' }, ...ls]);
      setKpis(ks => ks.map(k => k.id===kpiId ? { ...k, current: k.current + (+count) } : k));
    },
    deleteLog: (logId) => setLogs(ls => ls.filter(l => l.id !== logId)),
    createKpi: (data) => setKpis(ks => [...ks, { id:'k'+Date.now(), current:0, archived:false, tasks:[], ...data }]),
    updateKpi: (id, patch) => setKpis(ks => ks.map(k => k.id===id ? { ...k, ...patch } : k)),
    archiveKpi: (id) => setKpis(ks => ks.map(k => k.id===id ? { ...k, archived:!k.archived } : k)),
    addTask: (kpiId, task) => setKpis(ks => ks.map(k => k.id===kpiId ? { ...k, tasks:[...k.tasks, { id:'t'+Date.now(), status:'open', subtasks:[], ...task }] } : k)),
    toggleSubtask: (kpiId, taskId, subId) => setKpis(ks => ks.map(k => k.id!==kpiId?k:{ ...k, tasks:k.tasks.map(t => t.id!==taskId?t:{ ...t, subtasks:t.subtasks.map(s => s.id===subId?{...s,done:!s.done}:s) }) })),
    updateCompany: (id, patch) => setCompanies(cs => cs.map(c => c.id===id ? { ...c, ...patch } : c)),
    updateArticle: (id, patch) => setArticles(as => as.map(a => a.id===id ? { ...a, ...patch } : a)),
    createTodo: (data) => setTodos(ts => [...ts, { id:'td'+Date.now(), status:'open', subtasks:[], ...data }]),
    updateTodo: (id, patch) => setTodos(ts => ts.map(t => t.id===id ? { ...t, ...patch } : t)),
    deleteTodo: (id) => setTodos(ts => ts.filter(t => t.id !== id)),
    toggleTodoSub: (todoId, subId) => setTodos(ts => ts.map(t => t.id!==todoId?t:{ ...t, subtasks:t.subtasks.map(s => s.id===subId?{...s,done:!s.done}:s) })),
  }), [users, companies, articles]);

  const store = { users, kpis, companies, articles, logs, todos, currentUser, currentUserId, isAdmin, lang, ...actions };
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
window.StoreProvider = StoreProvider;

/* ---------------- Router (hash) ---------------- */
window.useRoute = () => {
  const [hash, setHash] = useState(window.location.hash.slice(1) || '/dashboard');
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1) || '/dashboard');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
};
window.navigate = (to) => { window.location.hash = to; };
window.matchRoute = (hash, pattern) => {
  const hp = hash.split('?')[0].split('/').filter(Boolean);
  const pp = pattern.split('/').filter(Boolean);
  if (hp.length !== pp.length) return null;
  const params = {};
  for (let i=0;i<pp.length;i++){ if(pp[i].startsWith(':')) params[pp[i].slice(1)]=decodeURIComponent(hp[i]); else if(pp[i]!==hp[i]) return null; }
  return params;
};

/* ---------------- UI primitives ---------------- */
const Icon = ({ name, className='icon' }) => {
  const p = {
    plus:<g><path d="M12 5v14M5 12h14"/></g>, check:<g><path d="M4 12l5 5L20 6"/></g>,
    chev:<g><path d="M9 6l6 6-6 6"/></g>, chevDown:<g><path d="M6 9l6 6 6-6"/></g>, chevLeft:<g><path d="M15 6l-6 6 6 6"/></g>,
    search:<g><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></g>,
    bell:<g><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0"/></g>,
    grid:<g><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>,
    target:<g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></g>,
    list:<g><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></g>,
    users:<g><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M18 20c0-2-.6-3.8-1.6-5"/></g>,
    user:<g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g>,
    db:<g><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></g>,
    doc:<g><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></g>,
    calendar:<g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></g>,
    flag:<g><path d="M5 21V4l8 2 6-2v11l-6 2-8-2z"/></g>, arrow:<g><path d="M5 12h14M13 5l7 7-7 7"/></g>,
    x:<g><path d="M6 6l12 12M18 6L6 18"/></g>, dot:<g><circle cx="12" cy="12" r="3" fill="currentColor"/></g>,
    bolt:<g><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></g>, phone:<g><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></g>,
    link:<g><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></g>,
    trash:<g><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></g>, edit:<g><path d="M4 20h4L18 10l-4-4L4 16zM14 6l4 4"/></g>,
    logout:<g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></g>,
    ext:<g><path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></g>,
    settings:<g><circle cx="12" cy="12" r="3"/></g>, filter:<g><path d="M3 6h18M6 12h12M10 18h4"/></g>,
    clock:<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>, sparkle:<g><path d="M12 4v6M12 14v6M4 12h6M14 12h6"/></g>,
  };
  return <svg className={className} viewBox="0 0 24 24">{p[name]||p.dot}</svg>;
};
window.Icon = Icon;

window.Avatar = ({ user, size }) => user ? (
  <div className={`avatar ${size||''}`} style={{ background:'color-mix(in oklch, '+user.color+' 14%, white)', color:user.color }}>{user.initials}</div>
) : null;

window.ProgressBar = ({ value, target, size='md', tone }) => {
  const p = window.pct(value, target);
  const t = tone || (p<40?'pb-red':p<70?'pb-amber':'');
  return <div className={`pb ${size==='lg'?'lg':size==='sm'?'sm':''} ${t}`}><div className="pb-fill" style={{ width:p+'%' }}/></div>;
};

window.StatusBadge = ({ status, lang }) => {
  const m = { done:'badge-green', onTrack:'badge-green', atRisk:'badge-amber', behind:'badge-red', open:'badge-gray', inProgress:'badge-amber', overdue:'badge-red', todo:'badge-gray' };
  return <span className={`badge ${m[status]||'badge-gray'}`}><span className="badge-dot"/>{window.tr(status, lang)}</span>;
};

window.ProgramPill = ({ program, lang }) => (
  <span className={`pill cat-bg-${program}`}><span className={`cat-dot cat-${program}`}/>{window.tr(program, lang)}</span>
);

window.Cbx = ({ checked, onClick, size }) => (
  <button className={`cbx ${size||''} ${checked?'checked':''}`} onClick={onClick}>{checked && <Icon name="check" className="icon icon-sm"/>}</button>
);

window.Modal = ({ title, sub, onClose, children, foot, width }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" style={width?{maxWidth:width}:null} onClick={e=>e.stopPropagation()}>
      <div className="modal-head">
        <div><div style={{fontSize:17,fontWeight:600,letterSpacing:'-0.01em'}}>{title}</div>{sub && <div style={{fontSize:12.5,color:'var(--ink-3)',marginTop:3}}>{sub}</div>}</div>
        <button className="btn-icon" onClick={onClose}><Icon name="x" className="icon"/></button>
      </div>
      <div className="modal-body">{children}</div>
      {foot && <div className="modal-foot">{foot}</div>}
    </div>
  </div>
);

window.LangToggle = ({ lang, setLang }) => (
  <div style={{ display:'inline-flex', background:'var(--cream-2)', borderRadius:99, padding:3 }}>
    {[['en','EN'],['ge','ქა']].map(([v,lbl]) => (
      <button key={v} onClick={()=>setLang(v)} style={{ padding:'5px 11px', borderRadius:99, border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:11,
        background:lang===v?'#fff':'transparent', color:lang===v?'var(--ink)':'var(--ink-3)', boxShadow:lang===v?'var(--shadow-1)':'none' }}>{lbl}</button>
    ))}
  </div>
);

window.activityIcon = (type) => ({ meeting:'users', call:'phone', article:'doc', other:'dot' }[type] || 'dot');
