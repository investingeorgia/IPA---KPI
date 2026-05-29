// Shared data, translations, and small components for both KPI app variations.
// Exposed on window so both app-a.jsx and app-b.jsx can use them.

const { useState, useEffect, useMemo, useRef, useCallback, Fragment } = React;

// -------------------- i18n --------------------
const T = {
  appName:        { en: 'KPI Hub',                            ka: 'KPI ჰაბი' },
  // nav
  navAdmin:       { en: 'Admin',                              ka: 'ადმინი' },
  navMember:      { en: 'My Dashboard',                       ka: 'ჩემი დაფა' },
  navTodo:        { en: 'To-do',                              ka: 'სამოქმედო' },
  navKpi:         { en: 'KPI Detail',                         ka: 'KPI დეტალი' },
  navTeam:        { en: 'Team',                               ka: 'გუნდი' },
  teamTitle:      { en: 'Team management',                    ka: 'გუნდის მართვა' },
  teamSub:        { en: '10 members across 4 programs · 1 admin', ka: '10 წევრი 4 პროგრამაში · 1 ადმინი' },
  role:           { en: 'Role',                               ka: 'როლი' },
  program:        { en: 'Program',                            ka: 'პროგრამა' },
  openTasks:      { en: 'Open tasks',                         ka: 'ღია დავალებები' },
  ownedKpis:      { en: 'KPIs owned',                         ka: 'KPI-ები' },
  inviteMember:   { en: 'Invite member',                      ka: 'წევრის მოწვევა' },
  admin:          { en: 'Admin',                              ka: 'ადმინი' },
  member:         { en: 'Member',                             ka: 'წევრი' },
  avgProgress:    { en: 'Avg. progress',                      ka: 'საშ. პროგრესი' },
  // categories
  catInvest:      { en: 'Investment Attraction',              ka: 'ინვესტიციების მოზიდვა' },
  catAwareness:   { en: 'Awareness',                          ka: 'ცნობადობის გაზრდა' },
  catAftercare:   { en: 'Aftercare',                          ka: 'Aftercare' },
  catFdi:         { en: 'FDI Grant',                          ka: 'FDI Grant' },
  // common
  target:         { en: 'Target',                             ka: 'სამიზნე' },
  current:        { en: 'Current',                            ka: 'მიმდინარე' },
  progress:       { en: 'Progress',                           ka: 'პროგრესი' },
  assignee:       { en: 'Assignee',                           ka: 'პასუხისმგებელი' },
  deadline:       { en: 'Deadline',                           ka: 'ვადა' },
  addKpi:         { en: 'Add KPI',                            ka: 'KPI-ის დამატება' },
  addTask:        { en: 'Add task',                           ka: 'დავალების დამატება' },
  updateValue:    { en: 'Update value',                       ka: 'მნიშვნელობის განახლება' },
  thisQuarter:    { en: 'This quarter',                       ka: 'მიმდინარე კვარტალი' },
  overallProgress:{ en: 'Overall progress',                   ka: 'საერთო პროგრესი' },
  team:           { en: 'Team',                               ka: 'გუნდი' },
  goal:           { en: 'Goal',                               ka: 'მიზანი' },
  activity:       { en: 'Activity',                           ka: 'აქტივობა' },
  indicator:      { en: 'Indicator',                          ka: 'ინდიკატორი' },
  members:        { en: 'members',                            ka: 'წევრი' },
  ofTarget:       { en: 'of target',                          ka: 'სამიზნედან' },
  onTrack:        { en: 'On track',                           ka: 'გრაფიკში' },
  atRisk:         { en: 'At risk',                            ka: 'რისკში' },
  behind:         { en: 'Behind',                             ka: 'ჩამორჩება' },
  done:           { en: 'Done',                               ka: 'შესრულდა' },
  todoTitle:      { en: 'To-do',                              ka: 'სამოქმედო ბარათები' },
  todoSub:        { en: 'Tasks across the team, grouped by deadline', ka: 'გუნდის დავალებები, დაჯგუფებული ვადით' },
  adminTitle:     { en: 'Team overview',                      ka: 'გუნდის მიმოხილვა' },
  adminSub:       { en: 'KPI progress across all 10 members', ka: '10 წევრის KPI პროგრესი' },
  memberTitle:    { en: 'My KPIs',                            ka: 'ჩემი KPI-ები' },
  memberSub:      { en: 'Your active indicators this quarter',ka: 'თქვენი აქტიური ინდიკატორები ამ კვარტალში' },
  searchPh:       { en: 'Search…',                            ka: 'ძებნა…' },
  taskTitle:      { en: 'Task title',                         ka: 'დავალების სათაური' },
  add:            { en: 'Add',                                ka: 'დამატება' },
  cancel:         { en: 'Cancel',                             ka: 'გაუქმება' },
  today:          { en: 'Today',                              ka: 'დღეს' },
  tomorrow:       { en: 'Tomorrow',                           ka: 'ხვალ' },
  thisWeek:       { en: 'This week',                          ka: 'ამ კვირას' },
  nextWeek:       { en: 'Next week',                          ka: 'შემდეგ კვირას' },
  later:          { en: 'Later',                              ka: 'მოგვიანებით' },
  overdue:        { en: 'Overdue',                            ka: 'ვადაგადაცილებული' },
  filterAll:      { en: 'All',                                ka: 'ყველა' },
  // KPI fields
  kpiName:        { en: 'KPI name',                           ka: 'KPI-ის სახელი' },
  category:       { en: 'Category',                           ka: 'კატეგორია' },
  unit:           { en: 'Unit',                               ka: 'ერთეული' },
  notes:          { en: 'Notes',                              ka: 'შენიშვნები' },
  recentUpdates:  { en: 'Recent updates',                     ka: 'ბოლო განახლებები' },
  history:        { en: 'History',                            ka: 'ისტორია' },
  contributors:   { en: 'Contributors',                       ka: 'მონაწილენი' },
  velocity:       { en: 'Weekly velocity',                    ka: 'კვირეული ტემპი' },
  daysLeft:       { en: 'days left in quarter',               ka: 'დღე დარჩა კვარტალში' },
  pushUpdate:     { en: 'Push update',                        ka: 'განახლების დაფიქსირება' },
  inputNewValue:  { en: 'New value',                          ka: 'ახალი მნიშვნელობა' },
  comment:        { en: 'Comment (optional)',                 ka: 'კომენტარი (არასავალდებულო)' },
  byMember:       { en: 'By member',                          ka: 'წევრის მიხედვით' },
  byCategory:     { en: 'By category',                        ka: 'კატეგორიის მიხედვით' },
  status:         { en: 'Status',                             ka: 'სტატუსი' },
  // sample task labels
  members10:      { en: '10 members + 1 admin',               ka: '10 წევრი + 1 ადმინი' },
};
window.T = T;
window.t = function t(key, lang) { return (T[key] && T[key][lang]) || key; };

