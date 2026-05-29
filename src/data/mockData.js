// ============================================================
// mockData.js — seed data for development (Chunks 3–8)
// Extracted from hub-data.jsx (window.SEED object)
// CHUNK 10: replaced by Firestore onSnapshot subscriptions
// ============================================================

export const ACTIVITY_TYPES = ['meeting', 'call', 'article', 'other'];
export const KPI_PROGRAMS   = ['invest', 'awareness', 'aftercare', 'fdi'];

const today = new Date();
const daysFromNow = (d) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export function getMockUsers() {
  return [
    { id:'u0',  name:'Nino Beridze',         email:'nino.beridze@enterprise.gov.ge',    role:'admin', initials:'NB', color:'#0B3D2E', program:'invest',    language:'en', active:true },
    { id:'u1',  name:'Giorgi Maisuradze',    email:'g.maisuradze@enterprise.gov.ge',    role:'user',  initials:'GM', color:'#1F5A45', program:'invest',    language:'en', active:true },
    { id:'u2',  name:'Tamar Kapanadze',      email:'t.kapanadze@enterprise.gov.ge',     role:'user',  initials:'TK', color:'#3E8367', program:'invest',    language:'ge', active:true },
    { id:'u3',  name:'Luka Gelashvili',      email:'l.gelashvili@enterprise.gov.ge',    role:'user',  initials:'LG', color:'#0B3D2E', program:'invest',    language:'en', active:true },
    { id:'u4',  name:'Ana Javakhishvili',    email:'a.javakhishvili@enterprise.gov.ge', role:'user',  initials:'AJ', color:'#C77A2B', program:'awareness', language:'ge', active:true },
    { id:'u5',  name:'Davit Kiknadze',       email:'d.kiknadze@enterprise.gov.ge',      role:'user',  initials:'DK', color:'#C77A2B', program:'awareness', language:'en', active:true },
    { id:'u6',  name:'Salome Gabunia',       email:'s.gabunia@enterprise.gov.ge',       role:'user',  initials:'SG', color:'#C77A2B', program:'awareness', language:'en', active:true },
    { id:'u7',  name:'Nikoloz Badriashvili', email:'n.badriashvili@enterprise.gov.ge',  role:'user',  initials:'NB', color:'#5A6FB8', program:'aftercare', language:'ge', active:true },
    { id:'u8',  name:'Ketevan Chkheidze',    email:'k.chkheidze@enterprise.gov.ge',     role:'user',  initials:'KC', color:'#5A6FB8', program:'aftercare', language:'en', active:true },
    { id:'u9',  name:'Alexandre Tsereteli', email:'a.tsereteli@enterprise.gov.ge',     role:'user',  initials:'AT', color:'#5A6FB8', program:'aftercare', language:'en', active:true },
    { id:'u10', name:'Mariam Putkaradze',    email:'m.putkaradze@enterprise.gov.ge',    role:'user',  initials:'MP', color:'#8B4A8E', program:'fdi',       language:'ge', active:true },
  ];
}

