import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useDatabase } from '@shared/hooks/useDatabase';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useTeam } from '@shared/hooks/useTeam';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import { getLabel, formatDate, formatActivityType } from '@shared/utils/formatters';

export function ArticleDetailPage() {
  const { id } = useParams();
  const { getArticleById, updateArticle, getLogsForEntity } = useDatabase();
  const { getKpiById } = useKPIs();
  const { getMemberById, members } = useTeam();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const article = getArticleById(id);

  const [title, setTitle] = useState(article?.title || '');
  const [url, setUrl] = useState(article?.url || '');
  const [description, setDescription] = useState(article?.description || '');
  const [saved, setSaved] = useState(false);

  const [filterUserId, setFilterUserId] = useState('');
  const [filterKpiId, setFilterKpiId] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  if (!article) {
    return (
      <div>
        <p>Article not found</p>
        <Link to="/database/articles">← Back to articles</Link>
      </div>
    );
  }

  function handleSave() {
    updateArticle(id, { title, url, description });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const allLogs = getLogsForEntity('article', id);
  const kpiIds = [...new Set(allLogs.map(l => l.kpiId))];
  const filtered = allLogs.filter(log => {
    if (filterUserId && log.userId !== filterUserId) return false;
    if (filterKpiId && log.kpiId !== filterKpiId) return false;
    if (filterFrom && log.date < filterFrom) return false;
    if (filterTo && log.date > filterTo) return false;
    return true;
  });

  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link to="/database/articles" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{t('articles')}</Link>
        <span>›</span>
        <span style={{ color: 'var(--ink)' }}>{article.title || article.url}</span>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>{article.title || article.url || 'Article'}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{t('title')}</label>
              <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>URL</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" style={{ flex: 1 }} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
                {url && <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--green)', alignSelf: 'center', fontSize: 13 }}>↗</a>}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{t('notes')}</label>
              <textarea className="input" rows={4} style={{ width: '100%', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button variant="primary" onClick={handleSave}>{saved ? '✓ Saved' : t('save')}</Button>
          </div>
        </Card>

        <Card title={t('activityHistory')}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <select className="input" value={filterUserId} onChange={e => setFilterUserId(e.target.value)} style={{ width: 140 }}>
              <option value="">All users</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select className="input" value={filterKpiId} onChange={e => setFilterKpiId(e.target.value)} style={{ width: 160 }}>
              <option value="">All KPIs</option>
              {kpiIds.map(kid => {
                const kpi = getKpiById(kid);
                return kpi ? <option key={kid} value={kid}>{getLabel(kpi.title, lang)}</option> : null;
              })}
            </select>
            <input type="date" className="input" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ width: 130 }} />
            <input type="date" className="input" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ width: 130 }} />
          </div>
          {filtered.length === 0
            ? <div className="empty">No activity</div>
            : filtered.sort((a, b) => b.date.localeCompare(a.date)).map(log => {
                const member = getMemberById(log.userId);
                const kpi = getKpiById(log.kpiId);
                return (
                  <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '80px 120px 1fr 80px 50px', gap: 8, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--ink-5)', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{formatDate(log.date)}</span>
                    <span>{member?.name ?? '—'}</span>
                    <span style={{ color: 'var(--ink-2)' }}>{kpi ? getLabel(kpi.title, lang) : '—'}</span>
                    <span style={{ color: 'var(--ink-3)' }}>{formatActivityType(log.activityType, lang)}</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>+{log.count}</span>
                  </div>
                );
              })
          }
        </Card>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
