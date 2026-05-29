// ============================================================
// useDatabase.js — companies and articles data
// CHUNK 10: replace with Firestore subscriptions
// ============================================================
import { useMemo } from 'react';
import { useData } from '@shared/contexts/DataContext';

/**
 * @param {string} [search] - optional string to filter companies and articles by name/title
 */
export function useDatabase(search) {
  const {
    companies,
    articles,
    logs,
    updateCompany,
    updateArticle,
    findOrCreateCompany,
    findOrCreateArticle,
  } = useData();

  const normalizedSearch = search ? search.toLowerCase() : '';

  const filteredCompanies = useMemo(() => {
    const list = companies ?? [];
    if (!normalizedSearch) return list;
    return list.filter((c) =>
      (c.name ?? '').toLowerCase().includes(normalizedSearch)
    );
  }, [companies, normalizedSearch]);

  const filteredArticles = useMemo(() => {
    const list = articles ?? [];
    if (!normalizedSearch) return list;
    return list.filter((a) =>
      (a.title ?? '').toLowerCase().includes(normalizedSearch)
    );
  }, [articles, normalizedSearch]);

  function getCompanyById(id) {
    if (!companies) return undefined;
    return companies.find((c) => c.id === id);
  }

  function getArticleById(id) {
    if (!articles) return undefined;
    return articles.find((a) => a.id === id);
  }

  function getLogsForEntity(entityType, entityId) {
    if (!logs) return [];
    return logs.filter(
      (log) => log.entityType === entityType && log.entityId === entityId
    );
  }

  return {
    companies: filteredCompanies,
    articles: filteredArticles,
    loading: false,
    getCompanyById,
    getArticleById,
    updateCompany,
    updateArticle,
    findOrCreateCompany,
    findOrCreateArticle,
    getLogsForEntity,
  };
}