// -------------------- Members --------------------
// 1 admin + 10 team members. Initials used for avatars.
const MEMBERS = [
  { id: 'm0',  name_en: 'Nino Beridze',           name_ka: 'ნინო ბერიძე',          role: 'admin',  cat: 'invest',    initials: 'NB', color: '#0B3D2E' },
  { id: 'm1',  name_en: 'Giorgi Maisuradze',      name_ka: 'გიორგი მაისურაძე',     role: 'member', cat: 'invest',    initials: 'GM', color: '#1F5A45' },
  { id: 'm2',  name_en: 'Tamar Kapanadze',        name_ka: 'თამარ კაპანაძე',       role: 'member', cat: 'invest',    initials: 'TK', color: '#3E8367' },
  { id: 'm3',  name_en: 'Luka Gelashvili',        name_ka: 'ლუკა გელაშვილი',       role: 'member', cat: 'invest',    initials: 'LG', color: '#0B3D2E' },
  { id: 'm4',  name_en: 'Ana Javakhishvili',      name_ka: 'ანა ჯავახიშვილი',      role: 'member', cat: 'awareness', initials: 'AJ', color: '#C77A2B' },
  { id: 'm5',  name_en: 'Davit Kiknadze',         name_ka: 'დავით კიკნაძე',        role: 'member', cat: 'awareness', initials: 'DK', color: '#C77A2B' },
  { id: 'm6',  name_en: 'Salome Gabunia',         name_ka: 'სალომე გაბუნია',       role: 'member', cat: 'awareness', initials: 'SG', color: '#C77A2B' },
  { id: 'm7',  name_en: 'Nikoloz Badriashvili',   name_ka: 'ნიკოლოზ ბადრიაშვილი',  role: 'member', cat: 'aftercare', initials: 'NB', color: '#5A6FB8' },
  { id: 'm8',  name_en: 'Ketevan Chkheidze',      name_ka: 'ქეთევან ჩხეიძე',       role: 'member', cat: 'aftercare', initials: 'KC', color: '#5A6FB8' },
  { id: 'm9',  name_en: 'Alexandre Tsereteli',    name_ka: 'ალექსანდრე წერეთელი',  role: 'member', cat: 'aftercare', initials: 'AT', color: '#5A6FB8' },
  { id: 'm10', name_en: 'Mariam Putkaradze',      name_ka: 'მარიამ ფუტკარაძე',     role: 'member', cat: 'fdi',       initials: 'MP', color: '#8B4A8E' },
];
window.MEMBERS = MEMBERS;
window.memberName = (m, lang) => lang === 'ka' ? m.name_ka : m.name_en;
window.memberById = (id) => MEMBERS.find(m => m.id === id);

