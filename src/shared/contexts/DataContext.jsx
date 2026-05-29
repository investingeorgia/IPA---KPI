import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase/firebaseConfig';
import { auth } from '../../firebase/firebaseConfig';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [todos, setTodos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs to avoid stale closures in callbacks
  const kpisRef = useRef([]);
  const todosRef = useRef([]);
  const logsRef = useRef([]);
  const companiesRef = useRef([]);
  const articlesRef = useRef([]);

  useEffect(() => { kpisRef.current = kpis; }, [kpis]);
  useEffect(() => { todosRef.current = todos; }, [todos]);
  useEffect(() => { logsRef.current = logs; }, [logs]);
  useEffect(() => { companiesRef.current = companies; }, [companies]);
  useEffect(() => { articlesRef.current = articles; }, [articles]);

  useEffect(() => {
    let unsubFirestore = () => {};
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubFirestore();
      if (!firebaseUser) {
        setUsers([]);
        setKpis([]);
        setTodos([]);
        setLogs([]);
        setCompanies([]);
        setArticles([]);
        setLoading(false);
        return;
      }
      let loaded = 0;
      const mark = () => { if (++loaded >= 6) setLoading(false); };
      const unsubs = [
        onSnapshot(collection(db, 'users'),         s => { setUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
        onSnapshot(collection(db, 'kpis'),          s => { setKpis(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
        onSnapshot(collection(db, 'todos'),         s => { setTodos(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
        onSnapshot(collection(db, 'progress_logs'), s => { setLogs(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
        onSnapshot(collection(db, 'companies'),     s => { setCompanies(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
        onSnapshot(collection(db, 'articles'),      s => { setArticles(s.docs.map(d => ({ id: d.id, ...d.data() }))); mark(); }),
      ];
      unsubFirestore = () => unsubs.forEach(u => u());
    });
    return () => { unsubAuth(); unsubFirestore(); };
  }, []);

  // --- Company / Article helpers ---

  const findOrCreateCompany = useCallback(async (name) => {
    if (!name) return null;
    const existing = companiesRef.current.find(
      c => c.name && c.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) return existing.id;
    const today = new Date().toISOString().split('T')[0];
    const ref = await addDoc(collection(db, 'companies'), {
      name,
      website: '',
      description: '',
      createdAt: today,
    });
    return ref.id;
  }, []);

  const findOrCreateArticle = useCallback(async (url) => {
    if (!url) return null;
    const existing = articlesRef.current.find(a => a.url === url);
    if (existing) return existing.id;
    let title = url;
    try {
      title = new URL(url).hostname;
    } catch {
      // keep url as title if parsing fails
    }
    const today = new Date().toISOString().split('T')[0];
    const ref = await addDoc(collection(db, 'articles'), {
      url,
      title,
      description: '',
      createdAt: today,
    });
    return ref.id;
  }, []);

  // --- Progress Logs ---

  const addProgressLog = useCallback(async ({
    kpiId, userId, activityType, count, entityType, entityName, comment
  }) => {
    let entityId = null;
    if (entityName) {
      if (entityType === 'company') {
        entityId = await findOrCreateCompany(entityName);
      } else if (entityType === 'article') {
        entityId = await findOrCreateArticle(entityName);
      }
    }
    await addDoc(collection(db, 'progress_logs'), {
      kpiId,
      userId,
      activityType: activityType || null,
      count: count || 1,
      entityType: entityType || null,
      entityName: entityName || null,
      entityId: entityId || null,
      comment: comment || '',
      date: new Date().toISOString(),
    });
    await updateDoc(doc(db, 'kpis', kpiId), { current: increment(count || 1) });
  }, [findOrCreateCompany, findOrCreateArticle]);

  const deleteLog = useCallback(async (logId) => {
    const log = logsRef.current.find(l => l.id === logId);
    if (!log) return;
    await deleteDoc(doc(db, 'progress_logs', logId));
    await updateDoc(doc(db, 'kpis', log.kpiId), { current: increment(-(log.count || 1)) });
  }, []);

  // --- KPIs ---

  const createKpi = useCallback(async (data) => {
    await addDoc(collection(db, 'kpis'), data);
  }, []);

  const updateKpi = useCallback(async (id, patch) => {
    await updateDoc(doc(db, 'kpis', id), patch);
  }, []);

  const archiveKpi = useCallback(async (id) => {
    await updateDoc(doc(db, 'kpis', id), { archived: true });
  }, []);

  // --- Tasks (nested in KPI documents) ---

  const addTask = useCallback(async (kpiId, task) => {
    const kpi = kpisRef.current.find(k => k.id === kpiId);
    if (!kpi) return;
    const tasks = Array.isArray(kpi.tasks) ? kpi.tasks : [];
    const newTask = {
      ...task,
      id: 't' + Date.now(),
      status: 'open',
      subtasks: [],
    };
    await updateDoc(doc(db, 'kpis', kpiId), { tasks: [...tasks, newTask] });
  }, []);

  const updateTask = useCallback(async (kpiId, taskId, patch) => {
    const kpi = kpisRef.current.find(k => k.id === kpiId);
    if (!kpi) return;
    const tasks = (Array.isArray(kpi.tasks) ? kpi.tasks : []).map(t =>
      t.id === taskId ? { ...t, ...patch } : t
    );
    await updateDoc(doc(db, 'kpis', kpiId), { tasks });
  }, []);

  const deleteTask = useCallback(async (kpiId, taskId) => {
    const kpi = kpisRef.current.find(k => k.id === kpiId);
    if (!kpi) return;
    const tasks = (Array.isArray(kpi.tasks) ? kpi.tasks : []).filter(t => t.id !== taskId);
    await updateDoc(doc(db, 'kpis', kpiId), { tasks });
  }, []);

  const toggleSubtask = useCallback(async (kpiId, taskId, subtaskId) => {
    const kpi = kpisRef.current.find(k => k.id === kpiId);
    if (!kpi) return;
    const tasks = (Array.isArray(kpi.tasks) ? kpi.tasks : []).map(t => {
      if (t.id !== taskId) return t;
      const subtasks = (Array.isArray(t.subtasks) ? t.subtasks : []).map(s =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      );
      return { ...t, subtasks };
    });
    await updateDoc(doc(db, 'kpis', kpiId), { tasks });
  }, []);

  // --- Todos ---

  const createTodo = useCallback(async (data) => {
    await addDoc(collection(db, 'todos'), data);
  }, []);

  const updateTodo = useCallback(async (id, patch) => {
    await updateDoc(doc(db, 'todos', id), patch);
  }, []);

  const deleteTodo = useCallback(async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  }, []);

  const toggleTodoSubtask = useCallback(async (todoId, subtaskId) => {
    const todo = todosRef.current.find(t => t.id === todoId);
    if (!todo) return;
    const subtasks = (Array.isArray(todo.subtasks) ? todo.subtasks : []).map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    await updateDoc(doc(db, 'todos', todoId), { subtasks });
  }, []);

  // --- Companies / Articles direct updates ---

  const updateCompany = useCallback(async (id, patch) => {
    await updateDoc(doc(db, 'companies', id), patch);
  }, []);

  const updateArticle = useCallback(async (id, patch) => {
    await updateDoc(doc(db, 'articles', id), patch);
  }, []);

  const value = useMemo(() => ({
    users,
    kpis,
    todos,
    logs,
    companies,
    articles,
    loading,
    addProgressLog,
    deleteLog,
    createKpi,
    updateKpi,
    archiveKpi,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoSubtask,
    updateCompany,
    updateArticle,
    findOrCreateCompany,
    findOrCreateArticle,
  }), [
    users, kpis, todos, logs, companies, articles, loading,
    addProgressLog, deleteLog,
    createKpi, updateKpi, archiveKpi,
    addTask, updateTask, deleteTask, toggleSubtask,
    createTodo, updateTodo, deleteTodo, toggleTodoSubtask,
    updateCompany, updateArticle,
    findOrCreateCompany, findOrCreateArticle,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}

export default DataContext;
