// ============================================================
// DataContext.jsx — shared app data store (mock state)
// Mirrors the prototype's StoreProvider (hub-data.jsx)
// CHUNK 10: replace with Firestore onSnapshot subscriptions
// ============================================================
import { createContext, useContext, useState, useMemo } from 'react';
import {
  getMockUsers, getMockKPIs, getMockTodos,
  getMockProgressLogs, getMockCompanies, getMockArticles,
} from '@data/mockData';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users]     = useState(() => getMockUsers());
  const [kpis,      setKpis]      = useState(() => getMockKPIs());
  const [todos,     setTodos]     = useState(() => getMockTodos());
  const [logs,      setLogs]      = useState(() => getMockProgressLogs());
  const [companies, setCompanies] = useState(() => getMockCompanies());
  const [articles,  setArticles]  = useState(() => getMockArticles());

  // ── Database helpers ────────────────────────────────────────

  const dbActions = useMemo(() => ({
    updateCompany(id, patch) {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    },

    updateArticle(id, patch) {
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    },

    findOrCreateCompany(name) {
      const lower = name.toLowerCase();
      let found;
      setCompanies(prev => {
        const existing = prev.find(c => c.name.toLowerCase() === lower);
        if (existing) {
          found = existing.id;
          return prev;
        }
        const newId = 'c' + Date.now();
        found = newId;
        const today = new Date().toISOString().slice(0, 10);
        return [...prev, { id: newId, name, website: '', description: '', createdAt: today }];
      });
      return found;
    },

    findOrCreateArticle(url) {
      const lower = url.toLowerCase();
      let found;
      setArticles(prev => {
        const existing = prev.find(a => a.url.toLowerCase() === lower);
        if (existing) {
          found = existing.id;
          return prev;
        }
        const newId = 'a' + Date.now();
        found = newId;
        let hostname = url;
        try { hostname = new URL(url).hostname.replace(/^www\./, ''); } catch {}
        const today = new Date().toISOString().slice(0, 10);
        return [...prev, { id: newId, url, title: hostname, description: '', createdAt: today }];
      });
      return found;
    },
  }), []);

  // ── KPI actions ─────────────────────────────────────────────

  const kpiActions = useMemo(() => ({
    addProgressLog({ kpiId, userId, activityType, count, entityType, entityName, comment }) {
      // Resolve entityId — create entity if entityName was provided
      let entityId = null;
      if (entityName) {
        if (entityType === 'company') {
          entityId = dbActions.findOrCreateCompany(entityName);
        } else if (entityType === 'article') {
          entityId = dbActions.findOrCreateArticle(entityName);
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      const newLog = {
        id: 'p' + Date.now(),
        kpiId,
        userId,
        activityType,
        count,
        entityType: entityType || null,
        entityId,
        date: today,
        comment: comment || '',
      };

      setLogs(prev => [...prev, newLog]);
      setKpis(prev => prev.map(k =>
        k.id === kpiId ? { ...k, current: k.current + count } : k
      ));
    },

    deleteLog(logId) {
      // Find the log first to reverse the count
      setLogs(prev => {
        const log = prev.find(l => l.id === logId);
        if (log) {
          setKpis(kpis => kpis.map(k =>
            k.id === log.kpiId ? { ...k, current: Math.max(0, k.current - log.count) } : k
          ));
        }
        return prev.filter(l => l.id !== logId);
      });
    },

    createKpi(data) {
      const newKpi = {
        ...data,
        id: 'k' + Date.now(),
        current: 0,
        archived: false,
        tasks: [],
      };
      setKpis(prev => [...prev, newKpi]);
    },

    updateKpi(id, patch) {
      setKpis(prev => prev.map(k => k.id === id ? { ...k, ...patch } : k));
    },

    archiveKpi(id) {
      setKpis(prev => prev.map(k => k.id === id ? { ...k, archived: true } : k));
    },

    addTask(kpiId, task) {
      const newTask = {
        ...task,
        id: 't' + Date.now(),
        status: 'open',
        subtasks: [],
      };
      setKpis(prev => prev.map(k =>
        k.id === kpiId ? { ...k, tasks: [...k.tasks, newTask] } : k
      ));
    },

    updateTask(kpiId, taskId, patch) {
      setKpis(prev => prev.map(k =>
        k.id === kpiId
          ? { ...k, tasks: k.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t) }
          : k
      ));
    },

    deleteTask(kpiId, taskId) {
      setKpis(prev => prev.map(k =>
        k.id === kpiId
          ? { ...k, tasks: k.tasks.filter(t => t.id !== taskId) }
          : k
      ));
    },

    toggleSubtask(kpiId, taskId, subtaskId) {
      setKpis(prev => prev.map(k => {
        if (k.id !== kpiId) return k;
        return {
          ...k,
          tasks: k.tasks.map(t => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks.map(s =>
                s.id === subtaskId ? { ...s, done: !s.done } : s
              ),
            };
          }),
        };
      }));
    },
  }), [dbActions]);

  // ── Todo actions ────────────────────────────────────────────

  const todoActions = useMemo(() => ({
    createTodo(data) {
      const newTodo = {
        ...data,
        id: 'td' + Date.now(),
        status: 'open',
        subtasks: [],
      };
      setTodos(prev => [...prev, newTodo]);
    },

    updateTodo(id, patch) {
      setTodos(prev => prev.map(td => td.id === id ? { ...td, ...patch } : td));
    },

    deleteTodo(id) {
      setTodos(prev => prev.filter(td => td.id !== id));
    },

    toggleTodoSubtask(todoId, subtaskId) {
      setTodos(prev => prev.map(td => {
        if (td.id !== todoId) return td;
        return {
          ...td,
          subtasks: td.subtasks.map(s =>
            s.id === subtaskId ? { ...s, done: !s.done } : s
          ),
        };
      }));
    },
  }), []);

  // ── Context value ───────────────────────────────────────────

  const value = useMemo(() => ({
    // Raw state
    users,
    kpis,
    todos,
    logs,
    companies,
    articles,
    // KPI actions
    ...kpiActions,
    // Todo actions
    ...todoActions,
    // Database actions
    updateCompany:       dbActions.updateCompany,
    updateArticle:       dbActions.updateArticle,
    findOrCreateCompany: dbActions.findOrCreateCompany,
    findOrCreateArticle: dbActions.findOrCreateArticle,
  }), [users, kpis, todos, logs, companies, articles, kpiActions, todoActions, dbActions]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