// -------------------- KPI data --------------------
// Goals -> Activities -> Indicators with current/target values.
const CATEGORIES = [
  {
    id: 'invest',
    name: { en: 'Investment Attraction', ka: 'ინვესტიციების მოზიდვა' },
    kpis: [
      { id: 'k1', name: { en: 'Companies screened',        ka: 'შერჩეული კომპანიები' },           goal: 'Identify potential investors', current: 142, target: 200, unit: '#',  owner: 'm1', updated: '2d ago' },
      { id: 'k2', name: { en: 'Companies contacted',       ka: 'კონტაქტირებული კომპანიები' },      goal: 'Reach out to investors',       current: 87,  target: 120, unit: '#',  owner: 'm2', updated: '5h ago' },
      { id: 'k3', name: { en: 'Companies hosted in GE',    ka: 'საქართველოში მასპინძლობა' },        goal: 'Host investors',                current: 12,  target: 20,  unit: '#',  owner: 'm3', updated: '1d ago' },
      { id: 'k4', name: { en: 'Projects launched',         ka: 'დაწყებული პროექტები' },             goal: 'Investment decision',           current: 4,   target: 8,   unit: '#',  owner: 'm1', updated: '3d ago' },
      { id: 'k5', name: { en: 'Jobs announced',            ka: 'გამოცხადებული სამუშაო ადგილები' },  goal: 'Investment decision',           current: 318, target: 500, unit: '#',  owner: 'm1', updated: '1w ago' },
      { id: 'k6', name: { en: 'Investment value (M USD)',  ka: 'საინვესტიციო ღირებულება (მლნ $)' }, goal: 'Investment decision',           current: 27,  target: 50,  unit: 'M', owner: 'm2', updated: '4d ago' },
    ],
  },
  {
    id: 'awareness',
    name: { en: 'Awareness', ka: 'ცნობადობა' },
    kpis: [
      { id: 'k7',  name: { en: 'Consultants hosted',       ka: 'მასპინძლობილი კონსულტანტები' },    goal: 'Host consultants & media',     current: 9,    target: 15,   unit: '#',  owner: 'm4', updated: '6h ago' },
      { id: 'k8',  name: { en: 'Articles published',      ka: 'გამოქვეყნებული სტატიები' },         goal: 'Publish articles',              current: 22,   target: 30,   unit: '#',  owner: 'm5', updated: '2d ago' },
      { id: 'k9',  name: { en: 'Article views',           ka: 'სტატიების ნახვები' },               goal: 'Publish articles',              current: 184000,target: 250000, unit: '',  owner: 'm5', updated: '1d ago' },
      { id: 'k10', name: { en: 'Social posts',            ka: 'სოც. მედია პოსტები' },              goal: 'Social campaign',               current: 64,   target: 80,   unit: '#',  owner: 'm6', updated: '3h ago' },
      { id: 'k11', name: { en: 'Leads generated',         ka: 'გენერირებული Lead-ები' },          goal: 'Social campaign',               current: 41,   target: 100,  unit: '#',  owner: 'm6', updated: '12h ago' },
      { id: 'k12', name: { en: 'Website visitors',        ka: 'ვებგვერდის ვიზიტორები' },          goal: 'Web operations',                current: 38200,target: 60000, unit: '',  owner: 'm4', updated: '5h ago' },
    ],
  },
  {
    id: 'aftercare',
    name: { en: 'Aftercare', ka: 'Aftercare' },
    kpis: [
      { id: 'k13', name: { en: 'Issues logged',           ka: 'აღრიცხული პრობლემები' },           goal: 'Resolve problems',              current: 38, target: 50, unit: '#', owner: 'm7', updated: '3h ago' },
      { id: 'k14', name: { en: 'Issues resolved',         ka: 'მოგვარებული პრობლემები' },         goal: 'Resolve problems',              current: 24, target: 45, unit: '#', owner: 'm8', updated: '1d ago' },
      { id: 'k15', name: { en: 'Meetings held',           ka: 'გამართული შეხვედრები' },           goal: 'Resolve problems',              current: 47, target: 60, unit: '#', owner: 'm9', updated: '4h ago' },
      { id: 'k16', name: { en: 'Positive expansion decisions', ka: 'დადებითი გადაწყვეტილებები' },  goal: 'Facilitate new projects',       current: 6,  target: 10, unit: '#', owner: 'm7', updated: '2d ago' },
    ],
  },
  {
    id: 'fdi',
    name: { en: 'FDI Grant', ka: 'FDI Grant' },
    kpis: [
      { id: 'k17', name: { en: 'Projects in program',     ka: 'პროგრამაში ჩართული პროექტები' },   goal: 'FDI Grant',                     current: 7,    target: 12,   unit: '#', owner: 'm10', updated: '1d ago' },
      { id: 'k18', name: { en: 'Grant jobs announced',    ka: 'სამუშაო ადგილები (გრანტი)' },       goal: 'FDI Grant',                     current: 142,  target: 250,  unit: '#', owner: 'm10', updated: '3d ago' },
      { id: 'k19', name: { en: 'Grant investment value',  ka: 'გრანტ-ინვესტიცია (მლნ $)' },        goal: 'FDI Grant',                     current: 14,   target: 25,   unit: 'M', owner: 'm10', updated: '5d ago' },
    ],
  },
];
window.CATEGORIES = CATEGORIES;