export function getMockKPIs() {
  return [
    { id:'k1',  title:{en:'Companies screened',          ge:'შერჩეული კომპანიები'},        program:'invest',    target:200, unit:'#', deadline:daysFromNow(34),  assignees:['u1','u2'], current:142, archived:false,
      tasks:[
        { id:'t1', title:{en:'Build long-list from sector reports', ge:'სიის შედგენა'}, assignedTo:'u1', dueDate:daysFromNow(5),  status:'open', subtasks:[{id:'s1',title:{en:'Pull EU manufacturing list',ge:'EU სია'},done:true},{id:'s2',title:{en:'Score by fit',ge:'შეფასება'},done:false}] },
        { id:'t2', title:{en:'Validate contact data', ge:'კონტაქტების ვალიდაცია'},       assignedTo:'u2', dueDate:daysFromNow(12), status:'open', subtasks:[{id:'s3',title:{en:'Cross-check CRM',ge:'CRM შემოწმება'},done:false}] },
      ]},
    { id:'k2',  title:{en:'Companies contacted',         ge:'კონტაქტირებული კომპანიები'}, program:'invest',    target:120, unit:'#', deadline:daysFromNow(34),  assignees:['u2','u3'], current:87,  archived:false, tasks:[] },
    { id:'k3',  title:{en:'Investor visits hosted',      ge:'ინვესტორთა ვიზიტები'},       program:'invest',    target:20,  unit:'#', deadline:daysFromNow(50),  assignees:['u3'],      current:12,  archived:false, tasks:[] },
    { id:'k4',  title:{en:'Investment projects launched',ge:'დაწყებული პროექტები'},        program:'invest',    target:8,   unit:'#', deadline:daysFromNow(80),  assignees:['u1'],      current:4,   archived:false, tasks:[] },
    { id:'k5',  title:{en:'Jobs announced',              ge:'სამუშაო ადგილები'},           program:'invest',    target:500, unit:'#', deadline:daysFromNow(80),  assignees:['u1','u3'], current:318, archived:false, tasks:[] },
    { id:'k6',  title:{en:'Consultants & media hosted',  ge:'კონსულტანტები & მედია'},      program:'awareness', target:15,  unit:'#', deadline:daysFromNow(40),  assignees:['u4'],      current:9,   archived:false, tasks:[] },
    { id:'k7',  title:{en:'Articles published',          ge:'გამოქვეყნებული სტატიები'},    program:'awareness', target:30,  unit:'#', deadline:daysFromNow(34),  assignees:['u5','u6'], current:22,  archived:false, tasks:[] },
    { id:'k8',  title:{en:'Social media leads',          ge:'სოც. მედია Lead-ები'},         program:'awareness', target:100, unit:'#', deadline:daysFromNow(34),  assignees:['u6'],      current:41,  archived:false, tasks:[] },
    { id:'k9',  title:{en:'Issues resolved',             ge:'მოგვარებული პრობლემები'},     program:'aftercare', target:45,  unit:'#', deadline:daysFromNow(34),  assignees:['u7','u8'], current:24,  archived:false, tasks:[] },
    { id:'k10', title:{en:'Investor meetings held',      ge:'ინვესტორთა შეხვედრები'},      program:'aftercare', target:60,  unit:'#', deadline:daysFromNow(34),  assignees:['u9'],      current:47,  archived:false, tasks:[] },
    { id:'k11', title:{en:'Expansion decisions',         ge:'გაფართოების გადაწყვეტ.'},      program:'aftercare', target:10,  unit:'#', deadline:daysFromNow(60),  assignees:['u7'],      current:6,   archived:false, tasks:[] },
    { id:'k12', title:{en:'FDI grant projects',          ge:'FDI გრანტ-პროექტები'},         program:'fdi',       target:12,  unit:'#', deadline:daysFromNow(70),  assignees:['u10'],     current:7,   archived:false, tasks:[] },
  ];
}

export function getMockCompanies() {
  return [
    { id:'c1', name:'Schneider Electric', website:'se.com',             description:'French multinational, energy & automation. Evaluating Tbilisi distribution hub.', createdAt:daysFromNow(-40) },
    { id:'c2', name:'Tbilisi Free Zone',  website:'tbilisifreezone.ge', description:'Free industrial zone operator.',                                                  createdAt:daysFromNow(-30) },
    { id:'c3', name:'BP Georgia',         website:'bp.com',             description:'Existing investor, aftercare account.',                                           createdAt:daysFromNow(-25) },
    { id:'c4', name:'Wissol Group',       website:'wissol.ge',          description:'Local energy & retail group.',                                                    createdAt:daysFromNow(-15) },
    { id:'c5', name:'Hualing Group',      website:'hualing.ge',         description:'Chinese conglomerate, Kutaisi FIZ.',                                              createdAt:daysFromNow(-10) },
  ];
}

