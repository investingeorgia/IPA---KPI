import React, { useState, useEffect } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useDatabase } from '@shared/hooks/useDatabase';
import Modal from '@shared/components/ui/Modal';
import Button from '@shared/components/ui/Button';
import { ACTIVITY_TYPES } from '@data/mockData';

export function LogProgressModal({ isOpen, onClose, kpiId }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addProgressLog } = useKPIs();

  const [step, setStep] = useState(1);
  const [activityType, setActivityType] = useState('meeting');
  const [count, setCount] = useState(1);
  const [entityName, setEntityName] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [comment, setComment] = useState('');

  const { companies } = useDatabase(companySearch);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setActivityType('meeting');
      setCount(1);
      setEntityName('');
      setCompanySearch('');
      setComment('');
    }
  }, [isOpen]);

  const isValid =
    activityType === 'article'
      ? entityName.startsWith('http')
      : activityType === 'meeting' || activityType === 'call'
      ? entityName.trim().length > 0
      : true;

  function handleSubmit() {
    const entityType =
      activityType === 'article'
        ? 'article'
        : activityType === 'meeting' || activityType === 'call'
        ? 'company'
        : null;

    addProgressLog({
      kpiId,
      userId: user.id,
      activityType,
      count,
      entityType,
      entityName: entityName || null,
      comment,
    });

    onClose();
  }

  const step1Footer = (
    <Button variant="primary" onClick={() => setStep(2)}>
      {t('next')} →
    </Button>
  );

  const step2Footer = (
    <>
      <Button variant="ghost" onClick={() => setStep(1)}>
        {t('back')}
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
        {t('submit')}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('logProgress')} footer={step === 1 ? step1Footer : step2Footer}>
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('activityType')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type}
                  className={activityType === type ? undefined : 'btn btn-ghost'}
                  style={
                    activityType === type
                      ? { background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 500 }
                      : { cursor: 'pointer' }
                  }
                  onClick={() => setActivityType(type)}
                >
                  {t(type)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('count')}</div>
            <input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="input"
              style={{ width: 80 }}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(activityType === 'meeting' || activityType === 'call') && (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('company')}</div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setEntityName(e.target.value);
                  }}
                  placeholder="Company name..."
                />
                {companySearch && companies.length > 0 && (
                  <div
                    style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                      background: '#fff', border: '1px solid var(--ink-5)', borderRadius: 6,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 160, overflowY: 'auto',
                    }}
                  >
                    {companies.slice(0, 5).map((c) => (
                      <div
                        key={c.id}
                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}
                        onMouseDown={() => {
                          setEntityName(c.name);
                          setCompanySearch(c.name);
                        }}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activityType === 'article' && (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>Article URL</div>
              <input
                type="text"
                className="input"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          {activityType === 'other' && (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>Note</div>
              <input
                type="text"
                className="input"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Note..."
              />
            </div>
          )}

          <div>
            <textarea
              placeholder="Comment (optional)"
              className="input"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default LogProgressModal;
