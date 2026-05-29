// ============================================================
// translations.js — all UI strings in English and Georgian
// Extracted from hub-data.jsx (L object)
// Usage: t('dashboard') returns string in current lang
// ============================================================

export const translations = {
  // app
  appName:       { en: 'IPA KPI Hub',                   ge: 'IPA KPI ჰაბი' },
  org:           { en: 'Enterprise Georgia',             ge: 'აწარმოე საქართველოში' },
  // nav
  dashboard:     { en: 'Dashboard',                     ge: 'მთავარი' },
  kpis:          { en: 'KPIs',                          ge: 'KPI-ები' },
  todos:         { en: 'To-do',                         ge: 'დავალებები' },
  team:          { en: 'Team',                          ge: 'გუნდი' },
  database:      { en: 'Database',                      ge: 'ბაზა' },
  reports:       { en: 'Reports',                       ge: 'ანგარიშები' },
  profile:       { en: 'Profile',                       ge: 'პროფილი' },
  logout:        { en: 'Log out',                       ge: 'გასვლა' },
  // programs
  invest:        { en: 'Investment Attraction',         ge: 'ინვესტიციების მოზიდვა' },
  awareness:     { en: 'Awareness',                     ge: 'ცნობადობა' },
  aftercare:     { en: 'Aftercare',                     ge: 'Aftercare' },
  fdi:           { en: 'FDI Grant',                     ge: 'FDI გრანტი' },
  // status
  onTrack:       { en: 'On track',                      ge: 'გრაფიკში' },
  atRisk:        { en: 'At risk',                       ge: 'რისკში' },
  behind:        { en: 'Behind',                        ge: 'ჩამორჩება' },
  done:          { en: 'Done',                          ge: 'დასრულდა' },
  open:          { en: 'Open',                          ge: 'ღია' },
  overdue:       { en: 'Overdue',                       ge: 'ვადაგადაცილ.' },
  inProgress:    { en: 'In progress',                   ge: 'მიმდინარე' },
  todo:          { en: 'To do',                         ge: 'გასაკეთებელი' },
  // common actions
  target:        { en: 'Target',                        ge: 'სამიზნე' },
  progress:      { en: 'Progress',                      ge: 'პროგრესი' },
  deadline:      { en: 'Deadline',                      ge: 'ვადა' },
  program:       { en: 'Program',                       ge: 'პროგრამა' },
  status:        { en: 'Status',                        ge: 'სტატუსი' },
  assignees:     { en: 'Assignees',                     ge: 'პასუხისმგებლები' },
  assignedTo:    { en: 'Assigned to',                   ge: 'პასუხისმგებელი' },
  logProgress:   { en: 'Log progress',                  ge: 'პროგრესის დაფიქსირება' },
  quickLog:      { en: 'Quick log',                     ge: 'სწრაფი ჩაწერა' },
  createKpi:     { en: 'New KPI',                       ge: 'ახალი KPI' },
  newTodo:       { en: 'New to-do',                     ge: 'ახალი დავალება' },
  search:        { en: 'Search…',                       ge: 'ძებნა…' },
  cancel:        { en: 'Cancel',                        ge: 'გაუქმება' },
  save:          { en: 'Save',                          ge: 'შენახვა' },
  next:          { en: 'Next',                          ge: 'შემდეგი' },
  back:          { en: 'Back',                          ge: 'უკან' },
  submit:        { en: 'Submit',                        ge: 'დადასტურება' },
  all:           { en: 'All',                           ge: 'ყველა' },
  edit:          { en: 'Edit',                          ge: 'რედაქტირება' },
  archive:       { en: 'Archive',                       ge: 'არქივი' },
  unit:          { en: 'Unit',                          ge: 'ერთეული' },
  addTask:       { en: 'Add task',                      ge: 'დავალების დამატება' },
  // todos
  myTodos:       { en: 'My to-dos',                     ge: 'ჩემი დავალებები' },
  teamTodos:     { en: 'Team to-dos',                   ge: 'გუნდის დავალებები' },
  list:          { en: 'List',                          ge: 'სია' },
  board:         { en: 'Board',                         ge: 'დაფა' },
  timeline:      { en: 'Timeline',                      ge: 'ვადები' },
  subtasks:      { en: 'subtasks',                      ge: 'ქვედავალება' },
  // activity types
  meeting:       { en: 'Meeting',                       ge: 'შეხვედრა' },
  call:          { en: 'Call',                          ge: 'ზარი' },
  article:       { en: 'Article',                       ge: 'სტატია' },
  other:         { en: 'Other',                         ge: 'სხვა' },
  // dashboard
  totalKpis:     { en: 'Total KPIs',                    ge: 'სულ KPI' },
  myTasks:       { en: 'My open tasks',                 ge: 'ჩემი ღია დავალებები' },
  recentActivity:{ en: 'Recent activity',               ge: 'ბოლო აქტივობა' },
  teamHealth:    { en: 'Team KPI health',               ge: 'გუნდის KPI ჯანმრთელობა' },
  stale:         { en: 'No recent activity',            ge: 'აქტივობის გარეშე' },
  // kpi detail
  progressLog:   { en: 'Progress log',                  ge: 'პროგრესის ისტორია' },
  tasks:         { en: 'Tasks',                         ge: 'დავალებები' },
  activityType:  { en: 'Activity type',                 ge: 'აქტივობის ტიპი' },
  count:         { en: 'Count',                         ge: 'რაოდენობა' },
  company:       { en: 'Company',                       ge: 'კომპანია' },
  companyName:   { en: 'Company name',                  ge: 'კომპანიის სახელი' },
  articleLink:   { en: 'Article link',                  ge: 'სტატიის ბმული' },
  linked:        { en: 'links to database',             ge: 'ბაზასთან დაკავშირება' },
  // team
  teamMgmt:      { en: 'Team management',               ge: 'გუნდის მართვა' },
  newUser:       { en: 'New user',                      ge: 'ახალი მომხმარებელი' },
  lastActivity:  { en: 'Last activity',                 ge: 'ბოლო აქტივობა' },
  activeKpis:    { en: 'Active KPIs',                   ge: 'აქტიური KPI' },
  email:         { en: 'Email',                         ge: 'ელ-ფოსტა' },
  role:          { en: 'Role',                          ge: 'როლი' },
  admin:         { en: 'Admin',                         ge: 'ადმინი' },
  user:          { en: 'Member',                        ge: 'წევრი' },
  reassign:      { en: 'Reassign',                      ge: 'გადანაწილება' },
  // database
  companies:     { en: 'Companies',                     ge: 'კომპანიები' },
  articles:      { en: 'Articles',                      ge: 'სტატიები' },
  website:       { en: 'Website',                       ge: 'ვებგვერდი' },
  notes:         { en: 'Notes',                         ge: 'შენიშვნები' },
  mentions:      { en: 'Mentions',                      ge: 'ხსენებები' },
  lastMention:   { en: 'Last mentioned',                ge: 'ბოლო ხსენება' },
  appearsIn:     { en: 'Appears in',                    ge: 'გვხვდება' },
  activityHistory:{ en: 'Activity history',             ge: 'აქტივობის ისტორია' },
  openFull:      { en: 'Open full page',                ge: 'სრული გვერდი' },
  title:         { en: 'Title',                         ge: 'სათაური' },
  // reports
  exportReport:  { en: 'Export report',                 ge: 'ანგარიშის ექსპორტი' },
  language:      { en: 'Language',                      ge: 'ენა' },
  scope:         { en: 'Scope',                         ge: 'მოცულობა' },
  dateRange:     { en: 'Date range',                    ge: 'პერიოდი' },
  preview:       { en: 'Preview',                       ge: 'გადახედვა' },
  exportPdf:     { en: 'Export PDF',                    ge: 'PDF ექსპორტი' },
  individual:    { en: 'Individual member',             ge: 'ცალკე წევრი' },
  allKpis:       { en: 'All KPIs',                      ge: 'ყველა KPI' },
  // login
  signIn:        { en: 'Sign in',                       ge: 'შესვლა' },
  password:      { en: 'Password',                      ge: 'პაროლი' },
  signInSub:     { en: 'Accounts are created by your administrator.', ge: 'ანგარიშებს ქმნის ადმინისტრატორი.' },
  // misc
  noActivity:    { en: 'No activity yet',               ge: 'აქტივობა არ არის' },
  viewAll:       { en: 'View all',                      ge: 'ყველას ნახვა' },
  due:           { en: 'Due',                           ge: 'ვადა' },
  changePassword:{ en: 'Change password',               ge: 'პაროლის შეცვლა' },
  displayName:   { en: 'Display name',                  ge: 'სახელი' },
  langPref:      { en: 'Language preference',           ge: 'ენის პარამეტრი' },
};

/** Resolve a translation key to a string in the given lang ('en'|'ge') */
export function tr(key, lang = 'en') {
  const entry = translations[key];
  if (!entry) return key; // fail gracefully — return the key itself
  return entry[lang] || entry.en || key;
}
