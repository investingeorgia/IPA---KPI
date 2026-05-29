import React from 'react';
import Badge from '@shared/components/ui/Badge';
import { useLanguage } from '@shared/contexts/LanguageContext';

const STATUS_MAP = {
  'on-track':    { color: 'green',  key: 'onTrack'    },
  'at-risk':     { color: 'yellow', key: 'atRisk'     },
  'behind':      { color: 'red',    key: 'behind'     },
  'done':        { color: 'green',  key: 'done'       },
  'open':        { color: 'gray',   key: 'open'       },
  'in-progress': { color: 'yellow', key: 'inProgress' },
  'overdue':     { color: 'red',    key: 'overdue'    },
};

function StatusBadge({ status, showDot = true }) {
  const { t } = useLanguage();
  const config = STATUS_MAP[status];

  if (!config) {
    return <Badge label={status} color="gray" dot={showDot} />;
  }

  return (
    <Badge
      label={t(config.key) ?? status}
      color={config.color}
      dot={showDot}
    />
  );
}

export { StatusBadge };
export default StatusBadge;
