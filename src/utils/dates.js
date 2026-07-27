export function daysLeft(dateStr) {
  if (!dateStr) return 3;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + 'T00:00:00');
  return Math.ceil((exp - today) / 86400000);
}

export function urgencyClass(d) {
  if (d <= 1) return 'now';
  if (d <= 3) return 'soon';
  return 'fresh';
}

export function urgencyLabel(d) {
  if (d < 0) return 'Expired';
  if (d === 0) return 'Today!';
  if (d === 1) return '1 day left';
  return `${d} days left`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function threeDaysFromNowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export function genId() {
  return 'item-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}