// -------------------- Todos --------------------
// One-page list, grouped by deadline buckets.
// dueDays: relative to "today" — negative = overdue, 0 = today, etc.
const INITIAL_TODOS = [
  { id: 't1',  title: { en: 'Send follow-up to Schneider Electric',     ka: 'შემდგომი იმეილი Schneider Electric-ისთვის' },          dueDays: -2, assignee: 'm2', cat: 'invest',    done: false },
  { id: 't2',  title: { en: 'Prepare investor visit briefing',          ka: 'ინვესტორის ვიზიტის ბრიფინგის მომზადება' },             dueDays: -1, assignee: 'm3', cat: 'invest',    done: false },
  { id: 't3',  title: { en: 'Review Q2 article draft',                  ka: 'Q2 სტატიის დრაფტის გადახედვა' },                       dueDays: 0,  assignee: 'm5', cat: 'awareness', done: false },
  { id: 't4',  title: { en: 'Schedule call with Tbilisi Free Zone',     ka: 'ზარის დანიშვნა თბილისის თავისუფალ ზონასთან' },        dueDays: 0,  assignee: 'm7', cat: 'aftercare', done: false },
  { id: 't5',  title: { en: 'Upload monthly KPI update',                ka: 'ყოველთვიური KPI განახლების ატვირთვა' },                dueDays: 0,  assignee: 'm1', cat: 'invest',    done: true  },
  { id: 't6',  title: { en: 'Draft LinkedIn campaign brief',            ka: 'LinkedIn კამპანიის ბრიფის შედგენა' },                  dueDays: 1,  assignee: 'm6', cat: 'awareness', done: false },
  { id: 't7',  title: { en: 'Coordinate aftercare meeting w/ BP',       ka: 'Aftercare შეხვედრის კოორდინაცია BP-სთან' },            dueDays: 1,  assignee: 'm9', cat: 'aftercare', done: false },
  { id: 't8',  title: { en: 'Translate FDI grant guide to EN',          ka: 'FDI გრანტის გზამკვლევის თარგმნა' },                    dueDays: 3,  assignee: 'm10',cat: 'fdi',       done: false },
  { id: 't9',  title: { en: 'Send Q3 calendar to consultants',          ka: 'Q3 კალენდრის გაგზავნა კონსულტანტებთან' },              dueDays: 4,  assignee: 'm4', cat: 'awareness', done: false },
  { id: 't10', title: { en: 'Compile investor pipeline report',         ka: 'ინვესტორთა Pipeline ანგარიში' },                       dueDays: 6,  assignee: 'm1', cat: 'invest',    done: false },
  { id: 't11', title: { en: 'Verify jobs data with HR portal',          ka: 'სამუშაო ადგილების მონაცემების შემოწმება HR პორტალში' },dueDays: 8,  assignee: 'm2', cat: 'invest',    done: false },
  { id: 't12', title: { en: 'Aftercare survey to 30 investors',         ka: 'Aftercare გამოკითხვა 30 ინვესტორთან' },                dueDays: 11, assignee: 'm8', cat: 'aftercare', done: false },
  { id: 't13', title: { en: 'Update grant scoring rubric',              ka: 'გრანტის შეფასების რუბრიკის განახლება' },               dueDays: 14, assignee: 'm10',cat: 'fdi',       done: false },
];
window.INITIAL_TODOS = INITIAL_TODOS;

