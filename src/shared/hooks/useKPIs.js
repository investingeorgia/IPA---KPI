// ============================================================
// useKPIs.js — KPI data and actions
// CHUNK 10: replace useData() calls with Firestore subscriptions
// ============================================================
import { useMemo } from 'react';
import { useData } from '@shared/contexts/DataContext';
import { calcKpiStatus } from '@shared/utils/statusCalculators';

/**
 * @param {Object} [filters]
 * @param {string} [filters.program]        - only KPIs with this program
 * @param {string} [filters.assigneeId]     - only KPIs where assignees includes this id
 * @param {boolean} [filters.includeArchived] - default false
 */
export function useKPIs(filters = {}) {
  const {
    kpis,
    logs,
    addProgressLog,
    deleteLog,
    createKpi,
    updateKpi,
    archiveKpi,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
  } = useData();

  const { program, assigneeId, includeArchived = false } = filters;

  const filteredKpis = useMemo(() => {
    let result = kpis ?? [];

    if (!includeArchived) {
      result = result.filter((kpi) => !kpi.archived);
    }

    if (program) {
      result = result.filter((kpi) => kpi.program === program);
    }

    if (assigneeId) {
      result = result.filter(
        (kpi) => Array.isArray(kpi.assignees) && kpi.assignees.includes(assigneeId)
      );
    }

    return result.map((kpi) => ({ ...kpi, status: calcKpiStatus(kpi) }));
  }, [kpis, program, assigneeId, includeArchived]);

  function getKpiById(id) {
    const found = kpis.find((kpi) => kpi.id === id);
    return found ? { ...found, status: calcKpiStatus(found) } : undefined;
  }

  function getLogsForKpi(kpiId) {
    if (!logs) return [];
    return logs.filter((log) => log.kpiId === kpiId);
  }

  return {
    kpis: filteredKpis,
    loading: false,
    getKpiById,
    getLogsForKpi,
    addProgressLog,
    deleteLog,
    createKpi,
    updateKpi,
    archiveKpi,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
  };
}