export function getMockArticles() {
  return [
    { id:'a1', url:'https://agenda.ge/en/news/invest-georgia-2026',    title:'Why investors are looking at Georgia in 2026', description:'Feature in Agenda.ge on the investment climate.', createdAt:daysFromNow(-20) },
    { id:'a2', url:'https://bm.ge/en/article/fdi-growth',              title:'FDI inflows rise 14% year-on-year',            description:'Business Media Georgia coverage.',               createdAt:daysFromNow(-12) },
    { id:'a3', url:'https://reuters.com/markets/georgia-manufacturing', title:'Georgia courts EU manufacturers',               description:'Reuters wire story.',                           createdAt:daysFromNow(-6)  },
  ];
}

export function getMockProgressLogs() {
  return [
    { id:'p1', kpiId:'k1', userId:'u1', activityType:'meeting', count:4, entityType:'company', entityId:'c1', date:daysFromNow(-2), comment:'Intro meeting with regional team' },
    { id:'p2', kpiId:'k2', userId:'u2', activityType:'call',    count:3, entityType:'company', entityId:'c4', date:daysFromNow(-1), comment:'' },
    { id:'p3', kpiId:'k7', userId:'u5', activityType:'article', count:1, entityType:'article', entityId:'a1', date:daysFromNow(-3), comment:'Published feature' },
    { id:'p4', kpiId:'k7', userId:'u6', activityType:'article', count:1, entityType:'article', entityId:'a2', date:daysFromNow(-5), comment:'' },
    { id:'p5', kpiId:'k9', userId:'u7', activityType:'meeting', count:2, entityType:'company', entityId:'c3', date:daysFromNow(-1), comment:'Aftercare review' },
    { id:'p6', kpiId:'k3', userId:'u3', activityType:'meeting', count:1, entityType:'company', entityId:'c5', date:daysFromNow(-4), comment:'Site visit' },
    { id:'p7', kpiId:'k7', userId:'u5', activityType:'article', count:1, entityType:'article', entityId:'a3', date:daysFromNow(-6), comment:'' },
  ];
}

export function getMockTodos() {
  return [
    { id:'td1', title:{en:'Send follow-up to Schneider Electric',ge:'Follow-up Schneider-ს'},  type:'personal', ownerId:'u1',  assignees:['u1'],               status:'open',       dueDate:daysFromNow(-2), subtasks:[{id:'st1',title:{en:'Draft email',ge:'იმეილის დრაფტი'},done:true},{id:'st2',title:{en:'Attach deck',ge:'დეკის მიმაგრება'},done:false}] },
    { id:'td2', title:{en:'Prepare investor visit briefing',ge:'ვიზიტის ბრიფინგი'},           type:'personal', ownerId:'u3',  assignees:['u3'],               status:'open',       dueDate:daysFromNow(0),  subtasks:[] },
    { id:'td3', title:{en:'Q2 KPI review — all leads',ge:'Q2 KPI მიმოხილვა'},                 type:'team',     ownerId:'u0',  assignees:['u1','u4','u7','u10'],status:'open',       dueDate:daysFromNow(3),  subtasks:[] },
    { id:'td4', title:{en:'Upload monthly report',ge:'თვიური ანგარიში'},                       type:'personal', ownerId:'u1',  assignees:['u1'],               status:'inProgress', dueDate:daysFromNow(1),  subtasks:[] },
    { id:'td5', title:{en:'Review article drafts',ge:'სტატიების გადახედვა'},                   type:'personal', ownerId:'u5',  assignees:['u5'],               status:'open',       dueDate:daysFromNow(2),  subtasks:[] },
    { id:'td6', title:{en:'Aftercare survey to 30 investors',ge:'Aftercare გამოკითხვა'},       type:'team',     ownerId:'u0',  assignees:['u7','u8','u9'],     status:'open',       dueDate:daysFromNow(8),  subtasks:[] },
    { id:'td7', title:{en:'Finalize FDI grant rubric',ge:'FDI რუბრიკა'},                       type:'personal', ownerId:'u10', assignees:['u10'],              status:'done',       dueDate:daysFromNow(-3), subtasks:[] },
    { id:'td8', title:{en:'Coordinate media day',ge:'მედია დღის კოორდინაცია'},                 type:'team',     ownerId:'u0',  assignees:['u4','u5','u6'],     status:'inProgress', dueDate:daysFromNow(5),  subtasks:[] },
  ];
}