// -------------------- Helpers --------------------
window.pct = (cur, tgt) => Math.max(0, Math.min(100, Math.round((cur / tgt) * 100)));
window.statusOf = (cur, tgt) => {
  const p = (cur / tgt) * 100;
  if (p >= 95) return 'done';
  if (p >= 70) return 'onTrack';
  if (p >= 40) return 'atRisk';
  return 'behind';
};
window.fmtN = (n) => {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 10000)   return (n/1000).toFixed(0) + 'k';
  if (n >= 1000)    return (n/1000).toFixed(1) + 'k';
  return String(n);
};

// -------------------- Tiny SVG icons (no library) --------------------
const Icon = ({ name, className='icon' }) => {
  const paths = {
    plus:    <g><path d="M12 5v14M5 12h14"/></g>,
    check:   <g><path d="M4 12l5 5L20 6"/></g>,
    chev:    <g><path d="M9 6l6 6-6 6"/></g>,
    chevDown:<g><path d="M6 9l6 6 6-6"/></g>,
    search:  <g><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></g>,
    bell:    <g><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0"/></g>,
    filter:  <g><path d="M3 6h18M6 12h12M10 18h4"/></g>,
    grid:    <g><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>,
    target:  <g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></g>,
    list:    <g><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></g>,
    user:    <g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g>,
    users:   <g><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M18 20c0-2-.6-3.8-1.6-5"/></g>,
    chart:   <g><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6"/></g>,
    calendar:<g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></g>,
    flag:    <g><path d="M5 21V4l8 2 6-2v11l-6 2-8-2z"/></g>,
    arrow:   <g><path d="M5 12h14M13 5l7 7-7 7"/></g>,
    sparkle: <g><path d="M12 4v6M12 14v6M4 12h6M14 12h6"/></g>,
    x:       <g><path d="M6 6l12 12M18 6L6 18"/></g>,
    dot:     <g><circle cx="12" cy="12" r="3" fill="currentColor"/></g>,
    settings:<g><circle cx="12" cy="12" r="3"/></g>,
  };
  return <svg className={className} viewBox="0 0 24 24">{paths[name] || paths.dot}</svg>;
};
window.Icon = Icon;

