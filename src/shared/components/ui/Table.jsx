import React, { useState, useMemo } from 'react';

function buildGridTemplate(columns) {
  return columns.map((col) => col.width ?? '1fr').join(' ');
}

function sortData(data, sortKey, sortDir) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let cmp;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
    }

    return sortDir === 'asc' ? cmp : -cmp;
  });
}

function Table({
  columns,
  data,
  onRowClick,
  selectedId,
  emptyMessage,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const gridTemplateColumns = buildGridTemplate(columns);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(
    () => sortData(data, sortKey, sortDir),
    [data, sortKey, sortDir]
  );

  return (
    <div className="tbl">
      {/* Header */}
      <div className="tbl-head" style={{ gridTemplateColumns }}>
        {columns.map((col) => {
          const isSorted = sortKey === col.key;
          const sortIcon = col.sortable
            ? isSorted
              ? sortDir === 'asc' ? '↑' : '↓'
              : '↕'
            : null;

          return (
            <div
              key={col.key}
              style={{
                cursor: col.sortable ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                userSelect: col.sortable ? 'none' : undefined,
              }}
              onClick={() => col.sortable && handleSort(col.key)}
            >
              {col.label}
              {sortIcon && (
                <span style={{ opacity: 0.5, fontSize: '0.85em' }}>
                  {sortIcon}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Rows or empty state */}
      {sortedData.length === 0 ? (
        <div className="empty">{emptyMessage || 'No results'}</div>
      ) : (
        sortedData.map((row, i) => {
          const isSelected = selectedId !== undefined && row.id === selectedId;
          return (
            <div
              key={row.id ?? i}
              className={`tbl-row${isSelected ? ' selected' : ''}`}
              style={{
                gridTemplateColumns,
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <div key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

export { Table };
export default Table;
