// ============================================================
// formatters.js — display formatting utilities
// ============================================================

// obj can be { en: 'string', ge: 'string' } OR a plain string
// Returns the string for the given lang, falls back to 'en', then obj itself
export function getLabel(obj, lang = 'en') {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
}

// Returns e.g. "14 Jun" (en) or Georgian locale equivalent (ge)
export function formatDate(dateString, lang = 'en') {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(
    lang === 'ge' ? 'ka-GE' : 'en-GB',
    { day: 'numeric', month: 'short' }
  );
}

// Returns "2d overdue", "Today", "Tomorrow", "in 5d"
export function formatRelativeDate(dateString, lang = 'en') {
  if (!dateString) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  const days = Math.round((d - today) / 86400000);
  if (lang === 'ge') {
    if (days < 0) return Math.abs(days) + ' დღ. გადაც.';
    if (days === 0) return 'დღეს';
    if (days === 1) return 'ხვალ';
    return days + ' დღეში';
  }
  if (days < 0) return Math.abs(days) + 'd overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return 'in ' + days + 'd';
}

export function formatProgress(current, target) {
  if (!target) return '0%';
  return Math.max(0, Math.min(100, Math.round((current / target) * 100))) + '%';
}

export function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

const ACTIVITY_LABELS = {
  meeting: { en: 'Meeting', ge: 'შეხვედრა' },
  call:    { en: 'Call',    ge: 'ზარი' },
  article: { en: 'Article', ge: 'სტატია' },
  other:   { en: 'Other',   ge: 'სხვა' },
};

export function formatActivityType(type, lang = 'en') {
  return ACTIVITY_LABELS[type]?.[lang] || type;
}

export function truncateUrl(url, maxLength = 40) {
  if (!url) return '';
  const clean = url.replace(/^https?:\/\//, '');
  return clean.length > maxLength ? clean.slice(0, maxLength) + '…' : clean;
}

export function getProgramColor(program) {
  return `cat-bg-${program}`; // matches CSS: cat-bg-invest, cat-bg-awareness, etc.
}