// -------------------- Shared mini components --------------------
window.ProgressBar = ({ value, target, size='md', tone }) => {
  const p = window.pct(value, target);
  const toneClass = tone || (p < 40 ? 'pb-red' : p < 70 ? 'pb-amber' : '');
  return (
    <div className={`pb ${size==='lg'?'lg':size==='sm'?'sm':''} ${toneClass}`}>
      <div className="pb-fill" style={{ width: p + '%' }} />
    </div>
  );
};

window.Avatar = ({ member, size }) => {
  if (!member) return null;
  return (
    <div className={`avatar ${size||''}`} style={{ background: 'color-mix(in oklch, ' + member.color + ' 14%, white)', color: member.color }}>
      {member.initials}
    </div>
  );
};

window.CategoryPill = ({ cat, label, lang }) => {
  const text = label || (CATEGORIES.find(c => c.id===cat)?.name?.[lang]) || cat;
  return (
    <span className={`pill cat-bg-${cat}`}>
      <span className={`cat-dot cat-${cat}`} />
      {text}
    </span>
  );
};

window.StatusPill = ({ status, lang }) => {
  const map = {
    done:    { cls: 'pill-green', label: t('done', lang) },
    onTrack: { cls: 'pill-green', label: t('onTrack', lang) },
    atRisk:  { cls: 'pill-amber', label: t('atRisk', lang) },
    behind:  { cls: 'pill-red',   label: t('behind', lang) },
  };
  const cfg = map[status] || map.onTrack;
  return <span className={`pill ${cfg.cls}`}><span className="pill-dot" />{cfg.label}</span>;
};

window.LangToggle = ({ lang, setLang, compact }) => (
  <div style={{ display:'inline-flex', background:'var(--cream-2)', borderRadius:99, padding:3, fontSize:11, fontWeight:600 }}>
    {['en','ka'].map(L => (
      <button key={L} onClick={() => setLang(L)}
        style={{ padding: compact?'4px 10px':'5px 12px', borderRadius:99, border:'none', cursor:'pointer',
                 background: lang===L?'#fff':'transparent', color: lang===L?'var(--ink)':'var(--ink-3)',
                 boxShadow: lang===L?'var(--shadow-1)':'none', fontFamily:'inherit', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
        {L}
      </button>
    ))}
  </div>
);

// Deadline bucketing
window.bucketOf = (dueDays) => {
  if (dueDays < 0) return 'overdue';
  if (dueDays === 0) return 'today';
  if (dueDays === 1) return 'tomorrow';
  if (dueDays <= 6) return 'thisWeek';
  if (dueDays <= 13) return 'nextWeek';
  return 'later';
};

window.formatRelDate = (dueDays, lang) => {
  if (dueDays < 0) return Math.abs(dueDays) + (lang==='ka'?'დღით ვადაგადაცილებული':'d overdue');
  if (dueDays === 0) return t('today', lang);
  if (dueDays === 1) return t('tomorrow', lang);
  return 'in ' + dueDays + 'd';
};
